import React from 'react';
import { FaBolt, FaShieldAlt, FaHeadset, FaUndo } from 'react-icons/fa';

const BenefitsSection = () => {
    const benefits = [
        {
            icon: <FaBolt />,
            title: "Giao Hàng Tức Thì",
            desc: "Nhận key game ngay sau khi thanh toán thành công.",
            color: "text-yellow-400",
            bg: "bg-yellow-400/10",
            border: "group-hover:border-yellow-400/50"
        },
        {
            icon: <FaShieldAlt />,
            title: "Thanh Toán An Toàn",
            desc: "Bảo mật tuyệt đối với các cổng thanh toán uy tín.",
            color: "text-green-400",
            bg: "bg-green-400/10",
            border: "group-hover:border-green-400/50"
        },
        {
            icon: <FaHeadset />,
            title: "Hỗ Trợ 24/7",
            desc: "Đội ngũ hỗ trợ luôn sẵn sàng giải đáp mọi thắc mắc.",
            color: "text-cyan-400",
            bg: "bg-cyan-400/10",
            border: "group-hover:border-cyan-400/50"
        },
        {
            icon: <FaUndo />,
            title: "Hoàn Tiền Uy Tín",
            desc: "Cam kết hoàn tiền nếu key lỗi hoặc không sử dụng được.",
            color: "text-pink-400",
            bg: "bg-pink-400/10",
            border: "group-hover:border-pink-400/50"
        }
    ];

    return (
        <section className="mb-20 py-12 border-y border-slate-800 bg-slate-900/50 backdrop-blur-sm relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-cyan-500/5 blur-3xl pointer-events-none"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                {benefits.map((item, index) => (
                    <div key={index} className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-slate-800/50 transition-all duration-300 group border border-transparent hover:border-slate-700">
                        <div className={`w-20 h-20 rounded-2xl ${item.bg} border border-slate-700 flex items-center justify-center text-4xl ${item.color} mb-6 group-hover:scale-110 ${item.border} group-hover:shadow-[0_0_20px_rgba(0,0,0,0.3)] transition-all duration-300 relative overflow-hidden`}>
                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            {item.icon}
                        </div>
                        <h3 className="text-xl font-black text-white mb-3 group-hover:text-cyan-400 transition-colors tracking-tight">
                            {item.title}
                        </h3>
                        <p className="text-slate-400 text-sm leading-relaxed font-medium">
                            {item.desc}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default BenefitsSection;
