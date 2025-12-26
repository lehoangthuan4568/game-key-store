// src/pages/ResetPasswordPage.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { resetPassword, selectAuthStatus, selectIsAuthenticated, selectAuthError, clearAuthError } from '../features/user/userSlice';
import { FaLock, FaCheckCircle } from 'react-icons/fa';
import FloatingInput from '../components/auth/FloatingInput';
import PasswordStrength from '../components/auth/PasswordStrength';

const ResetPasswordPage = () => {
    const location = useLocation();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});

    const email = location.state?.email;
    const pin = location.state?.pin;

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const authStatus = useSelector(selectAuthStatus);
    const isAuthenticated = useSelector(selectIsAuthenticated);

    useEffect(() => {
        if (!email || !pin) {
            toast.error("Phiên đặt lại mật khẩu không hợp lệ.");
            navigate('/forgot-password');
        }
        dispatch(clearAuthError());
    }, [email, pin, navigate, dispatch]);

    useEffect(() => {
        if (isAuthenticated) {
            toast.success("Đặt lại mật khẩu và đăng nhập thành công!");
            navigate('/');
        }
    }, [isAuthenticated, navigate])

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
        if (value && value.length < 8) {
            setErrors(prev => ({ ...prev, password: 'Mật khẩu phải có ít nhất 8 ký tự' }));
        } else {
            setErrors(prev => ({ ...prev, password: '' }));
        }
        if (confirmPassword && value !== confirmPassword) {
            setErrors(prev => ({ ...prev, confirmPassword: 'Mật khẩu không khớp' }));
        } else {
            setErrors(prev => ({ ...prev, confirmPassword: '' }));
        }
    };

    const handleConfirmPasswordChange = (e) => {
        const value = e.target.value;
        setConfirmPassword(value);
        if (value && value !== password) {
            setErrors(prev => ({ ...prev, confirmPassword: 'Mật khẩu không khớp' }));
        } else {
            setErrors(prev => ({ ...prev, confirmPassword: '' }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const newErrors = {};
        if (!password) newErrors.password = 'Vui lòng nhập mật khẩu';
        if (password.length < 8) newErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự';
        if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Mật khẩu không khớp';
        }
        
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        
        if (authStatus !== 'loading') {
            dispatch(resetPassword({ email, pin, password }))
                .unwrap()
                .catch((error) => toast.error(error));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 relative overflow-hidden">
            {/* Animated Background */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className="w-full max-w-md relative">
                {/* Gaming Card */}
                <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl p-8 lg:p-10 rounded-2xl shadow-2xl border-2 border-gray-700/50 relative overflow-hidden">
                    {/* Decorative gradient border */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-500/20 via-cyan-500/20 to-blue-500/20 opacity-0 hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                    
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-4 shadow-lg shadow-green-500/30">
                            <FaCheckCircle className="text-white" size={28} />
                        </div>
                        <h1 className="text-4xl font-extrabold mb-2 gaming-title">Đặt lại mật khẩu</h1>
                        <p className="text-gray-400">Tạo mật khẩu mới cho tài khoản của bạn</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <FloatingInput
                                id="password"
                                label="Mật khẩu mới"
                                type="password"
                                value={password}
                                onChange={handlePasswordChange}
                                showPasswordToggle={true}
                                error={errors.password}
                                required
                                autoFocus
                            />
                            {password && <PasswordStrength password={password} />}
                        </div>
                        
                        <FloatingInput
                            id="confirmPassword"
                            label="Xác nhận mật khẩu mới"
                            type="password"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            showPasswordToggle={true}
                            error={errors.confirmPassword}
                            required
                        />

                        <button 
                            type="submit" 
                            disabled={authStatus === 'loading'} 
                            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-green-500/50 gaming-button disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed flex items-center justify-center gap-2 group mt-6"
                        >
                            {authStatus === 'loading' ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    <span>Đang xử lý...</span>
                                </>
                            ) : (
                                <>
                                    <FaLock className="group-hover:scale-110 transition-transform" size={18} />
                                    <span>Đặt lại mật khẩu</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;