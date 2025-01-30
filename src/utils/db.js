import { collection, getDocs, addDoc, doc, updateDoc, Timestamp, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import { db, storage, auth, initializeAuth } from './firebase';

// Generate a random 6-character string for admin code
const generateAdminCode = () => {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed similar-looking characters
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export const getPackItems = async (packId, auth_uid) => {
  try {
    if (!auth.currentUser) {
      await initializeAuth();
    }
    
    const itemsCollection = collection(db, 'items');
    const querySnapshot = await getDocs(itemsCollection);
    
    const items = querySnapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      .filter(item => item.image_pack === packId);
    
    const itemsWithUrls = await Promise.all(items.map(async (item) => {
      const storagePath = `packs/${packId}/${item.image_reference}.jpg`;
      
      const imageRef = ref(storage, storagePath);
      try {
        const imageUrl = await getDownloadURL(imageRef);
        
        // New logic to check if the item is found and how many teams found it
        const isFound = await isItemFound(item.id, auth_uid); // Check if the current user found the item
        const teamsFoundCount = await numberTeamsFound(item.id, auth_uid); // Get the number of teams that found the item
        
        return {
          ...item,
          imageUrl,
          is_found: isFound, // Add is_found field
          teams_found: teamsFoundCount // Add teams_found field
        };
      } catch (error) {
        console.error(`Error fetching URL for image ${item.image_reference}:`, error);
        return {
          ...item,
          imageUrl: null,
          is_found: false, // Default to false if there's an error
          teams_found: 0 // Default to 0 if there's an error
        };
      }
    }));
    
    return itemsWithUrls;
  } catch (error) {
    console.error('Error fetching items:', error);
    throw error;
  }
};

export const createGame = async (imagePack = 1) => {
  try {
    if (!auth.currentUser) {
      await initializeAuth();
    }

    const gameData = {
      active: false,
      admin_code: generateAdminCode(),
      end_at: null,
      image_pack: imagePack,
      players: [],
      teams: []
    };

    const gamesCollection = collection(db, 'games');
    const docRef = await addDoc(gamesCollection, gameData);
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating game:', error);
    throw error;
  }
};

export const updateGameEndTime = async (gameId, endTime) => {
  try {
    if (!auth.currentUser) {
      await initializeAuth();
    }

    const gameRef = doc(db, 'games', gameId);
    await updateDoc(gameRef, {
      end_at: Timestamp.fromDate(new Date(endTime))  // Convert to Firestore Timestamp
    });
  } catch (error) {
    console.error('Error updating game end time:', error);
    throw error;
  }
};

export const joinGame = async (gameCode, name) => {
  try {
    if (!auth.currentUser) {
      await initializeAuth();
    }

    const uid = auth.currentUser.uid;

    // Check for existing player with this firebase_uid
    const playersCollection = collection(db, 'players');
    const querySnapshot = await getDocs(playersCollection);
    const existingPlayer = querySnapshot.docs.find(doc => 
      doc.data().firebase_uid === uid && doc.data().game_id === gameCode
    );

    if (existingPlayer) {
      // Player already exists in this game, let them in
      return { success: true, existing: true };
    }

    const gameRef = doc(db, 'games', gameCode);
    const gameDoc = await getDoc(gameRef);
    if (!gameDoc.exists()) {
      return { error: 'Game not found' };
    } 

    const gameData = gameDoc.data();
    if (gameData.players.includes(name)) {
      return { error: 'Name already in game' };
    } 

    // Create new player document
    const playerData = {
      name,
      game_id: gameCode,
      team_id: null,
      firebase_uid: uid,
      created_at: Timestamp.now()
    };
    
    await addDoc(playersCollection, playerData);

    // Update game with new player name
    await updateDoc(gameRef, {
      players: [...gameData.players, name]
    });

    return { success: true, existing: false };
  } catch (error) {
    console.error('Error joining game:', error);
    return { error: 'Error joining game' };
  }
};

export const createTeams = async (gameCode, maxPlayersPerTeam = null, numTeams = null) => {
  try {
    if (!auth.currentUser) {
      await initializeAuth();
    }

    // Get game document
    const gameRef = doc(db, 'games', gameCode);
    const gameDoc = await getDoc(gameRef);
    if (!gameDoc.exists()) throw new Error('Game not found');

    const players = gameDoc.data().players;
    if (!players.length) throw new Error('No players in game');

    // Shuffle players array
    const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
    const numPlayers = shuffledPlayers.length;

    if ((maxPlayersPerTeam === null) && (numTeams === null)) {
      // If the user has not chosen a method for sorting, make teams with 3 players
      maxPlayersPerTeam = 3;
    }
    if (maxPlayersPerTeam !== null) {
      // If the user has chosen a method for sorting, make teams with the chosen number of players
      numTeams = Math.ceil(numPlayers / maxPlayersPerTeam)
    }

    numTeams = Number(numTeams);
    maxPlayersPerTeam = Number(maxPlayersPerTeam);

    const teams = Array(numTeams).fill().map(() => []);

    if (teams.length <= 1) {
      throw new Error('Must form at least 2 teams, please change maxPlayersPerTeam.');
    }

    // Distribute players across teams
    shuffledPlayers.forEach((player, index) => {
      const teamIndex = index % numTeams;
      teams[teamIndex].push(player);
    });

    for (let team of teams) {
      if (team.length <= 1) {
        throw new Error('Teams must have at least 2 players, please change numTeams.');
      }
    }

    // Create team documents and collect their IDs
    const teamsCollection = collection(db, 'teams');
    const teamRefs = await Promise.all(teams.map(teamPlayers => 
      addDoc(teamsCollection, {
        game_id: gameCode,
        players: teamPlayers
      })
    ));

    // Get team IDs
    const teamIds = teamRefs.map(ref => ref.id);

    // Update game document with active status and team IDs
    await updateDoc(gameRef, {
      active: true,
      teams: teamIds  // Store the team IDs instead of the team arrays
    });

  } catch (error) {
    console.error('Error creating teams:', error);
    throw error;
  }
};

export const getTeamWithPlayer = async (playerName, gameCode) => {
  try {
    // Check authentication first
    if (!auth.currentUser) {
      await initializeAuth();
    }

    const teamsCollection = collection(db, 'teams');
    const querySnapshot = await getDocs(teamsCollection);

    const playerTeam = querySnapshot.docs.find(doc => 
      doc.data().players.includes(playerName) && 
      doc.data().game_id === gameCode
    );

    // Check if team was found
    if (!playerTeam) {
      return null;
    }

    // Update player's team_id
    // Get player doc with matching firebase_uid
    const playersCollection = collection(db, 'players');
    const playerQuerySnapshot = await getDocs(playersCollection);
    const playerDoc = playerQuerySnapshot.docs.find(doc => 
      doc.data().firebase_uid === auth.currentUser.uid
    );

    if (playerDoc) {
      const playerRef = doc(db, 'players', playerDoc.id);
      await updateDoc(playerRef, {
        team_id: playerTeam.id
      });
    }

    return playerTeam;
  } catch (error) {
    console.error('Error getting team with player:', error);
    throw error;
  }
};

export const getPlayersInTeam = async (teamId) => {
  const teamRef = doc(db, 'teams', teamId);
  const teamDoc = await getDoc(teamRef);
  return teamDoc.data().players;
};




// new stuff
export const getPlayerFromAuth = async (auth_uid) => {
  const playerCollection = collection(db, 'players');
  const querySnapshot = await getDocs(playerCollection);
  
  // Find all players with the matching firebase_uid
  const matchingPlayers = querySnapshot.docs.filter(doc => doc.data().firebase_uid === auth_uid);
  
  // Sort by created_at timestamp and get the most recent one
  const mostRecentPlayer = matchingPlayers.sort((a, b) => 
    b.data().created_at.toMillis() - a.data().created_at.toMillis()
  )[0];

  return mostRecentPlayer ? { id: mostRecentPlayer.id, ...mostRecentPlayer.data() } : null; // Return player data or null if not found
}

export const getTeamIdFromAuth = async (auth_uid) => {
  const playerData = await getPlayerFromAuth(auth_uid);
  return playerData ? playerData.team_id : null;
}

export const getTeamMembersFromAuth = async (auth_uid) => {
  const teamId = await getTeamIdFromAuth(auth_uid);
  const teamRef = doc(db, 'teams', teamId);
  const teamDoc = await getDoc(teamRef);
  return teamDoc ? teamDoc.players : null;
}

export const isItemFound = async (itemId, auth_uid) => {
  const teamId = await getTeamIdFromAuth(auth_uid);
  const foundItemCollection = collection(db, 'foundItems');
  const foundItemDocs = await getDocs(foundItemCollection);
  
  // Check if any document matches the criteria
  const itemFound = foundItemDocs.docs.some(doc => 
    doc.data().item_id === itemId && doc.data().team_id === teamId
  );

  return itemFound; // Return true if found, false otherwise
}

export const getTeamsFromGame = async (gameId) => {
  const gameDocRef = doc(db, 'games', gameId);
  const gameDoc = await getDoc(gameDocRef);
  const teams = gameDoc.data().teams;
  return gameDoc ? teams : null;
}

export const numberTeamsFound = async (itemId, auth_uid) => {
  const playerData = await getPlayerFromAuth(auth_uid);
  if (!playerData) {
    return 0;
  }
  const gameId = playerData.game_id;
  const teams = await getTeamsFromGame(gameId);

  if (!teams) {
    return 0;
  }

  const foundItemCollection = collection(db, 'foundItems');
  const foundItemDocs = await getDocs(foundItemCollection);

  let foundNum = 0;
  let itemFound = false;
  for (const team of teams) {
    itemFound = foundItemDocs.docs.some(doc => 
      doc.data().item_id === itemId && doc.data().team_id === team
    );
    if (itemFound) {
      foundNum = foundNum + 1;
    }
  }

  return foundNum;
}

export const uploadImage = async (file, itemId, auth_uid) => {
  const teamId = await getTeamIdFromAuth(auth_uid);

  try {
    // Create a canvas to compress the image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Create an image element and wait for it to load properly
    const img = await createLoadedImage(file);
    
    // Set canvas dimensions to the image dimensions
    canvas.width = img.width;
    canvas.height = img.height;
    // Draw the image on the canvas
    ctx.drawImage(img, 0, 0);

    // Clean up the object URL to prevent memory leaks
    URL.revokeObjectURL(img.src);

    // Compress the image by converting it to a Blob
    const compressedFile = await new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create blob'));
        }
      }, 'image/jpeg', 0.5);
    });

    const storagePath = `foundItems/${teamId}/${itemId}`; // Define the storage path
    const storageRef = ref(storage, storagePath);
    
    // Upload the compressed file
    await uploadBytes(storageRef, compressedFile);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(storageRef);

    // Create or update the found item document
    const foundItemRef = doc(collection(db, 'foundItems')); // Create a reference to a new document
    const foundItemDoc = await getDocs(collection(db, 'foundItems')); // Check existing documents

    // Check if a document with the same team_id and item_id exists
    const existingDoc = foundItemDoc.docs.find(doc => 
      doc.data().team_id === teamId && doc.data().item_id === itemId
    );

    if (existingDoc) {
      // Update the existing document
      await updateDoc(doc(db, 'foundItems', existingDoc.id), {
        image_url: downloadURL // Update the image URL or any other fields as needed
      });
    } else {
      // Create a new document
      await setDoc(foundItemRef, {
        team_id: teamId,
        item_id: itemId,
        image_url: downloadURL, // Store the image URL
        confirmed: false
      });
    }

    return downloadURL; // Return the download URL
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// Helper function to properly load image
function createLoadedImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    
    img.onload = () => {
      resolve(img);
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to load image'));
    };

    img.src = objectUrl;
  });
}

