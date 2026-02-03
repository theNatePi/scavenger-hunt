import { useNavigate } from 'react-router-dom';
import { useGameContext } from '../../contexts/GameContext';
import GamePoints from '../../components/GameComponenets/GamePoints';
import GlassContainer from '../../components/glassContainer/glassContainer';
import GlassButton from '../../components/glassButton';

export default function GameOver() {
  const { team, teamData } = useGameContext();
  const navigate = useNavigate();
  
  return (
    <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
    }}
    >
      <div
        style={{
          width: '100%',
          marginTop: '-30px',
        }}
      >
        <GlassContainer
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--negative-color-transparent)',
          }}
        >
          <h1>Game Over</h1>
          <p style={{ fontSize: '20px', color: 'var(--primary-color)', textAlign: 'center' }}>The game has ended!<br />Thank you for playing.</p>
          <p style={{ fontSize: '20px', color: 'var(--primary-color)', textAlign: 'center' }}>Please return to your game admin for the winner to be revealed</p>
        </GlassContainer>
        <GamePoints estimatedPoints={teamData(team?.id)?.points} />
        <GlassButton 
          onClick={() => navigate('/')}
        >
          <p style={{ fontSize: '18px', color: 'var(--primary-color)', textAlign: 'center', margin: '20px' }}>Return to Home</p>
        </GlassButton>
      </div>
    </div>
  );
}
