import {CSSProperties, useState} from "react";
import {IoMdClose} from 'react-icons/io';
import {HiOutlinePencil} from  'react-icons/hi2';

import './UserInfor.css';


type UserProp = {
    name: string;
    id: string;
    avatar: string;
    chat: string;
    time: string;
    no_id: number;  
}

type UserInfoProps = {
  userInfoProp: UserProp;
};


const RigtColumn: React.FC<UserInfoProps> = ({userInfoProp}) => {
    
    return (
        <div className="edit-info-container">
            <div className="edit-info-header-container">
                <span className="btn-close">
                    <IoMdClose size={24} className="util-icon"/>
                </span>
                <h5>User info</h5>
                <span className="btn-edit">
                    <HiOutlinePencil size={24} className="util-icon"/>
                </span>
            </div>
            
            <div className="avatar-container">
                <h2>{userInfoProp.avatar}</h2>
                <p>{userInfoProp.name}</p>
                <p>{userInfoProp.time}</p>
            </div>

            <div className="middle-container">
                <p>phone_number</p>
            </div>

            <div className="media-container">
                <h2>media</h2>
            </div>
        </div>

    );
}

export default RigtColumn;

