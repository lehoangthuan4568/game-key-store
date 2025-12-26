import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination, EffectFade } from 'swiper/modules';
import { Link } from 'react-router-dom';
import { FaGamepad, FaFire, FaStar, FaGift, FaArrowRight } from 'react-icons/fa';
import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';
import { getImageUrl } from '../../utils/imageUtils';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const HeroBanner = ({ products, status }) => {
    if (status !== 'succeeded' || !products || products.length === 0) {
        return (
            <div className="relative h-[500px] md:h-[650px] rounded-2xl mb-20 overflow-hidden shadow-2xl bg-slate-900 animate-pulse border border-slate-800">
                <div className="absolute inset-0 bg-gradient-to-r from-slate-800 to-slate-900 animate-pulse"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <FaGamepad className="text-slate-700 text-6xl animate-bounce" />
                </div>
            </div>
        );
    }

    return (
        <div className="relative h-[500px] md:h-[650px] rounded-2xl mb-20 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] group bg-slate-900 gaming-hero-container border border-slate-800/50">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 opacity-30 animate-gradient-xy pointer-events-none z-0"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 z-0 pointer-events-none"></div>

            <Swiper
                modules={[Navigation, Autoplay, Pagination, EffectFade]}
                slidesPerView={1}
                loop={true}
                effect="fade"
                fadeEffect={{ crossFade: true }}
                autoplay={{
                    delay: 6000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                }}
                pagination={{
                    clickable: true,
                    dynamicBullets: true,
                    renderBullet: function (index, className) {
                        return '<span class="' + className + ' transition-all duration-300"></span>';
                    },
                }}
                navigation={{
                    prevEl: '.hero-swiper-prev',
                    nextEl: '.hero-swiper-next',
                }}
                className="h-full w-full z-10"
            >
                {products.map(product => (
                    <SwiperSlide key={product._id}>
                        <div className="relative w-full h-full">
                            {/* Background Image */}
                            <div
                                className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 group-hover:scale-100 transition-transform duration-[3s] ease-out"
                                style={{ backgroundImage: `url(${getImageUrl(product.coverImage)})` }}
                            />

                            {/* Overlay Gradients - Improved visibility */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent"></div>
                            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-900/60 to-transparent"></div>

                            {/* Content */}
                            <div className="absolute inset-0 flex items-center z-20">
                                <div className="container-custom w-full px-4 sm:px-6 lg:px-8">
                                    <div className="max-w-3xl space-y-6 md:space-y-8 p-6 md:p-10 rounded-3xl bg-slate-900/40 backdrop-blur-md border border-white/5 shadow-2xl animate-slideUp relative overflow-hidden">
                                        {/* Decorative glow behind content */}
                                        <div className="absolute -top-20 -right-20 w-60 h-60 bg-cyan-500/20 rounded-full blur-[80px] pointer-events-none"></div>
                                        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-purple-500/20 rounded-full blur-[80px] pointer-events-none"></div>

                                        {/* Badges */}
                                        <div className="flex flex-wrap gap-3 relative z-10">
                                            {product.isHot && (
                                                <span className="px-3 py-1 rounded-md bg-orange-500/20 border border-orange-500/50 text-orange-400 text-xs md:text-sm font-bold flex items-center gap-1.5 backdrop-blur-sm shadow-[0_0_10px_rgba(249,115,22,0.2)]">
                                                    <FaFire /> HOT DEAL
                                                </span>
                                            )}
                                            {product.isNew && (
                                                <span className="px-3 py-1 rounded-md bg-blue-500/20 border border-blue-500/50 text-blue-400 text-xs md:text-sm font-bold flex items-center gap-1.5 backdrop-blur-sm shadow-[0_0_10px_rgba(59,130,246,0.2)]">
                                                    <FaStar /> NEW ARRIVAL
                                                </span>
                                            )}
                                            {product.salePrice && product.salePrice < product.price && (
                                                <span className="px-3 py-1 rounded-md bg-red-500/20 border border-red-500/50 text-red-400 text-xs md:text-sm font-bold flex items-center gap-1.5 backdrop-blur-sm shadow-[0_0_10px_rgba(239,68,68,0.2)]">
                                                    <FaGift /> SALE
                                                </span>
                                            )}
                                        </div>

                                        {/* Title */}
                                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight drop-shadow-lg tracking-tight relative z-10">
                                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-cyan-200 filter drop-shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                                                {product.name}
                                            </span>
                                        </h1>

                                        {/* Price */}
                                        <div className="flex items-center gap-4 md:gap-6 relative z-10">
                                            {product.salePrice && product.salePrice < product.price ? (
                                                <>
                                                    <div className="flex flex-col">
                                                        <span className="text-4xl md:text-6xl font-bold text-cyan-400 text-shadow-glow tracking-tighter">
                                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.salePrice)}
                                                        </span>
                                                        <div className="flex items-center gap-3 mt-1">
                                                            <span className="text-lg md:text-xl text-slate-400 line-through font-medium">
                                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                                                            </span>
                                                            <span className="px-2 py-0.5 bg-red-600 text-white text-xs font-bold rounded shadow-lg shadow-red-600/30">
                                                                -{Math.round(((product.price - product.salePrice) / product.price) * 100)}%
                                                            </span>
                                                        </div>
                                                    </div>
                                                </>
                                            ) : (
                                                <span className="text-4xl md:text-6xl font-bold text-cyan-400 text-shadow-glow tracking-tighter">
                                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                                                </span>
                                            )}
                                        </div>

                                        {/* Action Button */}
                                        <div className="pt-4 relative z-10">
                                            <Link
                                                to={`/product/${product.slug}`}
                                                className="relative inline-flex group/btn"
                                            >
                                                <div className="absolute transition-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xl blur-lg group-hover/btn:opacity-100 group-hover/btn:-inset-1 group-hover/btn:duration-200 animate-tilt"></div>
                                                <button className="relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-slate-900 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 border border-slate-700 group-hover/btn:border-white/20">
                                                    <FaGamepad className="mr-3 text-cyan-400 group-hover/btn:rotate-12 transition-transform duration-300" size={24} />
                                                    <span>Mua Ngay</span>
                                                    <FaArrowRight className="ml-2 opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all duration-300" />
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Navigation Buttons */}
            <div className="hero-swiper-prev swiper-button-prev-custom group/nav">
                <HiOutlineChevronLeft size={24} className="group-hover/nav:scale-110 transition-transform" />
            </div>
            <div className="hero-swiper-next swiper-button-next-custom group/nav">
                <HiOutlineChevronRight size={24} className="group-hover/nav:scale-110 transition-transform" />
            </div>
        </div>
    );
};

export default HeroBanner;
