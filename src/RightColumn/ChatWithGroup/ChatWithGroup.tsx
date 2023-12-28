import React, { CSSProperties, useState } from "react";
import { MdOutlineCall, MdPeopleAlt } from "react-icons/md";

import "../RightColumn.css";
import MediaState from "../Common/RenderMedia/MediaState";

type ChannelType = {
  id: number;
  member_count: number;
  last_message?: any;
  title: string;
  avatar_url?: string;
  create_at: string;
};

type ChannelInboxProps = {
  channel: ChannelType;
};

const ChatWithGroup: React.FC<ChannelInboxProps> = ({ channel }) => {
  const [MemberList, setMemberList] = useState<boolean>(true);
  const [isSlided, setSlided] = useState<boolean>(true); //slide edit status
  const [translateX, setTranslateX] = useState<CSSProperties>({
    visibility: "hidden",
    transform: "translateX(480px)",
  });

  const handleShowAllMembers = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.preventDefault();
    setMemberList(!MemberList);
    setSlided(!isSlided);
    setTranslateX((translateX) => ({
      ...translateX,
      visibility: isSlided ? "visible" : "hidden",
      transform: isSlided ? "translateX(0px)" : "translateX(600px)",
    }));
  };
  const [mediaClicked, setMediaClick] = useState<string>("");
  const handleClickOnMedia = (
    event: React.MouseEvent<HTMLParagraphElement>
  ) => {
    setMediaClick(event.currentTarget.innerHTML);
  };

  const [isAdminRoll, setAdminRoll] = useState<boolean>(true);

  const handleOnWheel = () => {};

  return (
    <div className="RightColumn-container">
      <div>
        <div className="wrapper" onWheel={handleOnWheel}>
          <div className="rightcolumn-body">
            <div className="status1-container">
              <div className="avatar-wrapper">
                <p className="name">Name</p>
                <div className="avatar-container">
                  <p className="avatar">Avatar</p>
                </div>
              </div>
              <div className="phone-container">
                <div className="layout-btn" onClick={handleShowAllMembers}>
                  <MdPeopleAlt size={24} className="util-icon" />
                  <p>Member</p>
                </div>
              </div>
            </div>
          </div>

          <MediaState />
        </div>
      </div>
    </div>
  );
};
export default ChatWithGroup;
