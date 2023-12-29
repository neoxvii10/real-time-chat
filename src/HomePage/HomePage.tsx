import "./HomePage.css";
import Users from "../Users/Users";
import UserInbox from "../UserInbox/UserInbox";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axiosClient from "../Api/AxiosClient";
import { v4 as uuidv4 } from "uuid";

// use api
type UserType = {
  id: number;
  username: string;
  avatar_url: any;
  first_name: string;
  last_name: string;
  fullname: string;
};

type ChannelType = {
  id: number;
  member_count: number;
  last_message?: any;
  title: string;
  avatar_url?: string;
  create_at: string;
};

type UnifiedType = UserType | ChannelType;

const _token = localStorage.getItem("accessToken"); // Token will be received when sign in successfully
if (_token) {
  var token = JSON.parse(_token);
  var userId = (jwtDecode(token) as any).user_id;
}

const socket = new WebSocket(`ws://112.137.129.158:5002/ws/chat/?token=${token}`);

function HomePage() {
  const [user, setUser] = useState<UserType>({
    first_name: "thuan",
    last_name: "le",
    username: "leminhthuan",
    id: 1,
    avatar_url: null,
    fullname: "thuan le",
  });

  const [channel, setChannel] = useState<ChannelType>({
    id: 4,
    member_count: 2,
    title: "none",
    create_at: "1/1/2000",
  });

  const [medium, setMedium] = useState<UnifiedType>();

  const navigate = useNavigate();

  const handleChannelClick = (selectedChannel: UnifiedType) => {
    if ("title" in selectedChannel) {
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

  const isUserType = medium && medium.hasOwnProperty("username");

  return (
    <div className="HomePage">
      <Users
        onChannelClick={handleChannelClick}
        selectedChannel={medium}
        userId={userId}
        socket={socket}
      />
      {isUserType ? (
        <UserInbox channel={user} userId={userId} socket={socket} />
      ) : (
        <UserInbox channel={channel} userId={userId} socket={socket} />
      )}
    </div>
  );
}

export default HomePage;
