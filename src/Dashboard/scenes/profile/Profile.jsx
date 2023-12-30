import { Box, Button, TextField, Typography, useTheme } from "@mui/material";
import Header from "../../components/Header";
import { useState, useRef, useEffect } from "react";
import { tokens } from "../../theme";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import UpdateIcon from "@mui/icons-material/Update";
import EditIcon from "@mui/icons-material/Edit";
import { IconButton } from "@mui/material";
import UserApi from "../../../Api/UserApi";
import UserProfileApi from "../../../Api/UserProfileApi";
import { toast } from "react-toastify";
import RefreshIcon from "@mui/icons-material/Refresh";

const Profile = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const inputRef = useRef();
    const [valid, setValid] = useState(true);
    const [imageFile, setImageFile] = useState(null);
    const [disabledList, setDisabledList] = useState({
        first_name: true,
        last_name: true,
        address: true,
        phone_number: true,
        bio: true,
    });
    const [userInformation, setUserInformation] = useState({
        first_name: "",
        last_name: "",
        phone_number: "",
        username: "username",
        address: "",
        email: "email",
        avatar_url: "",
        bio: "",
    });

    const handleGetUserProfile = async () => {
        const userProfileResponse = await UserProfileApi.getProfile();
        const userInformationResponse = await UserApi.getUserInformation();
        const userProfileData = userProfileResponse.data;
        const userInformationData = userInformationResponse.data;
        setUserInformation({
            first_name: userInformationData["first_name"] ? userInformationData["first_name"] : "",
            last_name: userInformationData["last_name"],
            email: userInformationData["email"],
            username: userInformationData["username"],
            phone_number: userInformationData["phone_number"] ? userInformationData["phone_number"] : "",
            address: userProfileData["address"] ? userProfileData["address"] : "",
            avatar_url: userProfileData["avatar_url"],
            bio: userProfileData["bio"],
        });
        console.log(userInformation["avatar_url"]);
    };

    useEffect(() => {
        
        handleGetUserProfile();
    }, []);

    const handleSubmit = async () => {
        delete userInformation["username"];
        delete userInformation["email"];
        if(imageFile) {
            const formData = new FormData();
            formData.append('file', imageFile);
            const uploadAvatarResponse = await UserProfileApi.putAvatar(formData);
            if(uploadAvatarResponse.status) {
                toast.error(uploadAvatarResponse.data.message, {
                    theme: theme.palette.mode,
                });
            } else {
                const avatar_url = uploadAvatarResponse.data.avatar_url;
                const response = await UserProfileApi.putProfile({
                    ...userInformation,
                    avatar_url: avatar_url
                });
                if (response.status) {
                    toast.error(response.data.message, {
                        theme: theme.palette.mode,
                    });
                } else {
                    toast.success(response.message, {
                        theme: theme.palette.mode,
                    });
                }
            }
        } else {
            const response = await UserProfileApi.putProfile({
                ...userInformation
            });
            if (response.status) {
                toast.error(response.data.message, {
                    theme: theme.palette.mode,
                });
            } else {
                toast.success(response.message, {
                    theme: theme.palette.mode,
                });
            }
        }
        
        
    };

    const handleChange = (value, field) => {
        if (field === "phone_number") {
            const reg = new RegExp(
                /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/
            );
            setValid(reg.test(value));
        }
        setUserInformation({
            ...userInformation,
            [field]: value,
        });
    };

    const handleClickUploadFile = () => {
        inputRef.current.click();
    };

    const handleClickEditInformation = (field) => {
        setDisabledList({
            ...disabledList,
            [field]: !disabledList[field],
        });
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImageFile(file);
            const url = URL.createObjectURL(file);
            setUserInformation({
                ...userInformation,
                avatar_url: url,
            });
        }
    };

    const refreshProfile = () => {
        handleGetUserProfile();
        setValid(true);
    }

    return (
        <Box m="20px">
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
            >
                <Header title="PROFILE" subtitle="Welcome to admin profile" />
                <Box display="flex" gap="10px">
                    <Button
                        sx={{
                            backgroundColor: colors.blueAccent[700],
                            color: colors.grey[100],
                            fontSize: "14px",
                            fontWeight: "bold",
                            padding: "10px 20px",
                        }}
                        onClick={handleSubmit}
                    >
                        <UpdateIcon sx={{ mr: "10px" }} />
                        UPDATE
                    </Button>
                </Box>
            </Box>

            <Box display="flex" justifyContent="space-between">
                <Box
                    border="1px solid #ccc"
                    borderRadius="5px"
                    display="flex"
                    flexDirection="column"
                    padding="20px"
                    width="60%"
                >
                    <Box display="flex" justifyContent="space-between">
                        <Typography variant="h4">
                            General Information
                        </Typography>
                        <Box onClick={refreshProfile}>
                            <IconButton>
                                <RefreshIcon />
                            </IconButton>
                        </Box>
                    </Box>

                    <Box marginTop="50px" width="100%">
                        <Box component="form" width="100%">
                            <Box
                                display="grid"
                                gap="30px"
                                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                                sx={{
                                    "& > div": "span 4",
                                }}
                            >
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Username"
                                    value={userInformation.username}
                                    name="username"
                                    sx={{ gridColumn: "span 4" }}
                                    disabled
                                />
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Email"
                                    value={userInformation.email}
                                    name="email"
                                    sx={{ gridColumn: "span 4" }}
                                    disabled
                                />
                                <Box
                                    fullWidth
                                    sx={{ gridColumn: "span 2" }}
                                    position="relative"
                                >
                                    <TextField
                                        fullWidth
                                        variant="filled"
                                        type="text"
                                        label="First Name"
                                        value={userInformation.first_name}
                                        name="first_name"
                                        disabled={disabledList.first_name}
                                        onChange={(event) => {
                                            handleChange(
                                                event.target.value,
                                                "first_name"
                                            );
                                        }}
                                    />
                                    <Box
                                        position="absolute"
                                        sx={{
                                            right: 0,
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            "&:hover": {
                                                cursor: "pointer",
                                            },
                                        }}
                                        onClick={() =>
                                            handleClickEditInformation(
                                                "first_name"
                                            )
                                        }
                                    >
                                        <IconButton>
                                            <EditIcon />
                                        </IconButton>
                                    </Box>
                                </Box>
                                <Box
                                    fullWidth
                                    sx={{ gridColumn: "span 2" }}
                                    position="relative"
                                >
                                    <TextField
                                        fullWidth
                                        variant="filled"
                                        type="text"
                                        label="Last Name"
                                        value={userInformation.last_name}
                                        name="last_name"
                                        disabled={disabledList.last_name}
                                        onChange={(event) => {
                                            handleChange(
                                                event.target.value,
                                                "last_name"
                                            );
                                        }}
                                    />
                                    <Box
                                        position="absolute"
                                        sx={{
                                            right: 0,
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            "&:hover": {
                                                cursor: "pointer",
                                            },
                                        }}
                                        onClick={() =>
                                            handleClickEditInformation(
                                                "last_name"
                                            )
                                        }
                                    >
                                        <IconButton>
                                            <EditIcon />
                                        </IconButton>
                                    </Box>
                                </Box>
                                <Box
                                    fullWidth
                                    sx={{ gridColumn: "span 4" }}
                                    position="relative"
                                >
                                    <TextField
                                        fullWidth
                                        variant="filled"
                                        type="text"
                                        label="Address"
                                        value={userInformation.address}
                                        name="address"
                                        disabled={disabledList.address}
                                        sx={{ gridColumn: "span 4" }}
                                        onChange={(event) => {
                                            handleChange(
                                                event.target.value,
                                                "address"
                                            );
                                        }}
                                    />
                                    <Box
                                        position="absolute"
                                        sx={{
                                            right: 0,
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            "&:hover": {
                                                cursor: "pointer",
                                            },
                                        }}
                                        onClick={() =>
                                            handleClickEditInformation(
                                                "address"
                                            )
                                        }
                                    >
                                        <IconButton>
                                            <EditIcon />
                                        </IconButton>
                                    </Box>
                                </Box>
                                <Box
                                    fullWidth
                                    sx={{ gridColumn: "span 4" }}
                                    position="relative"
                                >
                                    <TextField
                                        fullWidth
                                        variant="filled"
                                        type="text"
                                        label="Phone Number"
                                        value={userInformation.phone_number}
                                        name="phone_number"
                                        disabled={disabledList.phone_number}
                                        sx={{ gridColumn: "span 4" }}
                                        onChange={(event) => {
                                            handleChange(
                                                event.target.value,
                                                "phone_number"
                                            );
                                        }}
                                        error={!valid}
                                        helperText={
                                            valid ? "" : "Invalid phone number"
                                        }
                                        required={true}
                                    />
                                    <Box
                                        position="absolute"
                                        sx={{
                                            right: 0,
                                            top: "50%",
                                            transform: `${valid ? "translateY(-50%)" : "translateY(-72%)"}`,
                                            "&:hover": {
                                                cursor: "pointer",
                                            },
                                        }}
                                        onClick={() =>
                                            handleClickEditInformation(
                                                "phone_number"
                                            )
                                        }
                                    >
                                        <IconButton>
                                            <EditIcon />
                                        </IconButton>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                    <Box></Box>
                </Box>
                <Box
                    width="35%"
                    display="flex"
                    flexDirection="column"
                    height="70vh"
                    justifyContent="space-between"
                    backgroundColor={colors.primary[400]}
                    borderRadius="10px"
                >
                    <Box height="55%">
                        <Box
                            sx={{
                                backgroundImage: `url(${userInformation["avatar_url"]})`,
                                height: "80%",
                                objectFit: "cover",
                                position: "relative",
                                backgroundPosition: "center",
                            }}
                            borderRadius="10px 10px 0 0 "
                        >
                            <Box
                                position="absolute"
                                bottom="-75px"
                                sx={{
                                    right: 0,
                                    left: 0,
                                    textAlign: "center",
                                    marginLeft: "auto",
                                    marginRight: "auto",
                                }}
                            >
                                <Box
                                    size="150px"
                                    color="white"
                                    style={{
                                        borderRadius: 50,
                                        textAlign: "center",
                                    }}
                                    position="relative"
                                    display="inline-block"
                                    margin="auto"
                                >
                                    <Box
                                        component="img"
                                        src={userInformation["avatar_url"]}
                                        alt="Hình ảnh"
                                        width="150px"
                                        height="150px"
                                        objectFit="cover"
                                        borderRadius="999px"
                                    ></Box>
                                    <Box
                                        position="absolute"
                                        sx={{
                                            right: 10,
                                            bottom: 10,
                                            "&:hover": {
                                                cursor: "pointer",
                                            },
                                        }}
                                        backgroundColor="black"
                                        padding="5px"
                                        style={{
                                            borderRadius: 50,
                                        }}
                                        display="flex"
                                        onClick={handleClickUploadFile}
                                    >
                                        <CameraAltIcon></CameraAltIcon>
                                        <input
                                            ref={inputRef}
                                            type="file"
                                            hidden
                                            onChange={handleFileChange}
                                            accept="image/*"
                                        />
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                    <Box height="40%" textAlign="center" padding="0 40px">
                        <Typography
                            variant="h2"
                            color={colors.grey[100]}
                            fontWeight="bold"
                        >
                            {userInformation.username}
                        </Typography>
                        <Typography
                            variant="h5"
                            color={colors.greenAccent[500]}
                        >
                            {userInformation.first_name + " " + userInformation.last_name}
                        </Typography>
                        <Box textAlign="justify" position="relative">
                            <Box
                                position="absolute"
                                sx={{
                                    top: -20,
                                    right: -30,
                                    zIndex: 1,
                                    borderRadius: "999px",
                                }}
                            >
                                <IconButton
                                    onClick={() =>
                                        handleClickEditInformation("bio")
                                    }
                                >
                                    <EditIcon />
                                </IconButton>
                            </Box>

                            {!disabledList["bio"] ? (
                                <TextField
                                    placeholder="Bio description"
                                    value={userInformation["bio"]}
                                    onChange={(event) =>
                                        handleChange(event.target.value, "bio")
                                    }
                                    rows={5}
                                    multiline
                                    fullWidth
                                />
                            ) : (
                                <Typography
                                    variant="body1"
                                    title={userInformation["bio"]}
                                    style={{
                                        display: "-webkit-box",
                                        WebkitLineClamp: "5",
                                        WebkitBoxOrient: "vertical",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                    }}
                                >
                                    {userInformation["bio"]}
                                </Typography>
                            )}
                        </Box>

                        <Typography
                            marginTop="20px"
                            fontStyle="italic"
                            color="#5083d4"
                            sx={{
                                "&:hover": {
                                    cursor: "pointer",
                                },
                                textDecoration: "underline",
                            }}
                        >
                            Change Your Password
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default Profile;
