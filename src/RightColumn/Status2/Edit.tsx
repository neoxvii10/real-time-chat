import "./Edit.css";
import { useState } from "react";
import avatarimage from "./avatartest.jpeg";
import { TiTickOutline } from "react-icons/ti";
import { IoMdTrash } from "react-icons/io";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
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

const EditInfor: React.FC<UserInfoProps> = ({ userInfoProp }) => {
  const [existAvt, setExitAvt] = useState<boolean>(avatarimage ? true : false);
  const [ChangingForm, setChangingForm] = useState<boolean>(false);

  const NameSplited = userInfoProp.name.split(" ");
  const FirstNameOnly = userInfoProp.name.substring(
    userInfoProp.name.indexOf(" ") + 1
  );

  const [inputValues, setInputValues] = useState<{ [x: string]: string }>({
    fname: FirstNameOnly,
    lname: NameSplited[0],
  });

  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    setInputValues((prevState) => ({ ...prevState, [name]: value }));
    setChangingForm(true);
  };
  return (
    <div>
      <div className="status2-container">
        <div className="part1">
          <div className="edit-avatar-container">
            <div className="avatar">
              {existAvt ? (
                <div>
                  <img src={avatarimage} className="imgAvt" alt="avatar" />
                </div>
              ) : (
                <div className="textAvt">
                  <p>{userInfoProp.avatar}</p>
                </div>
              )}
            </div>
          </div>
          <div className="name">{userInfoProp.name}</div>
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
                  "& .MuiOutlinedInput-root:hover": {
                    "& > fieldset": {
                      borderColor: "#8774e1",
                    },
                  },
                  "& .MuiOutlinedInput-root": {
                    "& > fieldset": {
                      borderColor: "#aaaaaa",
                      borderRadius: 3,
                    },
                  },
                  "& .MuiOutlinedInput-root.Mui-focused": {
                    "& > fieldset": {
                      borderColor: "#8774e1",
                    },
                  },
                }}
                InputProps={{ sx: { color: "white" } }}
                color="primary"
                id="outlined-basic"
                label="First Name"
                variant="outlined"
                defaultValue={inputValues?.fname || ""}
                onChange={handleChangeInput}
              />
              <TextField
                sx={{
                  "& .MuiInputLabel-root": { color: "#aaaaaa" }, //styles the label
                  "& .MuiOutlinedInput-root:hover": {
                    "& > fieldset": {
                      borderColor: "#8774e1",
                    },
                  },
                  "& .MuiOutlinedInput-root": {
                    "& > fieldset": {
                      borderColor: "#aaaaaa",
                      borderRadius: 3,
                    },
                  },
                  "& .MuiOutlinedInput-root.Mui-focused": {
                    "& > fieldset": {
                      borderColor: "#8774e1",
                    },
                  },
                }}
                InputProps={{ sx: { color: "white" } }}
                color="primary"
                id="outlined-basic"
                label="Last Name"
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
            <TiTickOutline size={24} />
          </button>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default EditInfor;
