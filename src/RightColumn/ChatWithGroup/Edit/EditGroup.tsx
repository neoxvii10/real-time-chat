import "./EditGroup.css";
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
  handleEdit: (event: React.MouseEvent<HTMLSpanElement>) => void;
};

const EditInforGroup: React.FC<ChannelInboxProps> = ({
  channel,
  handleEdit,
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
        <span className="btn-edit" onClick={handleEdit}>
          <IoMdArrowBack size={24} className="util-icon" />
        </span>
        <h3>Edit</h3>
      </div>

      <div className="edit-body-right">
        <div className="group-avatar-name">
          <div className="edit-avatar-container">
            <div className="avatar">
              {existAvt ? (
                <div className="group-avatar-wrapper">
                  <div className="group-avatar-container">
                    <img src={channelInfo.avatar_url}></img>
                  </div>
                </div>
              ) : (
                <div className="textAvt">
                  <p>{}</p>
                </div>
              )}
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
            <p>Delete Contact</p>
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
    </div>
  );
};

export default EditInforGroup;