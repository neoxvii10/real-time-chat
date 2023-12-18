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

type ChannelType = {
  id: number,
  member_count: number,
  last_message?: any,
  title: string,
  avatar_url?: string,
  create_at: string
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


  const [channel, setChannel] = useState<ChannelType>({
    id: 4,
    member_count: 2,
    title: "none",
    create_at: "1/1/2000"
  })

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  const navigate = useNavigate();

  const handleChannelClick = (selectedChannel: ChannelType) => {
    setChannel(selectedChannel)
    navigate(`/${selectedChannel?.title}`);
    // setUser(selectedChannel);
  };

  return (
    <div className="HomePage">
      <Users onChannelClick={handleChannelClick} selectedChannel={channel} />
      <UserInbox channel={channel} />
    </div>
  );
}

export default HomePage;
