import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { login, selectIsAuthenticated, selectAuthStatus, selectAuthError, clearAuthError } from '../features/user/userSlice';
import { FaGoogle, FaGamepad, FaArrowRight } from 'react-icons/fa';
import { HiOutlineLockClosed, HiOutlineMail } from 'react-icons/hi';
import FloatingInput from '../components/auth/FloatingInput';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const isAuthenticated = useSelector(selectIsAuthenticated);
    const authStatus = useSelector(selectAuthStatus);
    const authError = useSelector(selectAuthError);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (authStatus !== 'loading') {
            dispatch(login({ email, password }));
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:5000/api/auth/google';
    };

    useEffect(() => {
        const urlError = searchParams.get('error');
        if (urlError) {
            toast.error('Đăng nhập bằng Google thất bại. Vui lòng thử lại.');
        }

        dispatch(clearAuthError());

        if (isAuthenticated) {
            toast.success('Đăng nhập thành công!');
            navigate('/');
        }

        if (authStatus === 'failed' && authError) {
            toast.error(authError);
        }
    }, [isAuthenticated, navigate, authStatus, authError, dispatch, searchParams]);

    return (
        <div className="min-h-screen flex bg-slate-950 relative overflow-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 -z-10 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
            </div>

            {/* Left Side - Visuals (Hidden on mobile) */}
            <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden bg-slate-900">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 z-10"></div>
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-40"></div>

                <div className="relative z-20 p-12 text-center">
                    <div className="inline-block p-4 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6 backdrop-blur-md animate-float">
                        <FaGamepad className="text-6xl text-cyan-400" />
                    </div>
                    <h2 className="text-5xl font-black text-white mb-6 leading-tight">
                        Chào Mừng Trở Lại <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Game Key Store</span>
                    </h2>
                    <p className="text-xl text-slate-300 max-w-md mx-auto leading-relaxed">
                        Khám phá hàng ngàn tựa game đỉnh cao với giá tốt nhất. Đăng nhập để tiếp tục hành trình của bạn.
                    </p>
                </div>

                {/* Animated Blobs */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/30 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative">
                <div className="w-full max-w-md">
                    <div className="text-center mb-10 lg:text-left">
                        <h1 className="text-4xl font-black text-white mb-2">Đăng Nhập</h1>
                        <p className="text-slate-400">Nhập thông tin tài khoản của bạn để tiếp tục.</p>
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

                        <div>
                            <FloatingInput
                                id="password"
                                label="Mật khẩu"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                showPasswordToggle={true}
                                required
                            />
                            <div className="flex justify-end mt-2">
                                <Link
                                    to="/forgot-password"
                                    className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors hover:underline font-medium"
                                >
                                    Quên mật khẩu?
                                </Link>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={authStatus === 'loading'}
                            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
                        >
                            {authStatus === 'loading' ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    <span>Đang xử lý...</span>
                                </>
                            ) : (
                                <>
                                    <span>Đăng Nhập</span>
                                    <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-800"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-slate-950 text-slate-500 font-medium">Hoặc đăng nhập với</span>
                        </div>
                    </div>

                    <button
                        onClick={handleGoogleLogin}
                        disabled={authStatus === 'loading'}
                        className="w-full bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                        <FaGoogle className="text-red-500 group-hover:scale-110 transition-transform" size={20} />
                        <span>Google</span>
                    </button>

                    <p className="text-center mt-8 text-slate-400">
                        Chưa có tài khoản?{' '}
                        <Link to="/register" className="text-cyan-400 hover:text-cyan-300 font-bold hover:underline transition-colors">
                            Đăng ký ngay
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;