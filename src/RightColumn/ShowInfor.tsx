import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { RiPencilLine } from "react-icons/ri";
import { MdOutlineCall } from "react-icons/md";
import { IoMdArrowBack } from "react-icons/io";

import "./ShowInfor.css";

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

const ShowInfor: React.FC<UserInfoProps> = ({ userInfoProp }) => {
  const [pageStatus, setPageStatus] = useState<string>("home");
  const [mediaClicked, setMediaClick] = useState<string>("");

  const handleClickOnEditButton = (
    event: React.MouseEvent<HTMLSpanElement>
  ) => {
    event.preventDefault();
    setPageStatus(pageStatus === "home" ? "edit" : "home");
  };

  const handleClickOnMediaButton = (
    event: React.MouseEvent<HTMLParagraphElement>
  ) => {
    event.preventDefault();
    const content = event.currentTarget.innerHTML;
    setMediaClick(content);
    // setPageStatus(pageStatus ? 0 : );
  };

  return (
    <div className="edit-info-container">
      <div className="edit-info-header">
        {pageStatus !== "edit" ? (
          <div>
            <span className="btn-close">
              <IoMdClose size={24} className="util-icon" />
            </span>
            <h3>User info</h3>
            <span className="btn-edit" onClick={handleClickOnEditButton}>
              <RiPencilLine size={24} className="util-icon" />
            </span>
          </div>
        ) : (
          <div>
            <span className="btn-edit" onClick={handleClickOnEditButton}>
              <IoMdArrowBack size={24} className="util-icon" />
            </span>
            <h3>Edit</h3>
          </div>
        )}
      </div>
      {pageStatus !== "edit" ? (
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
              <p
                className={`media-topic ${
                  mediaClicked === "Media" ? "media-clicked" : ""
                }`}
                onClick={(e) => {
                  setMediaClick(e.currentTarget.innerHTML);
                }}
              >
                Media
              </p>
              <p
                className={`media-topic ${
                  mediaClicked === "Files" ? "media-clicked" : ""
                }`}
                onClick={(e) => {
                  setMediaClick(e.currentTarget.innerHTML);
                }}
              >
                Files
              </p>
              <p
                className={`media-topic ${
                  mediaClicked === "Links" ? "media-clicked" : ""
                }`}
                onClick={(e) => {
                  setMediaClick(e.currentTarget.innerHTML);
                }}
              >
                Links
              </p>
              <p
                className={`media-topic ${
                  mediaClicked === "Music" ? "media-clicked" : ""
                }`}
                onClick={(e) => {
                  setMediaClick(e.currentTarget.innerHTML);
                }}
              >
                Music
              </p>
              <p
                className={`media-topic ${
                  mediaClicked === "Group" ? "media-clicked" : ""
                }`}
                onClick={(e) => {
                  setMediaClick(e.currentTarget.innerHTML);
                }}
              >
                Group
              </p>
            </div>
            <div className="body">
              <p>no media files jett</p>
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
      <div className="page2-container">
        <div>avatar</div>
        <form>
          <div>
            <label>First name</label>
            <input type="text"></input>
          </div>
          <div>
            <label>First last</label>
            <input type="text"></input>
          </div>
          <input type="submit" value="tick" />
        </form>
        <button>Delete Contact</button>
      </div>
    </div>
  );
};

export default ShowInfor;
