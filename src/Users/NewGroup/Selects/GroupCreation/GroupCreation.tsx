import React, { useState } from "react";
import { Dispatch, SetStateAction, CSSProperties } from "react";
import { TbCameraPlus } from 'react-icons/tb';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa6'
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import ImageCrop from './ImageCrop/ImageCrop';
import './GroupCreation.css';

type UserProp = {
  name: string,
  id: string,
  avatar: string,
  chat: string,
  time: string,
  no_id: number,
}

type GroupCreationProps = {
  slideRight: CSSProperties;
  handleNewGroupAnimation: Dispatch<SetStateAction<CSSProperties>>;
  selectedOptions: UserProp[];
}
const GroupCreation: React.FC<GroupCreationProps> = ({ slideRight, handleNewGroupAnimation, selectedOptions }) => {
  const CssTextField = styled(TextField)({
    '& label.Mui-focused': {
      color: 'var(--border-on-click)',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#2f2f2f',
      },
      '&:hover fieldset': {
        borderColor: 'var(--border-on-click)',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'var(--border-on-click)',
      },
      borderRadius: '10px',
    },
    '& .MuiInputLabel-root': {
      color: '#9e9e9e',
    },
    '&:hover .MuiInputLabel-root': {
      color: 'var(--border-on-click)',
    },
    '&.Mui-focused .MuiInputLabel-root': {
      color: 'var(--border-on-click)',
    },
    '& .MuiOutlinedInput-input': {
      color: 'var(--font-color)',
    },
    width: '90%',
    marginTop: '2rem',
  });

  const handleClose = () => {
    handleNewGroupAnimation(prevSlideRight => ({
      ...prevSlideRight,
      visibility: 'hidden',
      opacity: 0,
      transform: 'translateX(-480px)',
    }));
  };

  const [selectedImage, setSelectedImage] = useState<string>("");

  const [croppedImage, setCroppedImage] = useState<string>('');
  const [croppedBlob, setCroppedBlob] = useState<Blob | null>(null);
  const [isCropped, setIsCropped] = useState<boolean>(false);

  const handleCropImage = ({ blob, url }: { blob: Blob; url: string }) => {
    setCroppedBlob(blob);
    setCroppedImage(url);
    setIsCropped(!isCropped);
  };

  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target && e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setCroppedImage('');
      setCroppedBlob(null);
      setIsCropped(false);
    }
  };

  const defaultGrName = selectedOptions.map(option => option.name).join(', ');

  return (
    <div className='gr-creation-container' style={slideRight}>
      <div className="gr-creation-top">
        <div className="new-group-header">
          <span className="new-gr-back-icon-container">
            <FaArrowLeft onClick={handleClose} size={22} className='new-gr-back-icon' />
          </span>
          <h4>New Group</h4>
        </div>
        <form action="" className="new-group-info" >
          <div className="file-container selected-image-container">
            <label htmlFor="file-input" className="change-image-button">
              <TbCameraPlus className="add-photo-icon" size={50} />
            </label>

            <div className="image-container">
              {isCropped === true && croppedImage && (
                <img className="cropped-img" src={croppedImage} alt="Cropped Image" />
              )}
            </div>

            <input
              type="file"
              id="file-input"
              name="photo"
              accept="image/png, image/jpeg"
              onChange={handleImageChange}
              style={{ opacity: 0 }}
              title=""
            />
          </div>
          {isCropped === false && selectedImage && <ImageCrop selectedImage={selectedImage} onCropImage={handleCropImage} />}
          <CssTextField
            label="Group Name"
            id="gr-name"
            defaultValue={defaultGrName}
          />
        </form>
      </div>
      <div className="gr-creation-bot">
        <div className="gr-number">
          <h5>{selectedOptions.length} members</h5>
        </div>
        <ul>
          {selectedOptions.map((selectedOption) => (
            <li
              key={selectedOption.no_id}
            >
              <div className="user">
                <div className="user-avatar">
                  <span>
                    {selectedOption.avatar}
                  </span>
                </div>
                <div className="user-labels">
                  <h5>{selectedOption.name}</h5>
                  <p>Last seen now</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="create-gr-btn-container">
        <FaArrowRight className="create-gr-icon" size={22} />
      </div>
    </div>
  );
}

export default GroupCreation;
