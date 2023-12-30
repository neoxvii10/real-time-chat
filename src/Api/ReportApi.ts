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

    getAllReports = async () => {
        const url = '/api/report/all/';
        return await axiosClient.get(url);
    }
    
    getRecentAllReports = async () => {
        const url = '/api/report/recent/all/';
        return await axiosClient.get(url);
    }

    getRecentUserReports = async () => {
        const url = '/api/report/recent/user/';
        return await axiosClient.get(url);
    }

    getRecentChannelReports = async () => {
        const url = '/api/report/recent/channel/';
        return await axiosClient.get(url);
    }

    getRecentStatReports = async () => {
        const url = '/api/report/recent/stat/';
        return await axiosClient.get(url);
    }

    getReportsStat = async () => {
        const url = '/api/report/stat/';
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

