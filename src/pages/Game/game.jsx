import GameStats from '../../components/GameComponenets/GameStats';
import GameTimer from '../../components/GameComponenets/GameTimer';
import GameItem from '../../components/GameComponenets/GameItem';

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
        <GameItem itemId="1" itemImgUri="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%2Fid%2FOIP.f3AeOJngXd-l82lHJWLFgAHaED%3Fpid%3DApi&f=1&ipt=cf68f8c6963cdcf91102b96fb2ee44080c392b558818fe27f353de59d604ce0b" points={100} bonusPoints={100} teamsFound={0} isFound={false} />
        <GameItem itemId="2" itemImgUri="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%2Fid%2FOIP.f3AeOJngXd-l82lHJWLFgAHaED%3Fpid%3DApi&f=1&ipt=cf68f8c6963cdcf91102b96fb2ee44080c392b558818fe27f353de59d604ce0b" points={100} bonusPoints={100} teamsFound={1} isFound={true} />
        <GameItem itemId="3" itemImgUri="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%2Fid%2FOIP.f3AeOJngXd-l82lHJWLFgAHaED%3Fpid%3DApi&f=1&ipt=cf68f8c6963cdcf91102b96fb2ee44080c392b558818fe27f353de59d604ce0b" points={100} bonusPoints={100} teamsFound={1} isFound={false} />
        <GameItem itemId="4" itemImgUri="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%2Fid%2FOIP.f3AeOJngXd-l82lHJWLFgAHaED%3Fpid%3DApi&f=1&ipt=cf68f8c6963cdcf91102b96fb2ee44080c392b558818fe27f353de59d604ce0b" points={100} bonusPoints={100} teamsFound={1} isFound={false} />
        <GameItem itemId="5" itemImgUri="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%2Fid%2FOIP.f3AeOJngXd-l82lHJWLFgAHaED%3Fpid%3DApi&f=1&ipt=cf68f8c6963cdcf91102b96fb2ee44080c392b558818fe27f353de59d604ce0b" points={100} bonusPoints={100} teamsFound={1} isFound={false} />
      </div>
    </div>

  );
}
