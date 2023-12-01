import axiosClient from "./AxiosClient";

class UserApi {

    signin = async (data: object) => {
        const url = '/api/user/login/';
        return await axiosClient.post(url, data);
    }
}

export default new UserApi();

