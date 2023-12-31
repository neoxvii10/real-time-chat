import "../Edit/EditGroup.css";
import { useEffect, useState, CSSProperties } from "react";
import { TiTick } from "react-icons/ti";
import { IoMdTrash } from "react-icons/io";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { IoMdArrowBack } from "react-icons/io";
import { MdPeopleAlt } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import ChannelApi from "../../../Api/ChannelApi";
import Member from "./Member";
import AddMember from "./AddMember/AddMember";
import SetNickName from "./SetNickName/SetNickName";

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

type MemberType = {
  id: number;
  user: any;
  nickname: string;
  role: any;
  channel: number;
};

type ChannelInboxProps = {
  channel: UnifiedType;
  userId: number;
  handMemberBack: (event: React.MouseEvent<HTMLSpanElement>) => void;
  socket: WebSocket;
  Creator: boolean;
  memberList: MemberType[];
};

const MemberList: React.FC<ChannelInboxProps> = ({
  channel,
  handMemberBack,
  userId,
  socket,
  Creator,
  memberList,
}) => {
  const channelInfo = channel as ChannelType;

  const [members, setMembers] = useState<MemberType[]>(memberList);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleSocketMessage = (e: MessageEvent) => {
      // Parse the JSON data from the server
      const serverMessage = JSON.parse(e.data);

      // Rest of your message handling logic...
      if (
        serverMessage.action === "change_creator" ||
        serverMessage.action === "remove_member" ||
        serverMessage.action === "add_member" ||
        serverMessage.action === "set_nickname"
      ) {
        setTimeout(async () => {
          const response = await ChannelApi.getAllMembersChannel(
            channelInfo.id
          ); // Replace with your API endpoint
          setMembers(response.data);
        }, 100);
      }
    };

    // Add event listener when component mounts
    socket.addEventListener("message", handleSocketMessage);

    // Remove event listener when component unmounts
    return () => {
      socket.removeEventListener("message", handleSocketMessage);
    };
  }, [socket]);

  const fetchMember = async () => {
    try {
      const response = await ChannelApi.getAllMembersChannel(channelInfo.id); // Replace with your API endpoint
      setMembers(response.data);
    } catch (error) {
      console.error(error);
      // Handle errors appropriately
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMember();
  }, [channel.id]);

  const [hideBtnSubmit, setHideBtnSubmit] = useState<CSSProperties>({
    visibility: "visible",
    bottom: "1rem",
  });

  const [translateXForAddMember, setTranslateXForAddMember] =
    useState<CSSProperties>({
      visibility: "hidden",
      opacity: 0,
      transform: "translateX(480px)",
    });

  const handleSlideAnimationAddMember = (event: React.MouseEvent<Element>) => {
    setTranslateXForAddMember({
      ...translateXForAddMember,
      visibility: "visible",
      opacity: 1,
      transform: "translateX(0px)",
    });
  };

  // set nick name
  const [memberId, setMemberId] = useState(-1);

  const handleSlideAnimation = (event: React.MouseEvent<Element>) => {
    setTranslateXForNickName({
      ...translateXForNickName,
      visibility: "visible",
      opacity: 1,
      transform: "translateX(0px)",
    });
  };

  const [translateXForNickName, setTranslateXForNickName] =
    useState<CSSProperties>({
      visibility: "hidden",
      opacity: 0,
      transform: "translateX(480px)",
    });

  return (
    <>
      <AddMember
        socket={socket}
        translateX={translateXForAddMember}
        setTranslateX={setTranslateXForAddMember}
        channelId={channel.id}
      />
      <SetNickName
        socket={socket}
        translateX={translateXForNickName}
        setTranslateX={setTranslateXForNickName}
        channelId={channel.id}
        memberId={memberId}
      />

      <div>
        <div className="rightcolumn-header">
          <span className="btn-edit" onClick={handMemberBack}>
            <IoMdArrowBack size={24} className="util-icon" />
          </span>
          <h3>Member</h3>
        </div>
        <div style={{ height: "4rem" }}></div>
        <div>
          {members.map((member) => (
            <Member
              channel={member.channel}
              id={member.id}
              nickname={member.nickname}
              role={member.role}
              user={member.user}
              isUserAdmin
              socket={socket}
              userId={userId}
              setMemberId={setMemberId}
              handleSlideAnimation={handleSlideAnimation}
            />
          ))}
        </div>
        <button
          style={hideBtnSubmit}
          className="btn-submit-edit"
          onClick={handleSlideAnimationAddMember}
        >
          <FaPlus size={24} />
        </button>
      </div>
    </>
  );
};

export default MemberList;
