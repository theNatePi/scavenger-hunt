import React from 'react';
import { ListItem } from '../components/ItemComponents';
import { TeamHeader, TimeReamining } from '../components/HomeComponents';

const Home = () => {
  // Create an array of indices for demonstration
  const items = Array.from({ length: 20 }, (_, index) => index);

  return (
    <div style={{ width: '85%', maxWidth: '700px', margin: '20px auto 0 auto' }}>
      <TeamHeader />
      <div style={{ width: '117.65%', height: '0px', border: '1.5px solid rgba(255, 255, 255, 0.3)', borderRadius: '10px', marginBottom: '20px', marginLeft: '-8.825%' }}></div>
      <TimeReamining />
      <div style={{ marginBottom: '40px' }}>
        {items.map((item, index) => (
          <div key={index}>
            <ListItem />
            {index < items.length - 1 && (
              // Add a line between items if it's not the last item
              <div style={{ width: '100%', height: '0px', border: '1.5px solid rgba(255, 255, 255, 0.3)', borderRadius: '10px', margin: '15px 0 15px 0' }}></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
