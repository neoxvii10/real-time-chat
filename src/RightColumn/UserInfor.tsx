import React from "react";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { RiPencilLine } from "react-icons/ri";
import { IoMdArrowBack } from "react-icons/io";
import "./UserInfor.css";
import ShowInfor from "./Status1/ShowInfor";
import EditInfor from "./Status2/Edit";

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

const UserInfor: React.FC<UserInfoProps> = ({ userInfoProp }) => {
  const [pageStatus, setPageStatus] = useState<string>("info");
  const [mediaClicked, setMediaClick] = useState<string>("");
  const handleClickOnEditButton = (
    event: React.MouseEvent<HTMLSpanElement>
  ) => {
    event.preventDefault();
    setPageStatus(pageStatus === "info" ? "edit" : "info");
  };

  const handleClickOnMedia = (
    event: React.MouseEvent<HTMLParagraphElement>
  ) => {
    setMediaClick(event.currentTarget.innerHTML);
    setPageStatus(event.currentTarget.innerHTML);
  };

  return (
    <div className="RightColumn-container">
      {pageStatus === "info" && (
        <div>
          <div className="rightcolumn-header">
            <span className="btn-close">
              <IoMdClose size={24} className="util-icon" />
            </span>
            <h3>User info</h3>
            <span className="btn-edit" onClick={handleClickOnEditButton}>
              <RiPencilLine size={24} className="util-icon" />
            </span>
          </div>
          <div className="info-body">
            <ShowInfor userInfoProp={userInfoProp} />
          </div>
          <div className="media-container">
            <div className="header">
              <p
                className={`media-topic ${
                  mediaClicked === "Media" ? "media-clicked" : ""
                }`}
                onClick={(e) => {
                  handleClickOnMedia(e);
                }}
              >
                Media
              </p>
              <p
                className={`media-topic ${
                  mediaClicked === "Files" ? "media-clicked" : ""
                }`}
                onClick={(e) => {
                  handleClickOnMedia(e);
                }}
              >
                Files
              </p>
              <p
                className={`media-topic ${
                  mediaClicked === "Links" ? "media-clicked" : ""
                }`}
                onClick={(e) => {
                  handleClickOnMedia(e);
                }}
              >
                Links
              </p>
              <p
                className={`media-topic ${
                  mediaClicked === "Music" ? "media-clicked" : ""
                }`}
                onClick={(e) => {
                  handleClickOnMedia(e);
                }}
              >
                Music
              </p>
              <p
                className={`media-topic ${
                  mediaClicked === "Group" ? "media-clicked" : ""
                }`}
                onClick={(e) => {
                  handleClickOnMedia(e);
                }}
              >
                Group
              </p>
            </div>
            <div className="body">
              <p>no {mediaClicked} files jett</p>
            </div>
          </div>
        </div>
      )}

      {pageStatus === "edit" && (
        <div>
          <div className="rightcolumn-header">
            <span className="btn-edit" onClick={handleClickOnEditButton}>
              <IoMdArrowBack size={24} className="util-icon" />
            </span>
            <h3>Edit</h3>
          </div>
          <div className="info-body">
            <EditInfor userInfoProp={userInfoProp} />
          </div>
        </div>
      )}

      {pageStatus !== "edit" && pageStatus !== "info" && (
        <div>
          <div className="rightcolumn-header">
            <span className="btn-edit" onClick={handleClickOnEditButton}>
              <IoMdArrowBack size={24} className="util-icon" />
            </span>
            <h3>Shared Media</h3>
          </div>
          <div className="info-body"></div>
          <div className="header">
            <p
              className={`media-topic ${
                mediaClicked === "Media" ? "media-clicked" : ""
              }`}
              onClick={(e) => {
                handleClickOnMedia(e);
              }}
            >
              Media
            </p>
            <p
              className={`media-topic ${
                mediaClicked === "Files" ? "media-clicked" : ""
              }`}
              onClick={(e) => {
                handleClickOnMedia(e);
              }}
            >
              Files
            </p>
            <p
              className={`media-topic ${
                mediaClicked === "Links" ? "media-clicked" : ""
              }`}
              onClick={(e) => {
                handleClickOnMedia(e);
              }}
            >
              Links
            </p>
            <p
              className={`media-topic ${
                mediaClicked === "Music" ? "media-clicked" : ""
              }`}
              onClick={(e) => {
                handleClickOnMedia(e);
              }}
            >
              Music
            </p>
            <p
              className={`media-topic ${
                mediaClicked === "Group" ? "media-clicked" : ""
              }`}
              onClick={(e) => {
                handleClickOnMedia(e);
              }}
            >
              Group
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
export default UserInfor;
