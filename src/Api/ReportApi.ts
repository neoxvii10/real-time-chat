import axiosClient from "./AxiosClient";

class ReportApi {

    createReport = async (data: any) => {
        const url = '/api/report/'
        return await axiosClient.post(url, data)
    }

    getUserReports = async () => {
        const url = '/api/report/user/';
        return await axiosClient.get(url);
    }
    
    getChannelReports = async () => {
        const url = '/api/report/channel/';
        return await axiosClient.get(url);
    }
}

export default new ReportApi();

