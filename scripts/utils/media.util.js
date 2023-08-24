/**
 * generate blob image from video url
 * @param {string} url
 * @return {Promise<unknown>}
 */
export function generateImagePreviewFromVideo(url) {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');

    const loadImage = () => {
      let canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const blobToImage = (blob) => {
        if (!blob) {
          reject("Error to convert video to image blob");
        }
        resolve(blob);

        // Libération des ressources
        URL.revokeObjectURL(video.src);
        video.src = '';
        video.load();
        canvas = null;
      }

      canvas.toBlob(blobToImage, 'image/jpeg', 1);
    }

    video.onerror = reject;
    video.addEventListener('seeked', loadImage, { once: true });
    video.src = url;

    video.load();

    // Recherche de la vidéo au moment spécifié après le chargement
    video.addEventListener('canplay', function() {
      video.currentTime = 1;
    }, { once: true });

  });
}
