import { useState } from 'react';
import GlassButton from '../glassButton';
import { uploadFoundImage } from '../../utils/imageStorage/imageUploadData';
import { useGameContext } from '../../contexts/GameContext';

export default function UploadImage({ itemId }) {
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imgErr, setImgErr] = useState(null);
  const { team } = useGameContext();

  const handleImageUpload = async () => {
    // Create two input elements for camera and gallery
    // const cameraInput = document.createElement('input');
    const galleryInput = document.createElement('input');
    galleryInput.style.display = 'none';
    
    // Set up camera input
    // cameraInput.type = 'file';
    // cameraInput.accept = 'image/*';
    // cameraInput.capture = 'environment';
    // cameraInput.style.display = 'none';
    
    // Set up gallery input
    galleryInput.type = 'file';
    galleryInput.accept = 'image/jpeg';

    // document.body.appendChild(cameraInput);
    document.body.appendChild(galleryInput);
    
    // Handle file selection for both inputs
    const handleFileSelect = async (e) => {
      setUploadingImage(true);
      const file = e.target.files[0];
      if (file) {
        console.log('Selected image file:', file);
        try {
          await uploadFoundImage(file, itemId, team?.id);
          // Reload the page after the image upload
          // document.body.removeChild(cameraInput);
          document.body.removeChild(galleryInput);
          window.location.reload();
        } catch (error) {
          document.body.removeChild(galleryInput);
          setImgErr("Error uploading image: " + error.message + ". Please try again.");
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

  
  return (
    <>
      <GlassButton
        onClick={handleImageUpload}
        isLoading={uploadingImage}
        style={{
          marginBottom: '10px',
          backgroundColor: 'var(--confirm-color-transparent)',
        }}
      >
        <p><b>Upload Image</b></p>
      </GlassButton>
      {imgErr && (
        <p 
          style={{ 
            color: 'var(--not-found-color)', 
            marginLeft: '40px',
            fontSize: '20px', 
            marginTop: '0',
            marginBottom: '10px',
          }}
        >
          {imgErr}
        </p>
      )}
    </>
  );
}
