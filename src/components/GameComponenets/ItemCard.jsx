import { useState } from 'react';
import GlassContainer from '../glassContainer/glassContainer';
import GlassButton from '../glassButton';
import ClickableImage from './ClickableImage';

export default function ItemCard({ itemId, itemImgUri, points, bonusPoints, teamsFound, isFound, foundImgUri}) {
  const [showFoundImage, setShowFoundImage] = useState(foundImgUri ? true : false);
  const cardColor = isFound ? 'var(--confirm-color-transparent)' : 'var(--not-found-color)';
  const cardGradient = isFound ? 'var(--found-gradient)' : 'var(--not-found-gradient)';

  return (
    <GlassContainer
    style={{
      background: cardGradient,
    }}
    >
      <GlassContainer
        style={{
          position: 'absolute',
          width: 'fit-content',
          height: 'fit-content',
          padding: '5px 10px',
          margin: '0',
          backgroundColor: cardColor,
          borderRadius: '20px 0px 20px 0px',
        }}
      >
        <p>{isFound ? 'Found' : 'Not Found'}</p>
      </GlassContainer>
      <div
        style={{
          minHeight: '50px',
        }}
      >
        {showFoundImage ? (
          <ClickableImage
            imgUri={foundImgUri}
            alt={itemId}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              borderRadius: '20px',
            }}
          />
        ) : (
          <ClickableImage
            imgUri={itemImgUri}
            alt={itemId}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              borderRadius: '20px',
            }}
          />
        )}
      </div>
      {isFound && (
        <GlassButton onClick={() => setShowFoundImage(!showFoundImage)}>
          {showFoundImage ? 'Show Original' : 'Show Found'}
        </GlassButton>
      )}
      <p
        style={{
          fontSize: '25px',
          fontWeight: 'bold',
          color: 'var(--primary-color)',
          marginBottom: '-5px',
        }}
      >
        {points} points
      </p>
      <p
        style={{
          fontSize: '20px',
          color: 'var(--primary-color)',
        }}
      >
        {teamsFound} team{teamsFound === 1 ? '' : 's'} found
      </p>
      {(teamsFound === 0 && bonusPoints > 0) && (
        <p
          style={{
            fontSize: '18px',
            color: 'var(--primary-color)',
            marginTop: '-10px',
            marginBottom: '0px',
          }}
        >
          Find it first, get +{bonusPoints} points!
        </p>
      )}
    </GlassContainer>
  );
}
