import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { getImageById } from '../../utils/imageStorage/firebaseStorage';
import { getItemById } from '../../utils/items/ItemData';
import { useGameContext } from '../../contexts/GameContext';
import { enrichItems } from './gameTools';
import GlassContainer from '../../components/glassContainer/glassContainer';
import GlassButton from '../../components/glassButton';
import ItemCard from '../../components/GameComponenets/ItemCard';
import GamePoints from '../../components/GameComponenets/GamePoints';
import UploadImage from '../../components/GameComponenets/UploadImage';

export default function GameItem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { game, team, teamData } = useGameContext();

  const packId = game?.packId;

  const { data: itemData } = useQuery({
    queryKey: ['item', id, packId],
    queryFn: async () => {
      const item = await getItemById(packId, id);
      const image = await getImageById(packId, item.imageFile);
      return { ...item, image };
    },
    enabled: !!packId && !!id,
  });

  const item = useMemo(() => {
    const item = {
      id: id,
      imgUrl: itemData?.image,
      points: itemData?.points,
      bonusPoints: itemData?.bonusPoints,
    }
    return enrichItems([item], game, team)[0];
  }, [id, itemData, game, team]);

  return (
    <div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '20px',
          margin: '0px',
          padding: '0px',
          width: '100%',
        }}
      >
        <GlassButton 
          onClick={() => navigate(-1)}
          style={{
            width: 'fit-content',
            backgroundColor: 'var(--negative-color-transparent)',
            marginBottom: '0',
          }}
        >
          <p
            style={{
              fontSize: '18px',
              color: 'var(--primary-color)',
              marginLeft: '20px',
              marginRight: '20px',
            }}
          >
            Back
          </p>
        </GlassButton>
        <GamePoints estimatedPoints={teamData(team?.id)?.points} style={{ marginLeft: '-20px', width: '100%', marginBottom: '0'}} />
      </div>
      <GlassContainer>
        <p><b>Find the item or location below!</b></p>
        <p
          style={{
            fontSize: '18px',
            color: 'var(--primary-color)',
          }}
        >
          Upload a photo of your <b>entire</b> team in front of the item or location!
        </p>
      </GlassContainer>
      <ItemCard 
        itemId={item.id} 
        itemImgUri={item.imgUrl} 
        points={item.points} 
        bonusPoints={item.bonusPoints} 
        teamsFound={item.numTeamsFound} 
        isFound={item.foundByPlayerTeam}
      />
      <UploadImage />
    </div>
  );
}
