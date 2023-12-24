import React from 'react'
import './Friends.css'
import { TfiArrowLeft } from 'react-icons/tfi'
import { CSSProperties, useEffect, useState } from 'react';
import UserApi from '../../Api/UserApi';
import ContextMenu from './ContextMenu/ContextMenu';
import { MdOutlineMoreHoriz } from "react-icons/md";


type Props = {
    translateX: CSSProperties;
    setTranslateX: React.Dispatch<React.SetStateAction<CSSProperties>>;
};

type UserType = {
    id: number,
    username: string,
    avatar_url: string,
    first_name: string,
    last_name: string,
    fullname: string
}

type contextMenuType = {
    show: boolean,
    x: number,
    y: number,
}

const Friends: React.FC<Props> = ({ translateX, setTranslateX }) => {
    const handleSlideAnimation = (event: React.MouseEvent<Element>) => {
        setTranslateX((translateX) => ({
            ...translateX,
            visibility: 'hidden',
            opacity: 0,
            transform: 'translateX(-480px)',
        }));
    };

    //
    const [listFriends, setListFriends] = useState<UserType[]>([]);
    const [contextMenu, setContextMenu] = useState(-1)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const listFriendRes = await UserApi.getFriends();
                setListFriends(listFriendRes?.data)
            } catch (error) {
                console.log(error);
            }
        }
        fetchData();
    }, [contextMenu])

    // context menu to delete friends;

    const handleContextMenu = (event: React.MouseEvent<HTMLSpanElement, MouseEvent>, curIndex: number) => {
        event.preventDefault();
        if(curIndex === contextMenu) {
            setContextMenu(-1);
        } else {
            setContextMenu(curIndex);
        }
    }

    return (
        <div style={translateX} className='edit-container' >
            <div className="edit-header">
                <span className='icon-container' onClick={e => handleSlideAnimation(e)}>
                    <TfiArrowLeft size={22} className='header-icon' />
                </span>
                <div className="main-header">
                    <h3 className='title'>Friends</h3>
                </div>
            </div>
            <div className="wrapper">
                <div className="friends-container">
                    <ul >
                        {listFriends.map((friend) => (
                            <li tabIndex={friend.id} key={friend.id} >
                                <div className="user-container">
                                    <div className="user-avatar">
                                        <img src={friend.avatar_url || "https://static.vecteezy.com/system/resources/previews/008/442/086/non_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg"} alt="avatar user" className='user-avatar-img' />
                                    </div>
                                    <div className="user-label-timestamps">
                                        <div className="user-labels">
                                            <h5>{friend.fullname}</h5>
                                        </div>
                                        <span className="friend-context-menu-btn" 
                                            onClick={(e) => handleContextMenu(e, friend.id)}>
                                            <MdOutlineMoreHoriz size={22}/>
                                        </span>
                                    </div>
                                    {contextMenu === friend.id 
                                    && <ContextMenu userId={friend.id} userName={friend.fullname} setContextMenu={setContextMenu}/>}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Friends
