import { useState, useRef, CSSProperties, useEffect } from 'react';
import './Users.css';

import { FiMenu } from 'react-icons/fi'
import { GoSearch, GoX, GoPeople } from 'react-icons/go'
import { BsPerson, BsPeople } from 'react-icons/bs'
import { LuSettings } from 'react-icons/lu'
import { WiMoonAltThirdQuarter } from 'react-icons/wi'
import { FaArrowLeft } from 'react-icons/fa6'
import { ImProfile } from 'react-icons/im'
import { IoPersonAddOutline, IoPersonRemoveOutline } from "react-icons/io5";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import UserApi from '../Api/UserApi';
import ChannelApi from '../Api/ChannelApi';
import SearchUserApi from '../Api/SearchUserApi';

import DarkMode from './DarkMode/DarkMode';
import NewGroup from './NewGroup/NewGroup';
import Profile from './Profile/Profile';
import Friends from './Friends/Friends';
import Requests from './Requests/Requests';

type UsersTypes = {
  onChannelClick: (selectedChannel: UnifiedType) => void;
  selectedChannel?: UnifiedType;
  userId: number;
  socket: WebSocket;
  channelUpdate: boolean;
  onNewMessage: () => void;
};

type UserType = {
  id: number,
  username: string,
  avatar_url: any,
  first_name: string,
  last_name: string,
  fullname: string,
  isFriend?: boolean,
  hasSentFriendRq?: boolean;
}

type ChannelType = {
  id: number,
  member_count: number,
  last_message?: any,
  title: string,
  avatar_url?: string,
  create_at: string
}

type UnifiedType = UserType | ChannelType;

export enum ScreenTypes {
  HomeScreen = 'homeScreen',
  SearchScreen = 'searchScreen',
}

