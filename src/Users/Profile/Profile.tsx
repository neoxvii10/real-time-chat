import './Profile.css'
import { CSSProperties, useState } from 'react';
import { TfiArrowLeft } from 'react-icons/tfi'
import { MdOutlineModeEditOutline } from 'react-icons/md'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { MdOutlineCall, MdAlternateEmail } from 'react-icons/md'
import { IoNotificationsOutline } from 'react-icons/io5'
import { FiDatabase } from 'react-icons/fi'
import { HiOutlineLockClosed } from 'react-icons/hi'

type UserProp = {
    name: string;
    id: string;
    avatar: string;
    chat: string;
    time: string;
    no_id: number;
};

type ProfileProps = {
    userProp: UserProp;
    translateX: CSSProperties;
    setTranslateX: React.Dispatch<React.SetStateAction<CSSProperties>>;
};

const Profile: React.FC<ProfileProps> = ({ userProp, translateX, setTranslateX }) => {
    const handleSlideAnimation = (event: React.MouseEvent<Element>) => {
        setTranslateX((translateX) => ({
            ...translateX,
            visibility: 'hidden',
            opacity: 0,
            transform: 'translateX(480px)',
        }));
    };

    return (
        <div style={translateX} className='profile-container'>
            <div className='profile-header'>
                <span className='icon-container' onClick={e => handleSlideAnimation(e)}>
                    <TfiArrowLeft size={22} className='header-icon' />
                </span>
                <div className="main-header">
                    <h3 className='title'>Profile</h3>
                    <span className='icon-container'>
                        <MdOutlineModeEditOutline size={22} className='header-icon' />
                    </span>
                    <span className='icon-container'>
                        <BsThreeDotsVertical size={22} className='header-icon' />
                    </span>
                </div>
            </div>
            <div className="content-profile">
                <div className="profile-info">
                    <div className="avatar">
                        {/* <img src="" alt="" /> */}
                        <span>
                            {userProp.avatar}
                        </span>
                    </div>
                    <div className="info">
                        <div className='name'>
                            <h3>{userProp.name}</h3>
                        </div>
                        <div className='status'>
                            <span>online</span>
                        </div>
                    </div>
                </div>

                <div className="info-extra">
                    <ul>
                        <li>
                            <div className="list-item">
                                <span className="icon-item">
                                    <MdOutlineCall size={24} />
                                </span>
                                <div className="multiline-item">
                                    <span className="title-item">+84 123 456 789</span>
                                    <span className="subtitle">Phone</span>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div className="list-item">
                                <span className="icon-item">
                                    <MdAlternateEmail size={24} />
                                </span>
                                <div className="multiline-item">
                                    <span className="title-item">user_name</span>
                                    <span className="subtitle">Username</span>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>

                <div className="setting">
                    <ul>
                        <li>
                            <div className="list-setting">
                                <span className="icon">
                                    <IoNotificationsOutline size={24} />
                                </span>
                                <span className="title">Notificatons</span>
                            </div>
                        </li>
                        <li>
                            <div className="list-setting">
                                <span className="icon">
                                    <FiDatabase size={24} />
                                </span>
                                <span className="title">Data and Storage</span>
                            </div>
                        </li>
                        <li>
                            <div className="list-setting">
                                <span className="icon">
                                    <HiOutlineLockClosed size={24} />
                                </span>
                                <span className="title">Policy and security</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Profile;
