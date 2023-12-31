import axiosClient from "./AxiosClient";

class UserProfileApi {
    getProfile = async () => {
        const url = '/api/user/profile/';
        return await axiosClient.get(url);
    }

    getChatProfile = async (channelId: number) => {
        const url = `/api/user/${channelId}/profile`;
    }
    
    getParticularProfile = async (id: any) => {
        const url = `/api/user/${id}/profile`;
        return await axiosClient.get(url);
    }

    putProfile = async (data: object) => {
        const url = '/api/user/profile/';
        return await axiosClient.put(url, data);
    }

    putAvatar = async (file: any) => {
        const url = '/api/user/profile/avatar/'
        return await axiosClient.put(url, file,
            {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
    }
}

export default new UserProfileApi();