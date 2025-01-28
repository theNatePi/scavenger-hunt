import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { TeamHeader, TimeRemaining } from '../components/HomeComponents';
import { BackButton, ImageModal } from '../components/ItemComponents';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, storage } from '../utils/firebase';
import { useGame } from '../contexts/GameContext';
import { getPackItems, isItemFound, numberTeamsFound, uploadImage, getFoundImage } from '../utils/db';
import { ref, getDownloadURL } from 'firebase/storage';
import { CameraUpload } from '../components/ItemComponents';

const Item = () => {
  const { id } = useParams();
  const { gameCode } = useGame();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTakenImage, setShowTakenImage] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [gameActive, setGameActive] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [finishTime, setFinishTime] = useState(null);
  const [imgErr, setImgErr] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!gameCode) {
          setLoading(false);
          return;
        }

        const gameDoc = await getDoc(doc(db, 'games', gameCode));
        const endAt = gameDoc.data()?.end_at;
        setFinishTime(endAt?.toMillis());

        const itemDoc = await getDoc(doc(db, 'items', id));
        const itemDocData = itemDoc.data();
        const packData = await getPackItems(itemDocData.image_pack);
        const itemData = packData.find(item => item.id === id);
        const storagePath = `packs/${1}/${itemData.image_reference}.jpg`;
        const storageRef = ref(storage, storagePath);
        const url = await getDownloadURL(storageRef);

        const foundUrl = await getFoundImage(itemData.id, auth.currentUser.uid);

        const isFound = await isItemFound(itemData.id, auth.currentUser.uid);

        const teamsFound = await numberTeamsFound(itemData.id, auth.currentUser.uid);

        const data = {
          image: url,
          takenImage: foundUrl,
          points: itemData.points,
          teamsFound: teamsFound,
          found: isFound
        };
        setItem(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const checkGameStatus = () => {
      const now = new Date().getTime();
      const remaining = finishTime - now;
      const isActive = remaining > 0;
      
      setGameActive(isActive);
    };

    if (finishTime) {
      checkGameStatus();
      const interval = setInterval(checkGameStatus, 1000);
      return () => clearInterval(interval);
    }
  }, [gameCode, id, finishTime]);

  const handleImageUpload = async () => {
    // Create two input elements for camera and gallery
    // const cameraInput = document.createElement('input');
    const galleryInput = document.createElement('input');
    
    // Set up camera input
    // cameraInput.type = 'file';
    // cameraInput.accept = 'image/*';
    // cameraInput.capture = 'environment';
    // cameraInput.style.display = 'none';
    
    // Set up gallery input
    galleryInput.type = 'file';
    galleryInput.accept = 'image/*';

    // document.body.appendChild(cameraInput);
    document.body.appendChild(galleryInput);
    
    // Handle file selection for both inputs
    const handleFileSelect = async (e) => {
      setUploadingImage(true);
      const file = e.target.files[0];
      if (file) {
        console.log('Selected image file:', file);
        try {
          const imageUrl = await uploadImage(file, id, auth.currentUser.uid); // Upload the image and get the URL
          console.log('Uploaded image URL:', imageUrl);
          // Reload the page after the image upload
          // document.body.removeChild(cameraInput);
          document.body.removeChild(galleryInput);
          window.location.reload();
        } catch (error) {
          document.body.removeChild(galleryInput);
          console.error('Error uploading image:', error);
          setImgErr(true);
        }
      }
      // document.body.removeChild(cameraInput);
      // document.body.removeChild(galleryInput);
      setUploadingImage(false);
    };
    
    // cameraInput.onchange = handleFileSelect;
    galleryInput.onchange = handleFileSelect;

    // cameraInput.addEventListener('cancel', () => {
    //   document.body.removeChild(cameraInput);
    // });
    galleryInput.addEventListener('cancel', () => {
      document.body.removeChild(galleryInput);
    });

    // Create buttons for user choice
    const chooseMethod = () => {
      galleryInput.click();
    };

    chooseMethod();
  };

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
        <div style={{ fontSize: '24px', marginBottom: '10px' }}>Loading Item...</div>
        <div style={{ fontSize: '14px' }}>Where did we put that...</div>
      </div>
    );
  }

  if (!item) {
    return <div>Item not found</div>;
  }

  return (
    <div style={{ width: '85%', maxWidth: '700px', margin: '20px auto 0 auto' }}>
      <TeamHeader/>
      <TimeRemaining finishTime={finishTime} />
      <div style={{ marginBottom: '40px' }}>
        <div style={{
          backgroundColor: item.found 
            ? 'rgba(17, 117, 70, 0.2)' 
            : 'rgba(165, 31, 31, 0.2)',
          backgroundImage: `
            linear-gradient(135deg, 
              ${item.found 
                ? 'rgba(17, 117, 70, 0.7) 0%, rgba(17, 117, 70, 0.3)' 
                : 'rgba(165, 31, 31, 0.7) 0%, rgba(165, 31, 31, 0.2)'} 100%)
          `,
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderRadius: '16px',
          boxShadow: `
            0 4px 30px ${item.found 
              ? 'rgba(17, 117, 70, 0.2)' 
              : 'rgba(165, 31, 31, 0.2)'},
            inset 0 0 20px ${item.found 
              ? 'rgba(17, 117, 70, 0.2)' 
              : 'rgba(165, 31, 31, 0.2)'},
            inset 0 1px 2px rgba(255, 255, 255, 0.25)
          `,
          border: '1px solid rgba(255, 255, 255, 0.18)',
          padding: '20px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '50%',
            background: `linear-gradient(to bottom,
              ${item.found 
                ? 'rgba(255, 255, 255, 0.15)' 
                : 'rgba(255, 255, 255, 0.15)'} 0%,
              transparent 100%)`,
            borderTopLeftRadius: '16px',
            borderTopRightRadius: '16px',
            pointerEvents: 'none'
          }} />
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
            <div style={{ position: 'relative' }}>
              {uploadingImage ? (
                <div style={{
                  position: 'relative',
                  background: 'rgba(0, 0, 0, 0.5)',
                  borderRadius: '10px',
                  overflow: 'hidden'
                }}>
                  <img 
                    src={showTakenImage ? item.takenImage : item.image} 
                    alt={item.name} 
                    onClick={() => setShowModal(true)}
                    style={{ 
                      width: '100%',
                      height: '100%',
                      borderRadius: '10px', 
                      display: 'block', 
                      margin: '0 0 20px 0',
                      objectFit: 'cover',
                      cursor: 'pointer',
                      opacity: '50%',
                    }} 
                  />
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    color: 'white',
                    fontSize: '24px',
                    fontWeight: 'bold'
                  }}>
                    Uploading
                  </div>
                </div>
              ) : (
                <img 
                  src={showTakenImage ? item.takenImage : item.image} 
                  alt={item.name} 
                  onClick={() => setShowModal(true)}
                  style={{ 
                    width: '100%',
                    height: '100%',
                    borderRadius: '10px', 
                    display: 'block', 
                    margin: '0 0 20px 0',
                    objectFit: 'cover',
                    cursor: 'pointer'
                  }} 
                />
              )}  
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
              {item.found && (
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
                    cursor: 'pointer',
                  }}
              >
                  {showTakenImage ? 'Show Original' : 'Show Found'}
                  <img
                    src={item.takenImage} 
                    alt={item.name} 
                    style={{ 
                      width: '0px',
                      height: '0px',
                    }} 
                  />
                </button>
                
              )}
            </div>
            <div style={{padding: '0 0 10px 1px', textAlign: 'left'}}>
              <h1 style={{ fontSize: '250%', fontWeight: 'bold', fontFamily: "'IBM Plex Sans', sans-serif", margin: '0 0 10px 0', color: 'white', textAlign: 'left', padding: '0 0 0 0' }}>{item.points} Points</h1>
              <h1 style={{ fontSize: '180%', fontFamily: "'K2D', sans-serif", margin: '0 0 0 5px', letterSpacing: '0.05em', color: 'white', textAlign: 'left', padding: '0 0 0 0' }}>{item.teamsFound} {item.teamsFound === 1 ? 'Team Found' : 'Teams Found'}</h1>  
            </div>
          </div>
        </div>
        {gameActive && (
          <div>
            <button 
              onClick={handleImageUpload}
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
                cursor: 'pointer', 
                width: '100%',
                marginTop: '20px',
                transition: 'all 0.3s ease'
              }}
            >
              {item.found ? 'Replace Picture' : 'Add / Take Picture'}
            </button>
          </div>
        )}
      </div>
      <p style={{ fontFamily: "'K2D', sans-serif", fontSize: '14px', color: 'white', textAlign: 'center', marginTop: '10px', marginBottom: '20px' }}>made with 💜 by nate for <a href='https://ctc-uci.com/'>CTC @ UCI</a></p>
      <div style={{ paddingTop: '50px' }} />
      <BackButton />
      {showModal && (
        <ImageModal 
          image={showTakenImage ? item.takenImage : item.image}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

export default Item;
