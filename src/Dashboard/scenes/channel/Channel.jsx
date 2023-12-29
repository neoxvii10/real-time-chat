import { Box, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useState, useEffect } from "react";
import ChannelApi from "../../../Api/ChannelApi";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import BanApi from "../../../Api/BanApi";
import BlockIcon from "@mui/icons-material/Block";
import CheckIcon from "@mui/icons-material/Check";
import ConfirmDialog from "../../components/ConfirmDialog";

const Channel = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();
    const [channelData, setChannelData] = useState([]);
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
    const getChannelData = async () => {
        const channelListResponse = await ChannelApi.getChannelList();
        console.log(channelListResponse.data);
        setChannelData(channelListResponse.data);
    };

    const cancelBlockChannel = () => {
        setConfirmDialog({
            isOpen: false,
        });
    };

    const acceptBlockChannel = async () => {
        setConfirmDialog({
            isOpen: false,
        });
        if (currentStatus["is_active"]) {
            const response = await BanApi.banChannel(currentStatus["id"]);
            console.log(response);
            if (response.status) {
                toast.error("Cannot ban this channel", {
                    theme: theme.palette.mode,
                });
            } else {
                toast.success("Banned Channel successfully", {
                    theme: theme.palette.mode,
                });
                getChannelData();
            }
        } else {
            const response = await BanApi.unbanChannel(currentStatus["id"]);
            console.log(response);
            if (response.status) {
                toast.error("Cannot unban this channel", {
                    theme: theme.palette.mode,
                });
            } else {
                toast.success("Unbanned Channel successfully!", {
                    theme: theme.palette.mode,
                });
                getChannelData();
            }
        }
    };
    const handleClickBlockChannel = (id, is_active) => {
        setCurrentStatus({
            id,
            is_active,
        });
        if (is_active) {
            setConfirmDialog({
                title: "Ban Channel",
                content: "Do you want to block this channel?",
                isOpen: true,
            });
        } else {
            setConfirmDialog({
                title: "Unban Channel",
                content: "Do you want to unblock this channel?",
                isOpen: true,
            });
        }
    };

    useEffect(() => {
        getChannelData();
    }, []);

    const columns = [
        {
            field: "id",
            headerName: "ID",
        },
        {
            field: "title",
            headerName: "Channel Name",
            flex: 1,
            cellClassName: "name-column--cell",
        },
        {
            field: "member_count",
            headerName: "Number of members",
            flex: 1,
            cellClassName: "name-column--cell",
        },
        {
            field: "create_at",
            headerName: "Created Date",
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
                            handleClickBlockChannel(id, is_active);
                        }}
                    >
                        <Tooltip title={is_active ? "Active" : "Banned"}>
                            {is_active ? <CheckIcon /> : <BlockIcon />}
                        </Tooltip>
                    </Box>
                );
            },
        },
        {
            headerName: "Detail",
            align: "center",
            renderCell: ({ id }) => {
                return (
                    <Box
                        onClick={() => navigate(`/admin/channel/${id}/members`)}
                    >
                        <Tooltip title="View Detail">
                            <IconButton>
                                <VisibilityIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                );
            },
        },
        // {
        //     field: "age",
        //     headerName: "Age",
        //     type: "number",
        //     headerAlign: "left",
        //     align: "left"
        // },
        // {
        //     field: "phone",
        //     headerName: "Phone Number",
        //     flex: 1,
        // },
        // {
        //     field: "email",
        //     headerName: "Email",
        //     flex: 1,
        // },
        // {
        //     field: "access",
        //     headerName: "Access Level",
        //     flex: 1,
        //     renderCell: ({ row: {access}}) => {
        //         return (
        //             <Box
        //             width="60%"
        //             m ="0 auto"
        //             p="5px"
        //             display="flex"
        //             justifyContent="center"
        //             backgroundColor={
        //                 access === "admin"
        //                 ? colors.greenAccent[600]
        //                 : colors.greenAccent[700]
        //             }
        //             borderRadius="4px"
        //             >
        //             {access === "admin" && <AdminPanelSettingsOutlinedIcon/>}
        //             {access === "manager" && <SecurityOutlinedIcon/>}
        //             {access === "user" && <LockOpenOutlinedIcon/>}
        //             <Typography
        //                 color={colors.grey[100]}
        //                 sx={{ml: "5px"}}
        //             >

        //             </Typography>
        //             </Box>
        //         )
        //     }
        // },
    ];

    return (
        <Box m="20px">
            <Header title="CHANNEL" subtitle="Managing the Channels" />
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
                }}
            >
                <DataGrid
                    rows={channelData}
                    columns={columns}
                    components={{ Toolbar: GridToolbar }}
                />
            </Box>
            <ConfirmDialog
                confirmDialog={confirmDialog}
                handleCancel={cancelBlockChannel}
                handleOk={acceptBlockChannel}
            />
        </Box>
    );
};

export default Channel;
