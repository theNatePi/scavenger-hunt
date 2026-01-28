import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

async function fillPlayers(gameId, numPlayers) {
  const alphas = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const gamesCollection = process.env.REACT_APP_FIREBASE_GAMES_COLLECTION || 'games';
  const gameRef = doc(db, gamesCollection, gameId);
  const snapshot = await getDoc(gameRef);

  if (!snapshot.exists()) {
    return;
  }

  const data = snapshot.data();

  // Only append if a players list already exists (it starts as an empty array).
  if (!Array.isArray(data.players)) {
    return;
  }

  const players = [...data.players];

  for (let i = 0; i < numPlayers && i < alphas.length; i++) {
    players.push({ [alphas[i]]: `Player ${alphas[i]}` });
  }

  await updateDoc(gameRef, { players });
}

export { fillPlayers };
