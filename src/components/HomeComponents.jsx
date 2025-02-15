import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { PointsInfoModal } from './ItemComponents';
import { getTeamWithPlayer, getPlayersInTeam, getPointsEstimated } from '../utils/db';
import { useGame } from '../contexts/GameContext';
import { auth } from '../utils/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../utils/firebase';

const TeamHeader = () => {
  const [showPointsInfoModal, setShowPointsInfoModal] = useState(false);
  const [teamMembers, setTeamMembers] = useState(["Loading..."]);
  const [totalPoints, setTotalPoints] = useState(0);
  const { gameCode } = useGame();
  const [username, setUsername] = useState('');
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    const fetchUsername = async () => {
      if (!user) return;
      
      const playersCollection = collection(db, 'players');
      const querySnapshot = await getDocs(playersCollection);
      const playerDoc = querySnapshot.docs.find(doc => 
        doc.data().firebase_uid === user.uid && 
        doc.data().game_id === gameCode
      );
      
      if (playerDoc) {
        setUsername(playerDoc.data().name);
      }
    };

    const checkUser = () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        setUser(currentUser);
        fetchUsername();
      } else {
        setTimeout(checkUser, 1000);
      }
    };

    checkUser();
  }, [gameCode, user]);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        if (!gameCode || !username) return;
        
        const teamDoc = await getTeamWithPlayer(username, gameCode);
        if (!teamDoc) {
          console.log('No team found for player');
          return;
        }

        const players = await getPlayersInTeam(teamDoc.id);
        const points = await getPointsEstimated(auth.currentUser.uid);
        if (players && players.length > 0) {
          setTeamMembers(players);
          // TODO: Calculate total points when implementing scoring
          setTotalPoints(points); // Placeholder
        }
      } catch (error) {
        console.error('Error fetching team data:', error);
        setTeamMembers([]); // Reset on error
      }
    };

    const checkUsername = () => {
      if (username) {
        fetchTeamData();
      } else {
        setTimeout(checkUsername, 1000);
      }
    };

    checkUsername();
  }, [username, gameCode]);

  return (
    <>
      <div style={{ 
        width: '100%',
        height: '100px', 
        margin: '0 auto 60px auto',
        textAlign: 'left',
        color: 'white',
        position: 'relative',
        zIndex: 1
      }}>
        <h1 style={{ fontSize: '250%', fontWeight: 'bold', fontFamily: "'IBM Plex Sans', sans-serif", margin: '0 0 10px 0' }}>Team:</h1>
        <p style={{ fontSize: '20px', fontFamily: "'K2D', sans-serif", margin: '0 0 0 0', letterSpacing: '0.05em' }}>{teamMembers.join(', ')}</p>
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
          <p style={{ fontSize: '20px', fontFamily: "'K2D', sans-serif", margin: '0 0 0 0', letterSpacing: '0.05em', lineHeight: '25px' }}>Estimated Points: {totalPoints}</p>
          <button onClick={() => setShowPointsInfoModal(true)} style={{ backgroundColor: 'transparent', border: '2px solid white', color: 'white', width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '18px', padding: 0, marginLeft: '10px' }}>?</button>
        </div>
        <div style={{ width: '117.65%', height: '0px', border: '1.5px solid rgba(255, 255, 255, 0.3)', borderRadius: '10px', marginBottom: '20px', marginLeft: '-8.825%', marginTop: '20px' }}></div>
      </div>
      {showPointsInfoModal && createPortal(
        <PointsInfoModal onClose={() => setShowPointsInfoModal(false)} />,
        document.body
      )}
    </>
  );
};

const TimeRemaining = ({ startTime, finishTime }) => {
  const [timeRemaining, setTimeRemaining] = React.useState(0);

  React.useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date().getTime();
      const remaining = finishTime - now;
      setTimeRemaining(remaining);
    };

    calculateTimeRemaining(); // Initial calculation
    
    const timer = setInterval(() => {
      calculateTimeRemaining();
    }, 1000);

    return () => clearInterval(timer);
  }, [finishTime]);

  const formatTime = (ms) => {
    if (ms <= 0) return "Time's up!";
    
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor(ms / (1000 * 60 * 60));

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div style={{ 
      width: '100%',
      height: '35px', 
      margin: '0 auto 20px auto',
      borderRadius: '100px',
      textAlign: 'center',
      backgroundColor: '#4A0766',
      color: 'white'
    }}>
      <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: '0 0px 0 10%', lineHeight: '35px', fontSize: '15px' }}>Time Remaining:</h2>
        <h2 style={{ margin: '0 10% 0 0px', lineHeight: '35px', fontSize: '15px' }}>{formatTime(timeRemaining)}</h2>
      </div>
    </div>
  );
};

export { TeamHeader, TimeRemaining };
