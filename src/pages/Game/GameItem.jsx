import { useParams, useNavigate } from 'react-router-dom';
import GlassContainer from '../../components/glassContainer/glassContainer';
import GlassButton from '../../components/glassButton';
import ItemCard from '../../components/GameComponenets/ItemCard';
import GamePoints from '../../components/GameComponenets/GamePoints';
import UploadImage from '../../components/GameComponenets/UploadImage';

export default function GameItem() {
  const { id } = useParams();
  const navigate = useNavigate();

  const estimatedPoints = 20;

  const item = {
    id: 1,
    imgUri: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%2Fid%2FOIP.f3AeOJngXd-l82lHJWLFgAHaED%3Fpid%3DApi&f=1&ipt=cf68f8c6963cdcf91102b96fb2ee44080c392b558818fe27f353de59d604ce0b',
    points: 100,
    bonusPoints: 100,
    teamsFound: 0,
    isFound: false,
  };

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
        <GamePoints estimatedPoints={estimatedPoints} style={{ marginLeft: '-20px', width: '100%', marginBottom: '0'}} />
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
        itemImgUri={item.imgUri} 
        points={item.points} 
        bonusPoints={item.bonusPoints} 
        teamsFound={item.teamsFound} 
        isFound={item.isFound}
      />
      <UploadImage />
    </div>
  );
}
