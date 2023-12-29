import axiosClient from "./AxiosClient";

class ChannelApi {

    getChannelList = async () => {
        const url = '/api/user/channels/';
        return await axiosClient.get(url);
    }

    createChannel = async (data: any) => {
        const url = '/api/channel/';
        return await axiosClient.post(url, data);
    }

    uploadAvatar = async (data: any) => {
        const url = '/api/channel/upload/avatar/';
        return await axiosClient.post(url, data, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
    }

    getChannelMediaList = async (channelId: number) => {
        const url = `/api/channel/${channelId}/media`;
        return await axiosClient.get(url);
    }
}

export default new ChannelApi();

