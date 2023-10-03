import { MdOutlineCall } from "react-icons/md";
import "./ShowInfor.css";

type UserProp = {
  name: string;
  id: string;
  avatar: string;
  chat: string;
  time: string;
  no_id: number;
};

type UserInfoProps = {
  userInfoProp: UserProp;
};

const ShowInfor: React.FC<UserInfoProps> = ({ userInfoProp }) => {
  return (
    <div className="status1-container">
      <div className="avatar-container">
        <p className="avatar">{userInfoProp.avatar}</p>
      </div>
      <p className="name">{userInfoProp.name}</p>

      <div className="phone-container">
        <div className="layout-btn">
          <MdOutlineCall size={24} className="util-icon" />
          <p>Phone number</p>
        </div>
      </div>
    </div>
  );
};

export default ShowInfor;
