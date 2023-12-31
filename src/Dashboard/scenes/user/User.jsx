import { Box, useTheme, Button } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserApi from "../../../Api/UserApi";
import Header from "../../components/Header";
import AddIcon from "@mui/icons-material/Add";
import { toast } from "react-toastify";
import ConfirmDialog from "../../components/ConfirmDialog";
import BlockIcon from "@mui/icons-material/Block";
import CheckIcon from "@mui/icons-material/Check";
import VisibilityIcon from "@mui/icons-material/Visibility";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import BanApi from "../../../Api/BanApi";
import PeopleIcon from '@mui/icons-material/People';
const User = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();
    const [userData, setUserData] = useState([]);
    const [currentStatus, setCurrentStatus] = useState({
        id: null,
        is_active: false,
    });
    const [confirmDialog, setConfirmDialog] = useState({
        title: "",
        content: "",
        isOpen: false,
        handleOk: () => {},
        handleCancel: () => {},
    });

    const getUserData = async () => {
        const userListResponse = await UserApi.getUserList();
        setUserData(userListResponse.data);
        console.log(userListResponse.data);
    };

    const cancelBlockUser = () => {
        setConfirmDialog({
            isOpen: false,
        });
    };

    const acceptBlockUser = async () => {
        setConfirmDialog({
            isOpen: false,
        });
        if (currentStatus["is_active"]) {
            const response = await BanApi.banUser(currentStatus["id"]);
            console.log(response);
            if (response.status) {
                toast.error("Cannot ban this user", {
                    theme: theme.palette.mode,
                });
            } else {
                toast.success("Ban User successfully", {
                    theme: theme.palette.mode,
                });
                getUserData();
            }
        } else {
            const response = await BanApi.unbanUser(currentStatus["id"]);
            console.log(response);
            if (response.status) {
                toast.error("Cannot unban this user", {
                    theme: theme.palette.mode,
                });
            } else {
                toast.success("Unban User successfully!", {
                    theme: theme.palette.mode,
                });
                getUserData();
            }
        }
    };
    const handleClickBlockUser = (id, is_active) => {
        setCurrentStatus({
            id,
            is_active,
        });
        if (is_active) {
            setConfirmDialog({
                title: "Ban User",
                content: "Do you want to block this user?",
                isOpen: true,
            });
        } else {
            setConfirmDialog({
                title: "Unban User",
                content: "Do you want to unblock this user?",
                isOpen: true,
            });
        }
    };
    useEffect(() => {
        getUserData();
    }, []);

    const columns = [
        {
            field: "id",
            headerName: "ID",
            flex: 0.5,
        },
        {
            field: "username",
            headerName: "Username",
            flex: 1,
            cellClassName: "name-column--cell",
        },
        {
            field: "email",
            headerName: "Email",
            flex: 1,
            cellClassName: "name-column--cell",
        },
        {
            field: "first_name",
            headerName: "First Name",
            headerAlign: "left",
            align: "left",
            cellClassName: "name-column--cell",
        },
        {
            field: "last_name",
            headerName: "Last Name",
            flex: 1,
            cellClassName: "name-column--cell",
        },
        {
            field: "fullname",
            headerName: "Full Name",
            flex: 1,
            cellClassName: "name-column--cell",
        },
        {
            field: "is_active",
            headerName: "Status",
            renderCell: ({ id, ...obj }) => {
                const is_active = obj.row.is_active;
                return (
                    <Box
                        width="40%"
                        m="0 auto"
                        p="5px"
                        display="flex"
                        justifyContent="center"
                        backgroundColor={
                            is_active
                                ? colors.greenAccent[600]
                                : colors.redAccent[600]
                        }
                        borderRadius="4px"
                        sx={{
                            "&:hover": {
                                cursor: "pointer",
                            },
                        }}
                        onClick={() => {
                            handleClickBlockUser(id, is_active);
                        }}
                    >
                        {" "}
                        <Tooltip title={is_active ? "Active" : "Banned"}>
                            {is_active ? <CheckIcon /> : <BlockIcon />}
                        </Tooltip>
                    </Box>
                );
            },
        },
        {
            field: "1",
            headerName: "Friends",
            align: "center",
            renderCell: ({ id }) => {
                return (
                    <Box onClick={() => navigate(`/admin/user/${id}/friends`)}>
                        <Tooltip title="Friends">
                            <IconButton>
                                <PeopleIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                );
            },
        },
        {
            field: "2",
            headerName: "Detail",
            align: "center",
            renderCell: ({ id }) => {
                return (
                    <Box onClick={() => navigate(`/admin/user/${id}/detail`)}>
                        <Tooltip title="View Detail">
                            <IconButton>
                                <VisibilityIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                );
            },
        },
        
    ];

    return (
        <Box m="20px">
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
            >
                <Header
                    title="CONTACTS"
                    subtitle="List of Contacts for Future Reference"
                />
                <Box>
                    <Button
                        sx={{
                            backgroundColor: colors.blueAccent[700],
                            color: colors.grey[100],
                            fontSize: "14px",
                            fontWeight: "bold",
                            padding: "10px 20px",
                        }}
                        onClick={() => navigate("/admin/user/create")}
                    >
                        <AddIcon sx={{ mr: "10px" }} />
                        Create new user
                    </Button>
                </Box>
            </Box>

            <Box
                m="40px 0 0 0"
                height="75vh"
                sx={{
                    "& .MuiDataGrid-root": {
                        border: "none",
                    },
                    "& .MuiDataGrid-cell": {
                        borderBottom: "none",
                    },
                    "& .name-column--cell": {
                        color: colors.greenAccent[300],
                    },
                    "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: colors.blueAccent[700],
                        borderBottom: "none",
                    },
                    "& .MuiDataGrid-virtualScroller": {
                        backgroundColor: colors.primary[400],
                    },
                    "& .MuiDataGrid-footerContainer": {
                        borderTop: "none",
                        backgroundColor: colors.blueAccent[700],
                    },
                    "& .MuiCheckbox-root": {
                        color: `${colors.greenAccent[200]} !important`,
                    },
                    "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                        color: `${colors.grey[100]} !important`,
                    },
                }}
            >
                <DataGrid
                    rows={userData}
                    columns={columns}
                    components={{ Toolbar: GridToolbar }}
                />
            </Box>
            <ConfirmDialog
                confirmDialog={confirmDialog}
                handleCancel={cancelBlockUser}
                handleOk={acceptBlockUser}
            />
        </Box>
    );
};

export default User;
