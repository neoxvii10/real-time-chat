import axiosClient from "./AxiosClient";

class SearchUserApi {
    getSearchResults = async () => {
      const url = "/api/search/channel/";
      try {
        const response = await axiosClient.get(url);
        return response;
      } catch (error) {
        console.error("Error fetching search results:", error);
        throw error;
      }
    };
  }
  
  export default new SearchUserApi();
  
