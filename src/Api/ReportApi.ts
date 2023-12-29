import axiosClient from "./AxiosClient";

class ReportApi {

    getUserReports = async () => {
        const url = '/api/report/user/';
        return await axiosClient.get(url);
    }
    
    getChannelReports = async () => {
        const url = '/api/report/channel/';
        return await axiosClient.get(url);
    }

    processReport = async (reportId: any) => {
        const url = `/api/report/${reportId}/`
        return await axiosClient.put(url);
    }

    deleteReport = async (reportId: any) => {
        const url = `/api/report/${reportId}/`;
        return await axiosClient.delete(url);
    }
}

export default new ReportApi();

