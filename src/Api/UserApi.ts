import axiosClient from "./AxiosClient";

class UserApi {

    signin = async (data: object) => {
        const url = '/api/user/login/';
        return await axiosClient.post(url, data);
    }
    
    getFriends = async () => {
        const url = '/api/user/friends/';
        return await axiosClient.get(url);
    }
}

export default new UserApi();

