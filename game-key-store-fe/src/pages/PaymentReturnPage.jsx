// src/pages/PaymentReturnPage.jsx
import React, { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearCart } from '../features/cart/cartSlice'; // Import action xóa giỏ hàng
import { HiCheckCircle, HiXCircle } from 'react-icons/hi';
import { toast } from 'react-hot-toast';

const PaymentReturnPage = () => {
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();

    const responseCode = searchParams.get('vnp_ResponseCode');
    const orderId = searchParams.get('vnp_TxnRef');
    const amount = searchParams.get('vnp_Amount');
    const bankCode = searchParams.get('vnp_BankCode');
    const payDate = searchParams.get('vnp_PayDate');

    const isSuccess = responseCode === '00'; // Mã 00 là thành công

    useEffect(() => {
        if (isSuccess) {
            // Thanh toán thành công, xóa giỏ hàng
            dispatch(clearCart());
        } else {
            // Thanh toán thất bại
            toast.error('Thanh toán thất bại hoặc đã bị hủy.');
        }
    }, [isSuccess, dispatch]);

    // Định dạng lại ngày tháng
    const formattedDate = payDate
        ? `${payDate.substr(6, 2)}/${payDate.substr(4, 2)}/${payDate.substr(0, 4)} - ${payDate.substr(8, 2)}:${payDate.substr(10, 2)}`
        : 'N/A';

    // Định dạng lại số tiền
    const formattedAmount = amount
        ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(amount) / 100)
        : 'N/A';

    return (
        <div className="flex justify-center items-center py-20">
            <div className="max-w-xl w-full bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700 text-center">
                {isSuccess ? (
                    // --- GIAO DIỆN THÀNH CÔNG ---
                    <>
                        <HiCheckCircle className="text-green-400 text-6xl mx-auto mb-4" />
                        <h1 className="text-3xl font-bold text-white mb-3">Thanh toán thành công!</h1>
                        <p className="text-gray-400 mb-6">
                            Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được xác nhận.
                            <br />
                            Một email chứa key game đang được gửi đến bạn.
                        </p>
                    </>
                ) : (
                    // --- GIAO DIỆN THẤT BẠI ---
                    <>
                        <HiXCircle className="text-red-500 text-6xl mx-auto mb-4" />
                        <h1 className="text-3xl font-bold text-white mb-3">Thanh toán thất bại</h1>
                        <p className="text-gray-400 mb-6">
                            Đã xảy ra lỗi trong quá trình thanh toán hoặc bạn đã hủy giao dịch.
                            <br />
                            Giỏ hàng của bạn vẫn được giữ nguyên.
                        </p>
                    </>
                )}

                {/* Thông tin giao dịch */}
                <div className="text-left bg-gray-700/50 p-4 rounded-md mb-8 border border-gray-600 space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-400">Mã đơn hàng:</span>
                        <span className="font-mono text-gray-200">{orderId}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">Số tiền:</span>
                        <span className="font-semibold text-cyan-400">{formattedAmount}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">Ngân hàng:</span>
                        <span className="text-gray-200">{bankCode || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">Thời gian:</span>
                        <span className="text-gray-200">{formattedDate}</span>
                    </div>
                </div>

                {/* Nút điều hướng */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/products" className="bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2.5 px-6 rounded-md transition-colors">
                        Tiếp tục mua sắm
                    </Link>
                    <Link to="/user/my-orders" className="bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-2.5 px-6 rounded-md transition-colors">
                        Xem lịch sử đơn hàng
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PaymentReturnPage;