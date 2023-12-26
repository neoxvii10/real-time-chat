import { useState, useRef, CSSProperties, useEffect } from 'react';
import './Users.css';
import { FiMenu } from 'react-icons/fi'
import { GoSearch, GoX } from 'react-icons/go'
import { BsCloudCheck, BsPerson, BsPeople } from 'react-icons/bs'
import { LuSettings } from 'react-icons/lu'
import { WiMoonAltThirdQuarter } from 'react-icons/wi'
import { FaArrowLeft } from 'react-icons/fa6'
import { ImProfile } from 'react-icons/im'
import DarkMode from './DarkMode/DarkMode';
import NewGroup from './NewGroup/NewGroup';
import Profile from './Profile/Profile';
import { IoPersonAddOutline } from "react-icons/io5";

import UserApi from '../Api/UserApi';
import ChannelApi from '../Api/ChannelApi';
import ChangeEmail from './Profile/ChangeEmail/ChangeEmail';
import SearchUserApi from '../Api/SearchUserApi'

type UsersTypes = {
  onChannelClick: (selectedChannel: UnifiedType) => void;
  selectedChannel?: UnifiedType;
};

type UserType = {
  id: number,
  username: string,
  avatar_url: any,
  first_name: string,
  last_name: string,
  fullname: string,
  isFriend?: boolean
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

const Users: React.FC<UsersTypes> = ({ onChannelClick, selectedChannel }) => {
  const users: UserType[] = [
    {
        first_name: "thuan",
        last_name: "le",
        username: "leminhthuan",
        id: 1,
        avatar_url: null,
        fullname: "thuan le"
    },
    {
        first_name: "ủa",
        last_name: "alo",
        username: "username3",
        id: 3,
        avatar_url: null,
        fullname: "ủa alo"
    },
    {
        first_name: "Thuận",
        last_name: "Lê",
        username: "thuanlee",
        id: 5,
        avatar_url: null,
        fullname: "Thuận Lê"
    },
    {
        first_name: "Schat",
        last_name: "",
        username: "schat0",
        id: 7,
        avatar_url: "https://lh3.googleusercontent.com/a/ACg8ocKKkadbcfcroZVRkvBtLY_lJIy8o0bv8f_3PyhtHOx-yw=s96-c",
        fullname: "Schat "
    },
    {
        first_name: "Thuận",
        last_name: "Lê",
        username: "lethuan",
        id: 9,
        avatar_url: "https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=1725690177925763&width=640&ext=1700456098&hash=AeQS2DpJamIdVqwkDF",
        fullname: "Thuận Lê"
    },
    {
        first_name: "Trieu Thanh",
        last_name: "Tung",
        username: "thanhtung",
        id: 15,
        avatar_url: "https://s3.ap-east-1.amazonaws.com/bucket.thuanlee215/upload/user/15_thanhtung/avatar/de35248e-bf53-49c8-948f-f81db4ab5cab",
        fullname: "Trieu Thanh Tung"
    },
    {
        first_name: "Hieu",
        last_name: "Nguyen",
        username: "nguyenhieu",
        id: 22,
        avatar_url: "https://www.google.com/search?q=anonymous+avatar&sca_esv=582289591&tbm=isch&source=lnms&sa=X&ved=2ahUKEwj62uWn6MOCAxWT1TQHHSlpAR4Q_AUoAXoECAEQAw&biw=2191&bih=1114&dpr=1.17#imgrc=34bQconw0W1WaM",
        fullname: "Hieu Nguyen"
    },
    {
        first_name: "Viet",
        last_name: "Tran",
        username: "cucululu",
        id: 37,
        avatar_url: "https://s3.ap-east-1.amazonaws.com/bucket.thuanlee215/upload/user/37_cucululu/avatar/dc5f4128-e29e-4c57-a563-7ac0d5dab3fd",
        fullname: "Viet Tran"
    },
    {
        first_name: "",
        last_name: "",
        username: "admin",
        id: 38,
        avatar_url: "a",
        fullname: " "
    }
];
  // handle list friends
  const [listFriends, setListFriends] = useState<UserType[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserType[]>([]);

  //api to get user list that would replace the users const rn
  const [searchUserList, setSearchUserList] = useState<UserType[]>([]);
  const [searchChannelList, setSearchChannelList] = useState<ChannelType[]>([]);
  const [channelList, setChannelList] = useState<ChannelType[]>([]);

  const [isSearchVisible, setSearchVisible] = useState<boolean>(false);

  const handleSearchClick = () => {
    setSearchVisible(true);
  };

  const handleSearchClose = () => {
    setSearchVisible(false);
    setInputValue('');
    setFilteredUsers([]);
    setSearchChannelList([]);
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const listFriendRes = await UserApi.getFriends();
        const channelListRes = await ChannelApi.getChannelList();
        const searchUserListRes = await SearchUserApi.getSearchResults();
        setListFriends(listFriendRes?.data || []);
        setChannelList(channelListRes?.data);
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

  const [isClick, setIsClick] = useState<boolean>(false);
  const [isMenuRotated, setMenuRotated] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');

  const inputRef = useRef<HTMLInputElement>(null);

  const handleOnClick = (event: React.MouseEvent<Element, MouseEvent>) => {
    if (!isSearchVisible) {
      handleSearchClick();
    } else {
      handleSearchClose();
    }
    const target = event.target as HTMLDivElement;
    if (target.classList.contains('back-icon')) {
      setIsClick(false);
      setMenuRotated((prevState) => !prevState);
      setFilteredUsers([]);
      setSearchChannelList([]);
      // Restore the default chatlist when the input is cleared
    } else if (isClick && inputRef.current?.value === '') {
      setFilteredUsers(users);
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
  };
  
  const filterUsers = (searchText: string) => {
    if (searchText.trim() === '') {
      // If the search input is empty, show all users
      setFilteredUsers([]);
      setSearchChannelList([]);
    } else {
      // Filter the users whose name or chat contains the search text
      const filtered = users.filter((user) =>
        user.fullname.toLowerCase().includes(searchText.toLowerCase())
      );

      // Compare with friends list and add 'isFriend' property to each user
      const filteredWithFriendStatus = filtered.map((user) => ({
        ...user,
        isFriend: listFriends.some((friend) => friend.id === user.id),
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

  return (
    <div className="users-container">
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
              <li>
                <span className='dropdown-icon'><BsPerson size={22} /></span>
                <span className='dropdown-label'>Contacts</span>
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
      {isSearchVisible ? 
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
                    {!user.isFriend && <IoPersonAddOutline size={20} />}
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
      </div> : 
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

      <Profile translateX={translateXforProfile} setTranslateX={setTranslateXforProfile} />
     </div>
  );
}

export default Users;
