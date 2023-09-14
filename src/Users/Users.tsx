import { useState, useRef } from 'react';
import './Users.css';
import { FiMenu } from 'react-icons/fi'
import { GoSearch, GoX } from 'react-icons/go' 
import { BsCloudCheck, BsPerson } from 'react-icons/bs'
import { LuSettings } from 'react-icons/lu'
import { WiMoonAltThirdQuarter } from 'react-icons/wi'
import { TfiArrowLeft } from 'react-icons/tfi'
import DarkMode from './DarkMode/DarkMode';

type userProp = {
  name: string,
  id: string,
  avatar: string,
  chat: string,
  time: string,
  no_id: number,
}

type UsersProps = {
  onUserClick: (selectedUsername: userProp) => void;
};

const Users: React.FC<UsersProps> = ({ onUserClick }) => {
  const users = [
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
     }
  ];

  const [isClick, setIsClick] = useState<boolean>(false);
  const [isMenuRotated, setMenuRotated] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');

  const inputRef = useRef<HTMLInputElement>(null);

  // Handle styles for search bar when clicked and Menu-Back Icon
  const handleOnClick = (event: React.MouseEvent<Element, MouseEvent>) => {
    const target = event.target as HTMLDivElement;
    if (target.classList.contains('back-icon')) {
      setIsClick(false);
      setMenuRotated(prevState => !prevState);
    } else if (isClick && inputRef.current?.value === '') {
      setIsClick(false);
      setMenuRotated(prevState => !prevState);
    } else if (!isClick) {
      setIsClick(true);
      setMenuRotated(prevState => !prevState);
    }
  };

  // Handle input in search bar
  const handleClearInput = () => {
    setInputValue('');
  };
  
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };
  
  // handle menu dropdown
  const [isMenuVisible, setMenuVisible] = useState(false);

  const handleMenuClick = () => {
    setMenuVisible(!isMenuVisible);
  };
  
  return (
    <div className="users-container">
      <div className="navigation-users-container">
        <span className="menu-icon-container">
          {isClick ?
          <TfiArrowLeft size={22}
          className={`back-icon ${isMenuRotated ? 'rotated-cw' : 'rotated-ccw'}`}
          onClick={(e) => handleOnClick(e)}
          />
          :
          <FiMenu
            size={22}
            className={`menu-icon ${isMenuRotated ? 'rotated-cw' : 'rotated-ccw'}`}
            onClick={handleMenuClick}
          />
          }
          <div className="menu-container" style={{
            visibility: isMenuVisible ? 'visible' : 'hidden',
            opacity: isMenuVisible ? 1 : 0,
          }}
          onMouseLeave={() => setMenuVisible(false)}
          >
            <ul>
              <li>
                <span className='dropdown-icon'><BsCloudCheck size={22}/></span>
                <span className='dropdown-label'>My Cloud</span>
              </li>
              <li>
                <span className='dropdown-icon'><BsPerson size={22}/></span>
                <span className='dropdown-label'>Contacts</span>
              </li>
              <li>
                <span className='dropdown-icon'><WiMoonAltThirdQuarter size={22}/></span>
                <div className="dropdown-label-container">
                  <span className='dropdown-label'>Dark Mode</span>
                  <DarkMode />
                </div>
              </li>
              <li>
                <span className='dropdown-icon'><LuSettings size={22}/></span>
                <span className='dropdown-label'>Settings</span>
              </li>
            </ul>
          </div>
        </span>
        <div className={`search-container ${isClick ? 'active' : ''}`}
        onClick={handleOnClick}
        >
          <div className='search-bar'>
          <span className="search-icon-container">
            <GoSearch size={22} className={`search-icon ${isClick ? 'active' : ''}`}/>
          </span>
          <form action="">
            <input
              ref={inputRef}
              type="text"
              placeholder='Search'
              value={inputValue}
              onChange={handleInputChange}
            />
          </form>
          </div>
          
          {inputValue && ( // Render the clear icon only if there is input value
            <span className="clear-icon-container" onClick={handleClearInput}>
              <GoX size={22} className={`clear-icon ${isClick ? 'active' : ''}`} />
            </span>
          )}
        </div>
      </div>
      <div className="chatlist-container">
        <ul>
          {users.map((user) => (
            <li tabIndex={user.no_id} key={user.no_id} onClick={() => onUserClick(user)}>
              <div className="user">
                <div className="user-avatar">
                  <span>
                    {user.avatar}
                  </span>
                </div>
                <div className="user-label-timestamps">
                  <div className="user-labels">
                    <h5>{user.name}</h5>
                    <p>{user.chat}</p>
                  </div>
                  <span className="latest-timestamps">
                    {user.time}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Users;
