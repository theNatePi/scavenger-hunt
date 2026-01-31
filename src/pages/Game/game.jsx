import { useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useGameContext } from '../../contexts/GameContext';
import { fetchItems, enrichItems } from '../Game/gameTools';
import GamePoints from '../../components/GameComponenets/GamePoints';
import GameStats from '../../components/GameComponenets/GameStats';
import GameItem from '../../components/GameComponenets/GameListItem';

export default function Game() {
  const { game, team, teamData } = useGameContext();

  const packId = 'uci-testing';

  const { data: items } = useQuery({
    queryKey: ['items', packId],
    queryFn: async () => await fetchItems(packId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const enrichedItems = useMemo(() => {
    const enrichedItems = enrichItems(items, game, team);
    return enrichedItems;
  }, [items, game?.teams, team]);

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
        <GamePoints estimatedPoints={teamData(team?.id)?.points} />
      </div>
      <div
        style={{
          width: '100%',
        }}
      >
        {enrichedItems?.map((item) => (
          <GameItem key={item.id} itemId={item.id} itemImgUrl={item.imageUrl} points={item.points} bonusPoints={item.bonusPoints} numTeamsFound={item.numTeamsFound} isFound={item.foundByPlayerTeam} />
        ))}
      </div>
    </div>

  );
}
