import React, { useState } from 'react';
import Cropper from 'react-easy-crop';
import Slider from '@mui/material/Slider';
import Button from '@mui/material/Button';
import { getCroppedImg } from './canvasUtils';
import './styles.css';

const ImageCrop = ({ selectedImage, onCropImage }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const showCroppedImage = async () => {
    try {
      const { blob, url } = await getCroppedImg(
        selectedImage,
        croppedAreaPixels,
        rotation
      );
      console.log('Cropped Blob:', blob);
      console.log('Cropped URL:', url);
      onCropImage({ blob, url });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="img-crop-container">
      <div>
        <Cropper
          image={selectedImage}
          crop={crop}
          rotation={rotation}
          zoom={zoom}
          aspect={1}
          cropShape="round"
          showGrid={false}
          onCropChange={setCrop}
          onRotationChange={setRotation}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
        />
      </div>
      <div>
        <Slider
          value={zoom}
          min={1}
          max={3}
          step={0.1}
          aria-labelledby="Zoom"
          onChange={(e, zoom) => setZoom(zoom)}
        />
      </div>
      <div>
        <Button
          onClick={showCroppedImage}
          variant="contained"
          color="primary"
        >
          Show Result
        </Button>
      </div>
    </div>
  );
};

export default ImageCrop;
