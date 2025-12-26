import React from 'react';
import { FaPaperPlane, FaEnvelope, FaGamepad } from 'react-icons/fa';

const Newsletter = () => {
    return (
        <section className="mb-20 relative overflow-hidden rounded-3xl p-8 md:p-16 text-center group">
            {/* Background with Gaming Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 z-0"></div>

            {/* Animated Glow Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            {/* Noise Texture */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 z-0 pointer-events-none"></div>

            {/* Border Gradient */}
            <div className="absolute inset-0 rounded-3xl border border-white/10 group-hover:border-cyan-500/30 transition-colors duration-500 z-10 pointer-events-none"></div>

            <div className="relative z-20 max-w-3xl mx-auto">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-slate-800/50 backdrop-blur-md border border-slate-700 mb-8 text-4xl text-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.3)] group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    <FaEnvelope />
                </div>

                <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight drop-shadow-lg">
                    Đừng Bỏ Lỡ <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Ưu Đãi HOT</span>
                </h2>

                <p className="text-slate-300 mb-10 text-lg md:text-xl leading-relaxed font-medium">
                    Nhận thông báo về các chương trình khuyến mãi, mã giảm giá độc quyền và cập nhật game mới nhất trực tiếp vào hộp thư của bạn.
                </p>

                <form className="flex flex-col sm:flex-row gap-4 relative">
                    <div className="relative flex-1 group/input">
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl blur opacity-20 group-hover/input:opacity-40 transition-opacity duration-300"></div>
                        <input
                            type="email"
                            placeholder="Nhập địa chỉ email của bạn..."
                            className="relative w-full px-6 py-4 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 backdrop-blur-sm transition-all"
                        />
                        <FaGamepad className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within/input:text-cyan-500 transition-colors" />
                    </div>
                    <button
                        type="button"
                        className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg relative overflow-hidden group/btn"
                    >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                        <FaPaperPlane className="relative z-10 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform duration-300" />
                        <span className="relative z-10">Đăng Ký Ngay</span>
                    </button>
                </form>

                <p className="mt-6 text-sm text-slate-500 font-medium">
                    Chúng tôi cam kết bảo mật thông tin. Bạn có thể hủy đăng ký bất cứ lúc nào.
                </p>
            </div>
        </section>
    );
};

export default Newsletter;
