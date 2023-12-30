import React, { CSSProperties, useEffect, useState } from "react";
import { MdOutlineCall, MdPeopleAlt, MdExitToApp } from "react-icons/md";
import { IoIosInformationCircle, IoMdClose } from "react-icons/io";
import "./ChatWithGroup.css";
import "../RightColumn.css";
import MediaState from "../Common/RenderMedia/MediaState";
import { RiPencilLine } from "react-icons/ri";
import EditInforGroup from "./Edit/EditGroup";
import MemberList from "./Member/MemberList";
import { AiOutlineClose } from "react-icons/ai";
import ImageCrop from "../../Users/NewGroup/Selects/GroupCreation/ImageCrop/ImageCrop";
import { MdOutlineArrowForwardIos } from "react-icons/md";
import ChannelApi from "../../Api/ChannelApi";

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
  croppedImage: string | undefined;
  croppedBlob: Blob | undefined;
  isCropped: boolean;
  setIsCropped: React.Dispatch<React.SetStateAction<boolean>>;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  hideBtnSubmit: CSSProperties;
  handleVisibleBtn: (visible: boolean) => void;
  socket: WebSocket;
  UserAdmin: boolean;
};

const ChatWithGroup: React.FC<ChannelInboxProps> = ({
  UserAdmin,
  socket,
  channel,
  userId,
  handleClose,
  croppedImage,
  croppedBlob,
  isCropped,
  setIsCropped,
  handleImageChange,
  hideBtnSubmit,
  handleVisibleBtn,
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

  type MemberType = {
    id: number;
    user: any;
    nickname: string;
    role: any;
    channel: number;
  };

  const channelInfo = channel as ChannelType;

  useEffect(() => {
    if (isSlidedEdit) {
      setSlidedEdit(false);
      setPageStatus("info");
    }
    if (isSlidedMember) {
      setSlidedMember(false);
    }
  }, [channel.id]);

  const handleOnWheel = () => { };

  // handle change avatar

  return (
    <div className="RightColumn-container">
      {UserAdmin && (
        <div className={`user-info`} style={EditTranslateX}>
          <EditInforGroup
            socket={socket}
            channel={channel}
            userId={userId}
            handleEdit={handleClickOnEditButton}
            croppedImage={croppedImage}
            croppedBlob={croppedBlob}
            isCropped={isCropped}
            setIsCropped={setIsCropped}
            handleImageChange={handleImageChange}
            hideBtnSubmit={hideBtnSubmit}
            handleVisibleBtn={handleVisibleBtn}
          />
        </div>
      )}
      <div className={`user-info`} style={MemberTranslateX}>
        <MemberList
          socket={socket}
          channel={channel}
          handMemberBack={handleShowAllMembers}
          userId={userId}
          isUserAdmin={UserAdmin}
        />
      </div>

      <div className="rightcolumn-header">
        <span className="btn-close" onClick={(event) => handleClose(event)}>
          <IoMdClose size={24} className="util-icon" />
        </span>
        <h3>Profile</h3>
        {UserAdmin && (
          <span className="btn-edit" onClick={handleClickOnEditButton}>
            <RiPencilLine size={24} className={`util-icon`} />
          </span>
        )}
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
            {/* <div className="rectangle-container">
              <div className="layout-btn" >
                <MdExitToApp
                  size={24}
                  className="util-icon"
                  style={{ color: "red" }}
                />
                <p style={{ color: "red" }}>Leave group</p>
              </div>
            </div> */}
          </div>

          <MediaState channel={channel as ChannelType} />
        </div>
      </div>
    </div>
  );
};
export default ChatWithGroup;
