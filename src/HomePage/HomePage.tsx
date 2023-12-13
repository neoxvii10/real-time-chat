import './HomePage.css';
import Users from '../Users/Users';
import UserInbox from '../UserInbox/UserInbox';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// use api
type UserType = {
  id: number,
  username: string,
  avatar_url: string,
  first_name: string,
  last_name: string,
  fullname: string
}

function HomePage() {
  const [user, setUser] = useState<UserType>(() => {
    const selectedUser = localStorage.getItem("user");
    if (selectedUser) {
      return JSON.parse(selectedUser);
      // otherwise
    } else {
      return {
        id: 0,
        username: '',
        avatar_url: '',
        first_name: '',
        last_name: '',
        fullname: ''
      };
    }
  });

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  const navigate = useNavigate();

  const handleUserClick = (selectedUser: UserType) => {
    navigate(`/${selectedUser?.id}`);
    setUser(selectedUser);
  };

  return (
    <div className="HomePage">
      <Users onUserClick={handleUserClick} selectedUser = {user}/>
      <UserInbox userProp={user} />
    </div>
  );
}

export default HomePage;
