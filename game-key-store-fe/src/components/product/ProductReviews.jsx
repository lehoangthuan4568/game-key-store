import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { FaQuoteLeft, FaStar, FaUserCircle } from 'react-icons/fa';
import 'swiper/css';
import 'swiper/css/pagination';

const ProductReviews = ({ reviews }) => {
    // Dummy data if no reviews provided
    const defaultReviews = [
        {
            name: "Trần Văn Nam",
            date: "20/11/2023",
            content: "Game chơi rất cuốn, đồ họa đẹp mê ly. Shop giao key siêu tốc, vừa thanh toán xong là có ngay.",
            rating: 5
        },
        {
            name: "Nguyễn Thị Hương",
            date: "18/11/2023",
            content: "Giá rẻ hơn nhiều so với mua trực tiếp trên Steam. Sẽ ủng hộ shop dài dài.",
            rating: 5
        },
        {
            name: "Lê Hoàng",
            date: "15/11/2023",
            content: "Support nhiệt tình, mình không biết kích hoạt được hướng dẫn tận răng. 10 điểm!",
            rating: 4
        },
        {
            name: "Phạm Minh",
            date: "10/11/2023",
            content: "Uy tín, chất lượng. Game bản quyền chơi online vi vu không lo ban acc.",
            rating: 5
        }
    ];

    const displayReviews = reviews && reviews.length > 0 ? reviews : defaultReviews;

    return (
        <div className="mb-20">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                    <FaStar className="text-2xl text-purple-400" />
                </div>
                <h2 className="text-3xl font-black text-white">Đánh Giá Từ Game Thủ</h2>
            </div>

            <Swiper
                modules={[Autoplay, Pagination]}
                spaceBetween={24}
                slidesPerView={1}
                pagination={{ clickable: true, dynamicBullets: true }}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                breakpoints={{
                    640: { slidesPerView: 1 },
                    768: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
                }}
                className="pb-16 product-reviews-swiper"
            >
                {displayReviews.map((review, index) => (
                    <SwiperSlide key={index} className="h-auto">
                        <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-slate-700 hover:border-purple-500/50 transition-all duration-300 h-full flex flex-col relative group hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 border border-slate-700">
                                        <FaUserCircle size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-sm">{review.name}</h4>
                                        <p className="text-xs text-slate-500">{review.date}</p>
                                    </div>
                                </div>
                                <div className="flex gap-0.5 text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar key={i} size={12} className={i < review.rating ? "text-yellow-400" : "text-slate-700"} />
                                    ))}
                                </div>
                            </div>

                            <p className="text-slate-300 text-sm leading-relaxed flex-grow relative z-10">
                                "{review.content}"
                            </p>

                            <div className="absolute top-4 right-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <FaQuoteLeft className="text-4xl text-purple-500" />
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default ProductReviews;
