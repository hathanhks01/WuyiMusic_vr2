import http from '../common/http-common';

const StatisticService = {
    GetNewUsersCountByDateRange: async () => {
        try {
            const response = await http.get('/Statistic/new-users-count2');
            return response.data; 
        } catch (error) {
            console.error("Lỗi khi gọi API:", error);
            throw error; 
        }
    }
};

export default StatisticService;
