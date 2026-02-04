import { useNavigate } from 'react-router-dom';
import GlassButton from '../glassButton';

export default function TeamListItem({ team, actualPoints }) {
  const navigate = useNavigate();
  
  return (
    <GlassButton
      onClick={() => navigate(`/admin/manageGame/team/${team.id}`)}
      style={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <p 
        style={{ 
          fontSize: '15px', 
          color: 'var(--primary-color)', 
          textAlign: 'left',
          width: '100%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          padding: '20px'
        }}
      >
        {team.playerNicknames.join(', ')}
      </p>
      <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '20px',
        marginRight: '20px',
      }}
      >
        <p style={{ fontSize: '15px', color: 'var(--primary-color)', textAlign: 'center' }}>{team.points}<br/>(est)</p>
        <p style={{ fontSize: '15px', color: 'var(--primary-color)', textAlign: 'center' }}>{team.pointsActual}<br/>(act)</p>
      </div>
    </GlassButton>
  );
}
