import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

async function uploadTeamsToGame(gameId, teams) {
  const teamsRef = collection(
    db, 
    process.env.REACT_APP_FIREBASE_GAMES_COLLECTION, 
    gameId, 
    process.env.REACT_APP_FIREBASE_TEAMS_COLLECTION
  );

  for (const team of teams) {
    const teamData = {
      playerUIDs: team.map(player => Object.keys(player)[0]),
      playerNicknames: team.map(player => Object.values(player)[0]),
    };

    await addDoc(teamsRef, teamData);
  }
}

export { uploadTeamsToGame };
