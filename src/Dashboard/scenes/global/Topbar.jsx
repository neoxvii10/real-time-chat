import {
    Box,
    IconButton,
    useTheme,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
} from "@mui/material";
import { MenuItem } from "react-pro-sidebar";
import { useContext, useState } from "react";
import { ColorModeContext, tokens } from "../../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SettingsIcon from "@mui/icons-material/Settings";
import SearchIcon from "@mui/icons-material/Search";
import Collapse from "@mui/material/Collapse";
import StarBorder from "@mui/icons-material/StarBorder";
import UserProfileApi from "../../../Api/UserProfileApi";
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';

const Item = ({ title, icon, handleClick }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    return (
        <Box
            style={{ color: colors.grey[100] }}
            display="flex"
            flexDirection="row"
            justifyContent="left"
            width="100%"
            p="10px"
            padding="5px 10px"
            borderRadius="15px"
            marginBottom="10px"
            onClick={handleClick}
            sx={{
                "&:hover": {
                    backgroundColor: colors.grey[500],
                    cursor: "pointer",
                },
            }}
            alignItems="center"
        >
            {icon}
            <Typography whiteSpace="nowrap" marginLeft="10px" fontSize="18px">
                {title}
            </Typography>
        </Box>
    );
};

const Topbar = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const colorMode = useContext(ColorModeContext);
    const [open, setOpen] = useState(true);
    const [adminProfile, setAdminProfile] = useState({
        avatar_url: "/assets/user.png",
        username: "admin",
        fullname: "I am an admin",
    });

    const handleSignout = () => {
        localStorage.removeItem("accessToken");
        navigate('/admin/login');
    }

    const getProfileInformation = async () => {
        const response = await UserProfileApi.getProfile();
        setAdminProfile({
            avatar_url: "/assets/user.png",
            username: response.data.user.username,
            fullname: response.data.user.fullname,
        });
    };

    return (
        <Box display="flex" justifyContent="space-between" p={2}>
            <Box
                display="flex"
                backgroundColor={colors.primary[400]}
                borderRadius="3px"
            >
                <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
                <IconButton type="button" sx={{ p: 1 }}>
                    <SearchIcon />
                </IconButton>
            </Box>

            {/* ICONS */}
            <Box display="flex">
                <IconButton onClick={colorMode.ToggleColorMode}>
                    {theme.palette.mode === "dark" ? (
                        <DarkModeOutlinedIcon />
                    ) : (
                        <LightModeOutlinedIcon />
                    )}
                </IconButton>
                <IconButton>
                    <NotificationsOutlinedIcon />
                </IconButton>
                {/* <IconButton>
                    <SettingsOutlinedIcon />
                </IconButton> */}
                <Box
                    sx={{
                        position: "relative",
                    }}
                >
                    <IconButton onClick={() => setOpen(!open)}>
                        <PersonOutlinedIcon />
                    </IconButton>
                    <Collapse
                        sx={{
                            position: "absolute",
                            right: 0,
                            zIndex: 1,
                        }}
                        in={open}
                        timeout="auto"
                        unmountOnExit
                    >
                        <Box
                            borderRadius="10px"
                            p="15px 20px"
                            backgroundColor={colors.primary[400]}
                            display="flex"
                            flexDirection="column"
                            width="auto"
                            sx={{
                                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                              }}
                        >
                            <Box
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                gap="10px"
                                paddingBottom="10px"
                                borderBottom="1px solid #ccc"
                            >
                                <img
                                    alt="profile-user"
                                    width="30px"
                                    height="30px"
                                    src={adminProfile.avatar_url}
                                    style={{
                                        cursor: "pointer",
                                        borderRadius: "50%",
                                    }}
                                />
                                <Typography
                                    variant="h2"
                                    color={colors.grey[100]}
                                    fontWeight="bold"
                                    fontSize="20px"
                                >
                                    {adminProfile.username}
                                </Typography>
                            </Box>
                            <Box
                             marginTop="10px" display="flex"
                             flexDirection="column"
                            >
                                <Item 
                                    handleClick={() => navigate('/admin/profile')}
                                    title="Thông tin tài khoản"
                                    icon={<AccountCircleOutlinedIcon />}
                                />

                                <Item
                                    handleClick={() => {}}
                                    title="Cài đặt"
                                    icon={<SettingsIcon />}
                                />

                                <Item
                                    handleClick={handleSignout}
                                    title="Đăng xuất"
                                    icon={<LogoutIcon />}
                                />
                            </Box>
                        </Box>
                    </Collapse>
                </Box>
            </Box>
        </Box>
    );
};

export default Topbar;
