import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { FaQuoteLeft, FaStar } from 'react-icons/fa';
import 'swiper/css';
import 'swiper/css/pagination';

const Testimonials = () => {
    const reviews = [
        {
            name: "Nguyễn Văn A",
            role: "Gamer Hardcore",
            avatar: "https://i.pravatar.cc/150?u=1",
            content: "Dịch vụ tuyệt vời! Key game nhận được ngay lập tức sau khi thanh toán. Giá cả lại rất cạnh tranh so với thị trường.",
            rating: 5
        },
        {
            name: "Trần Thị B",
            role: "Streamer",
            avatar: "https://i.pravatar.cc/150?u=2",
            content: "Hỗ trợ khách hàng rất nhiệt tình. Mình gặp chút vấn đề khi kích hoạt nhưng đã được giải quyết trong vòng 5 phút.",
            rating: 5
        },
        {
            name: "Lê Văn C",
            role: "Game Collector",
            avatar: "https://i.pravatar.cc/150?u=3",
            content: "Giao diện web đẹp, dễ sử dụng. Rất thích tính năng wishlist và thông báo giảm giá. Sẽ ủng hộ dài dài.",
            rating: 4
        },
        {
            name: "Phạm Thị D",
            role: "Casual Gamer",
            avatar: "https://i.pravatar.cc/150?u=4",
            content: "Mua game ở đây rất yên tâm. Không lo bị scam hay key lậu. Uy tín đặt lên hàng đầu.",
            rating: 5
        }
    ];

    return (
        <section className="mb-20 relative">
            <div className="text-center mb-12 relative z-10">
                <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight drop-shadow-lg">
                    Khách Hàng <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Nói Gì?</span>
                </h2>
                <div className="h-1.5 w-24 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full mx-auto shadow-[0_0_15px_rgba(168,85,247,0.5)]"></div>
            </div>

            <Swiper
                modules={[Autoplay, Pagination]}
                spaceBetween={30}
                slidesPerView={1}
                pagination={{ clickable: true, dynamicBullets: true }}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                breakpoints={{
                    640: { slidesPerView: 1 },
                    768: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
                }}
                className="pb-16 testimonial-swiper"
            >
                {reviews.map((review, index) => (
                    <SwiperSlide key={index} className="h-auto">
                        <div className="bg-slate-900/60 backdrop-blur-md p-8 rounded-3xl border border-slate-700 hover:border-cyan-500/50 transition-all duration-300 h-full flex flex-col relative group hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]">
                            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                                <FaQuoteLeft className="text-6xl text-cyan-500" />
                            </div>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full blur opacity-50 group-hover:opacity-100 transition-opacity"></div>
                                    <img
                                        src={review.avatar}
                                        alt={review.name}
                                        className="w-16 h-16 rounded-full border-2 border-slate-800 relative z-10 object-cover"
                                    />
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg text-white group-hover:text-cyan-400 transition-colors">{review.name}</h4>
                                    <p className="text-xs font-bold text-purple-400 uppercase tracking-wider">{review.role}</p>
                                </div>
                            </div>

                            <p className="text-slate-300 mb-6 flex-grow italic leading-relaxed relative z-10">
                                "{review.content}"
                            </p>

                            <div className="flex gap-1 text-yellow-400 mt-auto bg-slate-950/50 w-fit px-3 py-1.5 rounded-full border border-slate-800">
                                {[...Array(5)].map((_, i) => (
                                    <FaStar key={i} size={14} className={i < review.rating ? "text-yellow-400" : "text-slate-700"} />
                                ))}
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
};

export default Testimonials;
