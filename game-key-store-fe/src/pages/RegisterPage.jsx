import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { register, selectAuthStatus, selectAuthError } from '../features/user/userSlice';
import { FaGamepad, FaUserPlus, FaArrowRight } from 'react-icons/fa';
import FloatingInput from '../components/auth/FloatingInput';
import PasswordStrength from '../components/auth/PasswordStrength';

const RegisterPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [errors, setErrors] = useState({});
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const authStatus = useSelector(selectAuthStatus);
    const authError = useSelector(selectAuthError);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });

        // Real-time validation
        if (id === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            setErrors(prev => ({
                ...prev,
                email: value && !emailRegex.test(value) ? 'Email không hợp lệ' : ''
            }));
        }

        if (id === 'password') {
            setErrors(prev => ({
                ...prev,
                password: value && value.length < 8 ? 'Mật khẩu phải có ít nhất 8 ký tự' : ''
            }));
        }

        if (id === 'confirmPassword') {
            setErrors(prev => ({
                ...prev,
                confirmPassword: value && value !== formData.password ? 'Mật khẩu không khớp' : ''
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validation
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Vui lòng nhập tên';
        if (!formData.email.trim()) newErrors.email = 'Vui lòng nhập email';
        if (!formData.password) newErrors.password = 'Vui lòng nhập mật khẩu';
        if (formData.password.length < 8) newErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự';
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Mật khẩu không khớp';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        if (authStatus !== 'loading') {
            dispatch(register({ name: formData.name, email: formData.email, password: formData.password }));
        }
    };

    useEffect(() => {
        if (authStatus === 'succeeded') {
            toast.success("Đăng ký thành công! Vui lòng kiểm tra email để nhận mã PIN.");
            navigate('/verify-email', { state: { email: formData.email } });
        }
        if (authStatus === 'failed' && authError) {
            toast.error(authError);
        }
    }, [authStatus, authError, navigate, formData.email]);

    return (
        <div className="min-h-screen flex bg-slate-950 relative overflow-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 -z-10 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
            </div>

            {/* Left Side - Visuals (Hidden on mobile) */}
            <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden bg-slate-900">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 z-10"></div>
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1538481199705-c710c4e965fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-40"></div>

                <div className="relative z-20 p-12 text-center">
                    <div className="inline-block p-4 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6 backdrop-blur-md animate-float">
                        <FaUserPlus className="text-6xl text-purple-400" />
                    </div>
                    <h2 className="text-5xl font-black text-white mb-6 leading-tight">
                        Tham Gia Cộng Đồng <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Game Thủ Việt</span>
                    </h2>
                    <p className="text-xl text-slate-300 max-w-md mx-auto leading-relaxed">
                        Tạo tài khoản ngay để nhận ưu đãi độc quyền, theo dõi đơn hàng và tham gia các sự kiện hấp dẫn.
                    </p>
                </div>

                {/* Animated Blobs */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/30 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative">
                <div className="w-full max-w-md">
                    <div className="text-center mb-10 lg:text-left">
                        <h1 className="text-4xl font-black text-white mb-2">Đăng Ký</h1>
                        <p className="text-slate-400">Điền thông tin bên dưới để tạo tài khoản mới.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <FloatingInput
                            id="name"
                            label="Tên hiển thị"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            error={errors.name}
                            required
                            autoFocus
                        />

                        <FloatingInput
                            id="email"
                            label="Email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            error={errors.email}
                            required
                        />

                        <div>
                            <FloatingInput
                                id="password"
                                label="Mật khẩu"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                showPasswordToggle={true}
                                error={errors.password}
                                required
                            />
                            {formData.password && <PasswordStrength password={formData.password} />}
                        </div>

                        <FloatingInput
                            id="confirmPassword"
                            label="Xác nhận mật khẩu"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            showPasswordToggle={true}
                            error={errors.confirmPassword}
                            required
                        />

                        <button
                            type="submit"
                            disabled={authStatus === 'loading'}
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group mt-6"
                        >
                            {authStatus === 'loading' ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    <span>Đang xử lý...</span>
                                </>
                            ) : (
                                <>
                                    <span>Đăng Ký Ngay</span>
                                    <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-center mt-8 text-slate-400">
                        Đã có tài khoản?{' '}
                        <Link to="/login" className="text-purple-400 hover:text-purple-300 font-bold hover:underline transition-colors">
                            Đăng nhập
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;