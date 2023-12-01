import './HomePage.css';
import Users from '../Users/Users';
import UserInbox from '../UserInbox/UserInbox';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

type UserProp = {
  name: string;
  id: string;
  avatar: string;
  chat: string;
  time: string;
  no_id: number;
};

function HomePage() {
  const [user, setUser] = useState<UserProp>(() => {
    const selectedUser = localStorage.getItem("user");
    if (selectedUser) {
      return JSON.parse(selectedUser);
      // otherwise
    } else {
      return {
        name: "",
        id: "",
        avatar: "",
        chat: "",
        time: "",
        no_id: 0,
      };
    }
  });

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  const navigate = useNavigate();

  const handleUserClick = (selectedUser: UserProp) => {
    navigate(`/${selectedUser.id}`);
    setUser(selectedUser);
  };

  return (
    <div className="HomePage">
      <Users onUserClick={handleUserClick} selectedUser={user} />
      <UserInbox userProp={user} />
    </div>
  );
}

export default HomePage;
