import React from 'react'
import { CSSProperties, useEffect, useState } from 'react';
import { MdOutlineMoreHoriz } from "react-icons/md";
import { TfiArrowLeft } from 'react-icons/tfi'
import './AddMember.css'
import UserApi from '../../../../Api/UserApi';
import { FaPlus } from "react-icons/fa6";

type AddMemberType = {
  socket: WebSocket;
  channelId: number;
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

const AddMember: React.FC<AddMemberType> = ({ translateX, setTranslateX, channelId, socket }) => {

  const [listFriends, setListFriends] = useState<UserType[]>([]);
  const [contextMenu, setContextMenu] = useState(-1)

  function isOpen(WebSocket: { readyState: any; OPEN: any; }) {
    return WebSocket.readyState === WebSocket.OPEN 
 }

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
  }, [contextMenu, translateX])

  const handleSlideAnimation = (event: React.MouseEvent<Element>) => {
    setTranslateX({
      ...translateX,
      visibility: "hidden",
      opacity: 0,
      transform: "translateX(480px)",
    });
  };

  console.log()

  const handleAddMember = async (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, userId: number) => {
    e.preventDefault();

    try {
      const formData = {
        action: "add_member",
        target: "channel",
        targetId: channelId,
        data: {
          user: userId,
        }
      }
      const formSubmit = JSON.stringify(formData);
      if (!isOpen(socket)) {
        console.log("WebSocket connection is not open");
        return;
      }
      // console.log(formSubmit);
      const reponse =  await socket.send(formSubmit);
      console.log(formSubmit, reponse);
      alert("Add new member sucessfully");
      handleSlideAnimation(e);
    } catch (error) {
      console.log(error);
      alert("Add new member FAIL");
    }
  }

  return (
    <div style={translateX} className='edit-container add-member-container' >
      <div className="edit-header">
        <span className='icon-container' onClick={handleSlideAnimation}>
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
                    <span className="friend-context-menu-btn" onClick={e => handleAddMember(e, friend.id)}>
                      <FaPlus  size={22} />
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default AddMember