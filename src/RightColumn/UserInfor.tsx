import { CSSProperties, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { RiPencilLine } from "react-icons/ri";
import { MdOutlineCall } from "react-icons/md";
import { IoMdArrowBack } from "react-icons/io";

import "./UserInfor.css";

type UserProp = {
  name: string;
  id: string;
  avatar: string;
  chat: string;
  time: string;
  no_id: number;
};

type UserInfoProps = {
  userInfoProp: UserProp;
};

const RigtColumn: React.FC<UserInfoProps> = ({ userInfoProp }) => {
  const [editClicked, setEditClick] = useState<boolean>(false);
  const [mediaClicked, setMediaClick] = useState<string>("unclicked");

  const handleClickOnEditButton = (
    event: React.MouseEvent<HTMLSpanElement>
  ) => {
    event.preventDefault();
    if (editClicked) {
      setEditClick(false);
    } else {
      setEditClick(true);
    }
  };

  const handleClickMedia = (event: React.MouseEvent<HTMLParagraphElement>) => {
    const content = event.currentTarget.innerHTML;
    setMediaClick(content);
    console.log(mediaClicked);
  };

  return (
    <div className="edit-info-container">
      <div className="edit-info-header">
        {editClicked ? (
          <div>
            <span className="btn-edit" onClick={handleClickOnEditButton}>
              <IoMdArrowBack size={24} className="util-icon" />
            </span>
            <h3>Edit</h3>
          </div>
        ) : (
          <div>
            <span className="btn-close">
              <IoMdClose size={24} className="util-icon" />
            </span>
            <h3>User info</h3>
            <span className="btn-edit" onClick={handleClickOnEditButton}>
              <RiPencilLine size={24} className="util-icon" />
            </span>
          </div>
        )}
      </div>
      {editClicked ? (
        <div></div>
      ) : (
        <div>
          <div className="avatar-container">
            <p className="avatar">{userInfoProp.avatar}</p>
            <p className="name">{userInfoProp.name}</p>
          </div>

          <div className="phone-container">
            <div className="layout-btn">
              <MdOutlineCall size={24} className="util-icon" />
              <p>Phone number</p>
            </div>
          </div>

          <div className="media-container">
            <div className="header">
              <p className="media-topic" onClick={(e) => handleClickMedia(e)}>
                Media
              </p>
              <p className="media-topic" onClick={(e) => handleClickMedia(e)}>
                Files
              </p>
              <p className="media-topic" onClick={(e) => handleClickMedia(e)}>
                Links
              </p>
              <p className="media-topic" onClick={(e) => handleClickMedia(e)}>
                Music
              </p>
              <p className="media-topic" onClick={(e) => handleClickMedia(e)}>
                Voice
              </p>
              <p className="media-topic" onClick={(e) => handleClickMedia(e)}>
                Group
              </p>
            </div>
            <div className="body">
              <p>no media files jett</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RigtColumn;
