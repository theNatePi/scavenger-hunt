import {
  signInAnonymously,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../config/firebase';

/**
 * Returns the current user's ID, or creates a new anonymous auth session and returns that user's ID.
 * Uses Firebase Anonymous Auth with default persistence (local storage), so the same anonymous
 * user is restored across sessions and the user can resume a game.
 *
 * @returns {Promise<string>} The Firebase Auth user ID (uid)
 * @throws When anonymous sign-in fails (e.g. network or Firebase config)
 */
export async function fetchOrCreateUser() {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      unsubscribe();
      if (user) {
        resolve(user.uid);
      } else {
        try {
          const cred = await signInAnonymously(auth);
          resolve(cred.user.uid);
        } catch (err) {
          reject(err);
        }
      }
    });
  });
}


export async function isLoggedIn() {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user !== null ? user.uid : null);
    });
  });
}
