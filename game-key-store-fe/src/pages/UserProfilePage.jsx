import React from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/user/userSlice';
import RankBadge from '../components/user/RankBadge';
import '../components/user/GamificationStyles.css';
import { FaCoins, FaGift, FaHistory, FaGamepad, FaCalendarAlt, FaLock } from 'react-icons/fa';
import { HiOutlineSparkles } from 'react-icons/hi';

const UserProfilePage = () => {
    const user = useSelector(selectUser);

    if (!user) return null;

    const { rank, xp, points, badges, stats } = user;

    // Calculate progress percentage
    const progressPercent = Math.min(100, Math.round((xp / (rank?.nextTierXp || 10000)) * 100));

    // Mock badges config
    const badgesConfig = {
        early_adopter: { name: 'Người Tiên Phong', icon: '🚀', desc: 'Tham gia từ những ngày đầu' },
        big_spender: { name: 'Đại Gia', icon: '💎', desc: 'Chi tiêu trên 10 triệu' },
        rpg_fan: { name: 'Fan Cứng RPG', icon: '⚔️', desc: 'Sở hữu 10 game RPG' },
        fps_master: { name: 'Xạ Thủ', icon: '🎯', desc: 'Sở hữu 5 game FPS' },
        sale_hunter: { name: 'Thợ Săn Sale', icon: '🏷️', desc: 'Mua 5 game giảm giá' },
        reviewer: { name: 'Nhà Phê Bình', icon: '✍️', desc: 'Viết 10 đánh giá' }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 -z-10 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px] animate-float"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-600/10 rounded-full blur-[120px] animate-float" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="container-custom py-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-br from-cyan-400 to-purple-500 animate-spin-slow">
                            <div className="w-full h-full rounded-full bg-slate-900 p-1">
                                <img
                                    src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=0D8ABC&color=fff`}
                                    alt={user.name}
                                    className="w-full h-full rounded-full object-cover"
                                />
                            </div>
                        </div>
                        <div className="absolute -bottom-2 -right-2">
                            <RankBadge rank={rank} size="sm" showName={false} />
                        </div>
                    </div>

                    <div className="text-center md:text-left flex-1">
                        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-blue-200 mb-2">
                            {user.name}
                        </h1>
                        <p className="text-slate-400 flex items-center justify-center md:justify-start gap-2">
                            <FaCalendarAlt /> Thành viên từ {stats?.memberSince || '2023'}
                        </p>
                    </div>

                    {/* Rank Card */}
                    <div className="gaming-card p-6 rounded-2xl w-full md:w-auto min-w-[300px] relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="flex items-center justify-between mb-4 relative z-10">
                            <div>
                                <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">Hạng Hiện Tại</p>
                                <h2 className={`text-2xl font-black bg-gradient-to-r ${rank?.name === 'Gold' ? 'from-yellow-400 to-yellow-600' : 'from-cyan-400 to-blue-600'} bg-clip-text text-transparent`}>
                                    {rank?.name || 'Bronze'}
                                </h2>
                            </div>
                            <RankBadge rank={rank} size="md" showName={false} />
                        </div>

                        <div className="relative z-10">
                            <div className="flex justify-between text-xs font-bold text-slate-400 mb-1">
                                <span>XP: {xp}</span>
                                <span>Next: {rank?.nextTierXp}</span>
                            </div>
                            <div className="h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                                <div
                                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 progress-bar-striped animate-shine"
                                    style={{ width: `${progressPercent}%` }}
                                ></div>
                            </div>
                            <p className="text-xs text-cyan-400 mt-2 text-right">
                                Còn {rank?.nextTierXp - xp} XP để lên hạng tiếp theo
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Stats & Currency */}
                    <div className="space-y-8">
                        {/* GamePoints */}
                        <div className="gaming-card p-6 rounded-2xl relative overflow-hidden group">
                            <div className="absolute -right-10 -top-10 w-32 h-32 bg-yellow-500/20 rounded-full blur-3xl group-hover:bg-yellow-500/30 transition-all"></div>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 rounded-xl bg-yellow-500/20 border border-yellow-500/30 text-yellow-400">
                                    <FaCoins size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">GamePoints</h3>
                                    <p className="text-3xl font-black text-yellow-400 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]">
                                        {points}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <button className="w-full py-3 rounded-xl bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white font-bold shadow-lg shadow-yellow-900/20 transition-all active:scale-95 flex items-center justify-center gap-2">
                                    <FaGift /> Đổi Quà Ngay
                                </button>
                                <button className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-bold transition-all flex items-center justify-center gap-2">
                                    <HiOutlineSparkles className="text-purple-400" /> Hộp Quà May Mắn
                                </button>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="gaming-card p-6 rounded-2xl">
                            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                <FaHistory className="text-cyan-400" /> Thống Kê
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-3 rounded-xl bg-slate-900/50 border border-slate-800">
                                    <span className="text-slate-400">Tổng Chi Tiêu</span>
                                    <span className="font-bold text-white">
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stats?.totalSpent || 0)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center p-3 rounded-xl bg-slate-900/50 border border-slate-800">
                                    <span className="text-slate-400">Game Sở Hữu</span>
                                    <span className="font-bold text-white flex items-center gap-2">
                                        <FaGamepad className="text-purple-400" /> {stats?.gamesOwned || 0}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Badges */}
                    <div className="lg:col-span-2">
                        <div className="gaming-card p-8 rounded-2xl h-full">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                                    <FaMedal className="text-yellow-400" /> Bộ Sưu Tập Huy Hiệu
                                </h3>
                                <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-sm text-slate-400">
                                    {badges?.length || 0} / {Object.keys(badgesConfig).length} Đã đạt
                                </span>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                                {Object.entries(badgesConfig).map(([id, config]) => {
                                    const isUnlocked = badges?.includes(id);
                                    return (
                                        <div
                                            key={id}
                                            className={`relative p-4 rounded-xl border transition-all duration-300 group ${isUnlocked
                                                ? 'bg-slate-900/50 border-cyan-500/30 hover:border-cyan-500 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                                                : 'bg-slate-900/30 border-slate-800 opacity-60 grayscale hover:opacity-80'
                                                }`}
                                        >
                                            <div className="flex flex-col items-center text-center gap-3">
                                                <div className={`text-4xl transition-transform duration-300 group-hover:scale-110 ${isUnlocked ? 'animate-float' : ''}`}>
                                                    {config.icon}
                                                </div>
                                                <div>
                                                    <h4 className={`font-bold ${isUnlocked ? 'text-white' : 'text-slate-500'}`}>
                                                        {config.name}
                                                    </h4>
                                                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                                                        {config.desc}
                                                    </p>
                                                </div>
                                                {!isUnlocked && (
                                                    <div className="absolute top-2 right-2 text-slate-600">
                                                        <FaLock size={12} />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfilePage;
