import { useState } from 'react';
import { createPortal } from 'react-dom';
import GlassContainer from '../glassContainer/glassContainer';
import GlassButton from '../glassButton';

export default function ClickableImage({ imgUri, alt, style, showMessage = true }) {
  const [showImage, setShowImage] = useState(false);
  const overlay = showImage && (
    <div
      // Including the onClick here, allowing the user
      //   to click outside of the modal to close it
      onClick={(e) => {
        e.stopPropagation();
        setShowImage(false);
      }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 2147483647,
        width: '100vw',
        height: '100vh',
        minHeight: '100dvh',
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
            {showMessage && (
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
                  Find this item in the game area
                </p>
              </GlassContainer>
            )}
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
            src={imgUri}
            alt={alt}
            onClick={(e) => e.stopPropagation()}
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
  );
  return (
    <>
      {createPortal(overlay, document.body)}
      <img
        src={imgUri}
        alt={alt}
        style={style}
        onClick={(e) => {
          e.stopPropagation();
          setShowImage(true);
        }}
      />
    </>
  );
}
