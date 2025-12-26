
import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaYoutube, FaInstagram, FaDiscord, FaEnvelope, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative bg-gray-900 pt-20 pb-10 overflow-hidden border-t border-gray-800 mt-auto">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
            </div>

            <div className="container-custom relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-cyan-500/20">
                                G
                            </div>
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                                GameKey<span className="font-light text-gray-500">Store</span>
                            </span>
                        </Link>
                        <p className="text-gray-400 leading-relaxed">
                            Điểm đến số 1 cho game thủ. Cung cấp key game bản quyền giá rẻ, uy tín và bảo hành trọn đời. Trải nghiệm mua sắm tuyệt vời ngay hôm nay.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-cyan-500 hover:text-white transition-all duration-300 shadow-lg hover:shadow-cyan-500/30">
                                <FaFacebookF />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-cyan-500 hover:text-white transition-all duration-300 shadow-lg hover:shadow-cyan-500/30">
                                <FaTwitter />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-cyan-500 hover:text-white transition-all duration-300 shadow-lg hover:shadow-cyan-500/30">
                                <FaInstagram />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-purple-500 hover:text-white transition-all duration-300 shadow-lg hover:shadow-purple-500/30">
                                <FaDiscord />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-bold text-white mb-6 relative inline-block">
                            Cửa Hàng
                            <span className="absolute -bottom-2 left-0 w-12 h-1 bg-cyan-500 rounded-full"></span>
                        </h4>
                        <ul className="space-y-4">
                            <li>
                                <Link to="/products" className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center gap-2 group">
                                    <span className="w-1.5 h-1.5 bg-gray-600 rounded-full group-hover:bg-cyan-400 transition-colors"></span>
                                    Tất cả sản phẩm
                                </Link>
                            </li>
                            <li>
                                <Link to="/products?sort=newest" className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center gap-2 group">
                                    <span className="w-1.5 h-1.5 bg-gray-600 rounded-full group-hover:bg-cyan-400 transition-colors"></span>
                                    Game mới ra mắt
                                </Link>
                            </li>
                            <li>
                                <Link to="/products?sort=price-asc" className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center gap-2 group">
                                    <span className="w-1.5 h-1.5 bg-gray-600 rounded-full group-hover:bg-cyan-400 transition-colors"></span>
                                    Đang giảm giá
                                </Link>
                            </li>
                            <li>
                                <Link to="/products?category=action" className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center gap-2 group">
                                    <span className="w-1.5 h-1.5 bg-gray-600 rounded-full group-hover:bg-cyan-400 transition-colors"></span>
                                    Game hành động
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-lg font-bold text-white mb-6 relative inline-block">
                            Hỗ Trợ
                            <span className="absolute -bottom-2 left-0 w-12 h-1 bg-cyan-500 rounded-full"></span>
                        </h4>
                        <ul className="space-y-4">
                            <li>
                                <Link to="/contact" className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center gap-2 group">
                                    <span className="w-1.5 h-1.5 bg-gray-600 rounded-full group-hover:bg-cyan-400 transition-colors"></span>
                                    Trung tâm hỗ trợ
                                </Link>
                            </li>
                            <li>
                                <Link to="/faq" className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center gap-2 group">
                                    <span className="w-1.5 h-1.5 bg-gray-600 rounded-full group-hover:bg-cyan-400 transition-colors"></span>
                                    Câu hỏi thường gặp
                                </Link>
                            </li>
                            <li>
                                <Link to="/terms-of-service" className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center gap-2 group">
                                    <span className="w-1.5 h-1.5 bg-gray-600 rounded-full group-hover:bg-cyan-400 transition-colors"></span>
                                    Điều khoản dịch vụ
                                </Link>
                            </li>
                            <li>
                                <Link to="/privacy-policy" className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center gap-2 group">
                                    <span className="w-1.5 h-1.5 bg-gray-600 rounded-full group-hover:bg-cyan-400 transition-colors"></span>
                                    Chính sách bảo mật
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-bold text-white mb-6 relative inline-block">
                            Liên Hệ
                            <span className="absolute -bottom-2 left-0 w-12 h-1 bg-cyan-500 rounded-full"></span>
                        </h4>
                        <ul className="space-y-6">
                            <li className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-cyan-400 shrink-0">
                                    <FaMapMarkerAlt />
                                </div>
                                <div>
                                    <p className="text-white font-medium mb-1">Địa chỉ</p>
                                    <p className="text-gray-400 text-sm">123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-cyan-400 shrink-0">
                                    <FaEnvelope />
                                </div>
                                <div>
                                    <p className="text-white font-medium mb-1">Email</p>
                                    <p className="text-gray-400 text-sm">support@gamekeystore.com</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-cyan-400 shrink-0">
                                    <FaPhone />
                                </div>
                                <div>
                                    <p className="text-white font-medium mb-1">Hotline</p>
                                    <p className="text-gray-400 text-sm">1900 123 456</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-gray-500 text-sm text-center md:text-left">
                        &copy; {currentYear} GameKeyStore. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="Visa" className="h-6 opacity-50 hover:opacity-100 transition-opacity" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="Mastercard" className="h-6 opacity-50 hover:opacity-100 transition-opacity" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/2560px-PayPal.svg.png" alt="PayPal" className="h-6 opacity-50 hover:opacity-100 transition-opacity" />
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
