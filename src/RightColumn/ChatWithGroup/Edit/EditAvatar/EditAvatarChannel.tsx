import React from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import ImageCrop from '../../../../Users/NewGroup/Selects/GroupCreation/ImageCrop/ImageCrop';

type EditAvatarType = {
  croppedImage: string | undefined;
  croppedBlob: Blob | undefined;
  isCropped: boolean;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  setDisEditAvatar: React.Dispatch<React.SetStateAction<boolean>>;
  selectedImage: string;
  setSelectedImage: React.Dispatch<React.SetStateAction<string>>;
  handleCropImage: ({ blob, url }: {
    blob: Blob;
    url: string;
}) => void;
};

const EditAvatarChannel:React.FC<EditAvatarType> = ({
  croppedImage,
  croppedBlob,
  isCropped,
  handleImageChange,
  setDisEditAvatar,
  selectedImage,
  setSelectedImage,
  handleCropImage,
}) => {

  const handleHiddenEditAvatar = () => {
    setDisEditAvatar(false);
    setSelectedImage("");
  }
  
  return (
    <div className="container-edit-avatar" >
    <div onClick={handleHiddenEditAvatar} className="backdrop"></div>
    <div className="wrap-edit">
      <div className="header-edit">
        <span onClick={handleHiddenEditAvatar} className='button-close'><AiOutlineClose size={22} /></span>
        <div className='header-title'>Avatar</div>
      </div>
      <div className="content-edit">
        <div className="avatar-crop">
          <ImageCrop setDisEditAvatar={setDisEditAvatar} selectedImage={selectedImage} onCropImage={handleCropImage} />
        </div>
      </div>
    </div>
  </div>
  )
}

export default EditAvatarChannel