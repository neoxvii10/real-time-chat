import React, { CSSProperties } from "react";
import "./RightColumn.css";
import ChatWithOne from "./ChatWithOne/ChatWithOne";
import ChatWithGroup from "./ChatWithGroup/ChatWithGroup";

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
  const isUserType = false;

  return (
    <div className="RightColumn-container">
      <div>
        {isUserType ? (
          <ChatWithOne
            channel={channel}
            userId={userId}
            handleClose={handleClose}
          />
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
