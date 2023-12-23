import { Box, Typography, useTheme} from "@mui/material";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataTeam } from "../../data/mockData";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "../../components/Header";
import { useState, useEffect } from "react";
import ChannelApi from "../../../Api/ChannelApi";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";

const Channel= () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();
    const [channelData, setChannelData] = useState([]);

    const getChannelData = async () => {
        const channelListResponse = await ChannelApi.getChannelList();
        console.log(channelListResponse.data);
        setChannelData(channelListResponse.data);
    }

    useEffect(() => {
      getChannelData();
    }, [])


    const columns = [
        {
            field: "id",
            headerName: "ID"
        },
        {
            field: "title",
            headerName: "Channel Name",
            flex: 1,
            cellClassName: "name-column--cell"
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
            cellClassName: "name-column--cell"

        },
        {
          headerName: "",
          align: "center",
          renderCell: ({ id }) => {
              return (
                  <Box
                      onClick={() =>
                          navigate(`/admin/channel/${id}/members`)
                      }
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
    ]

    return (
        <Box m="20px">
            <Header title="CHANNEL" subtitle="Managing the Channels"/>
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
                    rows ={channelData}
                    columns={columns}
                    components={{Toolbar: GridToolbar}}
                />
            </Box>
        </Box>
    )
};


export default Channel;