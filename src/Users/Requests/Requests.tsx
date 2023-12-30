import React from 'react'
import './Requests.css'
import { TfiArrowLeft } from 'react-icons/tfi'
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import { CSSProperties, useEffect, useState } from 'react';
import UserNotiApi from '../../Api/UserNotiApi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type Props = {
    translateX: CSSProperties;
    setTranslateX: React.Dispatch<React.SetStateAction<CSSProperties>>;
    userId: number
    setUserNotiAmount: React.Dispatch<React.SetStateAction<number>>;
    socket: WebSocket;
    onNewChannel: () => void;
};

type UserType = {
  id: number,
  username: string,
  avatar_url?: string,
  first_name: string,
  last_name: string,
  fullname: string,
  isFriend?: boolean,
  hasSentFriendRq?: boolean;
}

type NotiType = {
  sender: UserType;
  notification_type: string;
  status: string,
  create_at: string;
}

const Requests: React.FC<Props> = (
  { translateX, setTranslateX, userId, setUserNotiAmount, socket, onNewChannel }) => {
  const [userNoti, setUserNoti] = useState<NotiType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userNotiRes = await UserNotiApi.getUserNotis();
        const filteredUserNoti = userNotiRes?.data.filter((noti: NotiType) => noti.status === "PENDING");
        setUserNoti(filteredUserNoti);
        setUserNotiAmount(filteredUserNoti?.length || 0);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData(); // Initial fetch

    const handleSocketMessage = (e: MessageEvent) => {
      // Parse the JSON data from the server
      const serverMessage = JSON.parse(e.data);
      const newFriendRequest = serverMessage.data;

      // Rest of your message handling logic...
      if (serverMessage.action === "friend_request") {
        if (!userNoti.some((noti) => noti.sender.id === newFriendRequest.sender.id)) {
          setUserNoti((prevNoti) => [newFriendRequest, ...prevNoti]);
          setUserNotiAmount((prevAmount) => prevAmount + 1);
  
          // Show a notification or handle the UI update as needed
          toast.info(`${newFriendRequest.sender.username} sent you a friend request!`, {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 2500,
            hideProgressBar: true,
            pauseOnHover: true,
            closeOnClick: false,
          });
        }
      } 
      if (serverMessage.action === "friend_accept") {
        // Update state to include the new friend request
        onNewChannel();
        // Show a notification or handle the UI update as needed
        toast.info(`${newFriendRequest.sender.username} has accepted your friend request!`, {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2500,
          hideProgressBar: true,
          pauseOnHover: true,
          closeOnClick: false,
        });
      } 
      if (serverMessage.action === "friend_deny") {
        // Update state to include the new friend request
      }
    };

    // Add event listener when component mounts
    socket.addEventListener("message", handleSocketMessage);

    // Remove event listener when component unmounts
    return () => {
      socket.removeEventListener("message", handleSocketMessage);
    };
  }, [socket]);
  
  const handleAcceptRequest = async (sender: NotiType) => {
    try {
      let friendRq = {
        action: "friend_accept",
        target: "user",
        targetId: sender.sender.id,
      };
  
      const friendRqJSON = JSON.stringify(friendRq);

      socket.send(friendRqJSON);

      onNewChannel();

      setUserNoti((prevNoti) => prevNoti.filter((noti) => noti.sender.id !== sender.sender.id));
      setUserNotiAmount((prevAmount) => prevAmount - 1);

      console.log("You have accepted!");
    } catch (error) {
      console.error("Error sending/canceling accepting friend request:", error);
    }
  };

  const handleDenyRequest = async (sender: NotiType) => {
    try {
      let friendRq = {
        action: "friend_deny",
        target: "user",
        targetId: sender.sender.id,
      };
  
      const friendRqJSON = JSON.stringify(friendRq);

      socket.send(friendRqJSON);

      setUserNoti((prevNoti) => prevNoti.filter((noti) => noti.sender.id !== sender.sender.id));
      setUserNotiAmount((prevAmount) => prevAmount - 1);

      console.log("You have denied!");
    } catch (error) {
      console.error("Error sending/canceling denying friend request:", error);
    }
  };

  const handleSlideAnimation = (event: React.MouseEvent<Element>) => {
      setTranslateX((translateX) => ({
          ...translateX,
          visibility: 'hidden',
          opacity: 0,
          transform: 'translateX(-960px)',
      }));
  };

  const calculateTimeDifference = (createAt: string): string => {
    const currentTime = new Date();
    const requestTime = new Date(createAt);
    const timeDifferenceInSeconds = Math.floor((currentTime.getTime() - requestTime.getTime()) / 1000);
  
    if (timeDifferenceInSeconds < 60) {
      return 'Just now';
    }
  
    const minute = 60;
    const hour = 3600;
    const day = 86400;
  
    if (timeDifferenceInSeconds < minute) {
      return '1 minute ago';
    } else if (timeDifferenceInSeconds < hour) {
      const minutes = Math.floor(timeDifferenceInSeconds / minute);
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (timeDifferenceInSeconds < day) {
      const hours = Math.floor(timeDifferenceInSeconds / hour);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else {
      const days = Math.floor(timeDifferenceInSeconds / day);
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    }
  };
  
  return (
    <div style={translateX} className='rq-list-container'>
      <div className="rq-list-header">
          <span className='icon-container' onClick={e => handleSlideAnimation(e)}>
              <TfiArrowLeft size={22} className='header-icon' />
          </span>
          <div className="main-header">
              <h3 className='title'>Friend Requests</h3>
          </div>
      </div>
      <div className="rq-list-content">
        <div className='rq-counts-container'>
          <h5>{userNoti.length} friend {userNoti.length === 1 ? "request" : "requests"}</h5>
        </div>
        <ul>
          {userNoti.map((noti) => (
            <li key={noti.sender.id + noti.sender.username}>
              <div className="user">
                <div className="user-avatar">
                  <img src={noti.sender.avatar_url || "https://static.vecteezy.com/system/resources/previews/008/442/086/non_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg"} alt="avatar user" className='user-avatar-img' />
                </div>
                <div className="user-label-timestamps">
                  <div className="user-labels">
                    <h5>{noti.sender.username}</h5>
                    <span className="latest-timestamps">{calculateTimeDifference(noti.create_at)}</span>
                  </div>
                  <div className="friend-rq-handle-container">
                    <div className="handle-container acp" onClick={() => handleAcceptRequest(noti)}>
                      <AiOutlineCheck size={22} />
                    </div>
                    <div className="handle-container rm" onClick={() => handleDenyRequest(noti)}>
                      <AiOutlineClose size={22} />
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Requests;
