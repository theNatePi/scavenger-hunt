import { collection, doc, onSnapshot, writeBatch, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

function subscribeTeamsForGame(gameId, onTeams, onError) {
  const teamsRef = collection(
    db,
    process.env.REACT_APP_FIREBASE_GAMES_COLLECTION,
    gameId,
    process.env.REACT_APP_FIREBASE_TEAMS_COLLECTION
  );

  return onSnapshot(
    teamsRef,
    (teamsSnapshot) => {
      onTeams?.(teamsSnapshot.docs.map((d) => d.data()));
    },
    (err) => {
      onError?.(err);
    }
  );
}

async function uploadTeamsToGame(gameId, teams, { onTeams, onError } = {}) {
  const teamsRef = collection(
    db, 
    process.env.REACT_APP_FIREBASE_GAMES_COLLECTION, 
    gameId, 
    process.env.REACT_APP_FIREBASE_TEAMS_COLLECTION
  );

  const batch = writeBatch(db);

  for (const team of teams) {
    const teamData = {
      playerUIDs: team.map((player) => Object.keys(player)[0]),
      playerNicknames: team.map((player) => Object.values(player)[0]),
      teamReady: false,
      points: 0,
      pointsActual: 0,
    };

    // Auto-ID per team doc, but committed together.
    batch.set(doc(teamsRef), teamData);
  }

  await batch.commit();

  // Start listening immediately after commit.
  // Resolve on the first snapshot and keep streaming updates through callbacks.
  return await new Promise((resolve, reject) => {
    let didResolve = false;

    const unsub = onSnapshot(
      teamsRef,
      (teamsSnapshot) => {
        const teamsData = teamsSnapshot.docs.map((d) => d.data());
        onTeams?.(teamsData);

        if (!didResolve) {
          didResolve = true;
          resolve({ teams: teamsData, unsubscribe: unsub });
        }
      },
      (err) => {
        onError?.(err);
        if (!didResolve) reject(err);
      }
    );
  });
}


async function addPointsToTeam(gameId, teamId, points) {
  const gamesCol = process.env.REACT_APP_FIREBASE_GAMES_COLLECTION || 'games';
  const teamsCol = process.env.REACT_APP_FIREBASE_TEAMS_COLLECTION || 'teams';
  const teamsRef = doc(db, gamesCol, gameId, teamsCol, teamId);

  const teamData = await getDoc(teamsRef);
  const currentPoints = teamData.data().points;
  const newPoints = currentPoints + points;
  await updateDoc(teamsRef, { points: newPoints });
}


async function updateTeamPointsActual(gameId, teamId, points) {
  const gamesCol = process.env.REACT_APP_FIREBASE_GAMES_COLLECTION || 'games';
  const teamsCol = process.env.REACT_APP_FIREBASE_TEAMS_COLLECTION || 'teams';
  const teamsRef = doc(db, gamesCol, gameId, teamsCol, teamId);
  await updateDoc(teamsRef, { pointsActual: points });
}


async function isItemFoundByTeam(gameId, teamId, itemId) {
  const gamesCol = process.env.REACT_APP_FIREBASE_GAMES_COLLECTION || 'games';
  const teamsCol = process.env.REACT_APP_FIREBASE_TEAMS_COLLECTION || 'teams';
  const foundItemsCol = process.env.REACT_APP_FIREBASE_FOUND_ITEMS_COLLECTION || 'foundItems';
  const itemsRef = doc(db, gamesCol, gameId, teamsCol, teamId, foundItemsCol, itemId);
  const itemData = await getDoc(itemsRef);
  return {exists: itemData.exists(), itemDoc: itemData};
}

export { uploadTeamsToGame, subscribeTeamsForGame, addPointsToTeam, isItemFoundByTeam, updateTeamPointsActual };
