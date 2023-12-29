import React, { CSSProperties, useState } from "react";
import { MdOutlineCall, MdPeopleAlt } from "react-icons/md";
import { IoIosInformationCircle, IoMdClose } from "react-icons/io";
import "./ChatWithGroup.css";
import "../RightColumn.css";
import MediaState from "../Common/RenderMedia/MediaState";
import { RiPencilLine } from "react-icons/ri";
import EditInforGroup from "./Edit/EditGroup";
import MemberList from "./Member/MemberList";
import { MdOutlineArrowForwardIos } from "react-icons/md";

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
  handleClose: (event: React.MouseEvent<Element>) => void;
};

const ChatWithGroup: React.FC<ChannelInboxProps> = ({
  channel,
  userId,
  handleClose,
}) => {
  const [isSlidedEdit, setSlidedEdit] = useState<boolean>(true); //slide edit status
  const [isSlidedMember, setSlidedMember] = useState<boolean>(true); //slide member status
  const [EditTranslateX, EditSetTranslateX] = useState<CSSProperties>({
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
    EditSetTranslateX((EditTranslateX) => ({
      ...EditTranslateX,
      visibility: isSlidedEdit ? "visible" : "hidden",
      transform: isSlidedEdit ? "translateX(0px)" : "translateX(600px)",
    }));
  };

  const [MemberTranslateX, MemberSetTranslateX] = useState<CSSProperties>({
    visibility: "hidden",
    transform: "translateX(480px)",
  });

  const handleShowAllMembers = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.preventDefault();
    setPageStatus(pageStatus === "info" ? "member" : "info");
    setSlidedMember(!isSlidedMember);
    MemberSetTranslateX((MemberTranslateX) => ({
      ...MemberTranslateX,
      visibility: isSlidedMember ? "visible" : "hidden",
      transform: isSlidedMember ? "translateX(0px)" : "translateX(600px)",
    }));
  };

  const channelInfo = channel as ChannelType;

  const handleOnWheel = () => {};

  return (
    <div className="RightColumn-container">
      <div className={`user-info`} style={EditTranslateX}>
        <EditInforGroup
          channel={channel}
          userId={userId}
          handleEdit={handleClickOnEditButton}
        />
      </div>
      <div className={`user-info`} style={MemberTranslateX}>
        <MemberList
          channel={channel}
          handMemberBack={handleShowAllMembers}
          userId={userId}
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
              <div
                className="group-avatar-container"
                style={{
                  width: "10rem",
                  height: "10rem",
                  margin: "3.5rem 0  0 0",
                }}
              >
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
                <MdOutlineArrowForwardIos className="util-icons-right" />
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
