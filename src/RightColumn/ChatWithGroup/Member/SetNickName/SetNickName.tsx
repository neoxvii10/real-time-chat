import React from 'react'
import './SetNickName.css'
import { CSSProperties, useEffect, useState } from 'react';
import { TfiArrowLeft } from 'react-icons/tfi'
import { FaCheck } from "react-icons/fa6";
import { error } from 'console';

type SetNickNameType = {
  socket: WebSocket;
  channelId: number;
  translateX: CSSProperties;
  setTranslateX: React.Dispatch<React.SetStateAction<CSSProperties>>;
  memberId: number;
};

function isOpen(WebSocket: { readyState: any; OPEN: any; }) 
  { return WebSocket.readyState === WebSocket.OPEN }

const SetNickName: React.FC<SetNickNameType> = ({ translateX, setTranslateX, channelId, socket, memberId }) => {
  const handleSlideAnimation = (event: React.MouseEvent<Element>) => {
    setTranslateX({
      ...translateX,
      visibility: "hidden",
      opacity: 0,
      transform: "translateX(480px)",
    });
  };

  //
  const [nickName, setNickName] = useState('');
  const handleSetNickName = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    try {
      const formData = {
        action: "set_nickname",
        target: "channel",
        targetId: channelId,
        data: {
          memberId: memberId,
          nickname: nickName
        }
      }
      const requestData = JSON.stringify(formData);
      await socket.send(requestData);
      setNickName('');
      console.log(requestData);
      handleSlideAnimation(e);
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div style={translateX} className='edit-container add-member-container' >
      <div className="edit-header">
        <span className='icon-container' onClick={handleSlideAnimation}>
          <TfiArrowLeft size={22} className='header-icon' />
        </span>
        <div className="main-header">
          <h3 className='title'>Set nick name</h3>
        </div>
      </div>
      <div className="wrapper">
        <div className="edit-nickname">
          <div className="input-group">
            <input className='form-control' onChange={e => setNickName(e.target.value)} dir='auto' type="text" name='nickName' placeholder='Nick name' />
            <label>Nick name</label>
          </div>
        </div>
      </div>
      <button
        style={{
          visibility: "visible",
          bottom: "1rem",
        }}
        className="btn-submit-edit"
        onClick={handleSetNickName}
      >
        <FaCheck size={24} />
      </button>
    </div>
  )
}

export default SetNickName