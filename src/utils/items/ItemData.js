import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';

async function getItemsByPackId(packId) {
  const itemsRef = collection(db, process.env.REACT_APP_FIREBASE_PACKS_COLLECTION, packId, process.env.REACT_APP_FIREBASE_ITEMS_COLLECTION);
  const snapshot = await getDocs(itemsRef);
  return snapshot.docs.map((doc) => {return { ...doc.data(), id: doc.id }});
}

export { getItemsByPackId };
