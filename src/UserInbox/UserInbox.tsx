//add-new-friend
import { ReactComponent as Logo } from "../pattern.svg";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaCheckCircle, FaRegCheckCircle } from "react-icons/fa";
import { FiFlag } from "react-icons/fi";
import { IoNotificationsOffOutline } from "react-icons/io5";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { PiShareFat } from "react-icons/pi";
import { BiLockAlt } from "react-icons/bi";
import { FiTrash } from "react-icons/fi";
import { BiSend } from "react-icons/bi";
import { ImAttachment } from "react-icons/im";
import { MdOutlineEmojiEmotions } from "react-icons/md";

import { FaReply } from "react-icons//fa";
import { GoSearch, GoX } from "react-icons/go";
import { CSSProperties } from "react";
import React, { useEffect, useState, useRef } from "react";
import EmojiPicker, { EmojiStyle, EmojiClickData } from "emoji-picker-react";
import "./UserInbox.css";
import axiosClient from "../Api/AxiosClient";
import { v4 as uuidv4 } from "uuid";
import UserProfileApi from "../Api/UserProfileApi";
import Report from "../Users/Report/Report";
import UserInformation from "../RightColumn/RightColumn";
import EditAvatarChannel from "../RightColumn/ChatWithGroup/Edit/EditAvatar/EditAvatarChannel";
import axios from "axios";

import { timeEnd } from "console";
import ChannelApi from "../Api/ChannelApi";

// use api
type UserType = {
  id: number;
  username: string;
  avatar_url: any;
  first_name: string;
  last_name: string;
  fullname: string;
};

type UnifiedType = UserType | ChannelType;

type ChannelInboxProps = {
  channel: UnifiedType;
  userId: number;
  socket: WebSocket;
  onNewMessage: () => void;
};

type ChannelType = {
  id: number;
  member_count: number;
  last_message?: any;
  title: string;
  avatar_url?: string;
  create_at: string;
};

type ReactionType = {
  id: number;
  member: any;
  message: string;
  emoji: number;
};

type MessageType = {
  id?: number;
  channel?: number;
  text: string;
  fullname?: string;
  sender: string;
  type: string;
  reply?: number;
  file?: File;
  uuid?: string;
  isSent?: boolean;
  create_at: string;
  reactions?: ReactionType[];
};

