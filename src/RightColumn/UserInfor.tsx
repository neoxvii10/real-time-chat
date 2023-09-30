import React from "react";
import ShowInfor from "./ShowInfor";

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

const UserInfor: React.FC<UserInfoProps> = ({ userInfoProp }) => {
  return (
    <div>
      <ShowInfor userInfoProp={userInfoProp} />
    </div>
  );
};
export default UserInfor;
