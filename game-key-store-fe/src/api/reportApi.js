// src/api/reportApi.js
import api from './api';
import { formatISO } from 'date-fns'; // Dùng để định dạng ngày gửi lên API
export const fetchRevenueByPeriod = async (dateRange) => {
    const params = {};
    if (dateRange?.startDate) {
        // Gửi ngày dưới dạng YYYY-MM-DD
        params.startDate = formatISO(dateRange.startDate, { representation: 'date' });
    }
    if (dateRange?.endDate) {
        params.endDate = formatISO(dateRange.endDate, { representation: 'date' });
    }
    const response = await api.get('/reports/revenue-by-period', { params });
    return response.data.data.stats;
};

export const fetchBestSellers = async ({ year, month }) => {
    const response = await api.get('/reports/best-sellers', { params: { year, month } });
    return response.data.data.stats;
};