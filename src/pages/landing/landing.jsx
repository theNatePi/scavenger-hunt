import { useReducer } from 'react';
import { nicknameChangeHandler, joinGameHandler } from './landingTools';
import GlassContainer from '../../components/glassContainer/glassContainer';
import GlassButton from '../../components/glassButton';
import GlassInput from '../../components/glassInput';

const initialForm = {
  nickname: '',
  nicknameError: null,
  typedGameCode: '',
  gameCodeError: null,
  isLoading: false,
};

function formReducer(state, action) {
  switch (action.type) {
    case 'nickname': return { ...state, nickname: action.value, nicknameError: action.error ?? state.nicknameError };
    case 'nicknameError': return { ...state, nicknameError: action.value };
    case 'gameCode': return { ...state, typedGameCode: action.value };
    case 'gameCodeError': return { ...state, gameCodeError: action.value };
    case 'loading': return { ...state, isLoading: action.value };
    default: return state;
  }
}

export default function Landing() {
  const [form, dispatch] = useReducer(formReducer, initialForm);

  function _handleNicknameChange(e) {
    nicknameChangeHandler(e.target.value, dispatch);
  }

  async function _handleJoinGame() {
    await joinGameHandler(form, dispatch);
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
      <GlassButton 
        style={{ 
          backgroundColor: 'var(--negative-color-transparent)' }}
      >
        Manage Game
      </GlassButton>


      <div style={{ display: 'flex', gap: '0px' }}>
        <GlassButton style={{ width: '100%', marginRight: '10px' }}>one</GlassButton>
        <GlassButton style={{ width: '100%', marginLeft: '10px' }}>two</GlassButton>
      </div>
    </div>
  );
}
