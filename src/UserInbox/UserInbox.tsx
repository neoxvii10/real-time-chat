import { ReactComponent as Logo } from "../pattern.svg";
import { MdOutlineCall } from "react-icons/md";
import { HiOutlineVideoCamera } from "react-icons/hi";
import { BsThreeDotsVertical } from "react-icons/bs";
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

  const handleSendingInputs = () => {
    setInputValue("");
  };
  
  // const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
  //   const newMessage = event.target.value;
  //   setMessage(newMessage);
  //   setHasMessage(newMessage.trim() !== ""); // Check if the message is not empty
  // };

  // const sendMessage = () => {
  //   setSelectedFile(null);
  //   setMessage("");
  //   // TODO: Implement the logic to send the message
  // };

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

  const handleClosePopup = () => {
    setPopupVisible(false);
    setSelectedFile(null);
    if (attachmentButtonRef.current) {
      attachmentButtonRef.current.value = "";
    }
  }

  // useEffect(() => {
  //   updateTextareaHeight(); // update  height of the messsage text box as user add more text
  // }, [message]);

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
            <GoX size={24} onClick={handleClosePopup}/>
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
            <input type="text" placeholder="Add a caption"/>
            <button><span>SEND</span></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserInbox;