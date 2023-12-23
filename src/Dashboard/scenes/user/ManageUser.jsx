import React from "react";
import { Routes, Route, useParams } from 'react-router-dom';
import User from "./User";
import UserForm from "../../components/UserForm";
import Verification from "./Verification";
import UserApi from "../../../Api/UserApi";
import { toast } from 'react-toastify';
import {  useTheme} from "@mui/material";
import { useNavigate } from 'react-router-dom';
import UserProfile from "../../components/UserProfile";
const ManageUser = () => {
    const {userId} = useParams()
    const theme = useTheme();
    const navigate = useNavigate();
    const handleUpdateUser = async (values) => {

    }

    const handleCreateUser = async (values) => {
        const response = await UserApi.signup(values);
        
        if(response.status) {
            toast.error(response.data.message, {
                theme: theme.palette.mode
            });
        } else {
            await toast.success("Gửi yêu cầu thành công, vui lòng xác thực tài khoản.", {
                theme: theme.palette.mode
            });
            navigate("/admin/user/verification");
        }
    }

    return (
        <Routes>
            <Route path="/*" element={<User/>}/>
            <Route path="/:userId/detail" element={<UserProfile />} />
            <Route path="/create" 
            element={<UserForm
                handleSubmit = {handleCreateUser}
                title ="CREATE USER"
                subtitle = "Create a new user account"
                textSubmit = "CREATE NEW USER"
            />} />
            <Route path="/verification" element={<Verification/>}/>
        </Routes>
    )
}

export default ManageUser;