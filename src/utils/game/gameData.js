import { collection, addDoc, getDocs, limit, query, where, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { generateUniqueCode } from './gameTools';

async function createGame(packId = 'default') {
  const gameCode = await generateUniqueCode({ field: 'code' });
  const adminCode = await generateUniqueCode({ field: 'adminCode' });

  const game = {
    adminCode: adminCode,
    code: gameCode,
    packId: packId,
    status: 'not_started',
    endTime: new Date(Date.now() + 1000 * 60 * 60 * 24),
    players: [],
  };

  // post new game to firestore
  const gamesRef = collection(db, process.env.REACT_APP_FIREBASE_GAMES_COLLECTION);
  const ref = await addDoc(gamesRef, game);
  return { ...game, id: ref.id };
}


async function getGameByCode(gameCode) {
  const gamesRef = collection(db, process.env.REACT_APP_FIREBASE_GAMES_COLLECTION);
  const q = query(gamesRef, where('code', '==', gameCode), limit(1));
  const snapshot = await getDocs(q);
  return snapshot.docs[0]?.data() ?? null;
}


async function addPlayerToGame(gameCode, playerUID, nickname) {
  const gamesRef = collection(db, process.env.REACT_APP_FIREBASE_GAMES_COLLECTION);
  const q = query(gamesRef, where('code', '==', gameCode), limit(1));
  const snapshot = await getDocs(q);
  const game = snapshot.docs[0]?.data();
  game.players.push({ [playerUID]: nickname });
  await updateDoc(snapshot.docs[0].ref, game);
}


async function activeGameForUser(userUID) {
  const gamesRef = collection(db, process.env.REACT_APP_FIREBASE_GAMES_COLLECTION);
  const q = query(gamesRef, where('status', '!=', 'finished'));
  const snapshot = await getDocs(q);
  for (const doc of snapshot.docs) {
    const game = doc.data();
    if (game.players.some(player => Object.keys(player).includes(userUID))) {
      return game;
    }
  }
  return null;
}

export { createGame, getGameByCode, addPlayerToGame, activeGameForUser };
