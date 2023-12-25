import './HomePage.css';
import Users from '../Users/Users';
import UserInbox from '../UserInbox/UserInbox';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// use api
type UserType = {
  id: number,
  username: string,
  avatar_url: any,
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

type UnifiedType = UserType | ChannelType;

function HomePage() {
  const [user, setUser] = useState<UserType>({
    first_name: "thuan",
    last_name: "le",
    username: "leminhthuan",
    id: 1,
    avatar_url: null,
    fullname: "thuan le"
  });

  const [channel, setChannel] = useState<ChannelType>({
    id: 4,
    member_count: 2,
    title: "none",
    create_at: "1/1/2000"
  })

  const [medium, setMedium] = useState<UnifiedType>();

  const navigate = useNavigate();

  const handleChannelClick = (selectedChannel: UnifiedType) => {
    if ('title' in selectedChannel) {
      // It's a ChannelType
      setChannel(selectedChannel);
      navigate(`/${selectedChannel.title}`);
    } else {
      // It's a UserType
      // Handle the UserType logic if needed
      setUser(selectedChannel);
      navigate(`/${selectedChannel.fullname}`);
    }
    setMedium(selectedChannel);
  };

  const isUserType = medium && medium.hasOwnProperty('username');
  console.log(medium);
  console.log(isUserType);

  return (
    <div className="HomePage">
      <Users onChannelClick={handleChannelClick} selectedChannel={medium} />
      { isUserType ? <UserInbox channel={user} /> : <UserInbox channel={channel} /> }
      
    </div>
  );
}

export default HomePage;