export const getFoundImage = async (itemId, auth_uid) => {
  const teamId = await getTeamIdFromAuth(auth_uid);
  
  if (!teamId) {
    throw new Error('Team ID not found');
  }

  const storagePath = `foundItems/${teamId}/${itemId}`; // Define the storage path
  const imageRef = ref(storage, storagePath);
  
  try {
    const downloadURL = await getDownloadURL(imageRef); // Get the download URL
    return downloadURL; // Return the download URL
  } catch (error) {
    return '';
    // throw error; // Rethrow the error for handling
  }
}

export const getPointsEstimated = async (auth_uid) => {
  const teamId = await getTeamIdFromAuth(auth_uid);

  const foundItemCollection = collection(db, 'foundItems');
  const foundItemDocs = await getDocs(foundItemCollection);

  const itemsCollection = collection(db, 'items');
  const itemsDocs = await getDocs(itemsCollection);

  let total = 0;
  for (const itemDoc of foundItemDocs.docs) {
    const foundItem = itemDoc.data();
    if (foundItem.team_id !== teamId) {
      continue;
    }

    const item = itemsDocs.docs.find(doc => 
      doc.id === foundItem.item_id
    );
    total = total + item.data().points;
  }
  return total;
}

export const gameInProgress = async (gameId) => {
  const gameDocRef = doc(db, 'games', gameId);
  const gameDoc = await getDoc(gameDocRef);
  if (!gameDoc.exists()) throw new Error('Game not found');
  const data = gameDoc.data();

  return data.active;
}

