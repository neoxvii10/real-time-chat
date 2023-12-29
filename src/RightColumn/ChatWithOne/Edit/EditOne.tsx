import "./EditOne.css";
import { useState } from "react";
import { TiTick } from "react-icons/ti";
import { IoMdTrash } from "react-icons/io";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { IoMdArrowBack } from "react-icons/io";

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

const EditInforOne: React.FC<ChannelInboxProps> = ({
  channel,
  handleEdit,
  userId,
}) => {
  const user = channel as UserType;
  const [existAvt, setExitAvt] = useState<boolean>(true);
  const [ChangingForm, setChangingForm] = useState<boolean>(false);

  const [inputValues, setInputValues] = useState<{ [x: string]: string }>({
    fname: user.first_name,
    lname: user.last_name,
  });

  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    setInputValues((prevState) => ({ ...prevState, [name]: value }));
    setChangingForm(true);
  };
  return (
    <div className="status2-container">
      <div className="rightcolumn-header">
        <span className="btn-edit" onClick={handleEdit}>
          <IoMdArrowBack size={24} className="util-icon" />
        </span>
        <h3>Edit</h3>
      </div>

      <div className="edit-body-right">
        <div className="part1">
          <div className="edit-avatar-container">
            <div className="avatar">
              {existAvt ? (
                <div>
                  <img
                    src={channel.avatar_url}
                    className="imgAvt"
                    alt="avatar"
                  />
                </div>
              ) : (
                <div className="textAvt">
                  <p>{}</p>
                </div>
              )}
            </div>
          </div>
          <div className="name">"Name One User"</div>
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
                label="First Name (required)"
                required
                defaultValue={inputValues?.fname || ""}
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
                label="Last Name (optional)"
                variant="outlined"
                defaultValue={inputValues?.lname || ""}
                onChange={handleChangeInput}
              />
            </Box>
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

export default EditInforOne;
