import { useState } from 'react';
import { nicknameChangeHandler, joinGameHandler } from './landingTools';
import GlassContainer from '../../components/glassContainer/glassContainer';
import GlassButton from '../../components/glassButton';
import GlassInput from '../../components/glassInput';

export default function Landing() {
  const [nickname, setNickname] = useState('');
  const [nicknameError, setNicknameError] = useState(null);
  const [typedGameCode, setTypedGameCode] = useState('');
  const [gameCodeError, setGameCodeError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  function _handleNicknameChange(e) {
    nicknameChangeHandler(e.target.value, setNickname, setNicknameError);
  }

  async function _handleJoinGame() {
    joinGameHandler(nickname, typedGameCode, setIsLoading, setNicknameError, setGameCodeError);
  }

  return (
    <div>
      <h1 style={{ marginBottom: '35px' }}>
        Scavenger Hunt
      </h1>
      <GlassContainer>
        <p
          style={{
            fontSize: '20px',
            fontWeight: 'bold',
          }}
        >
          Welcome to the scavenger hunt!
        </p>
        <p
          style={{
            fontSize: '18px',
          }}
        >
          Please enter the game code you were given to join the game. <br/><br/>
          Teams will be chosen at random. <br/><br/>
          You will be tasked with finding and photographing items nearby. Remember to say safe, and have fun!
        </p>
      </GlassContainer>
      <GlassInput placeholder="Nickname" value={nickname} onChange={_handleNicknameChange} />
      {nicknameError && 
        <p 
          style={{ 
            color: '#000000BB',
            fontSize: '14px',
            marginTop: '-10px',
            textAlign: 'left',
            marginLeft: '40px',
          }}
        >
          {nicknameError}
        </p>
      }
      <GlassInput placeholder="Game Code" value={typedGameCode} onChange={(e) => setTypedGameCode(e.target.value)} />
      {gameCodeError && 
        <p 
          style={{ 
            color: '#000000BB',
            fontSize: '14px',
            marginTop: '-10px',
            textAlign: 'left',
            marginLeft: '40px',
          }}
        >
          {gameCodeError}
        </p>
      }
      <GlassButton 
        onClick={_handleJoinGame}
        isLoading={isLoading}
        style={{  
          backgroundColor: 'var(--confirm-color-transparent)' }}
      >
        Join Game
      </GlassButton>
      <GlassButton 
        style={{ 
          backgroundColor: 'var(--negative-color-transparent)' }}
      >
        Manage Game
      </GlassButton>
    </div>
  );
}
