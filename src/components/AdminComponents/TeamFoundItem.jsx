import { useEffect, useState } from 'react';
import { getImageById } from '../../utils/imageStorage/firebaseStorage';
import { setItemVerification } from '../../utils/items/ItemData';
import GlassContainer from '../glassContainer/glassContainer';
import GlassButton from '../glassButton';
import ClickableImage from '../GameComponenets/ClickableImage';

export default function TeamFoundItem({ packId, item, gameId, teamId }) {
  const [originalImageUrl, setOriginalImageUrl] = useState(null);
  const imageFile = `${item.id}.jpg`;

  useEffect(() => {
    const fetchImageUrl = async () => {
      const url = await getImageById(packId, imageFile);
      setOriginalImageUrl(url);
    }
    fetchImageUrl();
  }, [packId, item.id, imageFile]);

  return (
    <GlassContainer
      style={{
        backgroundColor: item.verified ? 'var(--confirm-color-transparent)' : 'var(--negative-color-transparent)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '20px',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '20px',
        }}
      >
        <div
          style={{
            width: '50%',
            aspectRatio: '1/0.75',
            overflow: 'hidden',
            borderRadius: '10px',
          }}
        >
          <ClickableImage
            imgUri={originalImageUrl}
            alt={'original'}
            showMessage={false}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>
        <div
          style={{
            width: '50%',
            aspectRatio: '1/0.75',
            overflow: 'hidden',
            borderRadius: '10px',
          }}
        >
          <ClickableImage
            imgUri={item.imageUrl}
            alt={'found'}
            showMessage={false}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>
      </div>
      <div
        style={{
          width: '100%',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          <GlassButton 
            onClick={() => {
              setItemVerification(item.id, teamId, gameId, true);
            }}
            style={{
              backgroundColor: 'var(--confirm-color-transparent)',
              width: '100%',
            }}
          >
              Mark Valid
          </GlassButton>
          <GlassButton 
            onClick={() => {
              setItemVerification(item.id, teamId, gameId, false);
            }}
            style={{
              backgroundColor: 'var(--negative-color-transparent)',
              width: '100%',
            }}
          >
              Mark Invalid
          </GlassButton>
        </div>
      </div>
    </GlassContainer>
  );
}
