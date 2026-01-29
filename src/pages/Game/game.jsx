import GameStats from '../../components/GameComponenets/GameStats';
import GameTimer from '../../components/GameComponenets/GameTimer';

export default function Game() {
  const players = ['Player A', 'Player B', 'Player C', 'Player D'];
  const endTime = new Date(Date.now() + 1000 * 60 * 60 * 24);

  return (
    <div>
      <div
        style={{
          width: '100%',
        }}
      >
        <GameStats players={players} endTime={endTime} />
        <GameTimer estimatedPoints={20} />
      </div>
      <div
        style={{
          width: '100%',
        }}
      >
        hi
      </div>
    </div>

  );
}
