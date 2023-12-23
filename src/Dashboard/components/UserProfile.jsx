import { Box, TextField, Typography, useTheme } from "@mui/material";
import Header from "./Header";
import { useState, useEffect } from "react";
import { tokens } from "../theme";
import EditIcon from "@mui/icons-material/Edit";
import { IconButton } from "@mui/material";
import UserApi from "../../Api/UserApi";
import UserProfileApi from "../../Api/UserProfileApi";
import { useParams } from "react-router-dom";

const UserProfile = () => {
    const { userId } = useParams();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
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

    const getUserById = (userList, id) => {
        return userList.filter((user) => user.id === parseInt(id))[0];
    }

    const handleGetUserProfile = async () => {
        const userProfileResponse = await UserProfileApi.getParticularProfile(userId);
        const userListResponse = await UserApi.getUserList();
        const userProfileData = userProfileResponse.data;
        const userInformationData = getUserById(userListResponse.data, userId);
        setUserInformation({
            ...userInformation,
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

    return (
        <Box m="20px">
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
            >
                <Header title="PROFILE" subtitle="User Profile" />
                
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
                                        disabled
                                    />

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
                                        disabled
                                    />

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
                                        disabled
                                        sx={{ gridColumn: "span 4" }}
                                    />
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
                                        disabled
                                        sx={{ gridColumn: "span 4" }}
                                        required={true}
                                    />
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
                            Admin
                        </Typography>
                        <Typography
                            variant="h5"
                            color={colors.greenAccent[500]}
                        >
                            I am admin
                        </Typography>
                        <Box textAlign="justify" position="relative">


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
                        </Box>

                        
                    </Box>
                </Box>
            </Box>
        </Box>
    );

}



export default UserProfile;
