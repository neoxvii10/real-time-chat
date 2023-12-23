import axios from "axios";
import axiosClient from "./AxiosClient";

class ChannelApi {

    getChannelList = async () => {
        const url = '/api/channel/all/';
        return await axiosClient.get(url);
    }

    getChannelMembers = async (channelId: string) => {
        const url = `/api/channel/${channelId}/members`;
        return await axiosClient.get(url);
    }
}

export default new ChannelApi();

