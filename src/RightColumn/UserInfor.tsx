import { CSSProperties, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { HiOutlinePencil } from "react-icons/hi2";
import { MdOutlineCall } from "react-icons/md";

import "./UserInfor.css";

type UserProp = {
  name: string;
  id: string;
  avatar: string;
  chat: string;
  time: string;
  no_id: number;
};

type UserInfoProps = {
  userInfoProp: UserProp;
};

const RigtColumn: React.FC<UserInfoProps> = ({ userInfoProp }) => {
  return (
    <div className="edit-info-container">
      <div className="edit-info-header">
        <span className="btn-close">
          <IoMdClose size={24} className="util-icon" />
        </span>
        <h5>User info</h5>
        <span className="btn-edit">
          <HiOutlinePencil size={24} className="util-icon" />
        </span>
      </div>

      <div className="avatar-container">
        <p className="avatar">{userInfoProp.avatar}</p>
        <p className="name">{userInfoProp.name}</p>
      </div>

      <div className="phone-container">
        <div className="layout-btn">
          <MdOutlineCall size={24} className="util-icon" />
          <p>Phone number</p>
        </div>
      </div>

      <div className="media-container">
        <div className="header">
          <p className="media-topic">Media</p>
          <p className="media-topic">Files</p>
          <p className="media-topic">Links</p>
          <p className="media-topic">Music</p>
          <p className="media-topic">Voice</p>
          <p className="media-topic">Group</p>
        </div>
        <div className="body">
          <p>no media files jett</p>
        </div>
      </div>
    </div>
  );
};

export default RigtColumn;
