import { ReactComponent as Logo } from "../pattern.svg";
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
import EmojiPicker, {
  EmojiStyle,
  EmojiClickData,
} from "emoji-picker-react";
import "./UserInbox.css";
import axiosClient from "../Api/AxiosClient";
import { v4 as uuidv4 } from 'uuid';
import UserProfileApi from '../Api/UserProfileApi';

// use api
type UserType = {
  id: number,
  username: string,
  avatar_url: any,
  first_name: string,
  last_name: string,
  fullname: string
}

type UnifiedType = UserType | ChannelType;

type ChannelInboxProps = {
  channel: UnifiedType;
  userId: number;
  socket: WebSocket;
};

type ChannelType = {
  id: number,
  member_count: number,
  last_message?: any,
  title: string,
  avatar_url?: string,
  create_at: string
}


const UserInbox: React.FC<ChannelInboxProps> = ({ channel, userId, socket }) => {
  useEffect(() => {
    // Establish WebSocket connection when the component mounts
    socket.onopen = () => {
      console.log('WebSocket connection established');
    };
  
    // Close WebSocket connection when the component unmounts
    return () => {
      socket.close();
      console.log('WebSocket connection closed');
    };
  }, []);
  
  const isUserType = (channel as UnifiedType).hasOwnProperty('username');

  const renderHeader = () => {
    if (isUserType) {
      const user = channel as UserType;
      return (
        <div className="user">
          <div className="user-avatar">
            <img
              src={user.avatar_url || "https://static.vecteezy.com/system/resources/previews/008/442/086/non_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg"}
              alt="avatar user"
              className="user-avatar-img"
            />
          </div>
          <div className="user-labels">
            <h5>{user.fullname}</h5>
            <p>Last seen now</p>
          </div>
        </div>
      );
    } else {
      const channelInfo = channel as ChannelType;
      return (
        <div className="user">
          <div className="user-avatar">
            <img
              src={channelInfo.avatar_url || "https://static.vecteezy.com/system/resources/previews/008/442/086/non_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg"}
              alt="avatar user"
              className="user-avatar-img"
            />
          </div>
          <div className="user-labels">
            <h5>{channelInfo.title}</h5>
            <p>Last seen now</p>
          </div>
        </div>
      );
    }
  };

  const messageContainer = document.querySelector('.message-container')
  const [onBottom, setOnBottom] = useState(true)

  const [isSlided, setSlided] = useState<boolean>(true);
  const [messages, setMessages] = useState<{ text: string; sender: string; type: string; file?: File; uuid?: string; isSent?: boolean }[]>([]);

  const [inputValue, setInputValue] = useState<string>("");

  const [userProfile, setUserProfile] = useState<any>();

  const fetchMessages = async (channelId: number) => {
    try {
      // Check if the current medium is a ChannelType
      if (isUserType) {
        // Handle UserType logic if needed
        let profileRes: any = await UserProfileApi.getChatProfile(channelId);
        setUserProfile(profileRes?.data);
      } else if (channelId) {
        // Make the API call only if channelId is defined
        let res: any = await axiosClient.get(`api/channel/${channelId}/messages/?page=1`)
        let messageList = []
        for (let message of res.data) {
          let messageElement = {
            text: message.content,
            sender: (userId === message.member.user.id) ? "self" : "user",
            type: message.message_type.toLowerCase(),
          }
          messageList.push(messageElement)
        }
        setMessages(messageList.reverse())
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };
  
  useEffect(() => {
    // Fetch messages when medium or channel.id changes
    fetchMessages(channel.id);
    if (messageContainer && onBottom) {
      messageContainer.scrollTop = messageContainer?.scrollHeight
    }
  }, [channel.id, isUserType]);

  useEffect(() => {
    // Scroll to bottom when receive message in case user is already bottom
    if (messageContainer && onBottom) {
      messageContainer.scrollTop = messageContainer?.scrollHeight
    }
  }, [messages])

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
        "targetId": channel.id,
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

      if (messageContainer) {
        if (Math.abs(messageContainer.scrollTop + messageContainer.clientHeight - messageContainer?.scrollHeight) < 1) {
          setOnBottom(true)
        } else {
          setOnBottom(false)
        }
      }

      let textMessage = {
        text: inputValue,
        sender: 'self',
        type: 'text',
        uuid: messageObject.uuid,
        isSent: false
      }
      setMessages([...messages, textMessage])
      setInputValue("");
    } else if (selectedFile) {
      handleFileMessage();
      setSelectedFile(null);
    }
  }

  // handle receive message
  socket.addEventListener("message", function(e) {
    // Parse the JSON data from the server
    const serverMessage = JSON.parse(e.data);

    // Check if the action is "create_message" and the message_type is "TEXT"
    if (serverMessage.action === "create_message") {

      if (messageContainer) {
        if (Math.abs(messageContainer.scrollTop + messageContainer.clientHeight - messageContainer?.scrollHeight) < 1) {
          setOnBottom(true)
        } else {
          setOnBottom(false)
        }
      }
      // Extract the content of the message
      const messageContent = serverMessage.data.content;

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
            isSent: true
          }
          setMessages([...messages, fileMessage]);
        } else {
          let uuid = serverMessage.uuid
          let isSelfMessageCheck = false
          for (let i = messages.length - 1; i >= 0; i--) {
            if (messages[i].uuid === uuid) {
              // console.log("**Đã gửi**" + messages[i].text)
              messages[i].isSent = true
              setMessages([...messages])
              isSelfMessageCheck = true
              break
            }
          }
          if (!isSelfMessageCheck) {
            let textMessage = {
              text: messageContent,
              sender: 'self',
              type: 'text',
              isSent: true
            }
            setMessages([...messages, textMessage])
          }
        }
      } else {
        setMessages([...messages, textMessage]);
      }
    }
  });


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
      formData.append('channel', channel.id.toString())
      await axiosClient.post('api/message/upload/image/', formData, {
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
    <>
      {!isUserType ? 
        <div className="user-box-chat">
          <div
            className="user-header-container"
            onClick={(event) => handleSlideAnimation(event)}
          >
            {renderHeader()}
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
                    (Object.hasOwn(message, "isSent")) && (!message.isSent && <FaRegCheckCircle size={12} />)
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
      :
      <div className="user-box-chat">
        {userProfile && (
        <div className="user-profile-container">
          <div className="user-profile-ava-container">
            <img src={userProfile.avatar_url || "https://static.vecteezy.com/system/resources/previews/008/442/086/non_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg"}
            alt="profile-img" />
          </div>
          <div className="user-profile-labels-container">
            <h4>{userProfile.user.fullname}</h4>
            <p>{userProfile.bio}</p>
          </div>
        </div>
        )}
        <Logo />
      </div>
    }
    </>

  );
};

export default UserInbox;