export const leaveGame = async (gameId, auth_uid) => {
  try {
    const uid = auth.currentUser.uid;

    // Step 1: Find the player document
    const playersCollection = collection(db, 'players');
    const querySnapshot = await getDocs(playersCollection);
    const playerDoc = querySnapshot.docs.find(doc => doc.data().firebase_uid === uid);

    if (!playerDoc) {
      return { error: 'Player not found' };
    }

    const playerName = playerDoc.data().name;

    // Step 2: Remove the player from the game
    const gameRef = doc(db, 'games', gameId);
    const gameDoc = await getDoc(gameRef);
    if (!gameDoc.exists()) {
      return { error: 'Game not found' };
    }

    const gameData = gameDoc.data();
    const updatedPlayers = gameData.players.filter(name => name !== playerName);

    // Update the game document
    await updateDoc(gameRef, {
      players: updatedPlayers
    });

    // Step 3: Delete the player document
    await deleteDoc(doc(db, 'players', playerDoc.id));

    // Step 4: Optionally remove the auth for the auth_uid
    await auth.currentUser.delete(); // This will delete the user's authentication

    return { success: true };
  } catch (error) {
    console.error('Error leaving game:', error);
    return { error: 'Error leaving game' };
  }
}; 

// admin stuff

export const getTeamsByGameForAdmin = async (gameId) => {
  const teams = await getTeamsFromGame(gameId);
  let result = [];

  for (const teamId of teams) {
    const teamRef = doc(db, 'teams', teamId);
    const teamDoc = await getDoc(teamRef);

    const foundItemCollection = collection(db, 'foundItems');
    const foundItemDocs = await getDocs(foundItemCollection);
  
    const itemsCollection = collection(db, 'items');
    const itemsDocs = await getDocs(itemsCollection);
  
    let total = 0;
    for (const itemDoc of foundItemDocs.docs) {
      const foundItem = itemDoc.data();
      if (foundItem.team_id !== teamId) {
        continue;
      }
  
      const item = itemsDocs.docs.find(doc => 
        doc.id === foundItem.item_id
      );
      total = total + item.data().points;
    }

    const actualPoints = await getConfirmed(teamId);
    
    const data = {
      id: teamId,
      members: teamDoc.data().players,
      estimatedPoints: total,
      actualPoints: actualPoints
    }

    result.push(data);
  }
  return result;
}


export const getTeamPhotos = async (teamId) => {
  const packId = 1;

  try {
    // Get the team document
    const teamRef = doc(db, 'teams', teamId);
    const teamDoc = await getDoc(teamRef);
    if (!teamDoc.exists()) throw new Error('Team not found');

    // Get the items in the pack
    const itemsCollection = collection(db, 'items');
    const querySnapshot = await getDocs(itemsCollection);
    const itemsInPack = querySnapshot.docs.filter(doc => doc.data().image_pack === packId);

    const results = await Promise.all(itemsInPack.map(async (item) => {
      const storagePath = `packs/${packId}/${item.data().image_reference}.jpg`;
      const storageRef = ref(storage, storagePath);
      const originalImageUrl = await getDownloadURL(storageRef);
      const foundItemCollection = collection(db, 'foundItems');
      const foundItemDocs = await getDocs(foundItemCollection);
      
      // Check if a found item exists for this team and item
      const foundItem = foundItemDocs.docs.find(doc => 
        doc.data().team_id === teamId && doc.data().item_id === item.id
      );

      return {
        itemId: item.id,
        image: originalImageUrl,
        foundImageUrl: foundItem ? foundItem.data().image_url : null, // Get found image URL if exists
        confirmed: foundItem ? (foundItem.data().confirmed ? foundItem.data().confirmed : false)  : (false) // Get approved status
      };
    }));

    return results;
  } catch (error) {
    console.error('Error getting pack images with found status:', error);
    throw error;
  }
};

