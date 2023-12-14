import axiosClient from "./AxiosClient";

class ChannelApi {

    getChannelList = async () => {
        const url = '/api/channel/all/';
        return await axiosClient.get(url);
    }
}

export default new ChannelApi();

