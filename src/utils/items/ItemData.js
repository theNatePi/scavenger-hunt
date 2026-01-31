import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

async function getItemsByPackId(packId) {
  if (!packId) {
    return null;
  }

  const itemsRef = collection(db, process.env.REACT_APP_FIREBASE_PACKS_COLLECTION, packId, process.env.REACT_APP_FIREBASE_ITEMS_COLLECTION);
  const snapshot = await getDocs(itemsRef);
  return snapshot.docs.map((doc) => {return { ...doc.data(), id: doc.id }});
}

async function getItemById(packId, itemId) {
  if (!packId || !itemId) {
    return null;
  }

  const itemsRef = doc(db, process.env.REACT_APP_FIREBASE_PACKS_COLLECTION, packId, process.env.REACT_APP_FIREBASE_ITEMS_COLLECTION, itemId);
  const snapshot = await getDoc(itemsRef);
  return { ...snapshot.data(), id: snapshot.id };
}

export { getItemsByPackId, getItemById };
