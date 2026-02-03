import GlassContainer from '../glassContainer/glassContainer';
import { useState, useEffect } from 'react';

export default function GameStats({ players = [], endTime } = {}) {
  const [timeLeft, setTimeLeft] = useState('loading...');
  const playerList = Array.isArray(players) ? players : [];

  function _formatTimeLeft(endTime) {
    const now = new Date();
    const timeLeft = endTime.toDate() - now;
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(_formatTimeLeft(endTime));
    }, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  return (
    <GlassContainer>
      <div 
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {playerList.length > 0 && (
          <>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'start',
                width: '95%',
              }}
            >
              <p
                style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: 'var(--primary-color)',
                }}
              >
                Team:
              </p>
              <p
                style={{
                  fontSize: '15px',
                  color: 'var(--primary-color)',
                  width: '50%',
                  textAlign: 'right',
                  marginTop: '4px',
                }}
              >
                {playerList.join(', ')}
              </p>
            </div>

            <div 
              style={{
                width: '100%',
                height: '2px',
                borderRadius: '1px',
                backgroundColor: 'var(--primary-color)',
                opacity: '0.3',
                marginTop: '10px',
                marginBottom: '10px',
              }}
            />
          </>
          )}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'end',
            width: '95%',
          }}
        >
          <p
            style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: 'var(--primary-color)',
            }}
          >
            Time Left:
          </p>
          <p
            style={{
              fontSize: '15px',
              color: 'var(--primary-color)',
              width: '50%',
              textAlign: 'right',
              marginBottom: '4px'
            }}
          >
            {timeLeft}
          </p>
        </div>
      </div>
    </GlassContainer>
  );
}
