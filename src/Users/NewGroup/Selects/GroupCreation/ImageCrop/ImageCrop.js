import React, { useState } from 'react';
import Cropper from 'react-easy-crop';
import Slider from '@mui/material/Slider';
import Button from '@mui/material/Button';
import { getCroppedImg } from './canvasUtils';
import './styles.css'


const Demo = ({selectedImage, onCropImage}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const showCroppedImage = async () => {
    try {
      const croppedImage = await getCroppedImg(
        selectedImage,
        croppedAreaPixels,
        rotation
      );
      onCropImage(croppedImage);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className='img-crop-container'>
        <React.Fragment>
          <div
            sx={{
              position: 'relative',
              zIndex: 10,
              width: '100%',
              height: 200,
              background: '#333',
              '@media (min-width: 600px)': {
                height: 400,
              },
            }}
          >
            <Cropper
              image={selectedImage}
              crop={crop}
              rotation={rotation}
              zoom={zoom}
              aspect={1}
              cropShape='round'
              showGrid={false}
              onCropChange={setCrop}
              onRotationChange={setRotation}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>
          <div
            sx={{
              padding: 16,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'stretch',
              '@media (min-width: 600px)': {
                flexDirection: 'row',
                alignItems: 'center',
              },
            }}
          >
            <div
              sx={{
                display: 'flex',
                flex: '1',
                alignItems: 'center',

              }}
            >
              <Slider
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-labelledby="Zoom"
                sx={{
                  padding: '22px 0px',
                  marginLeft: 16,
                  '@media (min-width: 600px)': {
                    flexDirection: 'row',
                    alignItems: 'center',
                    margin: '0 16px',
                  },
                }}
                onChange={(e, zoom) => setZoom(zoom)}
              />
            </div>
            <Button
              onClick={showCroppedImage}
              variant="contained"
              color="primary"
              sx={{
                flexShrink: 0,
                marginLeft: 16,
              }}
            >
              Show Result
            </Button>
          </div>
        </React.Fragment>
    </div>
  );
};

export default Demo;