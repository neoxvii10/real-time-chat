import axiosClient from "./AxiosClient";

class UserNotiApi {

    getUserNotis = async () => {
        const url = '/api/user/notifications/';
        return await axiosClient.get(url);
    }
}

export default new UserNotiApi();

