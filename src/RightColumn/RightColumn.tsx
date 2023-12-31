import React, { CSSProperties, useEffect, useState } from "react";
import "./RightColumn.css";
import ChatWithOne from "./ChatWithOne/ChatWithOne";
import ChatWithGroup from "./ChatWithGroup/ChatWithGroup";
import ChannelApi from "../Api/ChannelApi";

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
};

type MemberType = {
  id: number;
  user: any;
  nickname: string;
  role: any;
  channel: number;
};

const UserInfor: React.FC<ChannelInboxProps> = ({
  socket,
  channel,
  handleClose,
  userId,
  croppedImage,
  croppedBlob,
  isCropped,
  handleImageChange,
  hideBtnSubmit,
  handleVisibleBtn,
  setIsCropped,
}) => {
  const [UserAdmin, setUserAdmin] = useState<boolean>(false);

  const [memberList, setMemberList] = useState<MemberType[]>([]);

  const fetchMemberList = async () => {
    try {
      const memberList = await ChannelApi.getAllMembersChannel(channel.id);
      setMemberList(memberList?.data);

      // console.log(listFriendRes);
    } catch (error) {
      console.log(error);
    }
  };
  const applyAdmin = () => {
    if (memberList.length > 0)
      for (let i = 0; i < memberList.length; i++) {
        if (
          memberList[i].user.id === userId &&
          memberList[i].role === "CREATOR"
        ) {
          setUserAdmin(true);
          break;
        }
        setUserAdmin(false);
      }
  };

  useEffect(() => {
    fetchMemberList();
  }, [channel.id]);

  useEffect(() => {
    applyAdmin();
  }, [channel.id]);

  return (
    <div className="RightColumn-container">
      <div>
        {memberList.length === 2 ? (
          <ChatWithOne
            channel={channel}
            userId={userId}
            handleClose={handleClose}
          />
        ) : (
          <ChatWithGroup
            UserAdmin={UserAdmin}
            socket={socket}
            channel={channel}
            userId={userId}
            handleClose={handleClose}
            croppedImage={croppedImage}
            croppedBlob={croppedBlob}
            isCropped={isCropped}
            setIsCropped={setIsCropped}
            handleImageChange={handleImageChange}
            hideBtnSubmit={hideBtnSubmit}
            handleVisibleBtn={handleVisibleBtn}
          />
        )}
      </div>
    </div>
  );
};
export default UserInfor;
