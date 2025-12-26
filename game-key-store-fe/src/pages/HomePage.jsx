import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchFeaturedProducts,
    fetchNewProducts,
    fetchHotProducts,
    fetchSaleProducts
} from '../features/product/productSlice';
import { fetchGenres } from '../features/genre/genreSlice';
import { FaGamepad, FaFire, FaStar } from 'react-icons/fa';

// Import Components
import HeroBanner from '../components/home/HeroBanner';
import FeaturedCategories from '../components/home/FeaturedCategories';
import ProductSection from '../components/home/ProductSection';
import BenefitsSection from '../components/home/BenefitsSection';
import FeaturedBrands from '../components/home/FeaturedBrands';
import Testimonials from '../components/home/Testimonials';
import Newsletter from '../components/home/Newsletter';

const HomePage = () => {
    const dispatch = useDispatch();
    const { featured, newProducts, hotProducts, saleProducts } = useSelector((state) => state.products);
    const { items: genres, status: genreStatus } = useSelector((state) => state.genres);

    useEffect(() => {
        if (featured.status === 'idle') dispatch(fetchFeaturedProducts());
        if (newProducts.status === 'idle') dispatch(fetchNewProducts());
        if (hotProducts.status === 'idle') dispatch(fetchHotProducts());
        if (saleProducts.status === 'idle') dispatch(fetchSaleProducts());
        if (genreStatus === 'idle') dispatch(fetchGenres());
    }, [dispatch, featured.status, newProducts.status, hotProducts.status, saleProducts.status, genreStatus]);

    return (
        <div className="relative min-h-screen bg-gray-900 text-white overflow-hidden">
            {/* Background Elements */}
            <div className="fixed inset-0 -z-10 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[100px] animate-float"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[100px] animate-float" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="container-custom py-8">
                {/* Hero Section */}
                <HeroBanner products={featured.data} status={featured.status} />

                {/* Benefits Section */}
                <BenefitsSection />

                {/* Featured Categories */}
                <FeaturedCategories genres={genres} status={genreStatus} />

                {/* Product Sections */}
                <div className="space-y-12">
                    <ProductSection
                        title="Đang Giảm Giá"
                        products={saleProducts.data}
                        status={saleProducts.status}
                        icon={<FaFire className="text-orange-500" />}
                    />

                    {/* Featured Brands Middle Banner */}
                    <FeaturedBrands />

                    <ProductSection
                        title="Game Mới"
                        products={newProducts.data}
                        status={newProducts.status}
                        icon={<FaStar className="text-blue-500" />}
                    />

                    <ProductSection
                        title="Game Hot"
                        products={hotProducts.data}
                        status={hotProducts.status}
                        icon={<FaGamepad className="text-cyan-500" />}
                    />
                </div>

                {/* Testimonials */}
                <Testimonials />

                {/* Newsletter */}
                <Newsletter />
            </div>
        </div>
    );
};

export default HomePage;