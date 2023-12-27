import React from 'react'
import './ContextMenu.css'
import UserApi from '../../../Api/UserApi';
import { RiDeleteBin5Line } from "react-icons/ri";

type ContextMenuType = {
    userId: number;
    userName: string;
    setContextMenu: React.Dispatch<React.SetStateAction<number>>
}

const ContextMenu: React.FC<ContextMenuType> = ({userId, userName, setContextMenu}) => {

    const handleDeleteFriend = async (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.preventDefault();
        try {
            const response = await UserApi.deleteFriend(userId);
            console.log("delete friends: ", response);
            alert("Delete friends: " + userName);
            setContextMenu(-1);
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="friend-context-menu visible" onMouseLeave={() => setContextMenu(-1)}>
            <div className="friend-context-menu-item" onClick={handleDeleteFriend}>
                <span className="friend-context-menu-item-icon">
                    <RiDeleteBin5Line />
                </span>
                <h5 className="friend-context-menu-item-title">
                    Delete
                </h5>
            </div>
        </div>
    )
}

export default ContextMenu
