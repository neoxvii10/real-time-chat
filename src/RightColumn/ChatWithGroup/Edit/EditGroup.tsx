import "./EditGroup.css";
import { useEffect, useState, CSSProperties } from "react";
import { TiTick } from "react-icons/ti";
import { IoMdTrash } from "react-icons/io";
import Box from "@mui/material/Box";
import { TbCameraPlus } from "react-icons/tb";
import TextField from "@mui/material/TextField";
import { IoMdArrowBack } from "react-icons/io";
import { MdPeopleAlt, MdExitToApp } from "react-icons/md";
import { FaCheck } from "react-icons/fa6";
import ChannelApi from "../../../Api/ChannelApi";

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
  socket: WebSocket;
  channel: UnifiedType;
  userId: number;
  handleEdit: (event: React.MouseEvent<HTMLSpanElement>) => void;
  croppedImage: string | undefined;
  croppedBlob: Blob | undefined;
  isCropped: boolean;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  hideBtnSubmit: CSSProperties;
  handleVisibleBtn: (visible: boolean) => void;
  setIsCropped: React.Dispatch<React.SetStateAction<boolean>>;
};

const EditInforGroup: React.FC<ChannelInboxProps> = ({
  socket,
  channel,
  handleEdit,
  userId,
  croppedImage,
  croppedBlob,
  isCropped,
  setIsCropped,
  handleImageChange,
  hideBtnSubmit,
  handleVisibleBtn,
}) => {
  const channelInfo = channel as ChannelType;
  const [existAvt, setExitAvt] = useState<boolean>(true);
  const [ChangingForm, setChangingForm] = useState<boolean>(false);

  function isOpen(WebSocket: { readyState: any; OPEN: any; }) 
  { return WebSocket.readyState === WebSocket.OPEN }

  // handle submit blob
  const handleSubmitAvatar = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    const stringId = channel.id.toString();
    if (croppedBlob) {
      const fileAvatar = new File([croppedBlob], "channel_avatar.jpg", {
        type: "image/jpeg",
        lastModified: new Date().getTime(),
      });
      const formData = new FormData();
      formData.append("file", fileAvatar);
      formData.append("channel", stringId);
      try {
        const response = await ChannelApi.uploadAvatar(formData);
        console.log("update avatar group", response);
        alert("Update avatar channel successfully");
        setIsCropped(false);
      } catch (error) {
        console.log(error);
        alert("Update avatar FAIL");
      }
    }

    handleVisibleBtn(false);
  };

  // handle edit group name
  const [isNameChange, setNameChange] = useState(false);
  const [groupName, setGroupName] = useState<string>(channelInfo?.title);

  useEffect(() => {
    setGroupName(channelInfo.title)
  }, [channelInfo])

  const handleGroupNameChange = ( e: React.ChangeEvent<HTMLInputElement>) => {
    setGroupName(e.target.value);
    handleVisibleBtn(true);
    setNameChange(true);
  }

  const handleSubmitGroupName = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    try {
      const formData = {
        action: "set_channel_title",
        target: "channel",
        targetId: channelInfo.id,
        data: {
          title: groupName
        }
      }

      const requestData = JSON.stringify(formData);

      if (!isOpen(socket)) {
        console.log("WebSocket connection is not open");
        return;
      }

      await socket.send(requestData);
    } catch (error) {
      console.log(error);
    }
  }

  const handleSubmitChange = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    if(isCropped) {
      await  handleSubmitAvatar(event);
      console.log("update avatar");
    }
    if(isNameChange) {
      await handleSubmitGroupName(event);
      console.log("update name");
    }
  }

  return (
    <div>
      <div className="rightcolumn-header">
        <span className="btn-edit" onClick={handleEdit}>
          <IoMdArrowBack size={24} className="util-icon" />
        </span>
        <h3>Edit</h3>
      </div>
      <div className="edit-body-right">
        <div className="group-avatar-name">
          <div className="edit-avatar-container">
            <div className="file-container selected-image-container">
              <label htmlFor="file-input" className="change-image-button">
                <TbCameraPlus className="add-photo-icon" size={50} />
              </label>

              <div className="image-container">
                {isCropped && croppedImage && (
                  <img
                    className="cropped-img"
                    src={croppedImage}
                    alt="Cropped Image"
                  />
                )}
                {!isCropped && (
                  <img
                    className="cropped-img"
                    src={channel.avatar_url}
                    alt="Image"
                  />
                )}
              </div>

              <input
                type="file"
                id="file-input"
                name="photo"
                accept="image/png, image/jpeg"
                onChange={handleImageChange}
                style={{ opacity: 0 }}
                title=""
              />
            </div>
          </div>
          <div className="edit-group-title">
            <div className="input-group">
              <input onChange={handleGroupNameChange} className='form-control' dir='auto' type="text" name='title' value={groupName} placeholder='Group name' />
              <label>Group name</label>
            </div>
          </div>
        </div>

        <div className="rectangle-container">
          <div className="layout-btn">
            <MdPeopleAlt size={24} className="util-icon" />
            <p>Member</p>
          </div>
        </div>
        <div className="rectangle-container">
          <div className="layout-btn">
            <MdPeopleAlt size={24} className="util-icon" />
            <p>Member</p>
          </div>
        </div>

        <div className="delete-contact">
          <div className="layout-btn">
            <IoMdTrash
              size={24}
              className="util-icon"
              style={{ color: "red" }}
            />
            <p>Delete Group</p>
          </div>
        </div>
        {ChangingForm ? (
          <button type="submit" className="submit-btn">
            <TiTick size={25} />
          </button>
        ) : (
          <></>
        )}
      </div>
      <button
        style={hideBtnSubmit}
        className="btn-submit-edit"
        onClick={handleSubmitChange}
      >
        <FaCheck size={24} />
      </button>
    </div>
  );
};

export default EditInforGroup;
