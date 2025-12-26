import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    // Không hiển thị phân trang nếu chỉ có 1 trang
    if (totalPages <= 1) {
        return null;
    }

    // Tạo một mảng chứa các số trang, ví dụ: [1, 2, 3, ...]
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="flex justify-center items-center space-x-2 mt-12 mb-4">
            {/* Nút Trang trước */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-md bg-gray-700 hover:bg-cyan-500 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed"
            >
                Trước
            </button>

            {/* Các nút số trang */}
            {pages.map(page => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`px-2 py-2 rounded-md transition-colors w-12 h-12 text-lg ${currentPage === page
                            ? 'bg-cyan-500 text-white font-bold'
                            : 'bg-gray-700 hover:bg-cyan-600'
                        }`}
                >
                    {page}
                </button>
            ))}

            {/* Nút Trang sau */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-md bg-gray-700 hover:bg-cyan-500 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed"
            >
                Sau
            </button>
        </div>
    );
};

export default Pagination;