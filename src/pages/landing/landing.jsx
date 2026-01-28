import { useReducer, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameContext } from '../../contexts/GameContext';
import { nicknameChangeHandler, joinGameHandler, checkForAuthAndActiveGame } from './landingTools';
import { isLoggedIn } from '../../utils/auth';
import GlassContainer from '../../components/glassContainer/glassContainer';
import GlassButton from '../../components/glassButton';
import GlassInput from '../../components/glassInput';

const initialForm = {
  nickname: '',
  nicknameError: null,
  typedGameCode: '',
  gameCodeError: null,
  isLoading: false,
  wasDisconnected: false,
};

function formReducer(state, action) {
  switch (action.type) {
    case 'nickname': return { ...state, nickname: action.value, nicknameError: action.error ?? state.nicknameError };
    case 'nicknameError': return { ...state, nicknameError: action.value };
    case 'gameCode': return { ...state, typedGameCode: action.value };
    case 'gameCodeError': return { ...state, gameCodeError: action.value };
    case 'loading': return { ...state, isLoading: action.value };
    case 'wasDisconnected': return { ...state, wasDisconnected: action.value };
    default: return state;
  }
}

export default function Landing() {
  const [form, dispatch] = useReducer(formReducer, initialForm);
  const { setGameId, setPlayer } = useGameContext();
  const [showAdminOptions, setShowAdminOptions] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function checkForActiveGame() {
      const activeGame = await checkForAuthAndActiveGame();
      if (activeGame) {
        dispatch({ type: 'wasDisconnected', value: true });
      }
    }
    checkForActiveGame();
  }, []);

  function _handleNicknameChange(e) {
    setShowAdminOptions(false);
    nicknameChangeHandler(e.target.value, dispatch);
  }

  async function _handleJoinGame() {
    setGameId(null);
    setShowAdminOptions(false);
    const success = await joinGameHandler(form, dispatch, setGameId);
    if (success) {
      const uid = await isLoggedIn();
      if (uid) {
        setPlayer({ uid: uid, nickname: form.nickname });
      } else {
        alert('Failed to create user in _handleJoinGame, contact an admin');
      }
      navigate('/lobby');
    }
  }

  function _hadnleAdminOptions() {
    setShowAdminOptions(true);
  }

  function _handleCreateGame() {
    navigate('/admin/createGame');
  }

  function _handleManageGame() {
    alert('Not Yet Implemented');
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
      {
        form.wasDisconnected && (
          <GlassContainer>
            <p
              style={{
                fontSize: '18px',
              }}
            >
              <b>It looks like you were disconnected.</b> <br/>
              Input the <u>same</u> game code and <u>any</u> nickname to rejoin the game.
            </p>
          </GlassContainer>
        )
      }
      <GlassInput placeholder="Nickname" value={form.nickname} onChange={_handleNicknameChange} />
      {form.nicknameError && 
        <p 
          style={{ 
            color: '#000000BB',
            fontSize: '14px',
            marginTop: '-10px',
            textAlign: 'left',
            marginLeft: '40px',
          }}
        >
          {form.nicknameError}
        </p>
      }
      <GlassInput placeholder="Game Code" value={form.typedGameCode} onChange={(e) => dispatch({ type: 'gameCode', value: e.target.value })} />
      {form.gameCodeError && 
        <p 
          style={{ 
            color: '#000000BB',
            fontSize: '14px',
            marginTop: '-10px',
            textAlign: 'left',
            marginLeft: '40px',
          }}
        >
          {form.gameCodeError}
        </p>
      }
      <GlassButton 
        onClick={_handleJoinGame}
        isLoading={form.isLoading}
        style={{  
          backgroundColor: 'var(--confirm-color-transparent)' }}
      >
        Join Game
      </GlassButton>
      {showAdminOptions ? (
        <GlassContainer
          style={{
            display: 'flex',
            backgroundColor: 'var(--negative-color-transparent)',
            flexDirection: 'row',
            gap: '0px',
            // margin: '0',
            padding: '0',
          }}
        >
          <GlassButton style={{ width: '100%', marginRight: '10px' }} onClick={_handleCreateGame}>Create Game</GlassButton>
          <GlassButton style={{ width: '100%', marginLeft: '10px' }} onClick={_handleManageGame}>Manage Game</GlassButton>
        </GlassContainer>
      ): 
        (<GlassButton 
          onClick={_hadnleAdminOptions}
          style={{ 
            backgroundColor: 'var(--negative-color-transparent)' }}
        >
            Admin Options
          </GlassButton>
        )
      } 
    </div>
  );
}
