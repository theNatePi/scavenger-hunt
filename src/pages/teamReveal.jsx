import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameContext } from '../contexts/GameContext';
import ShuffleReveal from '../components/ShuffleReveal';
import GlassButton from '../components/glassButton';

export default function TeamReveal() {
  const { game, player, team, setTeam, actions } = useGameContext();
  const [teamReady, setTeamReady] = useState(false);
  const navigate = useNavigate();

  const revealTime = 1;
  const revealOffset = 0.5;

  const _handleReady = async () => {
    await actions.updateTeam(team?.id, {
      teamReady: true,
    });
    setTeamReady(true);
  };

  const _handleNotReady = async () => {
    await actions.updateTeam(team?.id, {
      teamReady: false,
    });
    setTeamReady(false);
  };

  function _findTeam() {
    const nickname = player?.nickname;
    const teams = game?.teams;

    if (!nickname || !Array.isArray(teams)) return;

    const foundTeam =
      teams.find((t) => Array.isArray(t?.playerNicknames) && t.playerNicknames.includes(nickname)) ??
      null;

    // If we already have the right team in context, don't update again.
    if (team?.playerNicknames?.includes?.(nickname) && team?.teamReady === foundTeam?.teamReady) return;

    setTeam(foundTeam);
    setTeamReady(foundTeam?.teamReady);
  }

  useEffect(() => {
    if (team === null) {
      console.log('game', game);
      console.log('player', player);
      console.log('team', team);
      _findTeam();
    }
  }, []);

  useEffect(() => {
    if (game?.status === 'game_started') {
      navigate('/game');
    }
  }, [game?.status]);

  useEffect(() => {
    _findTeam()
  }, [game?.teams, player?.nickname, setTeam, team]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <h1
        style={{ marginBottom: '35px' }}
      >
        Your Team
      </h1>
      {team?.playerNicknames.filter((nickname) => nickname !== player?.nickname).map((nickname, index) => (
        <ShuffleReveal
          key={index}
          text={nickname}
          revealTime={revealTime + (index * revealOffset)}
        />
      ))}

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          margin: '0 20px',
        }}
      >
        <p style={{ textAlign: 'center', marginBottom: '-10px' }}>Your team is <b>{teamReady ? 'ready' : 'not ready'}</b></p>
        {!teamReady ? (
          <>
            <p style={{ textAlign: 'center', marginBottom: '-10px' }}>Find your team to start the game!</p>
            <GlassButton 
              onClick={_handleReady} 
              style={{ backgroundColor: 'var(--confirm-color-transparent)', marginLeft: '0', marginRight: '0'}}
            >
              Ready Up
            </GlassButton>
          </>
        ) : (
          <>
            <p style={{ textAlign: 'center', marginBottom: '-10px' }}>Your team is ready to start the game!<br/>Please click "Not Ready" if you have not found your team.</p>
            <GlassButton 
              onClick={_handleNotReady} 
              style={{ backgroundColor: 'var(--negative-color-transparent)', marginLeft: '0', marginRight: '0'}}
            >
              Not Ready
            </GlassButton>
          </>
        )}
      </div>
    </div>
  );
}
