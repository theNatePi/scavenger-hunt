import { createContext, useContext, useState, useCallback } from 'react';
import { useGame, useGameMutations } from '../hooks/useGame';

const GameContext = createContext(null);

const ACTIVE_GAME_ID_STORAGE_KEY = 'scavenger-hunt:activeGameId';
const ACTIVE_PLAYER_STORAGE_KEY = 'scavenger-hunt:activePlayer';
const ACTIVE_TEAM_STORAGE_KEY = 'scavenger-hunt:activeTeam';

/**
 * Provides game data from Firestore to the subtree. The game code is stored in
 * context once (via initialGameId or setGameId); the provider subscribes to
 * that document and keeps game/loading/error in sync.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {string | null | undefined} [props.initialGameId] - Initial game document ID. Can be set later via setGameId from useGameContext().
 * @param {{ collection?: string }} [props.options] - Passed to useGame (e.g. { collection: 'games' }).
 */
export function GameProvider({ children, initialGameId = null, options = {} }) {
  const [gameCode, setGameCodeState] = useState(() => {
    if (initialGameId != null && initialGameId !== '') return initialGameId;
    try {
      return window?.localStorage?.getItem(ACTIVE_GAME_ID_STORAGE_KEY) ?? null;
    } catch {
      return null;
    }
  });

  const [team, setTeamState] = useState(() => {
    try {
      const raw = window?.localStorage?.getItem(ACTIVE_TEAM_STORAGE_KEY);
      if (raw == null || raw === '') return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  });

  const [player, setPlayerState] = useState(() => {
    try {
      const raw = window?.localStorage?.getItem(ACTIVE_PLAYER_STORAGE_KEY);
      if (raw == null || raw === '') return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  });

  const setGameId = useCallback((code) => {
    setGameCodeState((prev) => {
      const next = typeof code === 'function' ? code(prev) : code;
      try {
        if (next == null || next === '') {
          window?.localStorage?.removeItem(ACTIVE_GAME_ID_STORAGE_KEY);
        } else {
          window?.localStorage?.setItem(ACTIVE_GAME_ID_STORAGE_KEY, String(next));
        }
      } catch {
        // ignore storage errors (private mode, blocked, etc.)
      }
      return next;
    });
  }, []);

  const setTeam = useCallback((nextTeam) => {
    setTeamState((prev) => {
      const next = typeof nextTeam === 'function' ? nextTeam(prev) : nextTeam;
      try {
        if (next == null) {
          window?.localStorage?.removeItem(ACTIVE_TEAM_STORAGE_KEY);
        } else {
          window?.localStorage?.setItem(ACTIVE_TEAM_STORAGE_KEY, JSON.stringify(next));
        }
      } catch {
        // ignore storage errors (private mode, blocked, etc.)
      }
      return next;
    });
  }, []);

  const setPlayer = useCallback((nextPlayer) => {
    setPlayerState((prev) => {
      const next = typeof nextPlayer === 'function' ? nextPlayer(prev) : nextPlayer;
      try {
        if (next == null) {
          window?.localStorage?.removeItem(ACTIVE_PLAYER_STORAGE_KEY);
        } else {
          window?.localStorage?.setItem(ACTIVE_PLAYER_STORAGE_KEY, JSON.stringify(next));
        }
      } catch {
        // ignore storage errors (private mode, blocked, etc.)
      }
      return next;
    });
  }, []);

  const snapshot = useGame(gameCode, options);
  const { game } = snapshot;

  const teamData = useCallback((teamId) => {
    return game?.teams?.find((team) => team.id === teamId);
  }, [game?.teams]);

  const actions = useGameMutations(gameCode, options);
  const value = { ...snapshot, gameCode, setGameId, team, teamData, setTeam, player, setPlayer, actions };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

/**
 * Consumes game data and the game code from the nearest GameProvider.
 * Set the game code once (e.g. when joining or from URL), then read game/loading/error anywhere.
 *
 * @returns {{
 *   game: object | null,
 *   loading: boolean,
 *   error: Error | null,
 *   gameCode: string | null,
 *   setGameId: (code: string | null | ((prev: string | null) => string | null)) => void,
 *   team: object | null,
 *   setTeam: (team: object | null) => void,
 *   player: object | null,
 *   setPlayer: (player: object | null) => void,
 *   actions: {
 *     updateGame: (data: object) => Promise<void>,
 *     addTeam: (data: object) => Promise<{ id: string }>,
 *     updateTeam: (teamId: string, data: object) => Promise<void>,
 *     deleteTeam: (teamId: string) => Promise<void>,
 *     addFoundItem: (teamId: string, data: object) => Promise<{ id: string }>,
 *     updateFoundItem: (teamId: string, itemId: string, data: object) => Promise<void>,
 *     deleteFoundItem: (teamId: string, itemId: string) => Promise<void>,
 *   }
 * }}
 * @throws {Error} If used outside GameProvider
 */
export function useGameContext() {
  const context = useContext(GameContext);
  if (context === null) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
}
