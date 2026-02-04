import { useEffect, useState } from 'react';
import { useGameContext } from '../../contexts/GameContext';
import { calculateAllTeamPoints } from '../../utils/game/pointsCalc';
import { updateTeamPointsActual } from '../../utils/teams/teamsData';
import GlassContainer from '../../components/glassContainer/glassContainer';
import GlassButton from '../../components/glassButton';
import GameStats from '../../components/GameComponenets/GameStats';
import TeamListItem from '../../components/AdminComponents/TeamListItem';

export default function ManageGame() {
  const { game, actions } = useGameContext();

  useEffect(() => {
    const interval = setInterval( async () => {
      if (game?.endTime.toDate() < new Date()) {
        await actions.updateGame({ status: 'finished' });
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [game?.endTime]);


  async function _calculateActualPoints() {
    const verifiedTeamPoints = await calculateAllTeamPoints(game);
    for (const teamId in verifiedTeamPoints) {
      await updateTeamPointsActual(game.id, teamId, verifiedTeamPoints[teamId]);
    }
  }

  return (
    <div>
      <h1>Manage Game</h1>
      <GlassContainer>
        <p>Game Code: {game?.code}</p>
        <p>Status: {game?.status}</p>
      </GlassContainer>
      <GameStats endTime={game?.endTime} />
      <p 
        style={{ 
          fontSize: '25px',
          fontWeight: 'bold', 
          color: 'var(--primary-color)', 
          marginLeft: '30px', 
          marginTop: '30px',
        }}
      >
        Teams:
      </p>
      <div>
        {game?.teams?.map((team, index) => (
          <TeamListItem key={index} team={team} />
        ))}
      </div>
      <GlassButton
        onClick={_calculateActualPoints}
        style={{
          backgroundColor: 'var(--confirm-color-transparent)'
        }}
      >
        Calculate actual points
      </GlassButton>
    </div>
  );
}
