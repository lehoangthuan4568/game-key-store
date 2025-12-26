import React from 'react';
import { Link } from 'react-router-dom';
import { FaGamepad, FaTrophy, FaRocket, FaAward, FaStar, FaFire, FaTags, FaGhost, FaDragon, FaDiceD20, FaHeadset, FaChessKnight } from 'react-icons/fa';

const FeaturedCategories = ({ genres, status }) => {
    if (status === 'loading' || !genres || genres.length === 0) {
        return null;
    }

    const featuredGenres = genres.slice(0, 6);
    // Expanded icon set for more variety
    const genreIcons = [FaGamepad, FaDragon, FaRocket, FaGhost, FaDiceD20, FaHeadset, FaChessKnight, FaTrophy, FaAward, FaStar, FaFire];

    return (
        <section className="mb-20 relative">
            {/* Section Header */}
            <div className="flex items-center gap-4 mb-10 relative z-10">
                <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700 shadow-[0_0_15px_rgba(6,182,212,0.15)] backdrop-blur-sm">
                    <FaTags className="text-cyan-400 text-3xl drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]" />
                </div>
                <div>
                    <h2 className="text-4xl font-black text-white tracking-tight">
                        Thể Loại <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Nổi Bật</span>
                    </h2>
                    <div className="h-1.5 w-32 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full mt-3 shadow-[0_0_10px_rgba(6,182,212,0.5)]"></div>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
                {featuredGenres.map((genre, index) => {
                    const IconComponent = genreIcons[index % genreIcons.length] || FaGamepad;
                    return (
                        <Link
                            key={genre._id}
                            to={`/products?genres=${genre._id}`}
                            className="group relative p-6 rounded-2xl bg-slate-900/60 border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] overflow-hidden backdrop-blur-md"
                        >
                            {/* Hover Gradient Background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                            {/* Animated Border Gradient */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
                                <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
                            </div>

                            <div className="relative z-10 flex flex-col items-center text-center gap-5">
                                {/* Icon Container */}
                                <div className="w-16 h-16 rounded-2xl bg-slate-800/80 flex items-center justify-center group-hover:bg-cyan-500/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-inner border border-slate-700 group-hover:border-cyan-500/30">
                                    <IconComponent className="text-3xl text-slate-400 group-hover:text-cyan-400 transition-colors drop-shadow-md" />
                                </div>

                                {/* Category Name */}
                                <h3 className="font-bold text-lg text-slate-300 group-hover:text-white transition-colors group-hover:drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">
                                    {genre.name}
                                </h3>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
};

export default FeaturedCategories;
