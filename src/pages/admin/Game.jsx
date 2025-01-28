import React, { useState, useEffect } from 'react';
import { TimeRemaining } from '../../components/HomeComponents';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import { useGame } from '../../contexts/GameContext';
import { useParams } from 'react-router-dom';
import { getTeamsByGameForAdmin } from '../../utils/db';

const AdminGame = () => {
  const { gameCode } = useParams();
  const navigate = useNavigate();
  // const { gameCode } = useGame();
  const [finishTime, setFinishTime] = useState(null);
  
  const [teams, setTeams] = useState([]);

  const fetchGameData = async () => {
    try {
      if (!gameCode) return;

      const gameDoc = await getDoc(doc(db, 'games', gameCode));
      const endAt = gameDoc.data()?.end_at;

      const gameData = await getTeamsByGameForAdmin(gameCode);

      setTeams(gameData)
      setFinishTime(endAt?.toMillis());
    } catch (error) {
      console.error('Error fetching game data:', error);
    }
  };

  useEffect(() => {
    fetchGameData();
  }, []);

  return (
    <div style={{ width: '85%', maxWidth: '700px', margin: '20px auto 0 auto' }}>
      <h1 style={{ fontFamily: "'K2D', sans-serif", fontSize: '30px', color: 'white', textAlign: 'left', marginBottom: '20px' }}>Admin Game</h1>
      <TimeRemaining finishTime={finishTime} />
      {teams.map((team) => (
        <button
          key={team.id}
          onClick={() => navigate(`/admin/team/${team.id}`)}
          style={{
            width: '100%',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            backgroundColor: '#4A0766',
            padding: '10px',
            borderRadius: '10px',
            color: 'white',
            fontFamily: "'K2D', sans-serif",
            height: '50px'
          }}>
          {/* <h2 style={{ margin: '5px 0 5px 0', fontSize: '10px', width: '30%', textAlign: 'left' }}>Team {team.id}</h2> */}
          <h2 style={{ margin: '5px 0 5px 0', fontSize: '16px', width: '50%', textAlign: 'left' }}>{team.members ? team.members.join(', ') : ''}</h2>
          <p style={{ margin: '5px 0 5px 0', fontSize: '16px', width: '20%', textAlign: 'right' }}>{team.estimatedPoints} pts (est)</p>
          <p style={{ margin: '5px 0 5px 0', fontSize: '16px', width: '20%', textAlign: 'right' }}>{team.actualPoints} pts (act)</p>
        </button>
      ))}
      <button onClick={fetchGameData} style={{
          width: '100%',
          border: 'none',
          cursor: 'pointer',
          backgroundColor: '#4A0766',
          color: 'white',
          padding: '10px',
          borderRadius: '10px',
          fontFamily: "'K2D', sans-serif",
          height: '50px',
          marginTop: '20px'
        }}>
        Update
      </button>
    </div>
  );
};

export default AdminGame;
