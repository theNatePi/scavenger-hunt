import { collection, query, where, limit, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';


/**
 * Returns true if the given code is already used by an active game (status !== 'finished').
 * Uses a single-field query on code (no composite index) and filters out finished games in memory.
 *
 * @param {string} code - Game code to check
 * @returns {Promise<boolean>}
 */
async function _isCodeUsed(code, field='code') {
  const col = process.env.REACT_APP_FIREBASE_GAMES_COLLECTION || 'games';
  const gamesRef = collection(db, col);
  const q = query(gamesRef, where(field, '==', code), limit(10));
  const snapshot = await getDocs(q);
  const hasActive = snapshot.docs.some((d) => d.get('status') !== 'finished');
  return !hasActive;
}


/**
 * Generates a random game code that passes the given uniqueness check.
 *
 * @param {object} [options={}] - Generation options.
 * @param {number} [options.length=6] - Length of the code.
 * @param {number} [options.maxRetries=10] - Max attempts before throwing.
 * @param {string} [options.chars='0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'] - Characters to use.
 * @param {(code: string) => Promise<boolean>} [isUnique=_isCodeUsed] - Async predicate: return true if the code is available (unique), false otherwise.
 * @param {string} [field='code'] - Field to check for uniqueness.
 * @returns {Promise<string>} The first generated code for which isUnique(code) is true.
 * @throws {Error} If no unique code is found within maxRetries attempts.
 */
async function generateUniqueCode(options = {}, isUnique=_isCodeUsed, field='code') {
  const {
    length = 6,
    maxRetries = 10,
    chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  } = options;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    // Generate random code
    let code = '';
    for (let i = 0; i < length; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    // Check uniqueness
    if (await isUnique(code, field)) {
      return code;
    }
  }
  
  throw new Error(`Failed to generate unique game code after ${maxRetries} attempts`);
}

async function createGame(packId = 'default') {
  const gameCode = await generateUniqueCode({ field: 'code' });
  const adminCode = await generateUniqueCode({ field: 'adminCode' });

  const game = {
    adminCode: adminCode,
    code: gameCode,
    packId: packId,
    status: 'not_started',
    endTime: new Date(Date.now() + 1000 * 60 * 60 * 24),
  };

  // post new game to firestore
  const gamesRef = collection(db, process.env.REACT_APP_FIREBASE_GAMES_COLLECTION);
  console.log(gamesRef);
  console.log(game);
  const docRef = await addDoc(gamesRef, game);
  return docRef.id;
}



export { generateUniqueCode, createGame };
