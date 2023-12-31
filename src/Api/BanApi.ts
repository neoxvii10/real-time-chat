import axiosClient from "./AxiosClient";

class BanApi {

    banUser = async (id: any) => {
        const url = `/api/user/ban/${id}/`
        return await axiosClient.post(url);
    }

    unbanUser = async (id: any) => {
        const url = `/api/user/unban/${id}/`
        return await axiosClient.post(url);
    }

    banChannel = async (id: any) => {
        const url = `/api/channel/ban/${id}/`
        return await axiosClient.post(url);
    }

    unbanChannel = async (id: any) => {
        const url = `/api/channel/unban/${id}/`
        return await axiosClient.post(url);
    }
}

export default new BanApi();

