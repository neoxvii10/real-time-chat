import "../Edit/EditGroup.css";
import { useEffect, useState } from "react";
import { TiTick } from "react-icons/ti";
import { IoMdTrash } from "react-icons/io";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { IoMdArrowBack } from "react-icons/io";
import { MdPeopleAlt } from "react-icons/md";

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

type ChannelInboxProps = {
  channel: UnifiedType;
  userId: number;
  handMemberBack: (event: React.MouseEvent<HTMLSpanElement>) => void;
};

const MemberList: React.FC<ChannelInboxProps> = ({
  channel,
  handMemberBack,
  userId,
}) => {
  const channelInfo = channel as ChannelType;
  const [existAvt, setExitAvt] = useState<boolean>(true);
  const [ChangingForm, setChangingForm] = useState<boolean>(false);

  const [inputValues, setInputValues] = useState<{ [x: string]: string }>({
    groupName: channelInfo.title,
    description: "",
  });

  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    setInputValues((prevState) => ({ ...prevState, [name]: value }));
    setChangingForm(true);
  };
  return (
    <div className="group-edit-slide">
      <div className="rightcolumn-header">
        <span className="btn-edit" onClick={handMemberBack}>
          <IoMdArrowBack size={24} className="util-icon" />
        </span>
        <h3>Member</h3>
      </div>
    </div>
  );
};

export default MemberList;
