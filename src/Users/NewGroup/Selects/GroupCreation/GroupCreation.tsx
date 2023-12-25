import React, { useEffect, useState } from "react";
import { Dispatch, SetStateAction, CSSProperties } from "react";
import { TbCameraPlus } from 'react-icons/tb';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa6'
import { AiOutlineClose } from 'react-icons/ai'
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import ImageCrop from './ImageCrop/ImageCrop';
import './GroupCreation.css';
import ChannelApi from "../../../../Api/ChannelApi";

type UserType = {
  id: number,
  username: string,
  avatar_url: string,
  first_name: string,
  last_name: string,
  fullname: string
}

type GroupCreationProps = {
  slideRight: CSSProperties;
  handleNewGroupAnimation: Dispatch<SetStateAction<CSSProperties>>;
  handleCloseAddmember: () => void
  selectedOptions: UserType[];
  setSelectedOptions: React.Dispatch<React.SetStateAction<UserType[]>>;
}
const GroupCreation: React.FC<GroupCreationProps> = ({ slideRight, handleNewGroupAnimation, handleCloseAddmember, selectedOptions, setSelectedOptions }) => {

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

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target && e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setCroppedImage('');
      setCroppedBlob(null);
      setIsCropped(false);
    }

    setDisEditAvatar(true);
  };

  // handle visible popup edit avatar
  const [disEditAvatar, setDisEditAvatar] = useState<boolean>(false);
  const handleHiddenEditAvatar = () => {
    setDisEditAvatar(false);
    setSelectedImage("");
  }
  // handle submit create group

  const [groupName, setGroupName] = useState('');
  useEffect(() => {
    setGroupName(selectedOptions.map(option => option.fullname).join(', '));
  }, [slideRight])

  const handleInputGroupName = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    event.preventDefault();
    setGroupName(event.target.value);
  }

  const handleSubmitAvatar = async (event: React.MouseEvent<HTMLDivElement, MouseEvent>, id: number) => {
    event.preventDefault();
    const stringId = id.toString();
    if (croppedBlob) {
      const fileAvatar = new File([croppedBlob], "group_avatar.jpg", { type: "image/jpeg", lastModified: new Date().getTime() })
      const formData = new FormData();
      formData.append('file', fileAvatar);
      formData.append('channel', stringId);
      try {
        const response = await ChannelApi.uploadAvatar(formData);
        console.log("update avatar group", response);
        // 
        setIsCropped(false);
      } catch (error) {
        console.log(error)
      }
    }

  }

  const handleSubmitCreateGroup = async (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.preventDefault();
    const members = selectedOptions.map(option => option.id);

    const formData = {
      title: groupName,
      members: members
    }

    try {
      const response = await ChannelApi.createChannel(formData);
      handleSubmitAvatar(event, response.data?.id);
      setSelectedOptions([]);
      handleClose()
      handleCloseAddmember();
    } catch (error) {
      console.log(error);
    }

  }

  return (
    <>
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
            <div className="input-group">
              <input onChange={handleInputGroupName} className='form-control' dir='auto' type="text" name='groupName' value={groupName} placeholder='Group name' />
              <label>Group name</label>
            </div>
          </form>
        </div>
        <div className="gr-creation-bot">
          <div className="gr-number">
            <h5>{selectedOptions.length} members</h5>
          </div>
          <ul>
            {selectedOptions.map((selectedOption) => (
              <li key={selectedOption.id} >
                <div className="user">
                  <div className="user-avatar">
                    <img src={selectedOption.avatar_url || "https://static.vecteezy.com/system/resources/previews/008/442/086/non_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg"} alt="avatar user" className='user-avatar-img' />
                  </div>
                  <div className="user-labels">
                    <h5>{selectedOption.fullname}</h5>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="create-gr-btn-container" onClick={handleSubmitCreateGroup}>
          <FaArrowRight className="create-gr-icon" size={22} />
        </div>
      </div>
      {disEditAvatar &&
        <div className="overlay" >
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
        </div>}
    </>
  );
}

export default GroupCreation;
