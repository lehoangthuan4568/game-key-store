import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { updatePassword, selectAuthStatus, selectAuthError, clearAuthError } from '../features/user/userSlice';
import { FaLock, FaKey } from 'react-icons/fa';
import FloatingInput from '../components/auth/FloatingInput';
import PasswordStrength from '../components/auth/PasswordStrength';

const ChangePasswordPage = () => {
    const dispatch = useDispatch();
    const authStatus = useSelector(selectAuthStatus);
    const authError = useSelector(selectAuthError);

    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        // Xóa lỗi cũ khi vào trang
        dispatch(clearAuthError());
    }, [dispatch]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
        
        // Real-time validation
        if (id === 'newPassword') {
            if (value && value.length < 8) {
                setErrors(prev => ({ ...prev, newPassword: 'Mật khẩu phải có ít nhất 8 ký tự' }));
            } else {
                setErrors(prev => ({ ...prev, newPassword: '' }));
            }
            if (formData.confirmPassword && value !== formData.confirmPassword) {
                setErrors(prev => ({ ...prev, confirmPassword: 'Mật khẩu không khớp' }));
            } else {
                setErrors(prev => ({ ...prev, confirmPassword: '' }));
            }
        }
        
        if (id === 'confirmPassword') {
            if (value && value !== formData.newPassword) {
                setErrors(prev => ({ ...prev, confirmPassword: 'Mật khẩu không khớp' }));
            } else {
                setErrors(prev => ({ ...prev, confirmPassword: '' }));
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const newErrors = {};
        if (!formData.currentPassword) newErrors.currentPassword = 'Vui lòng nhập mật khẩu hiện tại';
        if (!formData.newPassword) newErrors.newPassword = 'Vui lòng nhập mật khẩu mới';
        if (formData.newPassword.length < 8) newErrors.newPassword = 'Mật khẩu phải có ít nhất 8 ký tự';
        if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Mật khẩu không khớp';
        }
        
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        
        if (authStatus !== 'loading') {
            dispatch(updatePassword({
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword,
            }))
                .unwrap()
                .then(() => {
                    toast.success('Đổi mật khẩu thành công!');
                    setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' }); // Reset form
                    setErrors({});
                })
                .catch((error) => {
                    toast.error(`Lỗi: ${error || 'Vui lòng thử lại'}`);
                });
        }
    };

    return (
        <div className="max-w-md mx-auto py-8">
            {/* Header */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full mb-4 shadow-lg shadow-cyan-500/30">
                    <FaKey className="text-white" size={28} />
                </div>
                <h1 className="text-4xl font-extrabold mb-2 gaming-title">Đổi mật khẩu</h1>
                <p className="text-gray-400">Bảo vệ tài khoản của bạn</p>
            </div>

            {/* Form Card */}
            <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border-2 border-gray-700/50 relative overflow-hidden">
                {/* Decorative gradient border */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 opacity-0 hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <FloatingInput
                        id="currentPassword"
                        label="Mật khẩu hiện tại"
                        type="password"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        showPasswordToggle={true}
                        error={errors.currentPassword}
                        required
                        autoFocus
                    />
                    
                    <div>
                        <FloatingInput
                            id="newPassword"
                            label="Mật khẩu mới"
                            type="password"
                            value={formData.newPassword}
                            onChange={handleChange}
                            showPasswordToggle={true}
                            error={errors.newPassword}
                            required
                        />
                        {formData.newPassword && <PasswordStrength password={formData.newPassword} />}
                    </div>
                    
                    <FloatingInput
                        id="confirmPassword"
                        label="Xác nhận mật khẩu mới"
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
                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-cyan-500/50 gaming-button disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed flex items-center justify-center gap-2 group mt-6"
                    >
                        {authStatus === 'loading' ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                <span>Đang xử lý...</span>
                            </>
                        ) : (
                            <>
                                <FaLock className="group-hover:scale-110 transition-transform" size={18} />
                                <span>Lưu thay đổi</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChangePasswordPage;