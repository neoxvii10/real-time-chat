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

import UserApi from '../Api/UserApi';

type UserProp = {
  name: string;
  id: string;
  avatar: string;
  chat: string;
  time: string;
  no_id: number;
};

type UsersProps = {
  onUserClick: (selectedUsername: UserType) => void;
  selectedUser: UserType;
};

type UserType = {
  id: number,
  username: string,
  avatar_url: string,
  first_name: string,
  last_name: string,
  fullname: string
}

const Users: React.FC<UsersProps> = ({ onUserClick, selectedUser }) => {
  const users: UserProp[] = [
    {
      name: "Lê Minh Thuận",
      id: "#@thuanle409",
      avatar: "LT",
      chat: "Đc thế nhờ",
      time: "Sep 14",
      no_id: 1,
     },
     {
      name: "Phạm Tùng Thủy",
      id: "#@thuypham412",
      avatar: "PT",
      chat: "Đc thế nhờ",
      time: "Sep 13",
      no_id: 2,
     },
     {
      name: "Đinh Đức Thuận",
      id: "#@thuandinh795",
      avatar: "DT",
      chat: "Đc thế nhờ",
      time: "Sep 7",
      no_id: 3,
     },
     {
      name: "Nguyễn Trung Hiếu",
      id: "#@hieunguyen318",
      avatar: "NH",
      chat: "Đc thế nhờ",
      time: "Sep 8",
      no_id: 4,
     },
     {
      name: "Triệu Thanh Tùng",
      id: "#@tungtrieu799",
      avatar: "TT",
      chat: "Đc thế nhờ",
      time: "Sep 12",
      no_id: 5,
     },
     {
      name: "Trần Tất Việt",
      id: "#@viettt132",
      avatar: "TV",
      chat: "Đc thế nhờ",
      time: "Sep 11",
      no_id: 6,
     },
     {
      name: "Sample Group",
      id: "#@sg",
      avatar: "SG",
      chat: "Đc thế nhờ",
      time: "Sep 11",
      no_id: 7,
     },
  ];

  // handle list friends
  const [listFriends, setListFriends] = useState<UserType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await UserApi.getFriends();
        setListFriends(response?.data)
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
    console.log(listFriends);
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
    const target = event.target as HTMLDivElement;
    if (target.classList.contains('back-icon')) {
      setIsClick(false);
      setMenuRotated((prevState) => !prevState);
      // Restore the default chatlist when the input is cleared
      setFilteredUsers(users);
    } else if (isClick && inputRef.current?.value === '') {
      setIsClick(false);
      setMenuRotated((prevState) => !prevState);
      // Restore the default chatlist when the input is cleared
      setFilteredUsers(users);
    } else if (!isClick) {
      setIsClick(true);
      setMenuRotated((prevState) => !prevState);
    }
  };

  const handleClearInput = () => {
    setInputValue('');
    // Restore the default chatlist when the input is cleared
    setFilteredUsers(users);
  };

  const [filteredUsers, setFilteredUsers] = useState<UserProp[]>(users);

  const filterUsers = (searchText: string) => {
    if (searchText.trim() === '') {
      // If the search input is empty, show all users
      setFilteredUsers(users);
    } else {
      // Filter the users whose name or chat contains the search text
      const filtered = users.filter((user) =>
        user.name.toLowerCase().includes(searchText.toLowerCase()) ||
        user.chat.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredUsers(filtered);
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
                <span className='dropdown-icon'><BsCloudCheck size={22} /></span>
                <span className='dropdown-label'>My Cloud</span>
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
                <span className='dropdown-icon'><BsPeople size={22}/></span>
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
      <div className="chatlist-container">
        <ul>
          {listFriends.map((user) => (
            <li tabIndex={user?.id} key={user?.id} onClick={() => onUserClick(user)} 
            className={(selectedUser === user) ? 'user-selected' : ''}>
              <div className="user">
                <div className="user-avatar">
                  <img src={user.avatar_url || "https://static.vecteezy.com/system/resources/previews/008/442/086/non_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg"} alt="avatar user" className='user-avatar-img'/>
                </div>
                <div className="user-label-timestamps">
                  <div className="user-labels">
                    <h5>{user.fullname}</h5>
                    <p>Unknown</p>
                  </div>
                  <span className="latest-timestamps">Unknown</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <Profile translateX={translateXforProfile} setTranslateX={setTranslateXforProfile} />

     </div>
  );
}

export default Users;
