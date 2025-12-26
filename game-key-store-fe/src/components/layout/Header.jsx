import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectIsAuthenticated, selectUser, logout } from '../../features/user/userSlice';
import { openCart } from '../../features/ui/uiSlice';
import { selectCartItems } from '../../features/cart/cartSlice';
import { clearWishlistOnLogout } from '../../features/user/wishlistSlice';
import { HiOutlineSearch, HiOutlineShoppingCart, HiMenu, HiX, HiChevronDown, HiUser, HiLogout, HiHeart, HiShoppingBag, HiCog } from 'react-icons/hi';
import api from '../../api/api';
import { getImageUrl } from '../../utils/imageUtils';

// --- SearchBar Component ---
const SearchBar = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isFocused, setIsFocused] = useState(false);
    const searchRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handler = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsFocused(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    useEffect(() => {
        if (query.trim() === '') {
            setResults([]);
            return;
        }
        const debounceSearch = setTimeout(async () => {
            try {
                const response = await api.get(`/products?search=${query}&limit=5`);
                setResults(response.data.data.products);
            } catch (error) {
                console.error("Lỗi khi tìm kiếm:", error);
                setResults([]);
            }
        }, 300);
        return () => clearTimeout(debounceSearch);
    }, [query]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/products?search=${encodeURIComponent(query.trim())}`);
            setQuery('');
            setIsFocused(false);
        }
    };

    return (
        <form onSubmit={handleSearchSubmit} className="relative w-full max-w-md" ref={searchRef}>
            <div className="relative group">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    placeholder="Tìm kiếm game..."
                    className="w-full bg-gray-900/50 text-white px-5 py-2.5 rounded-full border border-gray-700 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 pl-12 transition-all duration-300 backdrop-blur-sm group-hover:bg-gray-900/80"
                />
                <button type="submit" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-cyan-400 transition-colors">
                    <HiOutlineSearch size={20} />
                </button>
            </div>

            {isFocused && query && (
                <div className="absolute top-full mt-2 w-full bg-gray-900/95 backdrop-blur-xl rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto border border-gray-700 custom-scrollbar animate-fadeIn">
                    {results.length > 0 ? (
                        <ul className="py-2">
                            {results.map((product) => (
                                <li key={product._id}>
                                    <Link
                                        to={`/product/${product.slug}`}
                                        className="flex items-center gap-4 p-3 hover:bg-gray-800/50 transition-colors border-b border-gray-800 last:border-0"
                                        onClick={() => { setQuery(''); setIsFocused(false); }}
                                    >
                                        <img src={getImageUrl(product.coverImage)} alt={product.name} className="w-12 h-16 object-cover rounded-lg shadow-md" />
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-sm text-gray-200 truncate group-hover:text-cyan-400 transition-colors">{product.name}</h4>
                                            <div className="flex items-center gap-2 mt-1">
                                                {product.salePrice && product.salePrice < product.price ? (
                                                    <>
                                                        <span className="text-xs font-bold text-cyan-400">
                                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.salePrice)}
                                                        </span>
                                                        <span className="text-xs text-gray-500 line-through">
                                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span className="text-xs font-bold text-cyan-400">
                                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="p-8 text-center text-gray-400">
                            <p>Không tìm thấy kết quả nào.</p>
                        </div>
                    )}
                </div>
            )}
        </form>
    );
};

// --- Header Component ---
const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const isAuthenticated = useSelector(selectIsAuthenticated);
    const user = useSelector(selectUser);
    const cartItems = useSelector(selectCartItems);
    const dispatch = useDispatch();

    const totalItemsInCart = cartItems.reduce((total, item) => total + item.quantity, 0);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        dispatch(logout());
        dispatch(clearWishlistOnLogout());
        setIsUserMenuOpen(false);
    };

    const navLinkClass = ({ isActive }) => `relative px-3 py-2 text-sm font-medium transition-colors duration-300 ${isActive ? "text-cyan-400" : "text-gray-300 hover:text-white"} group`;

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${scrolled
                ? 'bg-gray-900/90 backdrop-blur-md border-gray-800 shadow-lg py-2'
                : 'bg-transparent border-transparent py-4'
                }`}
        >
            <div className="container-custom">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-cyan-500/20 group-hover:scale-110 transition-transform duration-300">
                            G
                        </div>
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 group-hover:from-cyan-400 group-hover:to-blue-400 transition-all duration-300">
                            GameKey<span className="font-light text-gray-500 group-hover:text-gray-300">Store</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <div className="flex items-center space-x-1">
                            <NavLink to="/" className={navLinkClass}>
                                Trang chủ
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-500 transition-all duration-300 group-hover:w-full"></span>
                            </NavLink>
                            <NavLink to="/products" className={navLinkClass}>
                                Sản phẩm
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-500 transition-all duration-300 group-hover:w-full"></span>
                            </NavLink>
                        </div>
                        <SearchBar />
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        {/* Cart Button */}
                        <button
                            onClick={() => dispatch(openCart())}
                            className="relative p-2.5 rounded-xl text-gray-300 hover:bg-gray-800 hover:text-cyan-400 transition-all duration-300 group"
                        >
                            <HiOutlineShoppingCart size={24} className="group-hover:scale-110 transition-transform" />
                            {totalItemsInCart > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-[10px] font-bold text-white shadow-lg ring-2 ring-gray-900 animate-pulse">
                                    {totalItemsInCart}
                                </span>
                            )}
                        </button>

                        {/* User Menu (Desktop) */}
                        <div className="hidden md:block relative">
                            {isAuthenticated && user ? (
                                <div
                                    className="relative"
                                    onMouseEnter={() => setIsUserMenuOpen(true)}
                                    onMouseLeave={() => setIsUserMenuOpen(false)}
                                >
                                    <button className="flex items-center gap-3 p-1.5 pr-3 rounded-full bg-gray-800/50 border border-gray-700 hover:border-cyan-500/50 transition-all duration-300 group">
                                        <img
                                            src={`https://ui-avatars.com/api/?name=${user.name.replace(/\s/g, '+')}&background=06b6d4&color=fff&rounded=true`}
                                            alt={user.name}
                                            className="w-8 h-8 rounded-full ring-2 ring-gray-700 group-hover:ring-cyan-500 transition-all"
                                        />
                                        <span className="font-medium text-sm text-gray-300 group-hover:text-white max-w-[100px] truncate">
                                            {user.name}
                                        </span>
                                        <HiChevronDown className={`text-gray-500 group-hover:text-cyan-400 transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* Dropdown Menu */}
                                    <div
                                        className={`absolute right-0 top-full pt-2 w-64 transition-all duration-300 transform origin-top-right ${isUserMenuOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                                            }`}
                                    >
                                        <div className="bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
                                            <div className="p-4 border-b border-gray-800 bg-gray-800/50">
                                                <p className="text-sm text-gray-400">Đăng nhập với tư cách</p>
                                                <p className="font-bold text-white truncate">{user.email}</p>
                                            </div>
                                            <div className="p-2 space-y-1">
                                                {user.role === 'admin' && (
                                                    <Link to="/admin/dashboard" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-cyan-400 hover:bg-cyan-500/10 transition-colors">
                                                        <HiCog size={18} /> Trang Admin
                                                    </Link>
                                                )}
                                                <Link to="/user/profile" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
                                                    <HiUser size={18} /> Hồ sơ & Cấp độ
                                                </Link>
                                                <Link to="/user/my-orders" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
                                                    <HiShoppingBag size={18} /> Đơn hàng của tôi
                                                </Link>
                                                <Link to="/user/wishlist" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
                                                    <HiHeart size={18} /> Yêu thích
                                                </Link>
                                                {!user.googleId && (
                                                    <Link to="/user/change-password" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
                                                        <HiUser size={18} /> Đổi mật khẩu
                                                    </Link>
                                                )}
                                            </div>
                                            <div className="p-2 border-t border-gray-800">
                                                <button
                                                    onClick={handleLogout}
                                                    className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
                                                >
                                                    <HiLogout size={18} /> Đăng xuất
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <Link to="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                                        Đăng nhập
                                    </Link>
                                    <Link to="/register" className="btn-primary text-sm py-2 px-5 rounded-full">
                                        Đăng ký
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 rounded-xl text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <HiX size={28} /> : <HiMenu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Panel */}
            <div
                className={`md:hidden fixed inset-0 z-40 bg-gray-900/95 backdrop-blur-xl transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
                style={{ top: '70px' }}
            >
                <div className="p-4 space-y-6 h-full overflow-y-auto pb-24">
                    <SearchBar />

                    <nav className="space-y-2">
                        <NavLink
                            to="/"
                            className={({ isActive }) => `block px-4 py-3 rounded-xl text-lg font-medium ${isActive ? 'bg-gray-800 text-cyan-400' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Trang chủ
                        </NavLink>
                        <NavLink
                            to="/products"
                            className={({ isActive }) => `block px-4 py-3 rounded-xl text-lg font-medium ${isActive ? 'bg-gray-800 text-cyan-400' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Sản phẩm
                        </NavLink>
                    </nav>

                    <div className="border-t border-gray-800 pt-6">
                        {isAuthenticated && user ? (
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 px-4">
                                    <img
                                        src={`https://ui-avatars.com/api/?name=${user.name.replace(/\s/g, '+')}&background=06b6d4&color=fff&rounded=true`}
                                        alt={user.name}
                                        className="w-10 h-10 rounded-full"
                                    />
                                    <div>
                                        <p className="font-bold text-white">{user.name}</p>
                                        <p className="text-xs text-gray-400">{user.email}</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    {user.role === 'admin' && (
                                        <Link to="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-cyan-400 hover:bg-gray-800" onClick={() => setIsMobileMenuOpen(false)}>
                                            <HiCog size={20} /> Trang Admin
                                        </Link>
                                    )}
                                    <Link to="/user/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-800" onClick={() => setIsMobileMenuOpen(false)}>
                                        <HiUser size={20} /> Hồ sơ & Cấp độ
                                    </Link>
                                    <Link to="/user/my-orders" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-800" onClick={() => setIsMobileMenuOpen(false)}>
                                        <HiShoppingBag size={20} /> Đơn hàng của tôi
                                    </Link>
                                    <Link to="/user/wishlist" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-800" onClick={() => setIsMobileMenuOpen(false)}>
                                        <HiHeart size={20} /> Yêu thích
                                    </Link>
                                    {!user.googleId && (
                                        <Link to="/user/change-password" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-800" onClick={() => setIsMobileMenuOpen(false)}>
                                            <HiUser size={20} /> Đổi mật khẩu
                                        </Link>
                                    )}
                                    <button
                                        onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                                        className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-400 hover:bg-gray-800"
                                    >
                                        <HiLogout size={20} /> Đăng xuất
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-4">
                                <Link
                                    to="/login"
                                    className="flex items-center justify-center px-4 py-3 rounded-xl bg-gray-800 text-white font-medium hover:bg-gray-700"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Đăng nhập
                                </Link>
                                <Link
                                    to="/register"
                                    className="flex items-center justify-center px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium hover:from-cyan-400 hover:to-blue-500"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Đăng ký
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;