import React from "react";
import { useNavigate } from "react-router-dom";
import { leaveGame } from "../utils/db";
import { useGame } from "../contexts/GameContext";
import { auth } from "../utils/firebase";

const PlayerList = ({ players }) => {
  return (
    <>
      <h1 style={{ fontSize: '250%', fontWeight: 'bold', fontFamily: "'IBM Plex Sans', sans-serif", margin: '0 0 10px 0', color: 'white', textAlign: 'center', marginTop: '30px' }}>Players</h1>
      <div style={{
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: '10px',
        width: '90%',
        height: '100%',
        margin: '0 auto'
      }}>
        {players.map((player, index) => (
          <div key={index} style={{
            display: 'flex', 
            flexDirection: 'row', 
            alignItems: 'center', 
            justifyContent: 'center', 
            width: '100%', 
            height: '50px', 
            color: '#c27ddf', 
            borderRadius: '10px', 
            margin: '10px 0' 
          }}>
            <p style={{ margin: '0 0 0 10px', fontSize: '25px', fontWeight: 'bold', fontFamily: "'K2D', sans-serif" }}>{player}</p>
          </div>
        ))}
      </div>
    </>
  );
};

const LeaveButton = () => {
  const navigate = useNavigate();

  const { gameCode } = useGame();

  const handleLeaveGame = async () => {
    // Call the database function to handle player leaving
    try {
      await leaveGame(gameCode, auth.currentUser.uid); // Replace with your actual DB function
      navigate('/'); // Navigate to the home or main page after leaving
    } catch (error) {
      console.error("Error leaving the game:", error);
      // Handle error (e.g., show a message to the user)
    }
  };

  return (
    <div style={{ 
      height: '35px', 
      margin: '0 auto 20px auto',
      borderRadius: '100px',
      textAlign: 'center',
      backgroundColor: '#2D0D53',
      color: 'white', 
      position: 'fixed',
      bottom: '5px',
      left: '50%',
      transform: 'translateX(-50%)',
      maxWidth: '700px',
      width: '85%',
    }}>
      <h2 onClick={handleLeaveGame} style={{ margin: '0', lineHeight: '30px', fontSize: '15px' }}>Leave Game</h2>
    </div>
  );
};

const CountdownOverlay = ({ onComplete, allPlayers, teamPlayers }) => {
  const [count, setCount] = React.useState(3);
  const [showingTeam, setShowingTeam] = React.useState(false);
  const [currentNames, setCurrentNames] = React.useState([]);
  const [locked, setLocked] = React.useState(Array(teamPlayers.length).fill(false));
  
  React.useEffect(() => {
    if (count > 0) {
      const timer = setTimeout(() => setCount(count - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setShowingTeam(true);
      let iterations = 0;
      const maxIterations = 200;
      
      const shuffleInterval = setInterval(() => {
        if (iterations < maxIterations) {
          // Calculate how many names should be locked based on progress
          const progress = iterations / maxIterations;
          const numToLock = Math.floor(progress * teamPlayers.length);
          
          // Update locked array
          const newLocked = Array(teamPlayers.length).fill(false);
          for (let i = 0; i < numToLock; i++) {
            newLocked[i] = true;
          }
          setLocked(newLocked);

          // Generate random names, keeping locked positions fixed
          const randomNames = Array(teamPlayers.length).fill(null).map((_, index) => 
            newLocked[index] ? teamPlayers[index] : allPlayers[Math.floor(Math.random() * allPlayers.length)]
          );
          
          setCurrentNames(randomNames);
          iterations++;
        } else {
          clearInterval(shuffleInterval);
          setCurrentNames(teamPlayers);
          setTimeout(() => onComplete?.(), 2000); // Give time to see final team
        }
      }, 20);

      return () => clearInterval(shuffleInterval);
    }
  }, [count, onComplete, allPlayers, teamPlayers]);

  if (!showingTeam && count === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
      flexDirection: 'column'
    }}>
      {!showingTeam ? (
        <div style={{
          color: 'white',
          fontSize: '120px',
          fontFamily: "'IBM Plex Sans', sans-serif",
          fontWeight: 'bold'
        }}>
          {count}
        </div>
      ) : (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px'
        }}>
          <h2 style={{
            color: 'white',
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontSize: '40px',
            marginBottom: '20px'
          }}>
            Your Team:
          </h2>
          {currentNames.map((name, index) => (
            <p key={index} style={{
              color: '#c27ddf',
              fontFamily: "'IBM Plex Sans', sans-serif",
              fontSize: '30px',
              margin: 0,
              transition: 'all 0.2s ease'
            }}>
              {name}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};


export { PlayerList, LeaveButton, CountdownOverlay };