const UserInbox: React.FC<ChannelInboxProps> = ({
  channel,
  userId,
  socket,
  onNewMessage,
}) => {
  useEffect(() => {
    // Establish WebSocket connection when the component mounts
    socket.onopen = () => {
      console.log("WebSocket connection established");
    };

    // Close WebSocket connection when the component unmounts
    return () => {
      socket.close();
      console.log("WebSocket connection closed");
    };
  }, []);

  const isUserType = (channel as UnifiedType).hasOwnProperty("username");

  const renderHeader = () => {
    if (isUserType) {
      const user = channel as UserType;
      return (
        <div className="user">
          <div className="user-avatar">
            <img
              src={
                user.avatar_url ||
                "https://static.vecteezy.com/system/resources/previews/008/442/086/non_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg"
              }
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
              src={
                channelInfo.avatar_url ||
                "https://static.vecteezy.com/system/resources/previews/008/442/086/non_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg"
              }
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

  const messageContainer = document.querySelector(".message-container");
  const [onBottom, setOnBottom] = useState(true);

  const [isSlided, setSlided] = useState<boolean>(true);
  const [messages, setMessages] = useState<MessageType[]>([]);

  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        // If the timestamp is not in a valid format, return the original timestamp
        return timestamp;
      }
      // Format the valid timestamp
      return `${date.getHours()}:${date.getMinutes()}`;
    } catch (error) {
      // Handle parsing errors
      console.error("Error parsing timestamp:", error);
      return timestamp;
    }
  };

  const getCurrentTime = () => {
    let currentTime_ = new Date();
    const currentTime = `${currentTime_.getHours()}:${currentTime_.getMinutes()}`;
    return currentTime;
  };

  const [inputValue, setInputValue] = useState<string>("");
  const fetchMessage = async () => {
    let res: any = await axiosClient.get(
      `api/channel/${channel.id}/messages/?page=1`
    );
    let reactionListRes = await axios.get(
      `http://112.137.129.158:5002/api/message/channel-reactions/${channel.id}/`
    );
    let messageList = [];
    for (let message of res.data) {
      let messageElement: MessageType = {
        id: message.id,
        channel: message.channel,
        text: message.content,
        fullname: message.member.user.fullname,
        sender: userId === message.member.user.id ? "self" : "user",
        type: message.message_type.toLowerCase(),
        create_at: message.create_at,
      };
      for (let reaction of reactionListRes.data.data) {
        if (reaction.message === message.id) {
          if (!messageElement.reactions) {
            messageElement.reactions = [];
          }
          //@ts-ignore
          messageElement.reactions.push(reaction);
        }
      }
      if (message.reply) {
        messageElement.reply = message.reply;
      }
      messageList.push(messageElement);
    }
    setMessages(messageList.reverse());
  };

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
        let res: any = await axiosClient.get(
          `api/channel/${channelId}/messages/?page=1`
        );
        let reactionListRes = await axios.get(
          `http://112.137.129.158:5002/api/message/channel-reactions/${channel.id}/`
        );

        let messageList = [];
        for (let message of res.data) {
          let messageElement: MessageType = {
            id: message.id,
            channel: message.channel,
            text: message.content,
            fullname: message.member.user.fullname,
            sender: userId === message.member.user.id ? "self" : "user",
            type: message.message_type.toLowerCase(),
            create_at: message.create_at,
          };
          for (let reaction of reactionListRes.data.data) {
            if (reaction.message === message.id) {
              if (!messageElement.reactions) {
                messageElement.reactions = [];
              }
              //@ts-ignore
              messageElement.reactions.push(reaction);
            }
          }
          if (message.reply) {
            messageElement.reply = message.reply;
          }

          if (message.member.user.id !== userId) {
            // @ts-ignore
            messageElement.fullname = message.member.user.fullname;
          }
          messageList.push(messageElement);
        }
        setMessages(messageList.reverse());
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    fetchMessages(channel.id);
    if (messageContainer && onBottom) {
      messageContainer.scrollTop = messageContainer?.scrollHeight;
    }
  }, [channel.id, isUserType]);

  useEffect(() => {
    // Scroll to bottom when receive message in case user is already bottom
    if (messageContainer && onBottom) {
      messageContainer.scrollTop = messageContainer?.scrollHeight;
    }
  }, [messages]);

  // handle receive message
  socket.onmessage = (e) => {
    // Parse the JSON data from the server
    const serverMessage = JSON.parse(e.data);
    // Check if the action is "create_message" and the message_type is "TEXT"
    switch (serverMessage.action) {
      case "create_message":
        if (messageContainer) {
          if (
            Math.abs(
              messageContainer.scrollTop +
                messageContainer.clientHeight -
                messageContainer?.scrollHeight
            ) < 1
          ) {
            setOnBottom(true);
          } else {
            setOnBottom(false);
          }
        }

        let hasReply = false;
        if (serverMessage.data.reply) {
          hasReply = true;
        }

        // Extract the content of the message
        const messageContent = serverMessage.data.content;
        let textMessage = {
          text: messageContent,
          user: serverMessage.data.member.user.fullname,
          sender: "user",
          type: "text",
          create_at: formatTimestamp(serverMessage.data.create_at),
        };
        if (hasReply) {
          // @ts-ignore
          textMessage.reply = serverMessage.data.reply;
        }

        if (serverMessage.data.message_type === "IMAGE") {
          textMessage.type = "image";
        }

        let senderId = serverMessage.data.member.user.id;
        if (senderId === userId) {
          if (textMessage.type === "image") {
            let fileMessage = {
              text: messageContent,
              user: serverMessage.data.member.user.fullname,
              sender: "self",
              type: "image",
              isSent: true,
              create_at: formatTimestamp(serverMessage.data.create_at),
            };
            if (hasReply) {
              // @ts-ignore
              fileMessage.reply = serverMessage.data.reply;
            }
            setMessages([...messages, fileMessage]);
          } else {
            let uuid = serverMessage.uuid;
            let isSelfMessageCheck = false;
            for (let i = messages.length - 1; i >= 0; i--) {
              if (messages[i].uuid === uuid) {
                // console.log("**Đã gửi**" + messages[i].text)
                messages[i].isSent = true;
                setMessages([...messages]);
                isSelfMessageCheck = true;
                break;
              }
            }
            if (!isSelfMessageCheck) {
              let textMessage = {
                text: messageContent,
                user: serverMessage.data.member.user.fullname,
                sender: "self",
                type: "text",
                isSent: true,
                create_at: formatTimestamp(serverMessage.data.create_at),
              };
              if (hasReply) {
                // @ts-ignore
                textMessage.reply = serverMessage.data.reply;
              }
              setMessages([...messages, textMessage]);
            }
          }
        } else {
          setMessages([...messages, textMessage]);
        }
        onNewMessage();
        break;
      case "remove_message":
        const messageId = serverMessage.data.messageId;
        console.log(`remove_message ${messageId}`);
        const updatedMessages = messages.filter((msg) => msg.id !== messageId);
        setMessages(updatedMessages);
        break;

      case "create_reaction":
        const data = serverMessage.data;
        let newReaction = {
          id: data.id,
          member: data.member,
          message: data.message,
          emoji: data.emoji,
        };
        for (let i = messages.length - 1; i >= 0; i--) {
          if (messages[i].id === newReaction.message) {
            if (!messages[i].reactions) {
              messages[i].reactions = [];
            }
            messages[i].reactions?.push(newReaction);
            setMessages([...messages]);
            break;
          }
        }
        break;
      case "remove_reaction":
        const removeReactionData = serverMessage.data;
        loop1: for (let i = messages.length - 1; i >= 0; i--) {
          if (messages[i].id === removeReactionData.messageId) {
            //@ts-ignore
            loop2: for (let j = 0; j < messages[i]?.reactions?.length; j++) {
              //@ts-ignore
              let reaction = messages[i]?.reactions[j];
              if (reaction.id === removeReactionData.reactionId) {
                messages[i]?.reactions?.splice(j, 1);
                setMessages([...messages]);
                break loop1;
              }
            }
          }
        }
        break;
    }
  };

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
        transform: isSlided ? "translateX(5px)" : "translateX(480px)",
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

  function isOpen(WebSocket: { readyState: any; OPEN: any }) {
    return WebSocket.readyState === WebSocket.OPEN;
  }

  const handleSendingInputs = () => {
    if (inputValue.trim() !== "") {
      const messageObject = {
        action: "create_message",
        target: "channel",
        targetId: channel.id,
        uuid: uuidv4(),
        data: {
          content: inputValue,
          reply: null,
        },
      };

      if (isReplying) {
        // @ts-ignore
        messageObject.data.reply = replyToMessage.id;
      }

      const messageJSON = JSON.stringify(messageObject);
      if (!isOpen(socket)) {
        console.log("Message can't be sent");
        return;
      }
      socket.send(messageJSON);

      if (messageContainer) {
        if (
          Math.abs(
            messageContainer.scrollTop +
              messageContainer.clientHeight -
              messageContainer?.scrollHeight
          ) < 1
        ) {
          setOnBottom(true);
        } else {
          setOnBottom(false);
        }
      }

      let textMessage = {
        text: inputValue,
        sender: "self",
        type: "text",
        uuid: messageObject.uuid,
        isSent: false,
        // @ts-ignore
        reply: replyToMessage.id,
        create_at: getCurrentTime(),
      };
      setMessages([...messages, textMessage]);
      setInputValue("");
    } else if (selectedFile) {
      handleFileMessage();
      setSelectedFile(null);
    }
    onNewMessage();
    setReplying(false);
  };

  const [popupVisible, setPopupVisible] = useState(false);

  const attachmentButtonRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const contentType =
    selectedFile && selectedFile.type.startsWith("image/") ? "image" : "normal";

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
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("channel", channel.id.toString());
      await axiosClient.post("api/message/upload/image/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
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
  };

  function onClick(emojiData: EmojiClickData, event: MouseEvent) {
    const unicodeEmoji = emojiData.emoji;
    setInputValue((inputValue) => inputValue + unicodeEmoji);
  }

  //emoji picker của phần nhập tin nhắn
  const [isEmojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const toggleEmojiPicker = () => {
    setEmojiPickerVisible(!isEmojiPickerVisible);
  };

  // THẢ EMOJI

  const [isMessageEmojiPickerVisible, setMessageEmojiPickerVisible] =
    useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState<number>();
  const [selectedMessageId, setSelectedMessageId] = useState<number | null>(
    null
  );
  const emojis = ["❤️", "😂", "😮", "😢", "😡", "👍"];

  // Toggle emoji picker visibility
  const toggleMessageEmojiPicker = () => {
    setMessageEmojiPickerVisible(!isMessageEmojiPickerVisible);
  };

  // Handle emoji selection
  const handleEmojiClick = (emoji: number) => {
    setSelectedEmoji(emoji);
    setMessageEmojiPickerVisible(false);
    // Now you can send the reaction through WebSocket
    sendReactionToWebSocket(emoji);
  };

  // Function to send the reaction through WebSocket
  const sendReactionToWebSocket = (emoji: number) => {
    const reactionObject = {
      action: "create_reaction",
      target: "channel",
      targetId: channel.id,
      data: {
        message: selectedMessageId,
        emoji: emoji,
      },
    };

    const reactionJSON = JSON.stringify(reactionObject);
    if (isOpen(socket)) {
      socket.send(reactionJSON);
    } else {
      console.log("WebSocket is not open. Reaction failed.");
    }
  };

  const removeReactionHandle = (message: any, reaction: any) => {
    const removeReactionObject = {
      action: "remove_reaction",
      target: "channel",
      targetId: channel.id,
      data: {
        reactionId: reaction.id,
        messageId: message.id,
      },
    };
    const jsonObject = JSON.stringify(removeReactionObject);
    if (isOpen(socket)) {
      socket.send(jsonObject);
    } else {
      console.log("WebSocket is not open. Remove reaction failed.");
    }
  };

  const countEmoji = (emoji: any, reactionList: any) => {
    let cnt = 0;
    for (let reaction of reactionList) {
      if (reaction.emoji === emoji) {
        cnt++;
      }
    }
    if (cnt !== 0) return cnt;
  };

  // TRẢ LỜI TIN NHẮN

  const [isReplying, setReplying] = useState(false);
  const [replyToMessage, setReplyToMessage] = useState<any>(null);

  const handleReplyClick = (message: any) => {
    setReplying(true);
    setReplyToMessage(message);
  };

  const ReplyPopup = () => {
    if (replyToMessage.type === "image") {
      replyToMessage.text = "Image";
    }

    return (
      <div className="reply-popup">
        <div className="close-button" onClick={() => setReplying(false)}>
          x
        </div>
        <p>Replying to: {replyToMessage && replyToMessage.text}</p>
      </div>
    );
  };

  const getReplyContent = (messageId: number) => {
    for (let message of messages) {
      if (message.id === messageId) {
        if (message.type === "text") {
          return `${message.fullname}: ${message.text}`;
        } else {
          return `${message.fullname}: Image`; // You can modify this for other types if needed
        }
      }
    }
  };

  // XOÁ TIN NHẮN
  // state to manage delete confirmation modal visibility
  const [isDeleteConfirmationVisible, setDeleteConfirmationVisible] =
    useState(false);
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

      const updatedMessages = messages.filter(
        (msg) => msg.id !== messageIdtoDelete
      );
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

  // hanle report channel
  const [isReport, setIsReport] = useState(false);

  const handleVisibleFormReport = (
    e: React.MouseEvent<HTMLLIElement, MouseEvent>
  ) => {
    e.preventDefault();

    setIsReport(!isReport);
  };

  const [hoveredMessageIndex, setHoveredMessageIndex] = useState<number | null>(
    null
  );

  const handleMouseEnter = (index: number) => {
    setHoveredMessageIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredMessageIndex(null);
  };

  // handle edit avatar channel

  const [disEditAvatar, setDisEditAvatar] = useState<boolean>(false);

  const [selectedImage, setSelectedImage] = useState<string>("");

  const [croppedImage, setCroppedImage] = useState<string>();
  const [croppedBlob, setCroppedBlob] = useState<Blob>();
  const [isCropped, setIsCropped] = useState<boolean>(false);

  const handleCropImage = ({ blob, url }: { blob: Blob; url: string }) => {
    setCroppedBlob(blob);
    setCroppedImage(url);
    setIsCropped(true);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target && e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setCroppedImage("");
      setIsCropped(false);
    }
    setDisEditAvatar(true);
    handleVisibleBtn(true);
  };

  const [hideBtnSubmit, setHideBtnSubmit] = useState<CSSProperties>({
    visibility: "hidden",
    bottom: "-4rem",
  });

  const handleVisibleBtn = (visible: boolean) => {
    if (visible) {
      setHideBtnSubmit({
        ...hideBtnSubmit,
        visibility: "visible",
        bottom: "1rem",
      });
    } else {
      setHideBtnSubmit({
        ...hideBtnSubmit,
        visibility: "hidden",
        bottom: "-4rem",
      });
    }
  };

  return (
    <>
      {!isUserType ? (
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
                    <li
                      className="util-dropdown-item"
                      onClick={handleVisibleFormReport}
                    >
                      <span className="dropdown-icon">
                        <FiFlag size={22} />
                      </span>
                      <span className="dropdown-label">Report</span>
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
            <UserInformation
              socket={socket}
              userId={userId}
              channel={channel}
              handleClose={handleSlideAnimation}
              croppedImage={croppedImage}
              croppedBlob={croppedBlob}
              isCropped={isCropped}
              handleImageChange={handleImageChange}
              hideBtnSubmit={hideBtnSubmit}
              handleVisibleBtn={handleVisibleBtn}
              setIsCropped={setIsCropped}
            />
          </div>

          <div className="message-container">
            {messages.map((message, index) => (
              <div
                className={`message-block ${
                  hoveredMessageIndex === index ? "hovered" : ""
                }`}
                key={index}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
              >
                <div
                  key={index}
                  className={`message ${
                    message.sender === "self" ? "self" : "user"
                  } ${message.type === "image" ? "image" : ""}`}
                >
                  <div className="message-content">
                    <div className="message-fullname">{message.fullname}</div>
                    {message.type === "image" ? (
                      <div>
                        <img
                          src={message.text.split(" ")[0]}
                          alt={message.type}
                        ></img>
                      </div>
                    ) : (
                      <>
                        <div>
                          {message.reply ? (
                            <>
                              <div className="reply-message">
                                <span>{getReplyContent(message.reply)}</span>
                              </div>
                              <div className="original-message">
                                {message.text}
                              </div>
                            </>
                          ) : (
                            <div className="single-message">{message.text}</div>
                          )}
                        </div>
                      </>
                    )}

                    <div className="message-footer">
                      <div className="timestamp">
                        {formatTimestamp(message.create_at)}
                      </div>
                      <div className="reaction-icon">
                        {message.reactions &&
                          emojis.map((emoji, index) => (
                            <>
                              {countEmoji(index + 1, message.reactions) &&
                                emoji +
                                  countEmoji(index + 1, message.reactions)}
                            </>
                          ))}
                      </div>
                    </div>
                  </div>

                  <div className="icon-container">
                    <div className="message-icons">
                      {hoveredMessageIndex === index && (
                        <>
                          <span
                            className="icon"
                            onClick={() => {
                              if (message.id) setSelectedMessageId(message.id);
                              toggleMessageEmojiPicker();
                            }}
                          >
                            <MdOutlineEmojiEmotions size={20} />
                          </span>
                          {isMessageEmojiPickerVisible && (
                            <div className="emoji-popup">
                              {emojis.map((emoji, index) => (
                                <span
                                  key={emoji}
                                  onClick={() => handleEmojiClick(index + 1)}
                                  className="emoji"
                                >
                                  {emoji}
                                </span>
                              ))}
                            </div>
                          )}
                          <span
                            className="icon"
                            onClick={() => handleReplyClick(message)}
                          >
                            <FaReply size={20} />
                          </span>
                          {message.sender === "self" && (
                            <>
                              <span
                                className="icon"
                                onClick={() => handleDeleteButtonClick(message)}
                              >
                                <FiTrash size={20} />
                              </span>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="sent-icon">
                  {Object.hasOwn(message, "isSent") && !message.isSent && (
                    <FaRegCheckCircle size={12} />
                  )}
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
            {isReplying && <ReplyPopup />}

            <div className="input-container">
              <MdOutlineEmojiEmotions
                style={{
                  marginLeft: "0.2rem",
                  color: isEmojiIconClicked
                    ? "var(--border-on-click)"
                    : "currentColor",
                }}
                size={25}
                onClick={toggleEmojiPicker}
              />
              {isEmojiPickerVisible && (
                <div
                  className={`emoji-picker-container ${
                    isEmojiPickerVisible ? "visible" : ""
                  }`}
                >
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
              <div
                className="file-import-container"
                onClick={handleAttachmentButtonClick}
              >
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
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Selected File"
                />
              ) : (
                <div className="file-descriptions">
                  <p>Name: {selectedFile.name}</p>
                  <p>Type: {selectedFile.type}</p>
                </div>
              )}
              <div className="file-popup-footer">
                <input type="text" placeholder="Add a caption" />
                <button onClick={handleSendingInputs}>
                  <span>SEND</span>
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="user-box-chat">
          {userProfile && (
            <div className="user-profile-container">
              <div className="user-profile-ava-container">
                <img
                  src={
                    userProfile.avatar_url ||
                    "https://static.vecteezy.com/system/resources/previews/008/442/086/non_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg"
                  }
                  alt="profile-img"
                />
              </div>
              <div className="user-profile-labels-container">
                <h4>{userProfile.user.fullname}</h4>
                <p>{userProfile.bio}</p>
              </div>
            </div>
          )}
          <Logo />
        </div>
      )}
      {isReport && (
        <Report
          setIsReport={setIsReport}
          channel={channel}
          isUserType={isUserType}
        />
      )}
      {disEditAvatar && (
        <EditAvatarChannel
          croppedImage={croppedImage}
          croppedBlob={croppedBlob}
          isCropped={isCropped}
          handleCropImage={handleCropImage}
          handleImageChange={handleImageChange}
          setDisEditAvatar={setDisEditAvatar}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
        />
      )}
    </>
  );
};

export default UserInbox;
