import axiosClient from "./AxiosClient";

class ChannelApi {

    getChannelList = async () => {
        const url = '/api/user/channels/';
        return await axiosClient.get(url);
    }
}

export default new ChannelApi();

