function shuffle(array) {
  // Use Fisher-Yates shuffle
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}


async function compressImageToTargetSize(file, targetBytes = 400 * 1024) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      let width = img.width;
      let height = img.height;

      const maxDimension = 1920;
      if (width > maxDimension || height > maxDimension) {
        const ratio = Math.min(maxDimension / width, maxDimension / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const drawAndTryBlob = (quality) => {
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to create blob'));
              return;
            }
            if (blob.size <= targetBytes || quality <= 0.1) {
              resolve(blob);
              return;
            }
            if (quality > 0.1) {
              drawAndTryBlob(Math.max(0.1, quality - 0.1));
            } else {
              // Quality at minimum and still too big: scale down dimensions and retry
              width = Math.round(width * 0.75);
              height = Math.round(height * 0.75);
              if (width < 64 || height < 64) {
                resolve(blob); // accept best effort
                return;
              }
              drawAndTryBlob(0.9);
            }
          },
          'image/jpeg',
          quality
        );
      };
      drawAndTryBlob(0.9);
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to load image'));
    };
    img.src = objectUrl;
  });
}


export { shuffle, compressImageToTargetSize };
