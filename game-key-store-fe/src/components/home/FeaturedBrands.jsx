import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import { FaGamepad, FaSteam, FaXbox, FaPlaystation, FaTwitch, FaDiscord, FaWindows, FaApple } from 'react-icons/fa';

const FeaturedBrands = () => {
    // Enhanced brand data with icons
    const brands = [
        { name: "Ubisoft", color: "text-blue-500", icon: <FaGamepad /> },
        { name: "EA Games", color: "text-red-500", icon: <FaGamepad /> },
        { name: "Steam", color: "text-blue-400", icon: <FaSteam /> },
        { name: "Xbox", color: "text-green-500", icon: <FaXbox /> },
        { name: "PlayStation", color: "text-blue-600", icon: <FaPlaystation /> },
        { name: "Twitch", color: "text-purple-500", icon: <FaTwitch /> },
        { name: "Discord", color: "text-indigo-500", icon: <FaDiscord /> },
        { name: "Windows", color: "text-cyan-400", icon: <FaWindows /> },
        { name: "Apple", color: "text-gray-300", icon: <FaApple /> },
        { name: "Rockstar", color: "text-yellow-500", icon: <FaGamepad /> },
    ];

    return (
        <section className="mb-20 py-12 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm border-y border-slate-800/50"></div>
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>

            <div className="relative z-10 container-custom">
                <div className="flex items-center justify-center gap-4 mb-10">
                    <div className="h-px w-12 bg-gradient-to-r from-transparent to-slate-600"></div>
                    <span className="text-sm font-black text-cyan-500 uppercase tracking-[0.3em] drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">
                        Đối Tác Chính Thức
                    </span>
                    <div className="h-px w-12 bg-gradient-to-l from-transparent to-slate-600"></div>
                </div>

                <Swiper
                    modules={[Autoplay]}
                    spaceBetween={40}
                    slidesPerView={2}
                    loop={true}
                    speed={3000}
                    autoplay={{
                        delay: 0,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: false,
                    }}
                    breakpoints={{
                        480: { slidesPerView: 3, spaceBetween: 40 },
                        640: { slidesPerView: 4, spaceBetween: 50 },
                        768: { slidesPerView: 5, spaceBetween: 60 },
                        1024: { slidesPerView: 6, spaceBetween: 80 },
                    }}
                    className="brand-swiper linear-ease"
                >
                    {brands.map((brand, index) => (
                        <SwiperSlide key={index} className="flex items-center justify-center py-4">
                            <div className="group flex items-center gap-3 opacity-40 hover:opacity-100 transition-all duration-300 cursor-pointer hover:scale-110 transform">
                                <span className={`text-3xl ${brand.color} drop-shadow-md group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all`}>
                                    {brand.icon}
                                </span>
                                <span className={`text-xl font-black text-slate-300 group-hover:text-white transition-colors uppercase tracking-tighter ${brand.color === 'text-white' ? '' : 'group-hover:' + brand.color}`}>
                                    {brand.name}
                                </span>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
};

export default FeaturedBrands;
