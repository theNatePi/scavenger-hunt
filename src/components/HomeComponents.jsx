import React from 'react';

const TeamHeader = () => {
  return (
    <div style={{ 
      width: '100%',
      height: '100px', 
      margin: '0 auto 10px auto',
      textAlign: 'left',
      color: 'white'
    }}>
      <h1 style={{ fontSize: '250%', fontWeight: 'bold', fontFamily: "'IBM Plex Sans', sans-serif", margin: '0 0 10px 0' }}>Team</h1>
      <p style={{ fontSize: '20px', fontFamily: "'K2D', sans-serif", margin: '0 0 0 0', letterSpacing: '0.05em' }}>aldkjf, lkfjal, akdfl</p>
    </div>
  );
};

const TimeReamining = () => {
  return (
    <div style={{ 
      width: '100%',
      height: '35px', 
      margin: '0 auto 20px auto',
      borderRadius: '100px',
      textAlign: 'center',
      backgroundColor: '#4A0766',
      color: 'white'
    }}>
      <h2 style={{ margin: '0', lineHeight: '30px', fontSize: '15px' }}>content</h2>
    </div>
  );
};

export { TeamHeader, TimeReamining };
