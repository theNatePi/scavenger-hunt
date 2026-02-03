import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useGameContext } from '../../contexts/GameContext';
import GlassButton from '../../components/glassButton';
import GlassContainer from '../../components/glassContainer/glassContainer';
import TeamFoundItem from '../../components/AdminComponents/TeamFoundItem';

export default function ReviewTeam() {
  const [team, setTeam] = useState(null);
  const navigate = useNavigate();

  const { id } = useParams();
  const { game } = useGameContext();

  useEffect(() => {
    const team = game?.teams?.find((t) => t.id === id);
    setTeam(team);
  }, [game, id]);

  return (
    <div>
      <h1>Review Team</h1>
      {/* <p>Player: {team?.playerNicknames.join(', ')}</p> */}
      <GlassButton
        onClick={() => navigate(-1)}
        style={{
          backgroundColor: 'var(--negative-color-transparent)',
          marginBottom: '0',
        }}
      >
        Back
      </GlassButton>
      <GlassContainer> 
        <p>Team Players: {team?.playerNicknames.join(', ')}</p>
      </GlassContainer>
      <p 
        style={{ 
          fontSize: '25px',
          fontWeight: 'bold', 
          color: 'var(--primary-color)', 
          marginLeft: '30px', 
          marginTop: '30px',
        }}
      >
        Items found:
      </p>
      {team?.foundItems.map((item) => (
        <TeamFoundItem key={item.id} packId={game?.packId} item={item} gameId={game?.id} teamId={team?.id} />
      ))}
    </div>
  );
}
