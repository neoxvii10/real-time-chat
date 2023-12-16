import { ReactComponent as Logo } from "../pattern.svg";
import { MdOutlineCall } from "react-icons/md";
import { HiOutlineVideoCamera } from "react-icons/hi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaCheckCircle, FaRegCheckCircle } from "react-icons/fa";
import { IoNotificationsOffOutline } from "react-icons/io5";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { PiShareFat } from "react-icons/pi";
import { BiLockAlt } from "react-icons/bi";
import { FiTrash } from "react-icons/fi";
import { BiSend } from "react-icons/bi";
import { ImAttachment } from "react-icons/im";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { GoSearch, GoX } from 'react-icons/go'
import { CSSProperties } from "react";
import React, { useEffect, useState, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import EmojiPicker, {
  EmojiStyle,
  EmojiClickData,
} from "emoji-picker-react";
import "./UserInbox.css";
import axiosClient from "../Api/AxiosClient";
import { v4 as uuidv4 } from 'uuid';

const _token = localStorage.getItem('accessToken'); // Token will be received when sign in successfully
// const token = _token?.slice(1, _token.length - 1);
const token = JSON.parse(_token || '{}')
const userId = (jwtDecode(token) as any).user_id
const socket = new WebSocket(`ws://127.0.0.1:8000/ws/chat/?token=${token}`);
// console.log(socket);
socket.onopen = () => {
  console.log('WebSocket connection established');
};

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
  const [isSlided, setSlided] = useState<boolean>(true);

  const [translateX, setTranslateX] = useState<CSSProperties>({
    visibility: "hidden",
    opacity: 0,
    transform: "translateX(480px)",
  });

  const handleSlideAnimation = (event: React.MouseEvent<Element>) => {
    // Check if the clicked element is the chat-utils element or one of its descendants
    const clickedElement = event.target as Element;
    const isChatUtilsClicked = clickedElement.closest(".chat-utils");

    // Only update the visibility of user-info if chat-utils or its child is not clicked
    if (!isChatUtilsClicked) {
      setSlided(!isSlided);
      setTranslateX((translateX) => ({
        ...translateX,
        visibility: isSlided ? "visible" : "hidden",
        opacity: isSlided ? 1 : 0,
        transform: isSlided ? "translateX(0px)" : "translateX(480px)",
      }));
    }
  };

  // handle utils dropdown
  const [isUtilsVisible, setUtilsVisible] = useState(false);

  const handleUtilsClick = () => {
    setUtilsVisible(!isUtilsVisible);
  };

  const [isEmojiIconClicked, setIsEmojiIconClicked] = useState(false);

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendingInputs();
      console.log("Submit action triggered");
    }
  };

  function isOpen(WebSocket: { readyState: any; OPEN: any; }) { return WebSocket.readyState === WebSocket.OPEN }

  const handleSendingInputs = () => {
    if (inputValue.trim() !== "") {

      const messageObject = {
        "action": "create_message",
        "target": "channel",
        "targetId": 4,
        'uuid': uuidv4(),
        "data": {
          "content": inputValue,
          // "reply": null
        }
      };

      const messageJSON = JSON.stringify(messageObject);

      if (!isOpen(socket)) {
        console.log("Message can't be sent");
        return;
      }

      socket.send(messageJSON);

      let messageContainer = document.querySelector('.message-container')
      let onBottom = false
      if (messageContainer) {
        if (Math.abs(messageContainer.scrollTop + messageContainer.clientHeight - messageContainer?.scrollHeight) < 1) {
          onBottom = true
        }
      }

      let textMessage = {
        text: inputValue,
        sender: 'self',
        type: 'text',
        uuid: messageObject.uuid,
        sent: false
      }
      setMessages([...messages, textMessage]);      

      if (messageContainer && onBottom) {
        messageContainer.scrollTop = messageContainer?.scrollHeight
        console.log(messageContainer.scrollTop, messageContainer?.scrollHeight)
      }

      setInputValue("");
    } else if (selectedFile) {
      handleFileMessage();
      setSelectedFile(null);
    }
  }

  // handle receive message
  socket.onmessage = (e) => {
    // Parse the JSON data from the server
    const serverMessage = JSON.parse(e.data);

    // Check if the action is "create_message" and the message_type is "TEXT"
    if (serverMessage.action === "create_message") {
      // Extract the content of the message
      const messageContent = serverMessage.data.content;

      // console.log("Received message content:", messageContent);
      // Render the message received

      let textMessage = {
        text: messageContent,
        sender: 'user',
        type: 'text'
      }

      if (serverMessage.data.message_type === "IMAGE") {
        textMessage.type = 'image'
      }

      let senderId = serverMessage.data.member.user.id
      if (senderId === userId) {
        if (textMessage.type === 'image') {
          let fileMessage = {
            text: messageContent,
            sender: 'self',
            type: 'image',
            sent: true
          }
          setMessages([...messages, fileMessage]);  
        } else {
          let uuid = serverMessage.uuid
          let isSelfMessageCheck = true
          for (let i = messages.length - 1; i >= 0; i--) {
            if (messages[i].uuid === uuid) {
              // console.log("**Đã gửi**" + messages[i].text)
              messages[i].sent = true
              setMessages([...messages])
              isSelfMessageCheck = false
              break
            }
          }
          if (isSelfMessageCheck) {
            let textMessage = {
              text: messageContent,
              sender: 'self',
              type: 'text',
              sent: true
            }
            setMessages([...messages, textMessage])
          }
        }
      } else {
        let messageContainer = document.querySelector('.message-container')
        let onBottom = false
        if (messageContainer) {
          if (Math.abs(messageContainer.scrollTop + messageContainer.clientHeight - messageContainer?.scrollHeight) < 1) {
            onBottom = true
          }
        }

        setMessages([...messages, textMessage]);      

        if (messageContainer && onBottom) {
          messageContainer.scrollTop = messageContainer?.scrollHeight
        }
      }
    }
  };


  const [popupVisible, setPopupVisible] = useState(false);

  const attachmentButtonRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const contentType = selectedFile && selectedFile.type.startsWith("image/") ? "image" : "normal";

  const handleAttachmentButtonClick = (event: React.MouseEvent<Element>) => {
    if (attachmentButtonRef.current) {
      attachmentButtonRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      setSelectedFile(file);
      setPopupVisible(true);
    }
  };

  const handleFileMessage = async () => {
    if (selectedFile) {
      // const fileMessage = {
      //   text: `${selectedFile.name}\n${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`,
      //   sender: "self",
      //   type: "file",
      //   file: selectedFile,
      // };
      // setMessages([...messages, fileMessage]);
      const formData = new FormData();
      formData.append('file', selectedFile)
      formData.append('channel', "4")
      await axiosClient.post('http://127.0.0.1:8000/api/message/upload/image/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      setInputValue("");
      setPopupVisible(false);
    }
  };

  const handleClosePopup = () => {
    setPopupVisible(false);
    setSelectedFile(null);
    if (attachmentButtonRef.current) {
      attachmentButtonRef.current.value = "";
    }
  }

  const [messages, setMessages] = useState<{text: string; sender: string; type: string; file?: File; uuid?: string; sent?: boolean}[]>([]);

  const [inputValue, setInputValue] = useState<string>("");


  function onClick(emojiData: EmojiClickData, event: MouseEvent) {
    const unicodeEmoji = emojiData.emoji;
    setInputValue((inputValue) => inputValue + unicodeEmoji);
  }

  const [isEmojiPickerVisible, setEmojiPickerVisible] = useState(false);

  const toggleEmojiPicker = () => {
    setEmojiPickerVisible(!isEmojiPickerVisible);
    setIsEmojiIconClicked(!isEmojiIconClicked);
  };

  return (
    <div className="user-box-chat">
      <div
        className="user-header-container"
        onClick={(event) => handleSlideAnimation(event)}
      >
        <div className="user">
          <div className="user-avatar">
            <span>{userProp.avatar}</span>
          </div>
          <div className="user-labels">
            <h5>{userProp.name}</h5>
            <p>Last seen now</p>
          </div>
        </div>
        <div className="chat-utils">
          <span className="util-icon-container">
            <GoSearch size={24} className="util-icon" />
          </span>
          <span className="util-icon-container">
            <BsThreeDotsVertical
              size={22}
              className="util-icon"
              onClick={handleUtilsClick}
            />
            <div
              className="util-container"
              style={{
                visibility: isUtilsVisible ? "visible" : "hidden",
                opacity: isUtilsVisible ? 1 : 0,
              }}
              onMouseLeave={() => setUtilsVisible(false)}
            >
              <ul className="util-dropdown-item-container">
                <li className="util-dropdown-item">
                  <span className="dropdown-icon">
                    <IoNotificationsOffOutline size={22} />
                  </span>
                  <span className="dropdown-label">Mute</span>
                </li>
                <li className="util-dropdown-item">
                  <span className="dropdown-icon">
                    <AiOutlineCheckCircle size={22} />
                  </span>
                  <span className="dropdown-label">Select Messages</span>
                </li>
                <li className="util-dropdown-item">
                  <span className="dropdown-icon">
                    <PiShareFat size={22} />
                  </span>
                  <span className="dropdown-label">Share Contact</span>
                </li>
                <li className="util-dropdown-item">
                  <span className="dropdown-icon">
                    <BiLockAlt size={22} />
                  </span>
                  <span className="dropdown-label">Block User</span>
                </li>
                <li className="util-dropdown-item">
                  <span className="dropdown-icon alert">
                    <FiTrash size={22} />
                  </span>
                  <span className="dropdown-label alert">Delete Chat</span>
                </li>
              </ul>
            </div>
          </span>
        </div>
      </div>
      <Logo />
      <div
        className={`user-info ${isSlided ? "slided" : ""}`}
        style={translateX}
      >
        Test
      </div>
      <div className="message-container">

        {messages.map((message, index) => (
          <div className="message-block">
            <div key={index}
            className={`message ${message.sender === "self" ? "self" : "user"} ${message.type === "image" ? "image" : ""}`}>
              <div>
                {message.type === "image" ? (
                  <img src={message.text.split(' ')[0]} alt={message.type}></img>
                  // <a
                  //   href={URL.createObjectURL(message.file)}
                  //   download={message.file.name}
                  //   className="file-downloader"
                  // >
                  //   {message.text}
                  // </a>
                ) : (
                  message.text
                )}
              </div>
              
            </div>
            <div className="sent-icon">
              {
                message.sent ? <FaCheckCircle size={12}/> : <FaRegCheckCircle size={12} />
              }
            </div>
          </div>
        ))}
      </div>
      <div className="message-input-container">
        <div className="input-container">
          <MdOutlineEmojiEmotions
            style={{
              marginLeft: "0.2rem",
              color: isEmojiIconClicked ? "var(--border-on-click)" : "currentColor",
            }}
            size={25}
            onClick={toggleEmojiPicker}
          />
          {isEmojiPickerVisible && (
            <div className={`emoji-picker-container ${isEmojiPickerVisible ? 'visible' : ''}`}>
              <EmojiPicker
                previewConfig={{
                  defaultCaption: "Pick one!",
                  defaultEmoji: "1f92a",
                  showPreview: false,
                }}
                lazyLoadEmojis={true}
                searchDisabled
                emojiStyle={EmojiStyle.NATIVE}
                onEmojiClick={onClick}
              />
            </div>
          )}
          <input
            type="text"
            className="input-area"
            value={inputValue}
            onChange={(e) => setInputValue(e.currentTarget.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Message"
          />
          <div className="file-import-container" onClick={handleAttachmentButtonClick}>
            <ImAttachment size={24} />
            <input
              type="file"
              style={{ display: "none" }}
              ref={attachmentButtonRef}
              onChange={handleFileChange}
            />
          </div>
        </div>
        <div className="send-container" onClick={handleSendingInputs}>
          <BiSend size={24} />
        </div>
      </div>
      {popupVisible && selectedFile && (
        <div className={`file-popup file-popup-${contentType}`}>
          <div className="file-popup-header file">
            <GoX size={24} onClick={handleClosePopup} />
            <span>Send {contentType === "image" ? "Photo" : "File"}</span>
          </div>
          {contentType === "image" ? (
            <img src={URL.createObjectURL(selectedFile)} alt="Selected File" />
          ) : (
            <div className="file-descriptions">
              <p>Name: {selectedFile.name}</p>
              <p>Type: {selectedFile.type}</p>
            </div>
          )}
          <div className="file-popup-footer">
            <input type="text" placeholder="Add a caption" />
            <button onClick={handleSendingInputs}><span>SEND</span></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserInbox;