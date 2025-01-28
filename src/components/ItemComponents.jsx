import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '../utils/firebase';

const ListItem = ({ packId, imageRef, points, found, teamsFound, id }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const storagePath = `packs/${packId}/${imageRef}.jpg`;
        const storageRef = ref(storage, storagePath);
        const url = await getDownloadURL(storageRef);
        setImageUrl(url);
      } catch (error) {
        console.error(`Error fetching image:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [packId, imageRef]);

  return (
    <>
      <div style={{ width: '100%', position: 'relative', display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
        <div style={{
          width: '100%',
          maxWidth: '500px',
          height: '8em', 
          display: 'flex', 
          flexDirection: 'row', 
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.03))',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '20px',
          boxShadow: `
            0 8px 32px 0 rgba(31, 38, 135, 0.15),
            inset 0 0 0 1px rgba(255, 255, 255, 0.08),
            inset 0 0 16px rgba(255, 255, 255, 0.05)
          `,
          padding: '12px',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
        }}
          onClick={() => {
            navigate(`/item/${id}`);
          }}
        >
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(45deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 100%)',
            pointerEvents: 'none',
            borderRadius: '20px',
          }} />

          <div style={{ 
            width: '10em', 
            height: '100%', 
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '15px',
            overflow: 'hidden',
            position: 'relative',
          }}>
            {loading ? (
              <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.05)'
              }}>
                <div style={{
                  width: '30px',
                  height: '30px',
                  border: '3px solid rgba(255,255,255,0.2)',
                  borderTop: '3px solid rgba(255,255,255,0.8)',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
              </div>
            ) : (
              <img 
                src={imageUrl}
                alt="Item"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '15px',
                }}
              />
            )}
            <div 
              onClick={(e) => {
                e.stopPropagation();
                setShowModal(true);
              }}
              style={{
                position: 'absolute',
                bottom: '8px',
                left: '8px',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05))',
                backdropFilter: 'blur(10px)',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: `
                  0 8px 32px 0 rgba(31, 38, 135, 0.2),
                  0 2px 8px 0 rgba(0, 0, 0, 0.2),
                  0 0 16px 0 rgba(0, 0, 0, 0.15)
                `,
                border: '1px solid rgba(255, 255, 255, 0.18)',
              }}
            >
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="white" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                style={{
                  filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
                }}
              >
                <path d="M11 3h10v10" />
                <path d="M13 21H3v-10" />
                <path d="M21 3l-7 7" />
                <path d="M3 21l7-7" />
              </svg>
            </div>
          </div>
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '0.5rem 1rem',
            position: 'relative',
            zIndex: 1,
          }}>
            <div style={{ 
              width: '100%',
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'flex-end',
              color: 'white',
              textShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }}>
              <b><p style={{ margin: '0', fontFamily: 'ibm-plex-sans, sans-serif', fontSize: '22px' }}>{points} Points</p></b>
              <p style={{ margin: '0.5rem 0', fontFamily: 'K2D, sans-serif', fontSize: '18px', opacity: 0.9 }}>{found ? 'Found' : 'Not Found'}</p>
              <p style={{ margin: '0', fontFamily: 'K2D, sans-serif', fontSize: '15px', opacity: 0.8 }}>{teamsFound} {teamsFound === 1 ? 'Team Found' : 'Teams Found'}</p>
            </div>
            <div style={{ 
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              width: '4px',
              background: found ? 'rgba(17, 217, 70, 0.5)' : 'rgba(255, 31, 31, 0.5)',
              borderRadius: '2px',
              boxShadow: `0 0 10px ${found ? 'rgba(17, 217, 70, 0.5)' : 'rgba(255, 31, 31, 0.5)'}`,
            }} />
          </div>
        </div>
      </div>
      {showModal && (
        <ImageModal 
          image={imageUrl}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <div style={{ 
      height: '35px', 
      margin: '0 auto 20px auto',
      borderRadius: '100px',
      textAlign: 'center',
      backgroundColor: '#2D0D53',
      color: 'white', 
      position: 'fixed',
      bottom: '5px',
      left: '50%',
      transform: 'translateX(-50%)',
      maxWidth: '700px',
      width: '85%',
    }}>
      <h2 onClick={() => navigate('/home')} style={{ margin: '0', lineHeight: '30px', fontSize: '15px' }}>Back</h2>
    </div>
  );
};

const ImageModal = ({ image, onClose }) => (
  <div 
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
      cursor: 'pointer'
    }}
    onClick={onClose}
  >
    <img 
      src={image} 
      alt="Full size"
      style={{
        maxWidth: '90%',
        maxHeight: '90%',
        width: '100%',
        objectFit: 'contain',
        borderRadius: '10px'
      }}
      onClick={e => e.stopPropagation()}
    />
  </div>
);

const PointsInfoModal = ({ onClose }) => (
  <div 
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      cursor: 'pointer'
    }}
    onClick={onClose}
  >
    <div 
      style={{
        backgroundColor: '#2D0D53',
        padding: '30px',
        borderRadius: '15px',
        maxWidth: '600px',
        margin: '20px',
        cursor: 'default'
      }}
      onClick={e => e.stopPropagation()}
    >
      <h2 style={{ color: 'white', 
              fontFamily: "'IBM Plex Sans', sans-serif",
              marginBottom: '15px'
              }}>
              Points Explanation
              </h2>
              <p style={{ 
              color: 'white', 
        fontFamily: "'K2D', sans-serif",
        lineHeight: '1.6'
      }}>
        Points must be confirmed by an admin. Your estimated points are the total of all items you claim to have found. Your actual point total will depend on which images can be confirmed.
      </p>
    </div>
  </div>
);

const CameraUpload = ({ onImageUpload, isUploading }) => {
  const [error, setError] = useState(null);

  const handleImageUpload = () => {
    // Create the file input element
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    // For iOS Safari, we need to set these attributes
    input.capture = 'environment';
    input.style.display = 'none';
    
    // Crucial: append to DOM for iOS Safari
    document.body.appendChild(input);

    // Handle the file selection
    const handleChange = async (e) => {
      const file = e.target.files?.[0];
      if (file) {
        try {
          await onImageUpload(file);
        } catch (err) {
          setError('Failed to upload image. Please try again.');
          console.error('Upload error:', err);
        }
      }
      // Clean up: remove the input from DOM
      document.body.removeChild(input);
    };

    // Add event listeners
    input.addEventListener('change', handleChange);
    input.addEventListener('cancel', () => {
      document.body.removeChild(input);
    });

    // Trigger file selection
    input.click();
  };

  return (
    <div>
      <button 
        onClick={handleImageUpload}
        disabled={isUploading}
        style={{
          background: 'rgba(99, 49, 216, 0.2)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 4px 12px rgba(99, 49, 216, 0.3)',
          color: 'white',
          borderRadius: '10px',
          padding: '10px 20px',
          fontFamily: "'K2D', sans-serif",
          fontSize: '16px',
          cursor: isUploading ? 'not-allowed' : 'pointer', 
          width: '100%',
          marginTop: '20px',
          opacity: isUploading ? 0.7 : 1,
          transition: 'all 0.3s ease'
        }}
      >
        {isUploading ? 'Uploading...' : 'Add / Take Picture'}
      </button>
      {error && (
        <div style={{ color: 'red', marginTop: '10px', textAlign: 'center' }}>
          {error}
        </div>
      )}
    </div>
  );
};

export { ListItem, BackButton, ImageModal, PointsInfoModal, CameraUpload };