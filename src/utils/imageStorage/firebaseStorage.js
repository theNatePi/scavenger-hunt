import { ref, listAll, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage, db } from '../../config/firebase';
import { doc, getDoc } from 'firebase/firestore';

async function getPackImages(packId) {
  const storageRef = ref(storage, `packs/${packId}`);
  const snapshot = await listAll(storageRef);
  return await Promise.all(snapshot.items.map(async (item) => {
    const imageUrl = await getDownloadURL(ref(storage, item.fullPath));
    return {
      path: item.fullPath,
      url: imageUrl,
    };
  }));
}


async function getImageById(packId, itemFile) {
  const storageRef = ref(storage, `packs/${packId}/${itemFile}`);
  const snapshot = await getDownloadURL(storageRef);
  return snapshot;
}


async function getFoundImageById(teamId, itemId, gameId) {
  const gamesCol = process.env.REACT_APP_FIREBASE_GAMES_COLLECTION || 'games';
  const teamsCol = process.env.REACT_APP_FIREBASE_TEAMS_COLLECTION || 'teams';
  const foundItemsCol = process.env.REACT_APP_FIREBASE_FOUND_ITEMS_COLLECTION || 'foundItems';
  const itemsRef = doc(db, gamesCol, gameId, teamsCol, teamId, foundItemsCol, itemId);
  const itemData = await getDoc(itemsRef);
  if (!itemData.exists()) {
    return null;
  }
  return itemData.data().imageUrl;
}


async function uploadFoundImage(file) {
  if (!file) {
    return null;
  }

  const foundItemsCol = process.env.REACT_APP_FIREBASE_STORAGE_FOUND_ITEMS_COLLECTION || 'foundItems';
  const id = crypto.randomUUID();
  const ext = 'jpg';
  const storageRef = ref(storage, `${foundItemsCol}/${id}.${ext}`);
  const uploadTask = await uploadBytes(storageRef, file);
  const imageUrl = await getDownloadURL(uploadTask.ref);
  return imageUrl;
}

export { getPackImages, getImageById, getFoundImageById, uploadFoundImage };
