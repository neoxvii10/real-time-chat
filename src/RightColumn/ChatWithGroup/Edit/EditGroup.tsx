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
import ImageCrop from "../../../Users/NewGroup/Selects/GroupCreation/ImageCrop/ImageCrop";

import { AiOutlineClose } from "react-icons/ai";
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

  const [inputValues, setInputValues] = useState<{ [x: string]: string }>({
    groupName: channelInfo.title,
    description: "",
  });

  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    setInputValues((prevState) => ({ ...prevState, [name]: value }));
    setChangingForm(true);
  };

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
        // setIsCropped(false);?
      } catch (error) {
        console.log(error);
        alert("Update avatar FAIL");
      }
    }

    handleVisibleBtn(false);
  };

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
          <div className="name">{channelInfo.title}</div>
          <div className="form-name">
            <Box
              component="form"
              sx={{
                "& > :not(style)": { mx: "2rem", my: 2, width: "90%" },
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
              noValidate
              autoComplete="off"
            >
              <TextField
                sx={{
                  "& .MuiInputLabel-root": { color: "#aaaaaa" }, //styles the label
                  "& label.Mui-focused": {
                    color: "var(--border-on-click) ",
                    fontWeight: "bold",
                  },
                  "& .MuiOutlinedInput-root": {
                    "& > fieldset": {
                      borderColor: "#aaaaaa",
                      borderRadius: 3,
                    },
                  },

                  "& .MuiOutlinedInput-root:hover": {
                    "& > fieldset": {
                      borderColor: "var(--border-on-click) ",
                    },
                  },
                  "&:hover .MuiInputLabel-root": {
                    color: "var(--border-on-click)",
                  },
                  "& .MuiOutlinedInput-root.Mui-focused": {
                    "& > fieldset": {
                      borderColor: "var(--border-on-click) ",
                      borderWidth: "3px",
                    },
                  },
                }}
                InputProps={{ sx: { color: "white" } }}
                color="primary"
                id="outlined-basic"
                label="Group Name (required)"
                required
                defaultValue={inputValues?.groupName || ""}
                onChange={handleChangeInput}
              />
              <TextField
                sx={{
                  "& .MuiInputLabel-root": { color: "#aaaaaa" }, //styles the label
                  "& label.Mui-focused": {
                    color: "var(--border-on-click) ",
                    fontWeight: "bold",
                  },
                  "& .MuiOutlinedInput-root": {
                    "& > fieldset": {
                      borderColor: "#aaaaaa",
                      borderRadius: 3,
                    },
                  },

                  "& .MuiOutlinedInput-root:hover": {
                    "& > fieldset": {
                      borderColor: "var(--border-on-click) ",
                    },
                  },
                  "&:hover .MuiInputLabel-root": {
                    color: "var(--border-on-click)",
                  },
                  "& .MuiOutlinedInput-root.Mui-focused": {
                    "& > fieldset": {
                      borderColor: "var(--border-on-click) ",
                    },
                  },
                }}
                InputProps={{ sx: { color: "white" } }}
                color="primary"
                id="outlined-basic"
                label="Description (optional)"
                variant="outlined"
                defaultValue={inputValues?.description || ""}
                onChange={handleChangeInput}
              />
            </Box>
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
        onClick={handleSubmitAvatar}
      >
        <FaCheck size={24} />
      </button>
    </div>
  );
};

export default EditInforGroup;
