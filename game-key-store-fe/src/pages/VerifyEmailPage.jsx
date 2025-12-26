import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { verify, resendPin, selectAuthStatus, selectIsAuthenticated, selectAuthError, clearAuthError } from '../features/user/userSlice';
import { HiOutlineMail, HiOutlineRefresh } from 'react-icons/hi';
import { FaShieldAlt } from 'react-icons/fa';
import PinInput from '../components/auth/PinInput';

const VerifyEmailPage = () => {
    const location = useLocation();
    const [pin, setPin] = useState('');
    const email = location.state?.email;

    // State cho bộ đếm ngược
    const [cooldown, setCooldown] = useState(0);
    const timerRef = useRef(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const authStatus = useSelector(selectAuthStatus);
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const authError = useSelector(selectAuthError);
    const [currentAction, setCurrentAction] = useState(null);

    // Xử lý bộ đếm ngược
    useEffect(() => {
        if (cooldown > 0) {
            timerRef.current = setTimeout(() => {
                setCooldown(cooldown - 1);
            }, 1000);
        }
        return () => {
            clearTimeout(timerRef.current);
        };
    }, [cooldown]);

    useEffect(() => {
        if (!email) {
            toast.error("Không tìm thấy email để xác thực.");
            navigate('/register');
        }
        dispatch(clearAuthError());
    }, [email, navigate, dispatch]);

    useEffect(() => {
        if (isAuthenticated) {
            toast.success("Xác thực và đăng nhập thành công!");
            navigate('/');
        }
        if (authStatus === 'failed' && authError) {
            toast.error(authError);
            setCurrentAction(null);
        }
        if (authStatus === 'succeeded' && currentAction === 'resend') {
            toast.success("Mã PIN mới đã được gửi!");
            setCooldown(60); // Bắt đầu đếm ngược
            setCurrentAction(null);
        }
    }, [isAuthenticated, authStatus, authError, navigate, currentAction]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (authStatus !== 'loading' && pin.length === 6) {
            setCurrentAction('verify');
            dispatch(verify({ email, pin }));
        } else if (pin.length < 6) {
            toast.error('Vui lòng nhập đủ 6 chữ số');
        }
    };

    const handleResendPin = () => {
        if (authStatus !== 'loading' && cooldown === 0) {
            setCurrentAction('resend');
            dispatch(resendPin({ email }));
        }
    };

    const isLoading = authStatus === 'loading';

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
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full mb-4 shadow-lg shadow-cyan-500/30 animate-pulse">
                            <FaShieldAlt className="text-white" size={28} />
                        </div>
                        <h1 className="text-4xl font-extrabold mb-2 gaming-title">Xác thực tài khoản</h1>
                        <p className="text-gray-400 mb-2">
                            Mã PIN gồm 6 chữ số đã được gửi tới
                        </p>
                        <p className="text-cyan-400 font-semibold text-lg">{email}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <PinInput
                            value={pin}
                            onChange={setPin}
                            length={6}
                            error={authStatus === 'failed' && currentAction === 'verify'}
                            disabled={isLoading}
                        />
                        
                        <button 
                            type="submit" 
                            disabled={isLoading || pin.length !== 6} 
                            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-cyan-500/50 gaming-button disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                        >
                            {isLoading && currentAction === 'verify' ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    <span>Đang xác thực...</span>
                                </>
                            ) : (
                                <>
                                    <FaShieldAlt className="group-hover:scale-110 transition-transform" size={18} />
                                    <span>Xác thực</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="text-center mt-8 pt-6 border-t border-gray-700/50">
                        <p className="text-gray-400 mb-3">
                            Không nhận được mã?
                        </p>
                        <button 
                            onClick={handleResendPin} 
                            disabled={isLoading || cooldown > 0} 
                            className="inline-flex items-center gap-2 font-semibold text-cyan-400 hover:text-cyan-300 transition-colors disabled:text-gray-500 disabled:cursor-not-allowed group"
                        >
                            <HiOutlineRefresh className={`${cooldown > 0 ? 'animate-spin' : 'group-hover:rotate-180 transition-transform'}`} size={18} />
                            {cooldown > 0 ? `Gửi lại sau (${cooldown}s)` : (isLoading && currentAction === 'resend' ? 'Đang gửi...' : 'Gửi lại mã PIN')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmailPage;