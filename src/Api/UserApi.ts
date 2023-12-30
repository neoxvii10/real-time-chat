import axiosClient from "./AxiosClient";

class UserApi {

    signup = async (data: object) => {
        const url = "/api/user/signup/";
        return await axiosClient.post(url, data);
    }

    signin = async (data: object) => {
        const url = '/api/user/login/';
        return await axiosClient.post(url, data);
    }

    requestResetPassword = async (data: object) => {
        const url = '/api/user/passwordreset/';
        return await axiosClient.post(url, data);
    }
    
    resetPassword = async (data: object) => {
        const url = '/api/user/passwordreset/confirm/';
        return await axiosClient.post(url, data);
    }

    changePassword = async (data: object) => {
        const url = '/api/user/change-password/'
        return await axiosClient.put(url, data);
    }

    changeEmail = async (data: object) => {
        const url = '/api/user/change-email/'
        return await axiosClient.put(url, data);
    }

    verifyChangeEmail = async (data: object) => {
        const url = '/api/user/verify-email/'
        return await axiosClient.post(url, data);
    }

    getUserInformation = async () => {
        const url = "/api/user/";
        return await axiosClient.get(url);
    }

    getFriends = async () => {
        const url = '/api/user/friends/';
        return await axiosClient.get(url);
    }

    getFriendsOfAUser = async (userId: any) => {
        const url = `/api/user/${userId}/friends/`;
        return await axiosClient.get(url);
    }

    getUserList = async () => {
        const url = '/api/user/all/';
        return await axiosClient.get(url);
    }

    deleteFriend = async (userId: number) => {
        const url = `/api/user/friend/${userId}/`
        return await axiosClient.delete(url);
    }
    
    getRecentUserList = async () => {
        const url = '/api/user/recent/all/';
        return await axiosClient.get(url);
    }

    verifyUser = async (data: object) => {
        const url = '/api/user/verify-user/';
        return await axiosClient.post(url, data);
    }
}

export default new UserApi();

