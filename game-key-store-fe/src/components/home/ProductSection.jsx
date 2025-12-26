import React from 'react';
import ProductCard from '../common/ProductCard';
import { Link } from 'react-router-dom';
import { HiArrowRight, HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const ProductSection = ({ title, products, status, linkTo, icon }) => {
    if (status === 'loading') {
        return (
            <section className="mb-20">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-800 rounded-xl animate-pulse"></div>
                        <div className="h-8 w-48 bg-slate-800 rounded animate-pulse"></div>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, index) => (
                        <div key={index} className="h-80 bg-slate-800 rounded-xl animate-pulse"></div>
                    ))}
                </div>
            </section>
        );
    }

    if (status === 'failed' || !products || products.length === 0) {
        return null;
    }

    let viewAllLink = '/products';
    if (linkTo) {
        viewAllLink = linkTo;
    } else if (title === "Đang Giảm Giá") {
        viewAllLink = "/products/sale";
    } else if (title === "Game Mới") {
        viewAllLink = "/products/new";
    } else if (title === "Game Hot") {
        viewAllLink = "/products/hot";
    }

    const navPrevId = `swiper-button-prev-${title.replace(/\s/g, '-')}`;
    const navNextId = `swiper-button-next-${title.replace(/\s/g, '-')}`;

    return (
        <section className="mb-20 relative group/section">
            {/* Section Header */}
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-10 gap-4 relative z-10">
                <div className="flex items-center gap-5">
                    <div className="relative group/icon">
                        <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full group-hover/icon:bg-cyan-500/40 transition-all duration-500"></div>
                        <div className="relative w-14 h-14 bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-700 flex items-center justify-center text-3xl shadow-lg group-hover/icon:scale-110 group-hover/icon:rotate-3 transition-all duration-300 group-hover/icon:border-cyan-500/50 group-hover/icon:text-cyan-400 text-slate-300">
                            {icon}
                        </div>
                    </div>
                    <div>
                        <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight drop-shadow-md">
                            {title}
                        </h2>
                        <div className="h-1.5 w-24 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full mt-2 shadow-[0_0_10px_rgba(6,182,212,0.5)]"></div>
                    </div>
                </div>

                <Link
                    to={viewAllLink}
                    className="group/link flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-cyan-500/50 hover:bg-slate-800 hover:shadow-[0_0_15px_rgba(6,182,212,0.15)] transition-all duration-300 backdrop-blur-sm"
                >
                    <span className="text-sm font-bold text-slate-300 group-hover/link:text-white uppercase tracking-wider">Xem tất cả</span>
                    <HiArrowRight className="text-slate-400 group-hover/link:text-cyan-400 group-hover/link:translate-x-1 transition-all" />
                </Link>
            </div>

            {/* Swiper Container */}
            <div className="relative">
                <Swiper
                    modules={[Navigation, Autoplay]}
                    navigation={{
                        prevEl: `.${navPrevId}`,
                        nextEl: `.${navNextId}`,
                    }}
                    loop={true}
                    autoplay={{
                        delay: 3000 + Math.random() * 1000,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                    }}
                    slidesPerView={1}
                    spaceBetween={20}
                    breakpoints={{
                        640: { slidesPerView: 2, spaceBetween: 20 },
                        768: { slidesPerView: 3, spaceBetween: 24 },
                        1024: { slidesPerView: 4, spaceBetween: 24 },
                    }}
                    className="!pb-10 !px-2"
                >
                    {products.map(product => (
                        <SwiperSlide key={product._id} className="h-auto">
                            <ProductCard product={product} />
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Custom Navigation Buttons */}
                <div className={`swiper-button-prev-custom ${navPrevId} !w-12 !h-12 !bg-slate-900/90 !border-slate-700 hover:!border-cyan-500 hover:!text-cyan-400 !text-slate-300 !shadow-lg !backdrop-blur-md opacity-0 group-hover/section:opacity-100 transition-opacity duration-300 -translate-x-4`} aria-label="Previous slide">
                    <HiOutlineChevronLeft size={24} />
                </div>
                <div className={`swiper-button-next-custom ${navNextId} !w-12 !h-12 !bg-slate-900/90 !border-slate-700 hover:!border-cyan-500 hover:!text-cyan-400 !text-slate-300 !shadow-lg !backdrop-blur-md opacity-0 group-hover/section:opacity-100 transition-opacity duration-300 translate-x-4`} aria-label="Next slide">
                    <HiOutlineChevronRight size={24} />
                </div>
            </div>
        </section>
    );
};

export default ProductSection;