import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getRevenueReport, getBestSellersReport, setDateRange, setBestSellersDate } from '../../features/admin/reportSlice';
import { Line, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement, Filler
} from 'chart.js';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { subDays } from 'date-fns';
import { HiChartBar, HiCalendar } from 'react-icons/hi';
import { FaChartLine, FaChartBar, FaTrophy } from 'react-icons/fa';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement, Filler);

const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

const AdminReportPage = () => {
    const dispatch = useDispatch();
    // Get all necessary states from the reports slice
    const { revenueByPeriod, bestSellers, dateRange, bestSellersDate } = useSelector(state => state.reports);

    // Local state for the Revenue DatePicker
    const [revenueStartDate, setRevenueStartDate] = useState(dateRange.startDate ? new Date(dateRange.startDate) : subDays(new Date(), 30));
    const [revenueEndDate, setRevenueEndDate] = useState(dateRange.endDate ? new Date(dateRange.endDate) : new Date());

    // Local state for the Best Sellers Date Selectors
    const currentYear = new Date().getFullYear();
    const [selectedBSYear, setSelectedBSYear] = useState(bestSellersDate.year);
    const [selectedBSMonth, setSelectedBSMonth] = useState(bestSellersDate.month);

    // Effect to fetch reports when their status is 'idle' (on load or after filter change)
    useEffect(() => {
        if (revenueByPeriod.status === 'idle') {
            dispatch(getRevenueReport(dateRange));
        }
        if (bestSellers.status === 'idle') {
            dispatch(getBestSellersReport(bestSellersDate)); // Fetch based on the Redux date
        }
    }, [dispatch, revenueByPeriod.status, bestSellers.status, dateRange, bestSellersDate]); // Add all relevant dependencies

    // Handler for Revenue DatePicker change
    const handleRevenueDateChange = (dates) => {
        const [start, end] = dates;
        setRevenueStartDate(start);
        setRevenueEndDate(end);
        // Dispatch action to update Redux state only when range is complete or cleared
        if ((start && end) || (!start && !end)) {
            dispatch(setDateRange({ startDate: start, endDate: end }));
        }
    };

    // Handler for Best Sellers filter button click
    const handleBestSellersFilter = () => {
        // Dispatch action to update Redux state, useEffect will trigger refetch
        dispatch(setBestSellersDate({ year: selectedBSYear, month: selectedBSMonth }));
    };

    // --- Chart Data Preparation ---

    // Revenue Chart Data (Bar Chart)
    const revenueChartData = {
        labels: revenueByPeriod.data.map(item => item.period),
        datasets: [
            {
                label: 'Doanh thu (VND)',
                data: revenueByPeriod.data.map(item => item.revenue),
                borderColor: '#22d3ee',
                backgroundColor: 'rgba(34, 211, 238, 0.6)',
                borderWidth: 1,
                borderRadius: 4,
                maxBarThickness: 100, // Optional: Limit bar width
            },
        ],
    };

    // Best Sellers Chart Data (Horizontal Bar Chart)
    const bestSellersChartData = {
        labels: bestSellers.data.map(item => item.name),
        datasets: [
            {
                label: 'Số lượng bán',
                data: bestSellers.data.map(item => item.quantitySold),
                backgroundColor: 'rgba(56, 189, 248, 0.7)',
                borderColor: '#22d3ee',
                borderWidth: 1,
                borderRadius: 4,
            },
        ],
    };

    // --- Chart Options Configuration ---

    const commonChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: '#cbd5e0',
                    padding: 20,
                    font: { size: 14 }
                }
            },
            tooltip: {
                backgroundColor: '#1f2937',
                titleColor: '#e5e7eb',
                bodyColor: '#d1d5db',
                padding: 12,
                cornerRadius: 6,
                boxPadding: 4,
                callbacks: {
                    label: function (context) {
                        let label = context.dataset.label || '';
                        if (label) { label += ': '; }
                        let value = context.parsed.y; // Default for vertical bars
                        if (context.chart.options.indexAxis === 'y') { // Check if horizontal
                            value = context.parsed.x;
                        }
                        if (value !== null) {
                            if (context.dataset.label && context.dataset.label.toLowerCase().includes('doanh thu')) {
                                label += formatPrice(value); // Format revenue
                            } else {
                                label += value; // Show raw number for quantity
                            }
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            x: {
                ticks: { color: '#9ca3af' },
                grid: { color: '#374151' }
            },
            y: {
                ticks: { color: '#9ca3af' },
                grid: { color: '#374151' },
                beginAtZero: true
            }
        }
    };

    // Options for Revenue chart (vertical bar)
    const revenueBarOptions = { ...commonChartOptions };

    // Options for Best Sellers chart (horizontal bar)
    const bestSellersBarOptions = {
        ...commonChartOptions,
        indexAxis: 'y', // Make it horizontal
        scales: {
            x: {
                ticks: { color: '#9ca3af' },
                grid: { color: '#374151' },
                beginAtZero: true
            },
            y: {
                ticks: { color: '#9ca3af' },
                grid: { display: false } // Hide grid lines on Y-axis (product names)
            }
        }
    };

    // --- JSX Render ---

    return (
        <div className="relative text-white">
            {/* Animated Background */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-lg shadow-cyan-500/30">
                        <FaChartLine className="text-white" size={24} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-extrabold gaming-title">Báo cáo</h1>
                        <div className="h-1 w-24 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full mt-2"></div>
                    </div>
                </div>
            </div>

            {/* Date Filter Section (Revenue) */}
            <div className="mb-8 p-6 bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-xl border-2 border-gray-700/50 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                    <HiCalendar className="text-cyan-400" size={20} />
                    <label className="text-gray-300 font-semibold">Lọc Doanh Thu:</label>
                </div>
                <DatePicker
                    selected={revenueStartDate}
                    onChange={handleRevenueDateChange}
                    startDate={revenueStartDate}
                    endDate={revenueEndDate}
                    selectsRange
                    isClearable={true}
                    dateFormat="dd/MM/yyyy"
                    className="bg-gray-800/50 border-2 border-gray-700 text-white p-3 rounded-lg focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 outline-none w-full sm:w-80 transition-all"
                    placeholderText="Mặc định: 30 ngày qua"
                    wrapperClassName="w-full sm:w-auto"
                />
            </div>

            {/* Revenue Chart Section */}
            <div className="mb-12 bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border-2 border-gray-700/50">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-700/50">
                    <FaChartBar className="text-cyan-400" size={24} />
                    <h2 className="text-2xl font-extrabold gaming-section-title">Biểu đồ Doanh thu</h2>
                </div>
                <div className="h-80 relative">
                    {revenueByPeriod.status === 'loading' && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                                <p className="text-gray-400">Đang tải...</p>
                            </div>
                        </div>
                    )}
                    {revenueByPeriod.status === 'succeeded' && revenueByPeriod.data.length > 0 && (
                        <Bar options={revenueBarOptions} data={revenueChartData} />
                    )}
                    {revenueByPeriod.status === 'succeeded' && revenueByPeriod.data.length === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <p className="text-gray-400 text-lg">Không có dữ liệu doanh thu cho khoảng thời gian này.</p>
                        </div>
                    )}
                    {revenueByPeriod.status === 'failed' && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <p className="text-red-400 text-lg">Lỗi tải báo cáo doanh thu: {revenueByPeriod.error}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Best Sellers Chart Section */}
            <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border-2 border-gray-700/50">
                {/* Header and Filters for Best Sellers */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 pb-4 border-b border-gray-700/50">
                    <div className="flex items-center gap-3 mb-4 sm:mb-0">
                        <FaTrophy className="text-yellow-400" size={24} />
                        <h2 className="text-2xl font-extrabold gaming-section-title">Top 5 Sản phẩm bán chạy</h2>
                    </div>
                    <div className="flex items-center gap-3">
                        <select
                            value={selectedBSMonth}
                            onChange={e => setSelectedBSMonth(Number(e.target.value))}
                            className="bg-gray-800/50 border-2 border-gray-700 text-white p-2.5 rounded-lg focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 outline-none transition-all"
                        >
                            {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                                <option key={m} value={m}>Tháng {m}</option>
                            ))}
                        </select>
                        <select
                            value={selectedBSYear}
                            onChange={e => setSelectedBSYear(Number(e.target.value))}
                            className="bg-gray-800/50 border-2 border-gray-700 text-white p-2.5 rounded-lg focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 outline-none transition-all"
                        >
                            {Array.from({ length: 5 }, (_, i) => currentYear - i).map(y => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                        <button
                            onClick={handleBestSellersFilter}
                            disabled={bestSellers.status === 'loading'}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-2.5 px-6 rounded-lg transition-all shadow-lg hover:shadow-cyan-500/50 gaming-button disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Xem
                        </button>
                    </div>
                </div>
                {/* Chart container */}
                <div className="h-80 relative">
                    {bestSellers.status === 'loading' && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                                <p className="text-gray-400">Đang tải...</p>
                            </div>
                        </div>
                    )}
                    {bestSellers.status === 'succeeded' && bestSellers.data.length > 0 && (
                        <Bar options={bestSellersBarOptions} data={bestSellersChartData} />
                    )}
                    {bestSellers.status === 'succeeded' && bestSellers.data.length === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <p className="text-gray-400 text-lg">Không có sản phẩm nào được bán trong tháng này.</p>
                        </div>
                    )}
                    {bestSellers.status === 'failed' && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <p className="text-red-400 text-lg">Lỗi tải báo cáo sản phẩm: {bestSellers.error}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminReportPage;