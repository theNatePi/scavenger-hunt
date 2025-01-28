import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { PlayerList, LeaveButton, CountdownOverlay } from "../components/LobbyComponents"
import { useGame } from "../contexts/GameContext";
import { doc, onSnapshot, collection, getDocs } from 'firebase/firestore'
import { auth, db } from '../utils/firebase'
import { getTeamWithPlayer, getPlayersInTeam } from '../utils/db'

const Lobby = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(false);

  const { setAllPlayers, allPlayers, teamPlayers, gameCode, setTeamPlayers, username } = useGame();

  useEffect(() => {
    const gameRef = doc(db, 'games', gameCode);

    // Set up real-time listener
    const unsubscribe = onSnapshot(gameRef, async (snapshot) => {
      if (snapshot.exists()) {
        const gameData = snapshot.data();
        setAllPlayers(gameData.players || []);
        setCountdown(gameData.active);
        
        // Get the player's document to check for existing team
        const playersCollection = collection(db, 'players');
        const playerSnapshot = await getDocs(playersCollection);
        const playerDoc = playerSnapshot.docs.find(doc => 
          doc.data().firebase_uid === auth.currentUser.uid && doc.data().game_id === gameCode
        );

        if (playerDoc && playerDoc.data().team_id) {
          // Player already has a team assigned
          const teamPlayers = await getPlayersInTeam(playerDoc.data().team_id);
          setTeamPlayers(teamPlayers);
          navigate('/home');
        } else {
          const teamDoc = await getTeamWithPlayer(username, gameCode);
          if (teamDoc) {
            const teamPlayers = await getPlayersInTeam(teamDoc.id);
            setTeamPlayers(teamPlayers);
          }
        }
      }
    }, (error) => {
      console.error('Error listening to game updates:', error);
    });

    return () => unsubscribe();
  }, [gameCode, setAllPlayers, username, setTeamPlayers, navigate]);

  return (
    <div style={{ width: '100%', height: '100%', margin: '0 0 0 0' }}>
      {countdown && <CountdownOverlay onComplete={() => {setCountdown(false); window.location.reload();}} allPlayers={allPlayers} teamPlayers={teamPlayers} />}
      <PlayerList players={allPlayers} />
      <LeaveButton/>
    </div>
  );
};

export default Lobby;
