import React, { useState } from "react";
import "./Member.css";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FiTrash } from "react-icons/fi";
import { PiPencilSimpleLineBold } from "react-icons/pi";
import { FaKey } from "react-icons/fa6";

type MemberType = {
  id: number;
  user: any;
  nickname: string;
  role: any;
  channel: number;
};

const Member: React.FC<MemberType> = ({
  id,
  user,
  nickname,
  role,
  channel,
}) => {
  // handle utils dropdown
  const [isUtilsVisible, setUtilsVisible] = useState(false);

  const isAdmin = role === "CREATOR" ? true : false;

  const handleUtilsClick = () => {
    setUtilsVisible(!isUtilsVisible);
  };
  return (
    <div style={{ display: "flex", padding: "1rem" }}>
      <span className="group-member-container">
        <img src={user.avatar_url}></img>
      </span>
      <span style={{ margin: "0 0 0 1rem" }}>
        <p style={{ margin: "0.3rem 0 0 0" }}>{user.fullname}</p>
        <p style={{ margin: "0.2rem 0 0 0 " }} id="member-nickname">
          {nickname ? nickname : "Set nickname"}
        </p>
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
                <li className="util-dropdown-item">
                  <span className="dropdown-icon">
                    <FaKey size={22} />
                  </span>
                  <span className="dropdown-label">Set as admin</span>
                </li>
              )}

              <li className="util-dropdown-item">
                <span className="dropdown-icon">
                  <PiPencilSimpleLineBold size={22} />
                </span>
                <span className="dropdown-label">Set nickname</span>
              </li>
              {!isAdmin && (
                <li className="util-dropdown-item">
                  <span className="dropdown-icon alert">
                    <FiTrash size={22} />
                  </span>
                  <span className="dropdown-label alert">
                    Remove from group
                  </span>
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
