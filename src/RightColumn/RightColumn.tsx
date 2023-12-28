import React, { CSSProperties } from "react";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { RiPencilLine } from "react-icons/ri";
import "./RightColumn.css";
import MediaState from "./Common/RenderMedia/MediaState";
import { MdOutlineCall } from "react-icons/md";
import ChatWithOne from "./ChatWithOne/ChatWithOne";
import ChatWithGroup from "./ChatWithGroup/ChatWithGroup";
import EditInforGroup from "./ChatWithGroup/EditGroup";
import EditInforOne from "./ChatWithOne/EditOne";
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

const UserInfor: React.FC<ChannelInboxProps> = ({
  channel,
  handleClose,
  userId,
}) => {
  const [pageStatus, setPageStatus] = useState<string>("info");
  const [isSlided, setSlided] = useState<boolean>(true); //slide edit status
  const [translateX, setTranslateX] = useState<CSSProperties>({
    visibility: "hidden",
    transform: "translateX(480px)",
  });

  const handleClickOnEditButton = (
    event: React.MouseEvent<HTMLSpanElement>
  ) => {
    event.preventDefault();
    setPageStatus(pageStatus === "info" ? "edit" : "info");
    setSlided(!isSlided);
    setTranslateX((translateX) => ({
      ...translateX,
      visibility: isSlided ? "visible" : "hidden",
      transform: isSlided ? "translateX(0px)" : "translateX(600px)",
    }));
  };

  const isUserType = false;

  const [mediaClicked, setMediaClick] = useState<string>("");
  const handleClickOnMedia = (
    event: React.MouseEvent<HTMLParagraphElement>
  ) => {
    setMediaClick(event.currentTarget.innerHTML);
    setPageStatus(event.currentTarget.innerHTML);
  };

  return (
    <div className="RightColumn-container">
      <div className={`user-info`} style={translateX}>
        {isUserType ? (
          <EditInforOne
            channel={channel}
            userId={userId}
            handleEdit={handleClickOnEditButton}
          />
        ) : (
          <EditInforGroup
            channel={channel}
            handleEdit={handleClickOnEditButton}
            userId={userId}
          />
        )}
      </div>

      <div>
        <div className="rightcolumn-header">
          <span className="btn-close" onClick={(event) => handleClose(event)}>
            <IoMdClose size={24} className="util-icon" />
          </span>
          <h3>Profile</h3>
          <span className="btn-edit" onClick={handleClickOnEditButton}>
            <RiPencilLine size={24} className={`util-icon`} />
          </span>
        </div>
        <div className="rightcolumn-body">
          {isUserType ? (
            <ChatWithOne channel={channel} userId={userId} />
          ) : (
            <ChatWithGroup channel={channel} userId={userId} />
          )}
        </div>
      </div>
    </div>
  );
};
export default UserInfor;