const Users: React.FC<UsersTypes> = (
  { onChannelClick, selectedChannel, userId, socket, channelUpdate, onNewMessage }) => {
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

  function isOpen(WebSocket: { readyState: any; OPEN: any; }) 
  { return WebSocket.readyState === WebSocket.OPEN }

  useEffect(() => {
      const handleSocketMessage = (e: MessageEvent) => {
        // Parse the JSON data from the server
        const serverMessage = JSON.parse(e.data);
  
        // Rest of your message handling logic...
        if (serverMessage.action === "create_channel" 
        || serverMessage.action === "upload_channel_avatar"
        || serverMessage.action === "set_channel_title"
        || serverMessage.action === "remove_member"
        || serverMessage.action === "out_channel"
        || serverMessage.action === "add_member") {
          setTimeout( async () => {
            const channelListRes = await ChannelApi.getChannelList()
            setChannelList(channelListRes?.data);
          }, 200)
        }
      }
  
      // Add event listener when component mounts
      socket.addEventListener("message", handleSocketMessage);
  
      // Remove event listener when component unmounts
      return () => {
        socket.removeEventListener("message", handleSocketMessage);
      };
  }, [socket])

  
  const [channelAdd, setChannelAdd] = useState<boolean>(false);

  const handleChannelAddTrigger = () => {
    setChannelAdd(prevState => !prevState);
  }

  const [selectedChannelId, setSelectedChannelId] = useState<number | null>(null);

  //api to get user list that would replace the users const rn
  const [searchUserList, setSearchUserList] = useState<UserType[]>([]);
  const [searchChannelList, setSearchChannelList] = useState<ChannelType[]>([]);
  const [userNotiAmount, setUserNotiAmount] = useState<number>(0);

  const [currentScreen, setCurrentScreen] = useState(ScreenTypes.HomeScreen);

  const handleSearchClick = () => {
    setCurrentScreen(ScreenTypes.SearchScreen);
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (channelUpdate || channelAdd) {
          // Your channel fetching logic here
          const listFriendRes = await UserApi.getFriends();
          const channelListRes = await ChannelApi.getChannelList();
          const searchUserListRes = await SearchUserApi.getSearchResults();
          setListFriends(listFriendRes?.data || []);
          setChannelList(channelListRes?.data);
          setSearchUserList(searchUserListRes?.data.users);
          // Reset channelUpdate to false after re-fetching
          if (channelUpdate && !channelAdd) {
            onNewMessage();
          } else if (!channelUpdate && channelAdd) {
            handleChannelAddTrigger();
          } else if (channelUpdate && channelAdd) {
            onNewMessage();
            handleChannelAddTrigger();
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [channelUpdate, channelAdd])

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Your channel fetching logic here
        const searchUserListRes = await SearchUserApi.getSearchResults();
        setSearchUserList(searchUserListRes?.data.users);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [])

  //hanlde new group slides
  const [isSlided, setSlided] = useState<boolean>(false);

  const [translateX, setTranslateX] = useState<CSSProperties>({
    visibility: 'hidden',
    opacity: 0,
    transform: 'translateX(-480px)',
  });

  const handleSlideAnimation = () => {
    setSlided(!isSlided);
    setTranslateX((translateX) => ({
      ...translateX,
      visibility: isSlided ? 'hidden' : 'visible',
      opacity: isSlided ? 0 : 1,
      transform: isSlided ? 'translateX(-480px)' : 'translateX(0px)',
    }));
  };

  // handle list friends
  const [listFriends, setListFriends] = useState<UserType[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserType[]>([]);
  const [channelList, setChannelList] = useState<ChannelType[]>([]);

  // visible list requests
  const [translateXforRequests, setTranslateXforRequests] = useState<CSSProperties>({
    visibility: 'hidden',
    opacity: 0,
    transform: 'translateX(-960px)',
  });
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const listFriendRes = await UserApi.getFriends();
        setListFriends(listFriendRes?.data)
        const channelListRes = await ChannelApi.getChannelList();
        setChannelList(channelListRes?.data);
        // console.log(listFriendRes);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
    // console.log("listFriend: ", listFriends);
  }, [translateX])

  const [isClick, setIsClick] = useState<boolean>(false);
  const [isMenuRotated, setMenuRotated] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');

  const inputRef = useRef<HTMLInputElement>(null);

  const handleOnClick = (event: React.MouseEvent<Element, MouseEvent>) => {
    if (currentScreen === ScreenTypes.SearchScreen) {
      // Handle back functionality for SearchScreen and RequestScreen
      setIsClick(false);
      setMenuRotated((prevState) => !prevState);
      setInputValue('');
      setFilteredUsers([]);
      setSearchChannelList([]);
      setCurrentScreen(ScreenTypes.HomeScreen);
    } else {
      // Handle other cases, such as opening the SearchScreen
      handleSearchClick();
    }
    const target = event.target as HTMLDivElement;
    if (target.classList.contains('back-icon')) {
      setIsClick(false);
      setMenuRotated((prevState) => !prevState);
      setFilteredUsers([]);
      setSearchChannelList([]);
      // Restore the default chatlist when the input is cleared
    } else if (isClick && inputRef.current?.value === '') {
      setFilteredUsers(searchUserList);
      setSearchChannelList(channelList);
      setIsClick(false);
      setMenuRotated((prevState) => !prevState);
      // Restore the default chatlist when the input is cleared
    } else if (!isClick) {
      setIsClick(true);
      setMenuRotated((prevState) => !prevState);
    }
  };
  
  const handleClearInput = () => {
    setInputValue('');
    setIsClick(false);
    setCurrentScreen(ScreenTypes.HomeScreen);
  };
  
  const filterUsers = (searchText: string) => {
    if (searchText.trim() === '') {
      // If the search input is empty, show all users
      setFilteredUsers([]);
      setSearchChannelList([]);
    } else {
      // Filter the users whose name or chat contains the search text
      const filtered = searchUserList.filter((user) =>
        user.fullname.toLowerCase().includes(searchText.toLowerCase())
      );

      // Compare with friends list and add 'isFriend' property to each user
      const filteredWithFriendStatus = filtered.map((user) => ({
        ...user,
        isFriend: listFriends.some((friend) => friend.id === user.id),
        hasSentFriendRq: false
      }));

      setFilteredUsers(filteredWithFriendStatus);
      const filteredChannels = channelList.filter((channel) =>
      channel.title.toLowerCase().includes(searchText.toLowerCase())
      );
      setSearchChannelList(filteredChannels);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchText = event.target.value;
    setInputValue(searchText);
    filterUsers(searchText);
  };

  const [isMenuVisible, setMenuVisible] = useState(false);

  const handleMenuClick = () => {
    setMenuVisible(!isMenuVisible);
  };

  // handle visiable profile
  const [translateXforProfile, setTranslateXforProfile] = useState<CSSProperties>({
    visibility: 'hidden',
    opacity: 0,
    transform: 'translateX(-480px)',
  });

  const handleSlideAnimationForProfile = (event: React.MouseEvent<Element>) => {
    setTranslateXforProfile((translateXforProfile) => ({
      ...translateXforProfile,
      visibility: 'visible',
      opacity: 1,
      transform: 'translateX(0px)',
    }));
  };

  const handleSendingRequest = async (user: UserType) => {
    try {
      let friendRq = {
        action: "friend_request",
        target: "user",
        targetId: user.id
      };
  
      const friendRqJSON = JSON.stringify(friendRq);
  
      if (!isOpen(socket)) {
        console.log("WebSocket connection is not open");
        return;
      }

      if (!user.hasSentFriendRq) {
        toast.success('Request sent successfully!', {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2500,
          hideProgressBar: true,
          pauseOnHover: true,
          closeOnClick: false
        });
      } else {
        toast.success('Request unsent successfully!', {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2500,
          hideProgressBar: true,
          pauseOnHover: true,
          closeOnClick: false
        });
      }
  
      // Send friend request or cancel friend request
      socket.send(friendRqJSON);
      // Update the state based on the action
      const updatedFriends = filteredUsers.map((friend) => {
        if (friend.id === user.id) {
          // Toggle hasSentFriendRq for the specific user
          return { ...friend, hasSentFriendRq: !friend.hasSentFriendRq };
        }
        return friend;
      });
  
      setFilteredUsers(updatedFriends);

      console.log("Request has been sent!");
    } catch (error) {
      console.error("Error sending/canceling friend request:", error);
    }
  };

  // visible list friends
  const [translateXforFriends, setTranslateXforFriends] = useState<CSSProperties>({
    visibility: 'hidden',
    opacity: 0,
    transform: 'translateX(-480px)',
  });

  const handleSlideAnimationForFriends = (event: React.MouseEvent<Element>) => {
    setTranslateXforFriends((translateXforFriends) => ({
      ...translateXforFriends,
      visibility: 'visible',
      opacity: 1,
      transform: 'translateX(0px)',
    }));
  };

  const handleSlideAnimationForRequests = (event: React.MouseEvent<Element>) => {
    setTranslateXforRequests((translateXforRequests) => ({
      ...translateXforRequests,
      visibility: 'visible',
      opacity: 1,
      transform: 'translateX(0px)',
    }));
  };

  const calculateTimeDifferenceForChannel = (channel: ChannelType): string => {
    const currentTime = new Date();
    const lastMessageTime = new Date(channel.last_message?.create_at);
    const channelCreateTime = new Date(channel.create_at);
  
    // Check if the channel has any messages and the message time is valid
    if (!isNaN(lastMessageTime.getTime())) {
      const timeDifferenceInSeconds = Math.floor((currentTime.getTime() - lastMessageTime.getTime()) / 1000);
  
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
    } else {
      // Use channel creation time if there are no messages
      const channelCreateDifferenceInSeconds = Math.floor((currentTime.getTime() - channelCreateTime.getTime()) / 1000);
  
      if (channelCreateDifferenceInSeconds < 60) {
        return 'Just now';
      }
  
      const minute = 60;
      const hour = 3600;
      const day = 86400;
  
      if (channelCreateDifferenceInSeconds < minute) {
        return '1 minute ago';
      } else if (channelCreateDifferenceInSeconds < hour) {
        const minutes = Math.floor(channelCreateDifferenceInSeconds / minute);
        return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
      } else if (channelCreateDifferenceInSeconds < day) {
        const hours = Math.floor(channelCreateDifferenceInSeconds / hour);
        return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
      } else {
        const days = Math.floor(channelCreateDifferenceInSeconds / day);
        return `${days} ${days === 1 ? 'day' : 'days'} ago`;
      }
    }
  };
  
  // Sort the channelList based on the latest activity time
  const sortedChannelList = channelList.slice().sort((a, b) => {
    const timeA = new Date(a.last_message?.create_at || a.create_at).getTime();
    const timeB = new Date(b.last_message?.create_at || b.create_at).getTime();
    return timeB - timeA;
  });

  const handleChannelClick = (channel: UnifiedType) => {
    onChannelClick(channel);
    setSelectedChannelId(channel.id);
  };
  
  return (
    <div className="users-container">
      <ToastContainer />
      <NewGroup
      translateX={translateX}
      handleSlideAnimation={handleSlideAnimation}
      users={listFriends}
      />
      <div className="navigation-users-container">
        <span className="menu-icon-container">
          {isClick ? (
            <FaArrowLeft
              size={22}
              className={`back-icon ${isMenuRotated ? 'rotated-cw' : 'rotated-ccw'}`}
              onClick={(e) => handleOnClick(e)}
            />
          ) : (
            <FiMenu
              size={22}
              className={`menu-icon ${isMenuRotated ? 'rotated-cw' : 'rotated-ccw'}`}
              onClick={handleMenuClick}
            />
          )}
          <div
            className="menu-container"
            style={{
              visibility: isMenuVisible ? 'visible' : 'hidden',
              opacity: isMenuVisible ? 1 : 0,
            }}
            onMouseLeave={() => setMenuVisible(false)}
          >
            <ul>
              <li onClick={e => handleSlideAnimationForProfile(e)}>
                <span className='dropdown-icon'><ImProfile size={22} /></span>
                <span className='dropdown-label'>Profile</span>
              </li>
              <li onClick={handleSlideAnimationForRequests}>
                <span className='dropdown-icon'><BsPerson size={22} /></span>
                <span className='dropdown-label'>
                  Requests
                  <span className='noti-amount'>({userNotiAmount})</span>
                </span>
              </li>
              <li onClick={handleSlideAnimationForFriends}>
                <span className='dropdown-icon'><GoPeople size={22} /></span>
                <span className='dropdown-label'>Friends</span>
              </li>
              <li>
                <span className='dropdown-icon'><WiMoonAltThirdQuarter size={22} /></span>
                <div className="dropdown-label-container">
                  <span className='dropdown-label'>Dark Mode</span>
                  <DarkMode />
                </div>
              </li>
              <li>
                <span className='dropdown-icon'><LuSettings size={22} /></span>
                <span className='dropdown-label'>Settings</span>
              </li>
              <li onClick={handleSlideAnimation}>
                <span className='dropdown-icon'><BsPeople size={22} /></span>
                <span className='dropdown-label'>New Group</span>
              </li>
            </ul>
          </div>
        </span>
        <div className={`search-container ${isClick ? 'active' : ''}`} onClick={handleOnClick}>
          <div className="search-bar">
            <span className="search-icon-container">
              <GoSearch
                size={22}
                className={`search-icon ${isClick ? 'active' : ''}`}
              />
            </span>
            <form action="">
              <input
                ref={inputRef}
                type="text"
                placeholder="Search"
                value={inputValue}
                onChange={handleInputChange}
              />
            </form>
          </div>

          {inputValue && (
            <span className="clear-icon-container" onClick={handleClearInput}>
              <GoX size={22} className={`clear-icon ${isClick ? 'active' : ''}`} />
            </span>
          )}
        </div>
      </div>
      {currentScreen === ScreenTypes.SearchScreen &&
      <div className="search-results">
        <div className="user-list-container">
          <div className="user-list-header-container">
            <h4>Users</h4>
          </div>
          <ul>
            {filteredUsers?.map((user) => (
              <li
                key={user.id}
                onClick={() => handleChannelClick(user)} 
                className={(selectedChannelId === user.id) ? 'user-selected' : ''}
              >
                <div className="user">
                  <div className="user-avatar">
                    <img src={user.avatar_url} alt="avatar user" className="user-avatar-img" />
                  </div>
                  <div className="user-label-timestamps">
                    <div className="user-labels">
                      <h5>{user.fullname}</h5>
                    </div>
                    {!user.isFriend ? 
                      (!user.hasSentFriendRq 
                      ? 
                      <IoPersonAddOutline size={22} 
                      onClick={() => handleSendingRequest(user)}
                      />
                      :
                      <IoPersonRemoveOutline size={22} 
                      onClick={() => handleSendingRequest(user)} 
                      />
                      )
                      : 
                      <></>      
                    }
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="channel-list-container">
          <div className="channel-list-header-container">
            <h4>Channels</h4>
          </div>
          <ul>
            {searchChannelList?.map((channel) => (
                <li
                  tabIndex={channel.id}
                  key={channel.id}
                  onClick={() => handleChannelClick(channel)}
                  className={selectedChannelId === channel.id ? 'user-selected' : ''}
                >
                <div className="user">
                  <div className="user-avatar">
                    <img src={channel.avatar_url || 
                      "https://static.vecteezy.com/system/resources/previews/008/442/086/non_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg"} alt="avatar user" className='user-avatar-img'/>
                  </div>
                  <div className="user-label-timestamps">
                    <div className="user-labels">
                      <h5>{channel.title}</h5>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div> 
      }

      {currentScreen === ScreenTypes.HomeScreen &&
      <div className="chatlist-container">
        <ul>
          {sortedChannelList.map((channel) => (
              <li
                tabIndex={channel.id}
                key={channel.id}
                onClick={() => handleChannelClick(channel)}
                className={selectedChannelId === channel.id ? 'user-selected' : ''}
              >
              <div className="user">
                <div className="user-avatar">
                  <img src={channel.avatar_url || "https://static.vecteezy.com/system/resources/previews/008/442/086/non_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg"} alt="avatar user" className='user-avatar-img'/>
                </div>
                <div className="user-label-timestamps">
                  <div className="user-labels">
                    <h5>{channel.title}</h5>
                    <p>{channel.last_message.content}</p>
                  </div>
                  <span className="latest-timestamps">
                    {calculateTimeDifferenceForChannel(channel)}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      }
    
      <Profile translateX={translateXforProfile} setTranslateX={setTranslateXforProfile}/>
      <Friends translateX={translateXforFriends} setTranslateX={setTranslateXforFriends}/>
      <Requests
        translateX={translateXforRequests}
        setTranslateX={setTranslateXforRequests}
        userId={userId}
        setUserNotiAmount={setUserNotiAmount}
        socket={socket}
        onNewChannel={handleChannelAddTrigger}
      />
     </div>
  );
}

export default Users;
