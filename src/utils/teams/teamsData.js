import { collection, doc, writeBatch } from 'firebase/firestore';
import { db } from '../../config/firebase';

async function uploadTeamsToGame(gameId, teams) {
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
    };

    // Auto-ID per team doc, but committed together.
    batch.set(doc(teamsRef), teamData);
  }

  await batch.commit();
}

export { uploadTeamsToGame };
