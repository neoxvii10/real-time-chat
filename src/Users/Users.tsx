import { useState, useRef, CSSProperties, useEffect } from 'react';
import './Users.css';
import { FiMenu } from 'react-icons/fi'
import { GoSearch, GoX } from 'react-icons/go'
import { BsPerson, BsPeople } from 'react-icons/bs'
import { LuSettings } from 'react-icons/lu'
import { WiMoonAltThirdQuarter } from 'react-icons/wi'
import { FaArrowLeft } from 'react-icons/fa6'
import { ImProfile } from 'react-icons/im'
import DarkMode from './DarkMode/DarkMode';
import NewGroup from './NewGroup/NewGroup';
import Profile from './Profile/Profile';
import { IoPersonAddOutline, IoPersonRemoveOutline } from "react-icons/io5";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import UserApi from '../Api/UserApi';
import ChannelApi from '../Api/ChannelApi';
import SearchUserApi from '../Api/SearchUserApi';
import UserNotiApi from '../Api/UserNotiApi';

type UsersTypes = {
  onChannelClick: (selectedChannel: UnifiedType) => void;
  selectedChannel?: UnifiedType;
  userId: number;
  socket: WebSocket;
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

type NotiType = {
  sender: UserType;
  notification_type: string;
  create_at: string;
}

type UnifiedType = UserType | ChannelType;

export enum ScreenTypes {
  HomeScreen = 'homeScreen',
  SearchScreen = 'searchScreen',
  RequestScreen = 'requestScreen'
}

const Users: React.FC<UsersTypes> = ({ onChannelClick, selectedChannel, userId, socket }) => {
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

  function isOpen(WebSocket: { readyState: any; OPEN: any; }) { return WebSocket.readyState === WebSocket.OPEN }

  // handle list friends
  const [listFriends, setListFriends] = useState<UserType[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserType[]>([]);

  //api to get user list that would replace the users const rn
  const [searchUserList, setSearchUserList] = useState<UserType[]>([]);
  const [searchChannelList, setSearchChannelList] = useState<ChannelType[]>([]);
  const [channelList, setChannelList] = useState<ChannelType[]>([]);

  const [currentScreen, setCurrentScreen] = useState(ScreenTypes.HomeScreen);

  const [userNoti, setUserNoti] = useState<NotiType[]>([]);

  const handleSearchClick = () => {
    setCurrentScreen(ScreenTypes.SearchScreen);
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const listFriendRes = await UserApi.getFriends();
        const channelListRes = await ChannelApi.getChannelList();
        const searchUserListRes = await SearchUserApi.getSearchResults();
        const userNotiRes = await UserNotiApi.getUserNotis();
        setListFriends(listFriendRes?.data || []);
        setChannelList(channelListRes?.data);
        setSearchUserList(searchUserListRes?.data.users);
        setUserNoti(userNotiRes?.data);
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

  const [isClick, setIsClick] = useState<boolean>(false);
  const [isMenuRotated, setMenuRotated] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');

  const inputRef = useRef<HTMLInputElement>(null);

  const handleOnClick = (event: React.MouseEvent<Element, MouseEvent>) => {
    if (currentScreen === ScreenTypes.SearchScreen || currentScreen === ScreenTypes.RequestScreen) {
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

  // handle receive message
  socket.addEventListener("message", function(e) {
    // Parse the JSON data from the server
    const serverMessage = JSON.parse(e.data);

    if (serverMessage.action === "friend_request") {
      console.log("A friend sended you a request.");
    }
  });

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

  const handleAccessRqPage = () => {
    setCurrentScreen(ScreenTypes.RequestScreen);
    setIsClick(true);
  }
  
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
              {/* <li>
                <span className='dropdown-icon'><BsPerson size={22} /></span>
                <span className='dropdown-label'>Contacts</span>
              </li> */}
              <li onClick={() => handleAccessRqPage()}>
                <span className='dropdown-icon'><BsPerson size={22} /></span>
                <span className='dropdown-label'>Requests</span>
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
                onClick={() => onChannelClick(user)} 
                className={(selectedChannel === user) ? 'user-selected' : ''}
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
              <li tabIndex={channel.id} key={channel.id} onClick={() => onChannelClick(channel)} 
              className={(selectedChannel === channel) ? 'user-selected' : ''}>
                <div className="user">
                  <div className="user-avatar">
                    <img src={channel.avatar_url || "https://static.vecteezy.com/system/resources/previews/008/442/086/non_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg"} alt="avatar user" className='user-avatar-img'/>
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
          {channelList.map((channel) => (
            <li tabIndex={channel.id} key={channel.id} onClick={() => onChannelClick(channel)} 
            className={(selectedChannel === channel) ? 'user-selected' : ''}>
              <div className="user">
                <div className="user-avatar">
                  <img src={channel.avatar_url || "https://static.vecteezy.com/system/resources/previews/008/442/086/non_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg"} alt="avatar user" className='user-avatar-img'/>
                </div>
                <div className="user-label-timestamps">
                  <div className="user-labels">
                    <h5>{channel.title}</h5>
                    <p>{channel.last_message.content}</p>
                  </div>
                  <span className="latest-timestamps">{channel.last_message.create_at}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      }

      {currentScreen === ScreenTypes.RequestScreen &&
      <div className='request-list-container'>
      
      </div>
      }
    
      <Profile translateX={translateXforProfile} setTranslateX={setTranslateXforProfile} />
     </div>
  );
}

export default Users;
