import { getStorage, ref, listAll } from 'firebase/storage';
import { storage } from '../../config/firebase';
import { getDownloadURL } from 'firebase/storage';

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

export { getPackImages };
