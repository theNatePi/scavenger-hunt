import React, { useState } from 'react';
import { ImageModal } from './ItemComponents';  // Import the existing ImageModal
import { setConfirmed, undoConfirmed } from '../utils/db';

const ComparisonCard = ({leftImage, rightImage, confirmed, itemId, teamId}) => {
  const [status, setStatus] = useState(confirmed);  // false = red, true = green
  const [showLeftModal, setShowLeftModal] = useState(false);
  const [showRightModal, setShowRightModal] = useState(false);

  const confirm = async () => {
    const set = await setConfirmed(itemId, teamId);
    if (set) {
      setStatus(true);
    }
  };

  const notConfirm = async () => {
    const set = await undoConfirmed(itemId, teamId);
    if (set) {
      setStatus(false);
    }
  }

  const buttonStyle = {
    padding: '8px 12px',
    border: 'none',
    borderRadius: '10px',
    color: 'white',
    cursor: 'pointer',
    margin: '0 5px',
    width: '35px',
    height: '35px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  return (
    <div style={{ width: '85%', maxWidth: '500px', margin: '0 auto', marginBottom: '45px' }}>
      <div style={{ 
        width: '100%',
        maxWidth: '500px',
        height: '8em',
        marginBottom: '20px'
      }}>
        <div style={{
          backgroundColor: status ? '#117546' : '#A51F1F',
          borderRadius: '20px',
          padding: '10px',
          height: '100%',
          display: 'flex',
          gap: '15px'
        }}>
          <div style={{
            display: 'flex',
            flex: 1,
            gap: '15px'
          }}>
            <img
              src={leftImage}
              alt="Left comparison"
              style={{
                flex: 1,
                objectFit: 'cover',
                borderRadius: '15px',
                cursor: 'pointer',
                width: '110px'
              }}
              onClick={() => setShowLeftModal(true)}
            />
            <img
              src={rightImage}
              alt="Right comparison"
              style={{
                flex: 1,
                objectFit: 'cover',
                borderRadius: '15px',
                cursor: 'pointer',
                width: '110px'
              }}
              onClick={() => setShowRightModal(true)}
            />
          </div>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center',
            gap: '10px'
          }}>
            <button 
              onClick={() => confirm()}
              style={{ ...buttonStyle, backgroundColor: '#117546' }}
            >✓</button>
            <button 
              onClick={() => notConfirm()}
              style={{ ...buttonStyle, backgroundColor: '#A51F1F' }}
            >✕</button>
          </div>
        </div>
      </div>
      {showLeftModal && (
        <ImageModal 
          image={leftImage}
          onClose={() => setShowLeftModal(false)}
        />
      )}
      {showRightModal && (
        <ImageModal 
          image={rightImage}
          onClose={() => setShowRightModal(false)}
        />
      )}
    </div>
  );
};

export { ComparisonCard };
