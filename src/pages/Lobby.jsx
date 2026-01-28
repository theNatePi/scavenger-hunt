import { useEffect } from 'react';
import { useGameContext } from '../contexts/GameContext';
import GlassContainer from '../components/glassContainer/glassContainer';

export default function Lobby() {
  const { game } = useGameContext();

  useEffect(() => {
    console.log(game);
  }, [game]);

  return (
    <div>
      <h1
        style={{ marginBottom: '35px' }}
      >
        Lobby
      </h1>
      <p
        style={{
          fontSize: '20px',
          fontWeight: 'bold',
          marginBottom: '-12px',
          textAlign: 'center',
        }}
      >
        Joined Players: {game?.players.length}
      </p>
      <p
        style={{
          fontSize: '15px',
          marginBottom: '23px',
          textAlign: 'center',
        }}
      >
        Please wait for the game to start...
      </p>
      <div
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          justifyItems: 'stretch',
          alignItems: 'stretch',
          margin: '0 40px',
          padding: '0',
          gap: '20px' ,
        }}
      >
        {game?.players.map((player, index) => (
          <GlassContainer 
            key={index}
            style={{
              width: '100%',
              height: '65px',
              margin: '0',
              padding: '0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '15px',
            }}
          >
            <p
              style={{
                fontSize: '20px',
                fontWeight: 'bold',
                width: '80%',
                textAlign: 'center',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {Object.values(player)[0]}
            </p>
          </GlassContainer>
        ))}
      </div>
      {/* <p>Game Name: {game.name}</p> */}
      {/* <p>Game status: {game.status}</p> */}
    </div>
  );
}
