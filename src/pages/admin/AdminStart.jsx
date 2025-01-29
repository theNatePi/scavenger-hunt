import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { updateGameEndTime, createTeams } from '../../utils/db';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../utils/firebase';

const AdminStart = () => {
  const { gameCode } = useParams();
  const [endTime, setEndTime] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [teamSorting, setTeamSorting] = useState('default');
  const [teamNum, setTeamNum] = useState(null);
  const [maxPlayers, setMaxPlayers] = useState(null);
  const [startErr, setStartErr] = useState('');

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

  const handleSortToggle = (num) => {
    setTeamSorting(num);
    setTeamNum(null);
    setMaxPlayers(null);
  };

  const handleSetTeamNum = (num) => {
    setTeamNum(num);
    setMaxPlayers(null);
  };

  const handleSetMaxPlayers = (num) => {
    setMaxPlayers(num);
    setTeamNum(null);
  };

  const handleStartGame = async () => {
    try {
      if (teamSorting === 'team_num' && !teamNum) {
        setStartErr('Please enter a team number');
        return;
      };
      if (teamSorting === 'max_players' && !maxPlayers) {
        setStartErr('Please enter a max players number');
        return;
      };
      setStartErr('');
      
      setStartErr('Loading...');
      await createTeams(gameCode, maxPlayers, teamNum);
      setStartErr('');
      window.location.href = `/admin/game/${gameCode}`;
    } catch (error) {
      setStartErr(`Failed to start game: ${error}`);
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
        <div style={{color: 'white'}}>
          <h2 style={{ fontFamily: "'K2D', sans-serif", fontSize: '25px', color: 'white', textAlign: 'left', marginBottom: '5px' }}>How should teams be sorted?</h2>
          <input 
            type="radio" 
            name="sorting" 
            value="default" 
            checked={teamSorting === 'default'}
            onChange={(e) => handleSortToggle(e.target.value)}
          />
          <label htmlFor="default"> Default player sorting</label><br></br>
          <input 
            type="radio" 
            name="sorting" 
            value="team_num" 
            checked={teamSorting === 'team_num'}
            onChange={(e) => handleSortToggle(e.target.value)}
          />
          <label htmlFor="team_size"> Sort by team size</label><br></br>
          <input 
            type="radio" 
            name="sorting" 
            value="max_players" 
            checked={teamSorting === 'max_players'}
            onChange={(e) => handleSortToggle(e.target.value)}
          />
          <label htmlFor="max_players"> Sort by max players per team</label><br></br>
        </div>
        {(teamSorting === 'team_num') &&
          (
          <input
            type="number"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '10px',
              marginTop: '10px',
              padding: '10px',
              color: 'white',
              fontFamily: "'K2D', sans-serif",
              fontSize: '16px',
              width: '20%',
              min: '50px'
            }}
            onChange={(e) => handleSetTeamNum(e.target.value)}
            defaultValue={null}
          />
          )
        }
        {(teamSorting === 'max_players') &&
          (
          <input
            type="number"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '10px',
              marginTop: '10px',
              padding: '10px',
              color: 'white',
              fontFamily: "'K2D', sans-serif",
              fontSize: '16px',
              width: '20%',
              min: '50px'
            }}
            onChange={(e) => handleSetMaxPlayers(e.target.value)}
            defaultValue={null}
          />
          )
        }
      </div>
      {teamSorting === 'default' && <p style={{ fontFamily: "'K2D', sans-serif", fontSize: '16px', color: 'white', textAlign: 'left', marginTop: '10px', marginBottom: '20px' }}>Teams will have 3 players max</p>}
      {teamSorting === 'team_num' && <p style={{ fontFamily: "'K2D', sans-serif", fontSize: '16px', color: 'white', textAlign: 'left', marginTop: '10px', marginBottom: '20px' }}>The game will create the specified number of teams</p>}
      {teamSorting === 'max_players' && <p style={{ fontFamily: "'K2D', sans-serif", fontSize: '16px', color: 'white', textAlign: 'left', marginTop: '10px', marginBottom: '20px' }}>The game will create teams, filling each one with max players if possible</p>}
      {startErr && <p style={{ color: 'red', fontFamily: "'K2D', sans-serif", fontSize: '14px', textAlign: 'left', marginTop: '10px' }}>{startErr}</p>}
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