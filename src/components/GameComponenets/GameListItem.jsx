import { useState } from 'react';
import GlassContainer from '../glassContainer/glassContainer';
import GlassButton from '../glassButton';
import { useNavigate } from 'react-router-dom';

function GameItem({ itemId, itemImgUri, points, bonusPoints, teamsFound, isFound }) {
  const [showImage, setShowImage] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      {showImage && (
        <div
          // Including the onClick here, allowing the user
          //   to click outside of the modal to close it
          onClick={() => setShowImage(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 1000,
            width: '100%',
            height: '100vh',
            backgroundColor: 'rgba(35, 35, 35, 0.71)',
            backdropFilter: 'blur(15px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '20px',
              width: '80%',
              padding: '0',
              marginBottom: '20px',
            }}
          >
            <GlassContainer
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                height: '55px',
                padding: '0 25px',
                margin: '0',
                backgroundColor: 'var(--confirm-color-transparent)',
              }}
            >
              <p
                style={{
                  fontSize: '15px',
                  color: 'var(--primary-color)',
                }}
              >
                Find this item in the game area and upload a photo!
              </p>
            </GlassContainer>
            <GlassButton
              onClick={() => setShowImage(false)}
              style={{
                padding: '10px 20px',
                width: '150px',
                cursor: 'pointer',
                backgroundColor: 'var(--negative-color-transparent)',
                margin: '0',
              }}
            >
              <p
                style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: 'var(--primary-color)',
                }}
              >
                Close
              </p>
            </GlassButton>
          </div>
          <img 
            src={itemImgUri} 
            alt={itemId} 
            style={{
              width: '75%',
              height: 'auto',
              objectFit: 'contain',
              objectPosition: 'center',
              borderRadius: '10px',
              padding: '4px',
              backgroundColor: 'var(--primary-color)',
              border: '4px solid var(--primary-color)',
            }}
          />
        </div>
      )}
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
          <img 
            src={itemImgUri} 
            alt={itemId} 
            onClick={(e) => {
              e.stopPropagation();
              setShowImage(true);
            }}
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
              <p style={{ fontSize: '12px', fontStyle: 'italic', color: 'var(--primary-color)' }}>find it first, get +{bonusPoints} points!</p>
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