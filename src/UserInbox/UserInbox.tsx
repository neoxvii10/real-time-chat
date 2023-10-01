import { ReactComponent as Logo } from "../pattern.svg";
import { MdOutlineCall } from 'react-icons/md'
import { HiOutlineVideoCamera } from 'react-icons/hi'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { IoNotificationsOffOutline } from 'react-icons/io5'
import { AiOutlineCheckCircle } from 'react-icons/ai'
import { PiShareFat } from 'react-icons/pi'
import { BiLockAlt } from 'react-icons/bi'
import { FiTrash } from 'react-icons/fi'
import { BiSend } from "react-icons/bi";
import { CSSProperties, useState } from 'react';
import React, { useEffect } from 'react';
import './UserInbox.css';



type UserProp = {
  name: string;
  id: string;
  avatar: string;
  chat: string;
  time: string;
  no_id: number;
};

type UserInboxProps = {
  userProp: UserProp;
};

const UserInbox: React.FC<UserInboxProps> = ({ userProp }) => {
  const [isSlided, setSlided] = useState<boolean>(false);

  const [translateX, setTranslateX] = useState<CSSProperties>({
    visibility: 'hidden',
    opacity: 0,
    transform: 'translateX(480px)',
  });

  const updateTextareaHeight = () => {
    const textarea = document.querySelector('.text-input-box') as HTMLTextAreaElement;
    textarea.rows = 1; // Reset to 1 row to calculate the scroll height
    const newRows = Math.ceil(textarea.scrollHeight / 20); // Adjust the divisor as needed
    textarea.rows = newRows;
  };
  
  
  const handleSlideAnimation = (event: React.MouseEvent<Element>) => {
    // Check if the clicked element is the chat-utils element or one of its descendants
    const clickedElement = event.target as Element;
    const isChatUtilsClicked = clickedElement.closest('.chat-utils');
  
    // Only update the visibility of user-info if chat-utils or its child is not clicked
    if (!isChatUtilsClicked) {
      setSlided(!isSlided);
      setTranslateX((translateX) => ({
        ...translateX,
        visibility: isSlided ? 'visible' : 'hidden',
        opacity: isSlided ? 1 : 0,
        transform: isSlided ? 'translateX(0px)' : 'translateX(480px)',
      }));
    }
  };
  
  // handle utils dropdown
  const [isUtilsVisible, setUtilsVisible] = useState(false);

  const handleUtilsClick = () => {
    setUtilsVisible(!isUtilsVisible);
  };
    const [message, setMessage] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  };

  const sendMessage = () => {
    // TODO: Implement the logic to send the message
  };

  useEffect(() => {
    updateTextareaHeight();   // update height of the messsage text box as user add more text
  }, [message]);

  return (
    <div className="user-box-chat">
      <Logo />
      <div className="single-user-container">
        
      </div>
      <div className="user-header-container" onClick={event => handleSlideAnimation(event)}>
        <div className="user">
          <div className="user-avatar">
            <span>
              {userProp.avatar}
            </span>
          </div>
          <div className="user-labels">
            <h5>{userProp.name}</h5>
            <p>Last seen now</p>
          </div>
        </div>
        <div className="chat-utils">
          <span className="util-icon-container">
            <MdOutlineCall size={24} className="util-icon"/>
          </span>
          <span className="util-icon-container">
            <HiOutlineVideoCamera size={24} className="util-icon"/>
          </span>
          <span className="util-icon-container">
            <BsThreeDotsVertical
            size={22}
            className="util-icon"
            onClick={handleUtilsClick}
            />
            <div className="util-container" style={{
              visibility: isUtilsVisible ? 'visible' : 'hidden',
              opacity: isUtilsVisible ? 1 : 0,
            }}
            onMouseLeave={() => setUtilsVisible(false)}
            >
              <ul className="util-dropdown-item-container">
                <li className="util-dropdown-item">
                  <span className='dropdown-icon'><IoNotificationsOffOutline size={22}/></span>
                  <span className='dropdown-label'>Mute</span>
                </li>
                <li className="util-dropdown-item">
                  <span className='dropdown-icon'><AiOutlineCheckCircle size={22}/></span>
                  <span className='dropdown-label'>Select Messages</span>
                </li>
                <li className="util-dropdown-item">
                  <span className='dropdown-icon'><PiShareFat size={22}/></span>
                  <span className='dropdown-label'>Share Contact</span>
                </li>
                <li className="util-dropdown-item">
                  <span className='dropdown-icon'><BiLockAlt size={22}/></span>
                  <span className='dropdown-label'>Block User</span>
                </li>
                <li className="util-dropdown-item">
                  <span className='dropdown-icon alert'><FiTrash size={22}/></span>
                  <span className='dropdown-label alert'>Delete Chat</span>
                </li>
              </ul>
            </div>
          </span>
        </div>
      </div>
      <div className={`user-info ${isSlided ? "slided" : ""}`} style={translateX}>
        {/* User chat history */}
      </div>
      <div className="message-input-container">
      <textarea
        className="text-input-box"
        placeholder="Type your message here..."
        value={message}
        onChange={handleChange}
      />
        <span className="util-icon">
          <BiSend size={24} onClick={sendMessage} className="util-icon" />
        </span>
      </div>
    </div>

  );
};

export default UserInbox;
