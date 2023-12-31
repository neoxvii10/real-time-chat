import React, { useState, CSSProperties, useEffect } from "react";
import "./Member.css";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FiTrash } from "react-icons/fi";
import { PiPencilSimpleLineBold } from "react-icons/pi";
import { FaKey } from "react-icons/fa6";
import { FaCrown } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa";
import { eventManager } from "react-toastify/dist/core";
import AddMember from "./AddMember/AddMember";
import { IoExitOutline } from "react-icons/io5";

type MemberType = {
  id: number;
  user: any;
  nickname: string;
  role: any;
  channel: number;
  isUserAdmin: boolean;
  socket: WebSocket;
  userId: number;
  setMemberId: React.Dispatch<React.SetStateAction<number>>;
  handleSlideAnimation: (event: React.MouseEvent<Element>) => void;
};

const Member: React.FC<MemberType> = ({
  id,
  user,
  nickname,
  role,
  channel,
  isUserAdmin,
  socket,
  userId,
  setMemberId,
  handleSlideAnimation,
}) => {
  // handle utils dropdown
  const [isUtilsVisible, setUtilsVisible] = useState(false);

  const isAdmin = role === "CREATOR" ? true : false;

  const userMember = role === "MEMBER" ? true : false;

  const [isCurrentUser, setCurrentUser] = useState<boolean>(false);
  useEffect(() => {
    setCurrentUser(userId === user.id && !isAdmin);
  }, [user]);

  const handleUtilsClick = () => {
    setUtilsVisible(!isUtilsVisible);
  };

  function isOpen(WebSocket: { readyState: any; OPEN: any }) {
    return WebSocket.readyState === WebSocket.OPEN;
  }

  const handleVisibleInputNickName = (
    e: React.MouseEvent<HTMLLIElement, MouseEvent>
  ) => {
    setMemberId(id);
    handleSlideAnimation(e);
  };

  //
  const handleSetAdmin = async (
    e: React.MouseEvent<HTMLLIElement, MouseEvent>
  ) => {
    e.preventDefault();
    try {
      const formAdmin = {
        action: "change_creator",
        target: "channel",
        targetId: channel,
        data: {
          memberId: id,
        },
      };
      const changeAdmin = JSON.stringify(formAdmin);
      if (!isOpen(socket)) {
        console.log("WebSocket connection is not open");
        return;
      }
      await socket.send(changeAdmin);
      alert("Change admin successfully");
    } catch (error) {
      console.log(error);
      alert("Change admin FAIL");
    }
  };

  const handleRemoveMember = async (
    e: React.MouseEvent<HTMLLIElement, MouseEvent>
  ) => {
    e.preventDefault();
    try {
      const formRemove = {
        action: "remove_member",
        target: "channel",
        targetId: channel,
        data: {
          memberId: id,
        },
      };
      const removeMember = JSON.stringify(formRemove);
      if (!isOpen(socket)) {
        console.log("WebSocket connection is not open");
        return;
      }
      await socket.send(removeMember);
      alert("Remove member successfully");
    } catch (error) {
      console.log(error);
      alert("Remove member FAIL");
    }
  };

  // leave group
  const handleLeaveGroup = async (
    e: React.MouseEvent<HTMLLIElement, MouseEvent>
  ) => {
    e.preventDefault();

    try {
      const formLeave = {
        action: "out_channel",
        target: "channel",
        targetId: channel,
        data: {
          memberId: id,
        },
      };
      const leaveData = JSON.stringify(formLeave);
      if (!isOpen(socket)) {
        console.log("WebSocket connection is not open");
        return;
      }
      await socket.send(leaveData);
      alert("Leave group successfully");
    } catch (error) {
      console.log(error);
      alert("Leave group FAIL");
    }
  };

  return (
    <div style={{ display: "flex", padding: "1rem" }}>
      <span className="group-member-container">
        <img src={user.avatar_url}></img>
      </span>
      <span style={{ margin: "0 0 0 1rem" }}>
        {isAdmin ? (
          <>
            <span style={{ margin: "0.3rem 0 0 0" }}>{user.fullname}</span>
            <span style={{ margin: "0 0 0 0.2rem", color: "yellow" }}>
              <FaCrown size={10} />
            </span>
          </>
        ) : (
          <p style={{ margin: "0.3rem 0 0 0" }}>{user.fullname}</p>
        )}

        {nickname ? (
          <>
            <p style={{ margin: "0.2rem 0 0 0" }} id="member-nickname">
              {nickname}
            </p>
          </>
        ) : (
          <p
            style={{
              margin: "0.2rem 0 0 0 ",
              fontSize: "0.6rem",
              color: "white",
            }}
            id="member-nickname"
          >
            Set nickname
          </p>
        )}
      </span>

      <span id="member-threeDot">
        <span className="util-icon-container">
          <BsThreeDotsVertical
            size={22}
            className="util-icon"
            onClick={handleUtilsClick}
          />
          <div
            className="util-container"
            style={{
              visibility: isUtilsVisible ? "visible" : "hidden",
              opacity: isUtilsVisible ? 1 : 0,
            }}
            onMouseLeave={() => setUtilsVisible(false)}
          >
            <ul className="util-dropdown-item-container">
              {!isAdmin && (
                <li className="util-dropdown-item" onClick={handleSetAdmin}>
                  <span className="dropdown-icon">
                    <FaKey size={22} />
                  </span>
                  <span className="dropdown-label">Set as admin</span>
                </li>
              )}

              <li
                className="util-dropdown-item"
                onClick={handleVisibleInputNickName}
              >
                <span className="dropdown-icon">
                  <PiPencilSimpleLineBold size={22} />
                </span>
                <span className="dropdown-label">Set nickname</span>
              </li>
              {!isAdmin && (
                <li className="util-dropdown-item" onClick={handleRemoveMember}>
                  <span className="dropdown-icon alert">
                    <FiTrash size={22} />
                  </span>
                  <span className="dropdown-label alert">
                    Remove from group
                  </span>
                </li>
              )}
              {isCurrentUser && (
                <li className="util-dropdown-item" onClick={handleLeaveGroup}>
                  <span className="dropdown-icon alert">
                    <IoExitOutline size={22} />
                  </span>
                  <span className="dropdown-label alert">Leave group</span>
                </li>
              )}
            </ul>
          </div>
        </span>
      </span>
    </div>
  );
};

export default Member;
