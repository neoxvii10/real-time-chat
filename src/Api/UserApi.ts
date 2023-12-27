import axiosClient from "./AxiosClient";

class UserApi {

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

    getFriends = async () => {
        const url = '/api/user/friends/';
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
}

export default new UserApi();

