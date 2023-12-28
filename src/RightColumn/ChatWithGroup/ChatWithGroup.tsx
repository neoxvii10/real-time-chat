import React, { CSSProperties, useState } from "react";
import { MdOutlineCall, MdPeopleAlt } from "react-icons/md";
import { IoIosInformationCircle, IoMdClose } from "react-icons/io";
import "./ChatWithGroup.css";
import "../RightColumn.css";
import MediaState from "../Common/RenderMedia/MediaState";
import { RiPencilLine } from "react-icons/ri";
import EditInforGroup from "./EditGroup";

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
  handleClose: (event: React.MouseEvent<Element>) => void;
  channel: UnifiedType;
  userId: number;
};

const ChatWithGroup: React.FC<ChannelInboxProps> = ({
  channel,
  userId,
  handleClose,
}) => {
  const [isSlidedEdit, setSlidedEdit] = useState<boolean>(true); //slide edit status
  const [isSlidedMember, setSlidedMember] = useState<boolean>(true); //slide member status
  const [translateX, setTranslateX] = useState<CSSProperties>({
    visibility: "hidden",
    transform: "translateX(480px)",
  });

  const [pageStatus, setPageStatus] = useState<string>("info");
  const handleClickOnEditButton = (
    event: React.MouseEvent<HTMLSpanElement>
  ) => {
    event.preventDefault();
    setPageStatus(pageStatus === "info" ? "edit" : "info");
    setSlidedEdit(!isSlidedEdit);
    setTranslateX((translateX) => ({
      ...translateX,
      visibility: isSlidedEdit ? "visible" : "hidden",
      transform: isSlidedEdit ? "translateX(0px)" : "translateX(600px)",
    }));
  };

  const handleShowAllMembers = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.preventDefault();
    // setMemberList(!MemberList);
    setSlidedMember(!isSlidedMember);
    setTranslateX((translateX) => ({
      ...translateX,
      visibility: isSlidedMember ? "visible" : "hidden",
      transform: isSlidedMember ? "translateX(0px)" : "translateX(600px)",
    }));
  };

  const channelInfo = channel as ChannelType;

  const [mediaClicked, setMediaClick] = useState<string>("");

  const [isAdminRoll, setAdminRoll] = useState<boolean>(true);

  const handleOnWheel = () => {};

  return (
    <div className="RightColumn-container">
      <div className={`user-info`} style={translateX}>
        <EditInforGroup
          channel={channel}
          userId={userId}
          handleEdit={handleClickOnEditButton}
        />
      </div>
      <div className="rightcolumn-header">
        <span className="btn-close" onClick={(event) => handleClose(event)}>
          <IoMdClose size={24} className="util-icon" />
        </span>
        <h3>Profile</h3>
        <span className="btn-edit" onClick={handleClickOnEditButton}>
          <RiPencilLine size={24} className={`util-icon`} />
        </span>
      </div>
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
              <div className="layout-btn">
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
