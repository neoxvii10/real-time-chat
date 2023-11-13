import axiosClient from "./AxiosClient";

class UserApi {

    signin = (data: Object) => {
        const url = '/api/user/login/';
        return axiosClient.post(url, data);
    } 
}

export default new UserApi();

