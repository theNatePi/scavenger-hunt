import { useState } from 'react';
import GlassContainer from '../glassContainer/glassContainer';
import GlassButton from '../glassButton';
import { useNavigate } from 'react-router-dom';
import ClickableImage from './ClickableImage';

function GameItem({ itemId, itemImgUri, points, bonusPoints, teamsFound, isFound }) {
  const [showImage, setShowImage] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <GlassContainer
        onClick={() => navigate(`/game/item/${itemId}`)}
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '100px',
        }}
      >
        <div>
          <ClickableImage 
            imgUri={itemImgUri} 
            alt={itemId} 
            style={{ 
              width: '150px',
              height: '100px',
              objectFit: 'cover',
              objectPosition: 'center',
              borderRadius: '10px',
            }} 
          />
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'flex-end',
            height: '100px',
            gap: '20px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'flex-end',
              height: '100px',
            }}
          >
            <p style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--primary-color)' }}>Points: {points}</p>
            <p style={{ fontSize: '15px', color: 'var(--primary-color)' }}>Teams Found: {teamsFound}</p>
            <p style={{ fontSize: '15px', color: 'var(--primary-color)' }}>{isFound ? 'Found' : 'Not Found'}</p>
            {teamsFound === 0 && (
              <p style={{ fontSize: '12px', fontStyle: 'italic', color: 'var(--primary-color)', textAlign: 'right' }}>find it first, get +{bonusPoints}</p>
            )}
          </div>
          <div 
            style={{ 
              height: '100px', 
              width: '4px',
              borderRadius: '2px',
              boxShadow: isFound ? '0 0 10px 0 var(--found-color)' : '0 0 10px 0 var(--not-found-color)',
              backgroundColor: isFound ? 'var(--found-color)' : 'var(--not-found-color)',
            }}
          />
        </div>
      </GlassContainer>
    </>
  );
}

export default GameItem;