import React from 'react';
import '../styles/Start.css';
import { createGame } from '../utils/db';
import { useState } from 'react';
import { joinGame, gameInProgress, playerInGame } from '../utils/db';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';

const Start = () => {
  // const [gameCode, setGameCode] = useState('');
  const [name, setName] = useState('');
  const [joinErr, setJoinErr] = useState('');
  const [returningUser, setReturningUser] = useState(false);
  const navigate = useNavigate();
  const { gameCode, setGameCode, setUsername } = useGame();

  const handleJoinGame = async () => {
    if (gameCode === '' || name === '') {
      setJoinErr('Please enter a game code and name');
      return;
    }

    try {
      const inGame = await playerInGame(gameCode, name);
      if (returningUser || inGame) {
        navigate('/lobby');
      }

      const inProgress = await gameInProgress(gameCode);
      if (inProgress) {
        setJoinErr("Game already started");
        return;
      }

      const res = await joinGame(gameCode, name);
      if (res.error) {
        setJoinErr(res.error);
        return;
      }
      if (res.existing) {
        setReturningUser(true);
        return;
      }
      setJoinErr('');
      setUsername(name);
      setGameCode(gameCode);
      navigate('/lobby');
    } catch (e) {
      console.error(e);
      setJoinErr('An error occurred, maybe your game code is wrong?');
    }
  };

  return (
    <div style={{height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center'}}>
      <div />
      <div style={{dispay: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ width: '85%', maxWidth: '700px', margin: '20px auto 0 auto' }}>
          <div style={{ marginBottom: '40px' }}>
            <div style={{ 
              background: 'rgba(99, 49, 216, 0.2)',
              backdropFilter: 'blur(20px)', 
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '10px',
              padding: '20px',
              color: 'white',
              fontFamily: "'K2D', sans-serif"
            }}>
              <b><h1 style={{ fontSize: '24px', marginBottom: '15px', fontFamily: "'K2D', sans-serif", textAlign: 'center' }}>Welcome to the Scavenger Hunt!</h1></b>
              <p style={{ width: '100%', textAlign: 'center', fontSize: '30px', lineHeight: '.3' }}>💜</p>
              <p style={{ fontSize: '16px', lineHeight: '1.5', marginBottom: '20px', fontFamily: "'K2D', monospace", textAlign: 'center' }}>
                Please enter the game code you were given to join the game. Teams will be chosen at random.<br />
                <br />
                You will be tasked with finding and photographing items around the area. Remember to stay safe and have fun!
              </p>
            </div>
            <input 
              type="text" 
              placeholder="enter game code"
              onChange={(e) => setGameCode(e.target.value)}
              style={{
                width: '100%',
                marginTop: '20px',
                padding: '15px',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                fontFamily: "'K2D', sans-serif",
                fontSize: '18px',
                boxSizing: 'border-box',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white'
              }} 
              className="game-code-input"
            />
            <input 
              type="text" 
              placeholder="enter name"
              onChange={(e) => setName(e.target.value)}
              style={{
                width: '100%',
                marginTop: '20px',
                padding: '15px',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                fontFamily: "'K2D', sans-serif",
                fontSize: '18px',
                boxSizing: 'border-box',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white'
              }} 
              className="name-input"
            />
            {joinErr && <p style={{ color: 'red', fontFamily: "'K2D', sans-serif", fontSize: '14px', textAlign: 'center', marginTop: '10px' }}>{joinErr}</p>}
            <button 
              onClick={handleJoinGame}
              style={{
                background: 'rgba(99, 49, 216, 0.2)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 4px 12px rgba(99, 49, 216, 0.3)',
                color: 'white',
                borderRadius: '10px',
                padding: '15px 30px',
                fontFamily: "'K2D', sans-serif",
                fontSize: '18px',
                cursor: 'pointer',
                width: '100%',
                marginTop: '20px',
                transition: 'all 0.3s ease'
              }}
            >
              {returningUser ? ("Rejoin Game") : ("Join Game")}
            </button>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
        <p style={{ fontFamily: "'K2D', sans-serif", fontSize: '14px', color: 'white', textAlign: 'center', marginTop: '10px', marginBottom: '20px' }}>made with 💜 by nate for <a href='https://ctc-uci.com/'>CTC @ UCI</a></p>
        <button 
          onClick={async () => {const gameId = await createGame(); window.location.href = '/admin/start/' + gameId}}
          style={{ 
            background: 'rgba(99, 49, 216, 0.1)',  // lighter background
            border: '1px solid rgba(255, 255, 255, 0.1)',  // more subtle border
            borderRadius: '10px',
            color: 'white',
            padding: '10px 20px',
            fontFamily: "'K2D', sans-serif",  // matched font
            fontSize: '14px',
            cursor: 'pointer',
            width: '200px',
            margin: '0 0 10px 0'
          }}>
          Create Game
        </button>
      </div>
    </div>
  );
}

export default Start;
