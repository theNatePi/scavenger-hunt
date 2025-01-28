import React, { useState, useEffect } from 'react';
import { ListItem } from '../components/ItemComponents';
import { TeamHeader, TimeRemaining } from '../components/HomeComponents';
import { getPackItems, isItemFound, numberTeamsFound } from '../utils/db';
import { useGame } from '../contexts/GameContext';
import { getDoc, doc } from 'firebase/firestore';
import { db, auth } from '../utils/firebase';

const Home = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [finishTime, setFinishTime] = useState(null);
  const { gameCode } = useGame();
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!gameCode || !user) {
          return;
        }

        const [itemsData, gameDoc] = await Promise.all([
          getPackItems(1, user.uid),
          getDoc(doc(db, 'games', gameCode))
        ]);
        
        setItems(itemsData);
        const endAt = gameDoc.data()?.end_at;
        setFinishTime(endAt?.toMillis());
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    const checkUser = () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        setUser(currentUser);
        fetchData();
      } else {
        setTimeout(checkUser, 1000);
      }
    };

    checkUser();

    return () => {
      // setLoading(false);
    };
  }, [gameCode, user]);

  if (loading) {
    return (
      <div style={{ 
        width: '85%', 
        maxWidth: '700px', 
        margin: '20px auto 0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '50vh',
        fontFamily: "'K2D', sans-serif",
        color: 'white'
      }}>
        <div style={{ fontSize: '24px', marginBottom: '10px' }}>Loading Hunt Items...</div>
        <div style={{ fontSize: '14px' }}>Please wait while we gather everything</div>
      </div>
    );
  }

  return (
    <div style={{ width: '85%', maxWidth: '700px', margin: '20px auto 0 auto' }}>
      <TeamHeader />
      <TimeRemaining finishTime={finishTime} />
      <div style={{ marginBottom: '40px' }}>
        {items.map((item) => (
          <div key={item.id}>
            <ListItem 
              packId={1}
              imageRef={item.image_reference}
              points={item.points}
              id={item.id}
              found={item.is_found}
              teamsFound={item.teams_found}
            />
          </div>
        ))}
      </div>
      <p style={{ fontFamily: "'K2D', sans-serif", fontSize: '14px', color: 'white', textAlign: 'center', marginTop: '10px', marginBottom: '20px' }}>made with 💜 by nate for <a href='https://ctc-uci.com/'>CTC @ UCI</a></p>
    </div>
  );
};

export default Home;
