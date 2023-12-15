import { Box, useTheme, Button} from "@mui/material";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataContacts } from "../../data/mockData";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import UserApi from "../../../Api/UserApi";
import Header from "../../components/Header";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { ToastContainer, toast } from 'react-toastify';
import ConfirmDialog from "../../components/ConfirmDialog";
const User= () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();
    const [userData, setUserData] = useState([]);
    const [confirmDialog, setConfirmDialog] = useState({
        title: "",
        content: "",
        isOpen: false,
        handleOk: () => {},
        handleCancel: () => {}
    });

    const getUserData = async () => {
        const userListResponse = await UserApi.getUserList();
        setUserData(userListResponse.data);
    }

    const cancelDeleteUser = () => {
      setConfirmDialog({
        isOpen: false
      })
      
    }

    const acceptDeleteUser = () => {
      setConfirmDialog({
        isOpen: false
      });

      toast.success("Xóa người dùng thành công", {
        theme: theme.palette.mode
      });
    }

    const handleDeleteUser = () => {
      setConfirmDialog({
        title: "Delete User",
        content: "Do you want to delete this user?",
        isOpen: true
      })
    }

    const handleEditUser = (id) => {
        navigate(`/admin/user/${id}/edit`)
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
        {
          headerName: "",
          renderCell: ({id}) => {
            return (
              <Box
              display="flex"
              justifyContent="space-between"
              width="80%"
              margin="auto"
              >
                <Box
                  onClick={() => handleEditUser(id)}
                  backgroundColor ={
                    colors.greenAccent[700]
                  }
                  sx = {{
                    p: 0.25,
                    "&:hover": {
                      backgroundColor: colors.greenAccent[600],
                      cursor: "pointer"
                    }
                  }}
                >
                  <EditIcon />
                </Box>
                <Box
                  onClick={handleDeleteUser}
                  backgroundColor ={
                    colors.redAccent[700]
                  }
                  sx = {{
                    p: 0.25,
                    "&:hover": {
                      backgroundColor: colors.redAccent[600],
                      cursor: "pointer"
                    }
                  }}

                >
                <DeleteIcon/>
                </Box>
                  
              </Box>
            )
          }
        }
    ]

    return (
        <Box m="20px">
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
            >
              <Header title="CONTACTS" subtitle="List of Contacts for Future Reference"/>
              <Box>
                    <Button
                        sx={{
                            backgroundColor: colors.blueAccent[700],
                            color: colors.grey[100],
                            fontSize: "14px",
                            fontWeight: "bold",
                            padding: "10px 20px",
                        }}
                        onClick={() => (
                          navigate('/admin/user/create')
                        )}
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
                    rows ={userData}
                    columns={columns}
                    components={{Toolbar: GridToolbar}}
                />
            </Box>
            <ConfirmDialog
              confirmDialog={confirmDialog}
              handleCancel={cancelDeleteUser}
              handleOk={acceptDeleteUser}
            />
        </Box>
    )
};


export default User;