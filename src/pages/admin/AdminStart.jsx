import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { updateGameEndTime, createTeams } from '../../utils/db';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../utils/firebase';

const AdminStart = () => {
  const { gameCode } = useParams();
  const [endTime, setEndTime] = useState('');
  const [adminCode, setAdminCode] = useState('');

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        const gameRef = doc(db, 'games', gameCode);
        const gameSnap = await getDoc(gameRef);
        if (gameSnap.exists()) {
          setAdminCode(gameSnap.data().admin_code);
        }
      } catch (error) {
        console.error('Failed to fetch game data:', error);
      }
    };
    fetchGameData();
  }, [gameCode]);

  const handleEndTimeChange = async (e) => {
    const newEndTime = e.target.value;
    setEndTime(newEndTime);
    
    try {
      await updateGameEndTime(gameCode, newEndTime);
    } catch (error) {
      console.error('Failed to update end time:', error);
      // You might want to add some user feedback here
    }
  };

  const handleStartGame = async () => {
    try {
      await createTeams(gameCode);
      window.location.href = `/admin/game/${gameCode}`;
    } catch (error) {
      console.error('Failed to create teams:', error);
      // Add user feedback here
    }
  };

  return (
    <div style={{ width: '85%', maxWidth: '700px', margin: '20px auto 0 auto' }}>
      <h1 style={{ fontFamily: "'K2D', sans-serif", fontSize: '30px', color: 'white', textAlign: 'left', marginBottom: '20px' }}>Create Game</h1>
      <p style={{ fontFamily: "'K2D', sans-serif", fontSize: '20px', color: 'white', textAlign: 'left', marginBottom: '20px' }}>Your game code is: <span style={{ fontWeight: 'bold' }}>{gameCode}</span></p>
      <button onClick={() => navigator.clipboard.writeText(gameCode)} style={{ background: 'rgba(99, 49, 216, 0.1)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', color: 'white', padding: '10px 20px', fontFamily: "'K2D', sans-serif", fontSize: '14px', cursor: 'pointer', width: '200px', margin: '0 0 10px 0' }}>Copy Game Code</button>
      <p style={{ fontFamily: "'K2D', sans-serif", fontSize: '20px', color: 'white', textAlign: 'left', marginBottom: '20px' }}>Admin code: <span style={{ fontWeight: 'bold' }}>{adminCode}</span></p>
      <div style={{ marginBottom: '20px' }}>
        <label 
          style={{ 
            display: 'block', 
            fontFamily: "'K2D', sans-serif", 
            fontSize: '16px', 
            color: 'white', 
            marginBottom: '10px' 
          }}
        >
          Set Hunt End Time:
        </label>
        <input
          type="datetime-local"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '10px',
            padding: '10px',
            color: 'white',
            fontFamily: "'K2D', sans-serif",
            fontSize: '16px',
            width: '100%',
            maxWidth: '300px'
          }}
          onChange={handleEndTimeChange}
        />
      </div>
      <button 
        onClick={handleStartGame} 
        style={{ background: 'rgba(99, 49, 216, 0.1)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', color: 'white', padding: '10px 20px', fontFamily: "'K2D', sans-serif", fontSize: '14px', cursor: 'pointer', width: '200px', margin: '0 0 10px 0' }}
      >
        Start Game
      </button>
    </div>
  );
};

export default AdminStart;