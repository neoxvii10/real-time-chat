import './HomePage.css';
import Users from '../Users/Users';
import UserInbox from '../UserInbox/UserInbox';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

type UserProp = {
  name: string;
  id: string;
  avatar: string;
  chat: string;
  time: string;
  no_id: number;
};

function HomePage() {
  const [user, setUser] = useState<UserProp>({
    name: "",
    id: "",
    avatar: "",
    chat: "",
    time: "",
    no_id: 0,
  });

  const navigate = useNavigate();

  const handleUserClick = (selectedUser: UserProp) => {
    navigate(`/${selectedUser.id}`);
    setUser(selectedUser);
  };

  return (
    <div className="HomePage">
      <Users onUserClick={handleUserClick} />
      <UserInbox userProp={user} />
    </div>
  );
}

export default HomePage;
