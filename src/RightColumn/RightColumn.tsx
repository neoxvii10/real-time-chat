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
  const [isSlided, setSlided] = useState<boolean>(true); //slide edit status
  const [translateX, setTranslateX] = useState<CSSProperties>({
    visibility: "hidden",
    transform: "translateX(480px)",
  });

  const isUserType = false;

  return (
    <div className="RightColumn-container">
      <div>
        {isUserType ? (
          <ChatWithOne channel={channel} userId={userId} />
        ) : (
          <ChatWithGroup
            channel={channel}
            userId={userId}
            handleClose={handleClose}
          />
        )}
      </div>
    </div>
  );
};
export default UserInfor;
