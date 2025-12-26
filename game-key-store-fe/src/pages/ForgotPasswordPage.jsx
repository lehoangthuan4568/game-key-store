// src/pages/ForgotPasswordPage.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { forgotPassword, selectAuthStatus, selectAuthError, clearAuthError } from '../features/user/userSlice';
import { HiOutlineKey, HiOutlineArrowLeft } from 'react-icons/hi';
import { FaLock } from 'react-icons/fa';
import FloatingInput from '../components/auth/FloatingInput';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const authStatus = useSelector(selectAuthStatus);
    const authError = useSelector(selectAuthError);

    useEffect(() => {
        dispatch(clearAuthError());
    }, [dispatch]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (authStatus !== 'loading') {
            dispatch(forgotPassword({ email }))
                .unwrap()
                .then(() => {
                    toast.success('Mã PIN đã được gửi tới email của bạn!');
                    navigate('/verify-pin', { state: { email, from: 'forgot-password' } });
                })
                .catch((error) => {
                    toast.error(error);
                });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 relative overflow-hidden">
            {/* Animated Background */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className="w-full max-w-md relative">
                {/* Gaming Card */}
                <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl p-8 lg:p-10 rounded-2xl shadow-2xl border-2 border-gray-700/50 relative overflow-hidden">
                    {/* Decorative gradient border */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 opacity-0 hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                    
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full mb-4 shadow-lg shadow-orange-500/30">
                            <FaLock className="text-white" size={28} />
                        </div>
                        <h1 className="text-4xl font-extrabold mb-2 gaming-title">Quên mật khẩu</h1>
                        <p className="text-gray-400">Nhập email để nhận mã PIN đặt lại mật khẩu</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <FloatingInput
                            id="email"
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoFocus
                        />

                        <button
                            type="submit"
                            disabled={authStatus === 'loading'}
                            className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-orange-500/50 gaming-button disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                        >
                            {authStatus === 'loading' ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    <span>Đang gửi...</span>
                                </>
                            ) : (
                                <>
                                    <HiOutlineKey className="group-hover:rotate-12 transition-transform" size={20} />
                                    <span>Gửi mã PIN</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="text-center mt-8 pt-6 border-t border-gray-700/50">
                        <Link 
                            to="/login" 
                            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-semibold transition-colors group"
                        >
                            <HiOutlineArrowLeft className="group-hover:-translate-x-1 transition-transform" size={18} />
                            <span>Quay lại Đăng nhập</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;