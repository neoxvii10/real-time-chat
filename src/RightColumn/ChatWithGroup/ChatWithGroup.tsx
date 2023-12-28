import React, { CSSProperties, useState } from "react";
import { MdOutlineCall, MdPeopleAlt } from "react-icons/md";
import { IoIosInformationCircle } from "react-icons/io";
import "./ChatWithGroup.css";
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

const ChatWithGroup: React.FC<ChannelInboxProps> = ({ channel, userId }) => {
  const [MemberList, setMemberList] = useState<boolean>(true);
  const [isSlided, setSlided] = useState<boolean>(true); //slide edit status
  const [translateX, setTranslateX] = useState<CSSProperties>({
    visibility: "hidden",
    transform: "translateX(480px)",
  });

  const handleShowAllMembers = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.preventDefault();
    setMemberList(!MemberList);
    setSlided(!isSlided);
    setTranslateX((translateX) => ({
      ...translateX,
      visibility: isSlided ? "visible" : "hidden",
      transform: isSlided ? "translateX(0px)" : "translateX(600px)",
    }));
  };

  const channelInfo = channel as ChannelType;

  const [mediaClicked, setMediaClick] = useState<string>("");
  const handleClickOnMedia = (
    event: React.MouseEvent<HTMLParagraphElement>
  ) => {
    setMediaClick(event.currentTarget.innerHTML);
  };

  const [isAdminRoll, setAdminRoll] = useState<boolean>(true);

  const handleOnWheel = () => {};

  return (
    <div className="RightColumn-container">
      <div>
        <div className="wrapper" onWheel={handleOnWheel}>
          <div className="rightcolumn-body">
            <div className="group-avatar-wrapper">
              <div className="group-avatar-container">
                <img src={channelInfo.avatar_url}></img>
              </div>
              <p className="group-name">{channelInfo.title}</p>
            </div>
            <div className="rectangle-container">
              <div className="layout-btn" onClick={handleShowAllMembers}>
                <IoIosInformationCircle size={24} className="util-icon" />
                <p>Info</p>
              </div>
            </div>
            <div className="rectangle-container">
              <div className="layout-btn" onClick={handleShowAllMembers}>
                <MdPeopleAlt size={24} className="util-icon" />
                <p>Member</p>
              </div>
            </div>
          </div>

          <MediaState channel={channel as ChannelType} />
        </div>
      </div>
    </div>
  );
};
export default ChatWithGroup;
