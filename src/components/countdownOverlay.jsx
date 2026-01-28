import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CountdownOverlay({ children, showCountdown = false }) {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(4);

  useEffect(() => {
    if (!showCountdown) {
      return;
    }

    const interval = setInterval(() => {
      if (countdown > 0) {
        setCountdown(countdown - 1);
      } else {
        navigate('/lobby/teamReveal');
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [countdown, showCountdown]);

  return (
    <>
    {showCountdown ? (
      <div>
        {children}
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <p
            style={{
              fontSize: '30px',
              fontWeight: 'bold',
              color: 'white',
            }}
          >
            Revealing Teams in...
          </p>
          <p
            style={{
              fontSize: '100px',
              fontWeight: 'bold',
              color: 'white',
              marginTop: '0',
            }}
          >
            {Math.min(countdown, 3)}
          </p>
        </div>
      </div>
    ) : (
      children
    )}
    </>
  );
}
