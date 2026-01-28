import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  doc,
  collection,
  onSnapshot,
  updateDoc,
  addDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../config/firebase';

const GAMES_COLLECTION = 'games';

/**
 * Maps a Firestore snapshot to { id, ...data }.
 */
function toDoc(d) {
  return { id: d.id, ...d.data() };
}

/**
 * Subscribes to a game and its full subtree:
 *   games/{gameId}                      → game doc
 *   games/{gameId}/teams/{teamId}       → team docs
 *   games/{gameId}/teams/{teamId}/foundItems/{itemId} → found item docs per team
 *
 * Returns a single nested shape: game with game.teams[].foundItems populated.
 *
 * @param {string | null | undefined} gameId - Game document ID. If null/undefined, no subscriptions run.
 * @param {{ collection?: string }} options - Optional. `collection` overrides the Firestore collection (default: 'games').
 * @returns {{
 *   game: ({ id: string, teams: Array<{ id: string, foundItems: Array<{ id: string }>, ... }>, ... } | null),
 *   loading: boolean,
 *   error: Error | null
 * }}
 */
export function useGame(gameId, options = {}) {
  const { collection: collectionName = GAMES_COLLECTION } = options;

  const [game, setGame] = useState(null);
  const [teams, setTeams] = useState([]);
  const [foundItemsByTeamId, setFoundItemsByTeamId] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const foundItemsUnsubsRef = useRef({});

  useEffect(() => {
    if (gameId == null || gameId === '') {
      setGame(null);
      setTeams([]);
      setFoundItemsByTeamId({});
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    const basePath = [collectionName, gameId];
    const gameRef = doc(db, ...basePath);
    const teamsRef = collection(db, ...basePath, 'teams');

    const unsubGame = onSnapshot(
      gameRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const { adminCode, ...rest } = snapshot.data();
          // Exclude the admin code for all users
          setGame({ id: snapshot.id, ...rest });
        } else {
          setGame(null);
        }
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError(err);
        setGame(null);
        setLoading(false);
      }
    );

    const unsubTeams = onSnapshot(
      teamsRef,
      (snapshot) => {
        const nextTeams = snapshot.docs.map(toDoc);
        setTeams(nextTeams);

        const teamIds = new Set(nextTeams.map((t) => t.id));
        const prevUnsubs = foundItemsUnsubsRef.current;

        // Unsubscribe from foundItems for teams that no longer exist
        Object.keys(prevUnsubs).forEach((tid) => {
          if (!teamIds.has(tid)) {
            prevUnsubs[tid]?.();
            delete prevUnsubs[tid];
          }
        });

        // Subscribe to foundItems for each team
        teamIds.forEach((teamId) => {
          if (prevUnsubs[teamId]) return;

          const foundItemsRef = collection(db, ...basePath, 'teams', teamId, 'foundItems');
          prevUnsubs[teamId] = onSnapshot(
            foundItemsRef,
            (itemSnap) => {
              const items = itemSnap.docs.map(toDoc);
              setFoundItemsByTeamId((prev) => ({ ...prev, [teamId]: items }));
            },
            (err) => {
              setError(err);
              setFoundItemsByTeamId((prev) => ({ ...prev, [teamId]: [] }));
            }
          );
        });
      },
      (err) => {
        setError(err);
        setTeams([]);
      }
    );

    return () => {
      unsubGame();
      unsubTeams();
      Object.values(foundItemsUnsubsRef.current).forEach((unsub) => unsub?.());
      foundItemsUnsubsRef.current = {};
    };
  }, [gameId, collectionName]);

  const gameWithSubtree =
    game == null
      ? null
      : {
          ...game,
          teams: teams.map((t) => ({
            ...t,
            foundItems: foundItemsByTeamId[t.id] ?? [],
          })),
        };

  return { game: gameWithSubtree, loading, error };
}

/**
 * Returns stable write helpers for the game subtree. Uses the same paths as useGame:
 *   games/{gameCode}, games/{gameCode}/teams/{teamId}, games/{gameCode}/teams/{teamId}/foundItems/{itemId}
 * Each helper returns a Promise; the useGame snapshot will reflect changes when they propagate.
 *
 * @param {string | null | undefined} gameCode - Game document ID. If null/undefined, helpers no-op (resolve) or throw.
 * @param {{ collection?: string }} options - Optional. `collection` overrides the Firestore collection (default: 'games').
 * @returns {{
 *   updateGame: (data: object) => Promise<void>,
 *   addTeam: (data: object) => Promise<{ id: string }>,
 *   updateTeam: (teamId: string, data: object) => Promise<void>,
 *   deleteTeam: (teamId: string) => Promise<void>,
 *   addFoundItem: (teamId: string, data: object) => Promise<{ id: string }>,
 *   updateFoundItem: (teamId: string, itemId: string, data: object) => Promise<void>,
 *   deleteFoundItem: (teamId: string, itemId: string) => Promise<void>,
 * }}
 */
export function useGameMutations(gameCode, options = {}) {
  const { collection: collectionName = GAMES_COLLECTION } = options;

  const basePath = useMemo(
    () => (gameCode ? [collectionName, gameCode] : null),
    [gameCode, collectionName]
  );

  const updateGame = useCallback(
    (data) => {
      if (!basePath) return Promise.resolve();
      return updateDoc(doc(db, ...basePath), data);
    },
    [basePath]
  );

  const addTeam = useCallback(
    (data) => {
      if (!basePath) return Promise.resolve({ id: '' });
      const teamsRef = collection(db, ...basePath, 'teams');
      return addDoc(teamsRef, data).then((ref) => ({ id: ref.id }));
    },
    [basePath]
  );

  const updateTeam = useCallback(
    (teamId, data) => {
      if (!basePath) return Promise.resolve();
      return updateDoc(doc(db, ...basePath, 'teams', teamId), data);
    },
    [basePath]
  );

  const deleteTeam = useCallback(
    (teamId) => {
      if (!basePath) return Promise.resolve();
      return deleteDoc(doc(db, ...basePath, 'teams', teamId));
    },
    [basePath]
  );

  const addFoundItem = useCallback(
    (teamId, data) => {
      if (!basePath) return Promise.resolve({ id: '' });
      const itemsRef = collection(db, ...basePath, 'teams', teamId, 'foundItems');
      return addDoc(itemsRef, data).then((ref) => ({ id: ref.id }));
    },
    [basePath]
  );

  const updateFoundItem = useCallback(
    (teamId, itemId, data) => {
      if (!basePath) return Promise.resolve();
      return updateDoc(
        doc(db, ...basePath, 'teams', teamId, 'foundItems', itemId),
        data
      );
    },
    [basePath]
  );

  const deleteFoundItem = useCallback(
    (teamId, itemId) => {
      if (!basePath) return Promise.resolve();
      return deleteDoc(
        doc(db, ...basePath, 'teams', teamId, 'foundItems', itemId)
      );
    },
    [basePath]
  );

  return useMemo(
    () => ({
      updateGame,
      addTeam,
      updateTeam,
      deleteTeam,
      addFoundItem,
      updateFoundItem,
      deleteFoundItem,
    }),
    [
      updateGame,
      addTeam,
      updateTeam,
      deleteTeam,
      addFoundItem,
      updateFoundItem,
      deleteFoundItem,
    ]
  );
}