export const setConfirmed = async (itemId, teamId) => {
  try {
    const foundItemCollection = collection(db, 'foundItems');
    const foundItemDocs = await getDocs(foundItemCollection);
    
    // Find the document where item_id matches
    const foundItemDoc = foundItemDocs.docs.find(doc => doc.data().team_id === teamId && doc.data().item_id === itemId);
    
    if (foundItemDoc) {
      // Update the confirmed field to true
      await updateDoc(doc(db, 'foundItems', foundItemDoc.id), {
        confirmed: true
      });
    } else {
      return false;
      // throw new Error('Found item not found');
    }
  } catch (error) {
    console.error('Error setting confirmed status:', error);
    throw error;
  }

  return true;
};

export const undoConfirmed = async (itemId, teamId) => {
  try {
    const foundItemCollection = collection(db, 'foundItems');
    const foundItemDocs = await getDocs(foundItemCollection);
    
    // Find the document where item_id matches
    const foundItemDoc = foundItemDocs.docs.find(doc => doc.data().team_id === teamId && doc.data().item_id === itemId);
    
    if (foundItemDoc) {
      // Update the confirmed field to true
      await updateDoc(doc(db, 'foundItems', foundItemDoc.id), {
        confirmed: false
      });
    } else {
      return false;
      // throw new Error('Found item not found');
    }
  } catch (error) {
    console.error('Error setting confirmed status:', error);
    throw error;
  }

  return true;
};

export const getConfirmed = async (teamId) => {
  try {
    const foundItemCollection = collection(db, 'foundItems');
    const foundItemDocs = await getDocs(foundItemCollection);
    
    // Find all documents where team_id matches
    const confirmedItems = foundItemDocs.docs.filter(doc => 
      doc.data().team_id === teamId && doc.data().confirmed === true
    );

    // If no confirmed items found, return 0 points
    if (confirmedItems.length === 0) {
      return 0;
    }

    // Get the item IDs for the confirmed items
    const itemIds = confirmedItems.map(doc => doc.data().item_id);

    // Fetch the items collection to get points
    const itemsCollection = collection(db, 'items');
    const itemsDocs = await getDocs(itemsCollection);

    // Calculate total points for confirmed items
    let totalPoints = 0;
    itemIds.forEach(itemId => {
      const itemDoc = itemsDocs.docs.find(doc => doc.id === itemId);
      if (itemDoc) {
        totalPoints += itemDoc.data().points; // Add points for each confirmed item
      }
    });

    return totalPoints; // Return the total points
  } catch (error) {
    console.error('Error getting confirmed points:', error);
    throw error;
  }
};

export const playerInGame = async (gameId, username) => {
  if (!auth.currentUser) {
    return false;
  }

  const playersCollection = collection(db, 'players');
  const querySnapshot = await getDocs(playersCollection);
  const existingPlayer = querySnapshot.docs.find(doc => 
    doc.data().firebase_uid === auth.currentUser.uid && doc.data().game_id === gameId
  );

  if (existingPlayer) {
    // Player already exists in this game, let them in
    return true;
  }

  const gameRef = doc(db, 'games', gameId);
  const gameDoc = await getDoc(gameRef);
  if (!gameDoc.exists()) {
    return false;
  }
  
  return false;
}
