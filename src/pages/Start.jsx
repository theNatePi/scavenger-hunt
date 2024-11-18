import React from 'react';

const Start = () => {
  return (
    <div style={{height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center'}}>
      <div />
      <div style={{dispay: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ width: '85%', maxWidth: '700px', margin: '20px auto 0 auto' }}>
          <div style={{ marginBottom: '40px' }}>
            <div style={{ 
              background: 'rgba(99, 49, 216, 0.2)',
              backdropFilter: 'blur(20px)', 
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '10px',
              padding: '20px',
              color: 'white',
              fontFamily: "'K2D', sans-serif"
            }}>
              <b><h1 style={{ fontSize: '24px', marginBottom: '15px', fontFamily: "'K2D', sans-serif", textAlign: 'center' }}>Welcome to the LPA Scavenger Hunt!</h1></b>
              <p style={{ width: '100%', textAlign: 'center', fontSize: '30px', lineHeight: '.3' }}>💜</p>
              <p style={{ fontSize: '16px', lineHeight: '1.5', marginBottom: '20px', fontFamily: "'K2D', monospace", textAlign: 'center' }}>
                Please enter the game code you were given to join the game. Teams will be chosen at random.<br />
                <br />
                You will be tasked with finding and photographing items around the area. Remember to stay safe and have fun!
              </p>
            </div>
            <input 
              type="text" 
              placeholder="enter game code" 
              style={{
                width: '100%',
                marginTop: '20px',
                padding: '15px',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                fontFamily: "'K2D', sans-serif",
                fontSize: '18px',
                boxSizing: 'border-box',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white'
              }} 
              className="game-code-input"
            />
            <button 
              style={{
                background: 'rgba(99, 49, 216, 0.2)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 4px 12px rgba(99, 49, 216, 0.3)',
                color: 'white',
                borderRadius: '10px',
                padding: '15px 30px',
                fontFamily: "'K2D', sans-serif",
                fontSize: '18px',
                cursor: 'pointer',
                width: '100%',
                marginTop: '20px',
                transition: 'all 0.3s ease'
              }}
            >
              Join Game
            </button>
          </div>
        </div>
      </div>
      <p style={{ fontFamily: "'K2D', sans-serif", fontSize: '14px', color: 'white', textAlign: 'center', marginTop: '10px', marginBottom: '20px' }}>made with 💜 by nate for LPA</p>
    </div>
  );
}

export default Start;
