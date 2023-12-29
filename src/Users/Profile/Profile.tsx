import './Profile.css'
import { useNavigate, Link } from "react-router-dom";
import { CSSProperties, useEffect, useState } from 'react';
import { TfiArrowLeft } from 'react-icons/tfi'
import { MdOutlineModeEditOutline } from 'react-icons/md'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { MdOutlineCall, MdAlternateEmail } from 'react-icons/md'
import { IoNotificationsOutline } from 'react-icons/io5'
import { FiDatabase } from 'react-icons/fi'
import { MdOutlineEmail } from "react-icons/md";
import { TbLogout } from 'react-icons/tb'
import { PiAddressBook } from 'react-icons/pi';
import { RiLockPasswordLine } from "react-icons/ri";
import { PiWarningCircle } from "react-icons/pi";

import EditProfile from './Edit/EditProfile';
import ChangePassword from './ChangePassword/ChangePassword';
import ChangeEmail from './ChangeEmail/ChangeEmail';
import UserProfileApi from '../../Api/UserProfileApi';
import { useAuth } from '../../Hooks/AuthContext';

type ProfileProps = {
    translateX: CSSProperties;
    setTranslateX: React.Dispatch<React.SetStateAction<CSSProperties>>;
};

type TypeUserProfile = {
    user?: {
        id: number,
        first_name: string,
        last_name: string,
        fullname: string,
        username: string
    },
    bio?: string,
    avatar_url?: string,
    phone_number?: string,
    address?: string,
    online?: boolean
}

const Profile: React.FC<ProfileProps> = ({ translateX, setTranslateX }) => {
   

    // handle slide for profile
    const handleSlideAnimation = (event: React.MouseEvent<Element>) => {
        setTranslateX((translateX) => ({
            ...translateX,
            visibility: 'hidden',
            opacity: 0,
            transform: 'translateX(-480px)',
        }));
    };

    // handle slide for edit
    const [translateXForEdit, setTranslateXForEdit] = useState<CSSProperties>({
        visibility: 'hidden',
        opacity: 0,
        transform: 'translateX(-480px)',
    })

    const handleSlideEdit = (event: React.MouseEvent<Element>) => {
        setTranslateXForEdit((translateXForEdit) => ({
            ...translateXForEdit,
            visibility: 'visible',
            opacity: 1,
            transform: 'translateX(0px)',
        }));
    }
    
    //handle slide for change password
    const [translateXForChangePassword, setTranslateXForChangePassword] = useState<CSSProperties>({
        visibility: 'hidden',
        opacity: 0,
        transform: 'translateX(-480px)',
    })

    const handleSlideChangePassword = (event: React.MouseEvent<Element>) => {
        setTranslateXForChangePassword((translateXForChangePassword) => ({
            ...translateXForChangePassword,
            visibility: 'visible',
            opacity: 1,
            transform: 'translateX(0px)',
        }));
    }

    //handle slide for change email
    const [translateXForChangeEmail, setTranslateXForChangeEmail] = useState<CSSProperties>({
        visibility: 'hidden',
        opacity: 0,
        transform: 'translateX(-480px)',
    })

    const handleSlideChangeEmail = (event: React.MouseEvent<Element>) => {
        setTranslateXForChangeEmail((translateXForChangeEmail) => ({
            ...translateXForChangeEmail,
            visibility: 'visible',
            opacity: 1,
            transform: 'translateX(0px)',
        }));
    }

    // handle visbile button logout
    const [visibleLogout, setvisibleLogout] = useState<boolean>(false);

    const handleVisibleLogout = () => {
        setvisibleLogout(!visibleLogout);
    }

    //fetch data
    const [dataUser, setDataUser] = useState<TypeUserProfile>({
        user: {
            id: 0,
            first_name: '',
            last_name: '',
            fullname: '',
            username: ''
        },
        bio: '',
        avatar_url: '',
        phone_number: '',
        address: '',
        online: true
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await UserProfileApi.getProfile();
                setDataUser(response?.data);
            } catch (error) {
                console.log(error);
            }
        }
        fetchData();
    }, [translateXForEdit])

    // logout
    const {handleLogout} = useAuth();

    const navigate = useNavigate();

    const handleSubmitLogout = async (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.preventDefault();
        handleLogout();
        navigate('/signin');
    }

    return (
        <>
            <div style={translateX} className='profile-container'>
                <div className='profile-header'>
                    <span className='icon-container' onClick={e => handleSlideAnimation(e)}>
                        <TfiArrowLeft size={22} className='header-icon' />
                    </span>
                    <div className="main-header">
                        <h3 className='title'>Profile</h3>
                        <span className='icon-container' onClick={e => handleSlideEdit(e)}>
                            <MdOutlineModeEditOutline size={22} className='header-icon' />
                        </span>
                        <span className='icon-container'>
                            <BsThreeDotsVertical size={22} className='header-icon'
                                onClick={handleVisibleLogout}
                            />
                            <div className='logout-button' style={{
                                visibility: visibleLogout ? 'visible' : 'hidden',
                                opacity: visibleLogout ? 1 : 0,
                            }}
                                onMouseLeave={() => setvisibleLogout(false)}
                            >

                                <div className='wrapper' onClick={handleSubmitLogout}>
                                    <span className='logout-icon'><TbLogout size={22} /></span>
                                    <span className='logout-lable'>Log out</span>
                                </div>
                            </div>
                        </span>
                    </div>
                </div>
                <div className="content-profile">
                    <div className="profile-info">
                        <div className="avatar">
                            <img className="cropped-img" src={dataUser.avatar_url} alt="Cropped Image" />
                        </div>
                        <div className="info">
                            <div className='name'>
                                <h3>{dataUser.user?.fullname}</h3>
                            </div>
                            <div className='status'>
                                <span>Online</span>
                            </div>
                        </div>
                    </div>

                    <div className="info-extra">
                        <ul>
                            {dataUser.phone_number &&
                                <li>
                                    <div className="list-item">
                                        <span className="icon-item">
                                            <MdOutlineCall size={24} />
                                        </span>
                                        <div className="multiline-item">
                                            <span className="title-item">{dataUser.phone_number}</span>
                                            <span className="subtitle">Phone</span>
                                        </div>
                                    </div>
                                </li>}
                            <li>
                                <div className="list-item">
                                    <span className="icon-item">
                                        <MdAlternateEmail size={24} />
                                    </span>
                                    <div className="multiline-item">
                                        <span className="title-item">{dataUser.user?.username}</span>
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

                    <div className="setting">
                        <ul>
                            <li>
                                <div className="list-setting input-change" onClick={e => handleSlideChangePassword(e)}>
                                    <span className="icon">
                                        <RiLockPasswordLine  size={24} />
                                    </span>
                                    <span className="title">Change password</span>
                                </div>
                            </li>
                            <li>
                                <div className="list-setting input-change" onClick={e => handleSlideChangeEmail(e)}>
                                    <span className="icon">
                                        <MdOutlineEmail  size={24} />
                                    </span>
                                    <span className="title">Change email</span>
                                </div>
                            </li>
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
                        </ul>
                    </div>
                </div>
            </div>
            <EditProfile translateXForEdit={translateXForEdit} setTranslateXForEdit={setTranslateXForEdit} />
            <ChangePassword translateXForChangePassword={translateXForChangePassword} 
                           setTranslateXForChangePassword={setTranslateXForChangePassword} />
            <ChangeEmail translateXForChangeEmail={translateXForChangeEmail}
                             setTranslateXForChangeEmail={setTranslateXForChangeEmail}/>   
        </>
    )
}

export default Profile;
