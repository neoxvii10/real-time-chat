import React, { CSSProperties, useState } from "react";
import { MdOutlineCall } from "react-icons/md";
import "../RightColumn.css";

import MediaState from "../Common/RenderMedia/MediaState";

type UserType = {
  id: number;
  username: string;
  avatar_url: any;
  first_name: string;
  last_name: string;
  fullname: string;
};

type ChannelType = {
  id: number;
  member_count: number;
  last_message?: any;
  title: string;
  avatar_url?: string;
  create_at: string;
};

type UnifiedType = UserType | ChannelType;

type ChannelInboxProps = {
  channel: UnifiedType;
  userId: number;
};

const ChatWithOne: React.FC<ChannelInboxProps> = ({ channel, userId }) => {
  const [mediaClicked, setMediaClick] = useState<string>("");
  const handleClickOnMedia = (
    event: React.MouseEvent<HTMLParagraphElement>
  ) => {
    setMediaClick(event.currentTarget.innerHTML);
  };

  const handleOnWheel = () => {};

  return (
    <div className="RightColumn-container">
      <div>
        <div className="wrapper" onWheel={handleOnWheel}>
          <div className="rightcolumn-body">
            <div className="status1-container">
              <div className="avatar-wrapper">
                <p className="name">Name</p>
                <div className="avatar-container">
                  <p className="avatar">Avatar</p>
                </div>
              </div>
              <div className="phone-container">
                <div className="layout-btn">
                  <MdOutlineCall size={24} className="util-icon" />
                  <p>Phone number</p>
                </div>
              </div>
            </div>
          </div>

          {/* <MediaState /> */}
        </div>
      </div>

      {/* {pageStatus !== "edit" && pageStatus !== "info" && (
        <div>
          <div className="rightcolumn-header">
            <span className="btn-edit" onClick={handleClickOnEditButton}>
              <IoMdArrowBack size={24} className="util-icon" />
            </span>
            <h3>Shared Media</h3>
          </div>
          <div className="info-body"></div>
          <MediaState userProp={userProp} stateMedia={mediaClicked} />
        </div>
      )} */}
    </div>
  );
};
export default ChatWithOne;
