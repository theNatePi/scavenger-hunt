import { collection, doc, onSnapshot, writeBatch } from 'firebase/firestore';
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

export { uploadTeamsToGame, subscribeTeamsForGame };
