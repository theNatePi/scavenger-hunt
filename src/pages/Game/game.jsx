import { useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useGameContext } from '../../contexts/GameContext';
import { fetchItems, enrichItems } from '../Game/gameTools';
import GamePoints from '../../components/GameComponenets/GamePoints';
import GameStats from '../../components/GameComponenets/GameStats';
import GameItem from '../../components/GameComponenets/GameListItem';

export default function Game() {
  const { game, team, teamData } = useGameContext();

  const { data: items } = useQuery({
    queryKey: ['items', game?.packId],
    queryFn: async () => await fetchItems(game?.packId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const enrichedItems = useMemo(() => {
    const enrichedItems = enrichItems(items, game, team);
    return enrichedItems;
  }, [items, game?.teams, team]);

  return (
    <div>
      <div
        style={{
          width: '100%',
        }}
      >
        <GameStats players={team?.playerNicknames} endTime={game?.endTime} />
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
