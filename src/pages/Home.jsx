import React from 'react';
import { ListItem } from '../components/ItemComponents';
import { TeamHeader, TimeReamining } from '../components/HomeComponents';

const Home = () => {
  // Create an array of indices for demonstration
  const items = Array.from({ length: 20 }, (_, index) => index);

  return (
    <div style={{ width: '85%', maxWidth: '700px', margin: '20px auto 0 auto' }}>
      <TeamHeader totalPoints={100} members={[{name: 'John'}, {name: 'Jane'}, {name: 'Jim'}]} />
      <TimeReamining startTime={new Date().getTime() + 360000} finishTime={new Date().getTime() + 370000} />
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
      <p style={{ fontFamily: "'K2D', sans-serif", fontSize: '14px', color: 'white', textAlign: 'center', marginTop: '10px', marginBottom: '20px' }}>made with 💜 by nate for LPA</p>
    </div>
  );
};

export default Home;
