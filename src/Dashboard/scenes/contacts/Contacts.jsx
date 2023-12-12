import { Box, useTheme} from "@mui/material";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataContacts } from "../../data/mockData";
import { useState, useEffect } from "react";
import UserApi from "../../../Api/UserApi";
import Header from "../../components/Header";

const Contacts= () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [userData, setUserData] = useState([]);

    const getUserData = async () => {
        const userListResponse = await UserApi.getUserList();
        setUserData(userListResponse.data);
    }

    useEffect(() => {
        getUserData();
    }, []);

    const columns = [
        {
            field: "id",
            headerName: "ID",
            flex: 0.5
        },
        {
            field: "username",
            headerName: "Username",
            flex: 1,
            cellClassName: "name-column--cell"
        },
        {
            field: "email",
            headerName: "Email",
            flex: 1,
            cellClassName: "name-column--cell"
        },
        {
            field: "first_name",
            headerName: "First Name",
            headerAlign: "left",
            align: "left",
            cellClassName: "name-column--cell"
        },
        {
            field: "last_name",
            headerName: "Last Name",
            flex: 1,
            cellClassName: "name-column--cell"
        },
        {
            field: "fullname",
            headerName: "Full Name",
            flex: 1,
            cellClassName: "name-column--cell"
        },
    ]

    return (
        <Box m="20px">
            <Header title="CONTACTS" subtitle="List of Contacts for Future Reference"/>
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
                    rows ={userData}
                    columns={columns}
                    components={{Toolbar: GridToolbar}}
                />
            </Box>
        </Box>
    )
};


export default Contacts;