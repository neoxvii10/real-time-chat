import { useNavigate, Link } from "react-router-dom";
import { CSSProperties, useEffect, useState } from "react";
import { TfiArrowLeft } from "react-icons/tfi";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdOutlineCall, MdAlternateEmail } from "react-icons/md";
import { TbLogout } from "react-icons/tb";
import { PiAddressBook } from "react-icons/pi";
import { PiWarningCircle } from "react-icons/pi";
import EditInforOne from "./Edit/EditOne";

import UserProfileApi from "../../Api/UserProfileApi";
import { useAuth } from "../../Hooks/AuthContext";
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

type MemberType = {
  id: number;
  user: any;
  nickname: string;
  role: any;
  channel: number;
};

type UnifiedType = UserType | ChannelType;

type ProfileProps = {
  channel: ChannelType;
  handleClose: (event: React.MouseEvent<Element>) => void;
  memberList: MemberType[];
  userId: number;
};

type TypeUserProfile = {
  user?: {
    id: number;
    first_name: string;
    last_name: string;
    fullname: string;
    username: string;
  };
  bio?: string;
  avatar_url?: string;
  phone_number?: string;
  address?: string;
  online?: boolean;
};

const ChatWithOne: React.FC<ProfileProps> = ({
  channel,
  handleClose,
  memberList,
  userId,
}) => {
  const friend: MemberType =
    memberList[0].user.id === userId ? memberList[1] : memberList[0];
  // handle slide for edit
  const [translateXForEdit, setTranslateXForEdit] = useState<CSSProperties>({
    visibility: "hidden",
    opacity: 0,
    transform: "translateX(-480px)",
  });

  const handleSlideEdit = (event: React.MouseEvent<Element>) => {
    setTranslateXForEdit((translateXForEdit) => ({
      ...translateXForEdit,
      visibility: "visible",
      opacity: 1,
      transform: "translateX(0px)",
    }));
  };

  //fetch data
  const [dataUser, setDataUser] = useState<TypeUserProfile>({
    user: {
      id: 0,
      first_name: "",
      last_name: "",
      fullname: "",
      username: "",
    },
    bio: "",
    avatar_url: "",
    phone_number: "",
    address: "",
    online: true,
  });

  return (
    <>
      <div className="profile-container">
        <div className="profile-header">
          <span className="icon-container" onClick={(e) => handleClose(e)}>
            <TfiArrowLeft size={22} className="header-icon" />
          </span>
          <div className="main-header">
            <h3 className="title">Profile</h3>
            <span
              className="icon-container"
              onClick={(e) => handleSlideEdit(e)}
            >
              <MdOutlineModeEditOutline size={22} className="header-icon" />
            </span>
          </div>
        </div>
        <div className="content-profile">
          <div className="profile-info">
            <div className="avatar">
              <img
                className="cropped-img"
                src={friend.user.avatar_url}
                alt="Cropped Image"
              />
            </div>
            <div className="info">
              <div className="name">
                <h3>{friend.user?.fullname}</h3>
              </div>
              <div className="status"></div>
            </div>
          </div>
          <div className="info-extra">
            <ul>
              {dataUser.phone_number && (
                <li>
                  <div className="list-item">
                    <span className="icon-item">
                      <MdOutlineCall size={24} />
                    </span>
                    <div className="multiline-item">
                      <span className="title-item">
                        {dataUser.phone_number}
                      </span>
                      <span className="subtitle">Phone</span>
                    </div>
                  </div>
                </li>
              )}
              <li>
                <div className="list-item">
                  <span className="icon-item">
                    <MdAlternateEmail size={24} />
                  </span>
                  <div className="multiline-item">
                    <span className="title-item">{friend.user?.username}</span>
                    <span className="subtitle">Username</span>
                  </div>
                </div>
              </li>
              <li>
                <div className="list-item">
                  <span className="icon-item">
                    <PiAddressBook size={24} />
                  </span>
                  <div className="multiline-item">
                    <span className="title-item">{dataUser.address}</span>
                    <span className="subtitle">Address</span>
                  </div>
                </div>
              </li>
              <li>
                <div className="list-item">
                  <span className="icon-item">
                    <PiWarningCircle size={24} />
                  </span>
                  <div className="multiline-item">
                    <span className="title-item">{dataUser.bio}</span>
                    <span className="subtitle">Bio</span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <MediaState channel={channel} />
        </div>
      </div>
    </>
  );
};

export default ChatWithOne;
