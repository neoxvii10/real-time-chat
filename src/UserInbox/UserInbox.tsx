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
import { FaReply } from "react-icons/fa";
import { GoSearch, GoX } from 'react-icons/go'
import { CSSProperties, useCallback } from "react";
import React, { useEffect, useState, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import EmojiPicker, {
  EmojiStyle,
  EmojiClickData,
} from "emoji-picker-react";
import "./UserInbox.css";
import axiosClient from "../Api/AxiosClient";
import { v4 as uuidv4 } from 'uuid';
import { timeEnd } from "console";

// use api
type UserType = {
  id: number,
  username: string,
  avatar_url: string,
  first_name: string,
  last_name: string,
  fullname: string
}

type ChannelInboxProps = {
  channel: ChannelType;
};

type ChannelType = {
  id: number,
  member_count: number,
  last_message?: any,
  title: string,
  avatar_url?: string,
  create_at: string
}



const _token = localStorage.getItem('accessToken'); // Token will be received when sign in successfully
if (_token) {
  var token = JSON.parse(_token)
  var userId = (jwtDecode(token) as any).user_id
}

const socket = new WebSocket(`ws://16.162.46.190/ws/chat/?token=${token}`);
console.log(socket);
socket.onopen = () => {
  console.log('WebSocket connection established');
};

const UserInbox: React.FC<ChannelInboxProps> = ({ channel }) => {
  const messageContainer = document.querySelector('.message-container')
  const [onBottom, setOnBottom] = useState(true)

  const [isSlided, setSlided] = useState<boolean>(true);
  const [messages, setMessages] = useState<{
    id?: number;
    channel?: number;
    text: string;
    fullname?: string;
    sender: string;
    type: string;
    file?: File;
    uuid?: string;
    isSent?: boolean;
    create_at: string;
  }[]>([]);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return `${date.getHours()}:${date.getMinutes()}`;
  };

  function getCurrentTime() {
    let currentTime_ = new Date();
    const currentTime = `${currentTime_.getHours()}:${currentTime_.getMinutes()}`;
    console.log(currentTime);
    return currentTime;
  }


  const [inputValue, setInputValue] = useState<string>("");
  const fetchMessage = async () => {
    let res: any = await axiosClient.get(`api/channel/${channel.id}/messages/?page=1`)
    let messageList = []
    for (let message of res.data) {
      let messageElement = {
        id: message.id,
        channel: message.channel,
        text: message.content,
        fullname: message.member.user.fullname,
        sender: (userId === message.member.user.id) ? "self" : "user",
        type: message.message_type.toLowerCase(),
        create_at: message.create_at,
      }
      messageList.push(messageElement)
    }
    setMessages(messageList.reverse())
  }
  useEffect(() => {
    fetchMessage()
    if (messageContainer && onBottom) {
      messageContainer.scrollTop = messageContainer?.scrollHeight
    }
  }, [channel])

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
        isSent: false,
        create_at: getCurrentTime(),
      }
      setMessages([...messages, textMessage])
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
        user: serverMessage.data.member.user.fullname,
        sender: 'user',
        type: 'text',
        create_at: formatTimestamp(serverMessage.data.create_at),
      }

      if (serverMessage.data.message_type === "IMAGE") {
        textMessage.type = 'image'
      }

      let senderId = serverMessage.data.member.user.id
      if (senderId === userId) {
        if (textMessage.type === 'image') {
          let fileMessage = {
            text: messageContent,
            user: serverMessage.data.member.user.fullname,
            sender: 'self',
            type: 'image',
            isSent: true,
            create_at: formatTimestamp(serverMessage.data.create_at),
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
              user: serverMessage.data.member.user.fullname,
              sender: 'self',
              type: 'text',
              isSent: true,
              create_at: formatTimestamp(serverMessage.data.create_at),
            }
            setMessages([...messages, textMessage])
          }
        }
      } else {
        setMessages([...messages, textMessage]);
      }
    } else if (serverMessage.action === "remove_message") {
      const messageId = serverMessage.data.messageId;
      const updatedMessages = messages.filter((msg) => msg.id !== messageId);
      setMessages(updatedMessages);
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


  function handleEmojiClick(message: { text: string; sender: string; type: string; file?: File | undefined; uuid?: string | undefined; isSent?: boolean | undefined; create_at?: string | undefined; }): void {
    throw new Error("Function not implemented.");
  }

  function handleReplyClick(message: { text: string; sender: string; type: string; file?: File | undefined; uuid?: string | undefined; isSent?: boolean | undefined; create_at?: string | undefined; }): void {
    throw new Error("Function not implemented.");
  }

 

  // state to manage delete confirmation modal visibility
  const [isDeleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<any>(null);

  // Function to handle delete button click
  const handleDeleteButtonClick = (message: any) => {
    setMessageToDelete(message);
    setDeleteConfirmationVisible(true);
  };

  // Function to handle delete confirmation
  const handleDeleteConfirmation = () => {
    if (messageToDelete.id) {
      const messageIdtoDelete = messageToDelete.id;
      const channelId = messageToDelete.channel;
      const deleteMessageObject = {
        action: "remove_message",
        target: "channel",
        targetId: channelId,
        data: {
          messageId: messageIdtoDelete,
        },
      };

      const deleteMessageJSON = JSON.stringify(deleteMessageObject);

      if (isOpen(socket)) {
        socket.send(deleteMessageJSON);
        
      } else {
        console.log("WebSocket is not open. Message deletion failed.");
      }

      const updatedMessages = messages.filter((msg) => msg.id !== messageIdtoDelete);
      setMessages(updatedMessages);
    } else {
      console.error("Invalid message format. Unable to delete message.");
    }
    setDeleteConfirmationVisible(false);
    setMessageToDelete(null);
  };

  // Function to handle cancel button click
  const handleCancelDelete = () => {
    // Close the confirmation modal
    setDeleteConfirmationVisible(false);
    setMessageToDelete(null);
  };



  const [hoveredMessageIndex, setHoveredMessageIndex] = useState<number | null>(null);

  const handleMouseEnter = (index: number) => {
    setHoveredMessageIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredMessageIndex(null);
  };

  return (
    <div className="user-box-chat">
      <div
        className="user-header-container"
        onClick={(event) => handleSlideAnimation(event)}
      >
        <div className="user">
          <div className="user-avatar">
            {/* <span>{userProp.avatar}</span> */}
            <img src={channel?.avatar_url || "https://static.vecteezy.com/system/resources/previews/008/442/086/non_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg"} alt="avatar user" className='user-avatar-img' />
          </div>
          <div className="user-labels">
            <h5>{channel?.title}</h5>
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
          <div
            className={`message-block ${hoveredMessageIndex === index ? "hovered" : ""}`}
            key={index}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            <div key={index}
              className={`message ${message.sender === "self" ? "self" : "user"} ${message.type === "image" ? "image" : ""}`}>
              <div className="message-content">
                {message.type === "image" ? (
                  <div>
                    <img src={message.text.split(' ')[0]} alt={message.type}></img>
                    {message.create_at && (
                      <div className="timestamp">{formatTimestamp(message.create_at)}</div>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="message-fullname">{message.fullname}</div>
                    <div>{message.text}</div>
                    {message.create_at && (
                      <div className="timestamp">{formatTimestamp(message.create_at)}</div>
                    )}
                  </>
                )}
              </div>
              <div className="icon-container">
                <div className="message-icons">
                  {/* hoveredMessageIndex === index && ( */}
                  <>
                    <span className="icon" onClick={() => handleEmojiClick(message)}>
                      <MdOutlineEmojiEmotions size={20} />
                    </span>
                    <span className="icon" onClick={() => handleReplyClick(message)}>
                      <FaReply size={20} />
                    </span>
                    <span className="icon" onClick={() => handleDeleteButtonClick(message)}>
                      <FiTrash size={20} />
                    </span>

                  </>
                  {/* )  */}
                </div>
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
      {isDeleteConfirmationVisible && (
        <div className="delete-confirmation-modal">
          <p>Are you sure you want to delete this message?</p>
          <button onClick={handleDeleteConfirmation}>Yes</button>
          <button onClick={handleCancelDelete}>No</button>
        </div>
      )}
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