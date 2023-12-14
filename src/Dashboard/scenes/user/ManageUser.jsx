import React from "react";
import { Routes, Route, useParams } from 'react-router-dom';
import User from "./User";
import UserForm from "../../components/UserForm";
const ManageUser = () => {
    const {userId} = useParams()

    const handleUpdateUser = (values) => {
        console.log(values);
    }

    const handleCreateUser = (values) => {
        console.log(values);
    }

    return (
        <Routes>
            <Route path="/*" element={<User/>}/>
            <Route path="/:userId/edit" element={<UserForm 
                userId={userId}
                handleSubmit = {handleUpdateUser}
                title="UPDATE USER INFORMATION"
                subtitle = "Update information of user"
                textSubmit = "UPDATE INFORMATION"
            />} />
            <Route path="/create" 
            element={<UserForm
                handleSubmit = {handleCreateUser}
                title ="CREATE USER"
                subtitle = "Create a new user account"
                textSubmit = "CREATE NEW USER"
            />} />
        </Routes>
    )
}

export default ManageUser;