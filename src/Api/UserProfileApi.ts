import axiosClient from "./AxiosClient";

class UserProfileApi {
    getProfile = async () => {
        const url = '/api/user/profile/';
        return await axiosClient.get(url);
    }

    putProfile = async (data: object) => {
        const url = '/api/user/profile/';
        return await axiosClient.put(url, data);
    }
}

export default new UserProfileApi();