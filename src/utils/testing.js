import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
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


/**
 * Creates Firestore documents for items from startItemId to endItemId (inclusive)
 * at /packs/<packName>/items/<id>, each with points, bonusPoints, and imageFile.
 */
async function addItemPoints(packName, startItemId, endItemId, points, bonusPoints) {
  const packsCol = process.env.REACT_APP_FIREBASE_PACKS_COLLECTION || 'packs';
  const itemsCol = process.env.REACT_APP_FIREBASE_ITEMS_COLLECTION || 'items';

  for (let id = startItemId; id <= endItemId; id++) {
    const itemRef = doc(db, packsCol, packName, itemsCol, String(id));
    await setDoc(itemRef, {
      points: points,
      bonusPoints: bonusPoints,
      imageFile: `${id}.jpg`,
    });
  }
}

export { fillPlayers, addItemPoints };
