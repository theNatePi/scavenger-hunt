import { collection, getDocs, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../config/firebase';
import { addPointsToTeam, isItemFoundByTeam } from '../teams/teamsData';

async function getItemsByPackId(packId) {
  if (!packId) {
    return null;
  }

  const packsCol = process.env.REACT_APP_FIREBASE_PACKS_COLLECTION || 'packs';
  const itemsCol = process.env.REACT_APP_FIREBASE_ITEMS_COLLECTION || 'items';
  const itemsRef = collection(db, packsCol, packId, itemsCol);
  const snapshot = await getDocs(itemsRef);
  return snapshot.docs.map((doc) => {return { ...doc.data(), id: doc.id }});
}

async function getItemById(packId, itemId) {
  if (!packId || !itemId) {
    return null;
  }

  const packsCol = process.env.REACT_APP_FIREBASE_PACKS_COLLECTION || 'packs';
  const itemsCol = process.env.REACT_APP_FIREBASE_ITEMS_COLLECTION || 'items';
  const itemsRef = doc(db, packsCol, packId, itemsCol, itemId);
  const snapshot = await getDoc(itemsRef);
  return { ...snapshot.data(), id: snapshot.id };
}


async function _uploadFoundImage(file) {
  if (!file) {
    return null;
  }

  const foundItemsCol = process.env.REACT_APP_FIREBASE_STORAGE_FOUND_ITEMS_COLLECTION || 'foundItems';
  const storageRef = ref(storage, foundItemsCol);
  const uploadTask = await uploadBytes(storageRef, file);
  const imageUrl = await getDownloadURL(uploadTask.ref);
  return imageUrl;
}


async function _markItemAsFound(itemId, teamId, gameId, imageUrl, foundAt) {
  if (!itemId || !teamId || !gameId) {
    return null;
  }

  const gamesCol = process.env.REACT_APP_FIREBASE_GAMES_COLLECTION || 'games';
  const teamsCol = process.env.REACT_APP_FIREBASE_TEAMS_COLLECTION || 'teams';
  const foundItemsCol = process.env.REACT_APP_FIREBASE_FOUND_ITEMS_COLLECTION || 'foundItems';
  const itemsRef = doc(db, gamesCol, gameId, teamsCol, teamId, foundItemsCol, itemId);
  await setDoc(itemsRef, {
    itemId: itemId,
    imageUrl: imageUrl,
    foundAt: foundAt,
  });
}


async function handleNewFoundItem(file, itemId, teamId, gameId, itemPoints, itemBonusPoints) {
  const foundAt = new Date();
  const imageUrl = await _uploadFoundImage(file);

  // Check if the item is already found by this team
  const {exists, itemDoc} = await isItemFoundByTeam(gameId, teamId, itemId);
  if (exists) {
    // Update the image url for the found item
    await updateDoc(itemDoc.ref, { imageUrl: imageUrl });
    return;
  }

  // Mark the item as found
  await _markItemAsFound(itemId, teamId, gameId, imageUrl, foundAt);
  // Add points to the team
  await addPointsToTeam(gameId, teamId, itemPoints);
  // Add bonus points to the team
  await addPointsToTeam(gameId, teamId, itemBonusPoints);
}

export { getItemsByPackId, getItemById, handleNewFoundItem };
