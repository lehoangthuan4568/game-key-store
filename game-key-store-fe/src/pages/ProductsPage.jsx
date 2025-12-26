import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchAllProducts, setFilters, setPage } from '../features/product/productSlice';
import { fetchPlatforms } from '../features/platform/platformSlice';
import { fetchGenres } from '../features/genre/genreSlice';
import ProductCard from '../components/common/ProductCard';
import Pagination from '../components/common/Pagination';
import ReactSlider from 'react-slider';
import { HiOutlineChevronDown, HiOutlineChevronUp, HiOutlineSearch, HiFilter, HiSortAscending } from 'react-icons/hi';
import { FaGamepad, FaSearch } from 'react-icons/fa';

// Helper to format currency
const formatPrice = (price) => {
    if (isNaN(price) || price === null) return 'N/A';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

// Define price range constants for the slider
const MIN_PRICE = 0;
const MAX_PRICE = 5000000; // 5 Million
const PRICE_STEP = 50000; // 50k steps

// --- Reusable Checkbox Filter Group Component ---
const CheckboxFilterGroup = ({ title, items, status, selectedItems, onChange }) => {
    const [isOpen, setIsOpen] = useState(false); // Default to collapsed
    const [searchTerm, setSearchTerm] = useState(''); // State for search term

    // Filter items based on search term
    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="py-4 border-b border-gray-700/50">
            <button
                className="flex justify-between items-center w-full group hover:text-cyan-400 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
            >
                <h3 className="font-bold text-base text-gray-200 group-hover:text-cyan-400 transition-colors">{title}</h3>
                <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    {isOpen ? <HiOutlineChevronUp size={18} className="text-cyan-400" /> : <HiOutlineChevronDown size={18} />}
                </div>
            </button>
            {isOpen && (
                <div className="pt-4 space-y-2 animate-fadeIn">
                    {/* Search bar (only show if many items) */}
                    {items.length > 5 && (
                        <div className="relative mb-3">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder={`Tìm ${title.toLowerCase()}...`}
                                className="w-full bg-gray-700/50 border-2 border-gray-600 p-2.5 pl-9 rounded-lg focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 outline-none text-sm text-white placeholder-gray-400 transition-all"
                            />
                            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        </div>
                    )}

                    {/* Checkbox list */}
                    <div className="max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                        {status === 'loading' && (
                            <div className="flex items-center justify-center py-4">
                                <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        )}
                        {status === 'succeeded' && filteredItems.length > 0 && filteredItems.map(item => (
                            <label
                                key={item._id}
                                className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-gray-700/50 border border-transparent hover:border-cyan-500/30 transition-all group"
                            >
                                <input
                                    type="checkbox"
                                    value={item._id}
                                    checked={selectedItems.includes(item._id)}
                                    onChange={onChange}
                                    className="bg-gray-700 border-2 border-gray-600 rounded text-cyan-500 focus:ring-cyan-500 focus:ring-offset-gray-800 h-4 w-4 cursor-pointer checked:bg-cyan-500 checked:border-cyan-500 transition-all"
                                />
                                <span className="text-gray-300 text-sm group-hover:text-cyan-400 transition-colors">{item.name}</span>
                            </label>
                        ))}
                        {/* Empty states */}
                        {status === 'succeeded' && filteredItems.length === 0 && (
                            <p className="text-gray-500 text-sm text-center py-4">
                                {items.length > 0 ? "Không tìm thấy kết quả." : "Không có dữ liệu."}
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
// ------------------------------------

// --- Reusable Price Range Filter Component ---
const PriceRangeFilter = ({ initialMin, initialMax, onApply }) => {
    const [isOpen, setIsOpen] = useState(false); // Default to collapsed
    const [priceRange, setPriceRange] = useState([initialMin, initialMax]);

    const handleSliderChange = (newRange) => {
        setPriceRange(newRange);
    };

    const handleApplyClick = () => {
        onApply(priceRange[0], priceRange[1]);
    };

    useEffect(() => {
        setPriceRange([initialMin, initialMax]);
    }, [initialMin, initialMax]);

    return (
        <div className="py-4 border-b border-gray-700/50">
            <button
                className="flex justify-between items-center w-full mb-4 group hover:text-cyan-400 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
            >
                <h3 className="font-bold text-base text-gray-200 group-hover:text-cyan-400 transition-colors">Khoảng giá</h3>
                <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    {isOpen ? <HiOutlineChevronUp size={18} className="text-cyan-400" /> : <HiOutlineChevronDown size={18} />}
                </div>
            </button>
            {isOpen && (
                <div className="animate-fadeIn">
                    <ReactSlider
                        className="h-6 pr-2 pl-1 mb-4 flex items-center cursor-grab"
                        thumbClassName="h-6 w-6 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full cursor-grab focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-400 shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70 transition-shadow"
                        trackClassName="slider-track"
                        value={priceRange}
                        onChange={handleSliderChange}
                        min={MIN_PRICE}
                        max={MAX_PRICE}
                        step={PRICE_STEP}
                        minDistance={PRICE_STEP}
                        pearling
                        renderThumb={({ key, ...props }, state) => <div key={key} {...props}></div>}
                        renderTrack={({ key, ...props }, state) => (
                            <div
                                key={key}
                                {...props}
                                className={`${props.className} ${state.index === 1 ? 'bg-gradient-to-r from-cyan-500 to-blue-600' : 'bg-gray-600'} h-2 rounded-full`}
                            ></div>
                        )}
                    />
                    <div className="flex justify-between items-center mb-4">
                        <div className="bg-gray-700/50 border-2 border-gray-600 rounded-lg px-4 py-2">
                            <span className="text-cyan-400 font-bold text-sm">{formatPrice(priceRange[0])}</span>
                        </div>
                        <span className="text-gray-400">→</span>
                        <div className="bg-gray-700/50 border-2 border-gray-600 rounded-lg px-4 py-2">
                            <span className="text-cyan-400 font-bold text-sm">{formatPrice(priceRange[1])}</span>
                        </div>
                    </div>
                    <button
                        onClick={handleApplyClick}
                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white py-2.5 rounded-lg transition-all font-bold shadow-lg hover:shadow-cyan-500/50 gaming-button"
                    >
                        Áp dụng
                    </button>
                </div>
            )}
        </div>
    );
};
// ---------------------------------

// --- Main Products Page Component ---
const ProductsPage = ({ filterType }) => {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('search');

    // Selectors
    const { data: products, status, page, totalPages } = useSelector((state) => state.products.allProducts);
    const currentFilters = useSelector((state) => state.products.filters);
    const { items: allPlatforms, status: platformStatus } = useSelector((state) => state.platforms);
    const { items: allGenres, status: genreStatus } = useSelector((state) => state.genres);

    // Local state
    const [pageTitle, setPageTitle] = useState('Tất cả sản phẩm');
    const isInitialMount = useRef(true);

    // Calculate initial filters based on filterType or search query
    const initialFilters = useMemo(() => {
        let baseFilters = {
            sort: '-createdAt',
            'price[gte]': '', 'price[lte]': '',
            platforms: [], genres: [],
            sale: '', isNew: '', isHot: '',
            search: searchQuery || '',
        };
        let title = 'Tất cả sản phẩm';

        if (searchQuery) {
            title = `Kết quả cho "${searchQuery}"`;
        } else if (filterType === 'sale') {
            baseFilters.sale = 'true';
            title = 'Sản phẩm đang Giảm Giá';
        } else if (filterType === 'new') {
            baseFilters.isNew = 'true';
            title = 'Game Mới';
        } else if (filterType === 'hot') {
            baseFilters.isHot = 'true';
            title = 'Game Hot';
        }
        return { filters: baseFilters, title };
    }, [filterType, searchQuery]);

    // Effect to set initial filters, title, and fetch initial data
    useEffect(() => {
        if (platformStatus === 'idle') dispatch(fetchPlatforms());
        if (genreStatus === 'idle') dispatch(fetchGenres());

        dispatch(setFilters(initialFilters.filters));
        setPageTitle(initialFilters.title);

        const activeFilters = { ...initialFilters.filters, page: 1 };
        Object.keys(activeFilters).forEach(key => {
            const value = activeFilters[key];
            if (value === '' || value === null || (Array.isArray(value) && value.length === 0)) {
                delete activeFilters[key];
            }
            if (Array.isArray(value) && value.length > 0) {
                activeFilters[key] = value.join(',');
            }
        });
        dispatch(fetchAllProducts(activeFilters));
        isInitialMount.current = true;

    }, [initialFilters, dispatch, platformStatus, genreStatus]);

    // Effect to refetch data when filters (from Redux) or page change, AFTER the initial load
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        const activeFilters = { ...currentFilters, page };
        Object.keys(activeFilters).forEach(key => {
            const value = activeFilters[key];
            if (value === '' || value === null || (Array.isArray(value) && value.length === 0)) {
                delete activeFilters[key];
            }
            if (Array.isArray(value) && value.length > 0) {
                activeFilters[key] = value.join(',');
            }
        });
        dispatch(fetchAllProducts(activeFilters));

    }, [currentFilters, page, dispatch]);

    // --- Event Handlers ---

    const handlePriceFilterApply = (min, max) => {
        const gte = min === MIN_PRICE ? '' : min;
        const lte = max === MAX_PRICE ? '' : max;
        dispatch(setFilters({ ...currentFilters, 'price[gte]': gte, 'price[lte]': lte, page: 1 }));
    };

    const handleSortChange = (e) => {
        dispatch(setFilters({ ...currentFilters, sort: e.target.value, page: 1 }));
    };

    const handlePageChange = (newPage) => {
        dispatch(setPage(newPage));
        window.scrollTo(0, 0);
    };

    const handleCheckboxFilterChange = (filterKey) => (e) => {
        const { value, checked } = e.target;
        const currentList = currentFilters[filterKey] || [];
        const newList = checked ? [...currentList, value] : currentList.filter(id => id !== value);
        dispatch(setFilters({ ...currentFilters, [filterKey]: newList, page: 1 }));
    };

    return (
        <div className="relative">
            {/* Animated Background */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Filters Sidebar */}
                <aside className="lg:col-span-1">
                    <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl p-6 rounded-xl self-start sticky top-24 shadow-2xl border-2 border-gray-700/50 relative overflow-hidden">
                        {/* Decorative gradient border */}
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 opacity-0 hover:opacity-100 transition-opacity duration-500 -z-10"></div>

                        {/* Header */}
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-700/50">
                            <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg shadow-lg">
                                <HiFilter className="text-white" size={20} />
                            </div>
                            <h2 className="text-2xl font-extrabold gaming-section-title">Bộ lọc</h2>
                        </div>

                        <div className="divide-y divide-gray-700/50">
                            {/* Price Range Filter */}
                            <PriceRangeFilter
                                initialMin={Number(currentFilters['price[gte]'] || MIN_PRICE)}
                                initialMax={Number(currentFilters['price[lte]'] || MAX_PRICE)}
                                onApply={handlePriceFilterApply}
                            />

                            {/* Platform Filter */}
                            <CheckboxFilterGroup
                                title="Nền tảng"
                                items={allPlatforms}
                                status={platformStatus}
                                selectedItems={currentFilters.platforms}
                                onChange={handleCheckboxFilterChange('platforms')}
                            />

                            {/* Genre Filter */}
                            <CheckboxFilterGroup
                                title="Thể loại"
                                items={allGenres}
                                status={genreStatus}
                                selectedItems={currentFilters.genres}
                                onChange={handleCheckboxFilterChange('genres')}
                            />
                        </div>
                    </div>
                </aside>

                {/* Products Grid */}
                <main className="lg:col-span-3">
                    {/* Header Section */}
                    <div className="mb-8">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-lg shadow-cyan-500/30">
                                <FaGamepad className="text-white" size={24} />
                            </div>
                            <h1 className="text-4xl font-extrabold gaming-title">{pageTitle}</h1>
                        </div>
                        <div className="h-1 w-24 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full mb-6"></div>

                        {/* Sort Dropdown */}
                        <div className="flex items-center gap-3">
                            <HiSortAscending className="text-cyan-400" size={20} />
                            <select
                                onChange={handleSortChange}
                                value={currentFilters.sort}
                                className="bg-gray-800/50 border-2 border-gray-700 p-3 rounded-lg text-white focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 outline-none font-medium cursor-pointer transition-all hover:border-cyan-500/50"
                            >
                                <option value="-createdAt">Mới nhất</option>
                                <option value="price">Giá: Thấp đến Cao</option>
                                <option value="-price">Giá: Cao đến Thấp</option>
                                <option value="name">Tên: A-Z</option>
                                <option value="-name">Tên: Z-A</option>
                            </select>
                        </div>
                    </div>

                    {/* Loading State */}
                    {status === 'loading' && (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                            <p className="text-xl text-gray-400 font-medium">Đang tải sản phẩm...</p>
                        </div>
                    )}

                    {/* Success State */}
                    {status === 'succeeded' && products.length > 0 && (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                                {products.map(product => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                            </div>
                            <div className="mt-8">
                                <Pagination
                                    currentPage={page}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                />
                            </div>
                        </>
                    )}

                    {/* Empty State */}
                    {status === 'succeeded' && products.length === 0 && (
                        <div className="text-center py-20 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl border-2 border-gray-700/50">
                            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full mb-6 border-2 border-gray-700/50">
                                <FaSearch className="text-gray-500" size={48} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-300 mb-2">Không tìm thấy sản phẩm</h2>
                            <p className="text-gray-400 mb-6">Hãy thử điều chỉnh bộ lọc để tìm thêm sản phẩm.</p>
                        </div>
                    )}

                    {/* Error State */}
                    {status === 'failed' && (
                        <div className="text-center py-20 bg-gradient-to-br from-red-900/20 to-red-800/20 backdrop-blur-sm rounded-xl border-2 border-red-500/30">
                            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-red-900 to-red-800 rounded-full mb-6 border-2 border-red-500/50">
                                <FaGamepad className="text-red-400" size={48} />
                            </div>
                            <h2 className="text-2xl font-bold text-red-400 mb-2">Đã xảy ra lỗi</h2>
                            <p className="text-red-300">Không thể tải sản phẩm. Vui lòng thử lại sau.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default ProductsPage;