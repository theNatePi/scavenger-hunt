import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { TeamHeader, TimeReamining } from '../components/HomeComponents';
import { BackButton } from '../components/ItemComponents';

function Item() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTakenImage, setShowTakenImage] = useState(false);

  useEffect(() => {
    // Fetch item data based on ID
    const fetchItem = async () => {
      try {
        // Replace this with your actual API endpoint
        // const response = await fetch(`/api/items/${id}`);
        // const data = await response.json();
        const data = {
          image: 'https://via.placeholder.com/150',
          takenImage: 'https://via.placeholder.com/150',
          points: 10,
          teamsFound: 1,
          found: true
        };
        setItem(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching item:', error);
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!item) {
    return <div>Item not found</div>;
  }

  return (
    <div style={{ width: '85%', maxWidth: '700px', margin: '20px auto 0 auto' }}>
      <TeamHeader />
      <div style={{ width: '117.65%', height: '0px', border: '1.5px solid rgba(255, 255, 255, 0.3)', borderRadius: '10px', marginBottom: '20px', marginLeft: '-8.825%' }}></div>
      <TimeReamining />
      <div style={{ marginBottom: '40px' }}>
        <div style={{backgroundColor: item.found ? '#117546' : '#A51F1F', borderRadius: '10px'}}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ position: 'relative' }}>
            <img 
              src={showTakenImage ? item.takenImage : item.image} 
              alt={item.name} 
              style={{ 
                width: 'calc(100% - 10px)', 
                height: 'auto', 
                borderRadius: '10px', 
                marginBottom: '20px', 
                border: `5px solid ${item.found ? '#117546' : '#A51F1F'}`, 
                display: 'block', 
                margin: '0 auto 20px auto' 
              }} 
            />
            <div style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              backgroundColor: item.found ? '#117546' : '#A51F1F',
              padding: '10px 20px', 
              borderRadius: '10px',
              color: 'white',
              fontFamily: "'K2D', sans-serif",
              fontSize: '18px'
            }}>
              {item.found ? 'Found' : 'Not Found'}
            </div>
            <button
              onClick={() => setShowTakenImage(!showTakenImage)}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                backgroundColor: '#2D0D53',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                padding: '10px 20px',
                fontFamily: "'K2D', sans-serif",
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              {showTakenImage ? 'Show Original' : 'Show Found'}
            </button>
          </div>
          <div style={{padding: '0 20px 20px 20px'}}>
            <h1 style={{ fontSize: '250%', fontWeight: 'bold', fontFamily: "'IBM Plex Sans', sans-serif", margin: '0 0 10px 0', color: 'white', textAlign: 'left' }}>{item.points} Points</h1>
            <h1 style={{ fontSize: '180%', fontFamily: "'K2D', sans-serif", margin: '0 0 0 0', letterSpacing: '0.05em', color: 'white', textAlign: 'left' }}>{item.teamsFound} {item.teamsFound === 1 ? 'Team Found' : 'Teams Found'}</h1>  
          </div>
        </div>
        </div>
      </div>
      <BackButton />
    </div>
  );
}

export default Item;
