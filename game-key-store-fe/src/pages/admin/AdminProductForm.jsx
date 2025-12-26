import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    createProduct,
    updateProduct,
    fetchProductBySlug,
    clearCurrentProduct
} from '../../features/product/productSlice';
import { fetchPlatforms } from '../../features/platform/platformSlice';
import { fetchGenres } from '../../features/genre/genreSlice';
import { toast } from 'react-hot-toast';
import { HiOutlineSearch, HiOutlinePhotograph, HiX, HiOutlineCloudUpload } from 'react-icons/hi';
import { uploadImage, uploadImages } from '../../api/adminApi';

// === Helper Functions for Price Formatting ===
const formatNumberForDisplay = (value) => {
    const num = Number(String(value).replace(/\D/g, ''));
    if (isNaN(num)) return '';
    return new Intl.NumberFormat('vi-VN').format(num);
};

const parseDisplayToNumber = (formattedValue) => {
    if (!formattedValue) return 0;
    return Number(String(formattedValue).replace(/\./g, ''));
};
// ===========================================

// === Reusable Checkbox List Component with Search ===
const CheckboxList = ({ title, items, status, selectedItems, onChange }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-lg border border-gray-700/50">
            <h3 className="text-lg font-semibold border-b border-gray-700 pb-3 mb-4">{title}</h3>
            <div className="relative mb-3">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={`Tìm ${title.toLowerCase()}...`}
                    className="w-full bg-gray-700 p-2 pl-8 rounded-md border border-gray-600 focus:ring-cyan-500 focus:border-cyan-500 outline-none text-sm"
                />
                <HiOutlineSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {status === 'loading' && <p className="text-gray-400 text-sm">Đang tải...</p>}
                {status === 'succeeded' && filteredItems.length > 0 && filteredItems.map(item => (
                    <label key={item._id} className="flex items-center space-x-3 cursor-pointer p-1 rounded hover:bg-gray-700/50">
                        <input
                            type="checkbox"
                            value={item._id}
                            checked={selectedItems.includes(item._id)}
                            onChange={onChange}
                            className="bg-gray-700 border-gray-600 rounded text-cyan-500 focus:ring-cyan-500 h-4 w-4"
                        />
                        <span className="text-gray-300">{item.name}</span>
                    </label>
                ))}
                {status === 'succeeded' && filteredItems.length === 0 && (
                    <p className="text-gray-500 text-sm text-center py-2">
                        {items.length > 0 ? "Không tìm thấy kết quả." : "Không có dữ liệu."}
                    </p>
                )}
            </div>
        </div>
    );
};
// ===========================================

// === Main Admin Product Form Component ===
const AdminProductForm = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { data: productToEdit, status: productStatus } = useSelector(state => state.products.currentProduct);
    const { items: allPlatforms, status: platformStatus } = useSelector(state => state.platforms);
    const { items: allGenres, status: genreStatus } = useSelector(state => state.genres);
    const { status: adminCategoryStatus } = useSelector(state => state.adminCategories);

    const isEditing = !!slug;

    const [formData, setFormData] = useState({
        name: '', shortDescription: '', description: '', price: 0, coverImage: '',
        images: [], genres: [], platforms: [],
        isNew: false, isHot: false, isFeatured: false,
    });

    const [displayPrice, setDisplayPrice] = useState('0');
    const [discountPercent, setDiscountPercent] = useState(0);
    
    // Image upload states
    const [coverImageFile, setCoverImageFile] = useState(null);
    const [coverImagePreview, setCoverImagePreview] = useState('');
    const [galleryFiles, setGalleryFiles] = useState([]);
    const [galleryPreviews, setGalleryPreviews] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    
    const coverImageInputRef = useRef(null);
    const galleryInputRef = useRef(null);

    // Fetch data
    useEffect(() => {
        if (platformStatus === 'idle') dispatch(fetchPlatforms());
        if (genreStatus === 'idle') dispatch(fetchGenres());
        if (isEditing) {
            dispatch(fetchProductBySlug(slug));
        }
        return () => dispatch(clearCurrentProduct());
    }, [slug, isEditing, dispatch, platformStatus, genreStatus]);

    // Populate form when in "Edit" mode
    useEffect(() => {
        if (isEditing && productToEdit) {
            const price = productToEdit.price || 0;
            const coverImg = productToEdit.coverImage || '';
            const galleryImgs = productToEdit.images || [];
            
            setFormData({
                name: productToEdit.name || '',
                shortDescription: productToEdit.shortDescription || '',
                description: productToEdit.description || '',
                price: price,
                coverImage: coverImg,
                images: galleryImgs,
                platforms: productToEdit.platforms?.map(p => p._id) || [],
                genres: productToEdit.genres?.map(g => g._id) || [],
                isNew: productToEdit.isNew || false,
                isHot: productToEdit.isHot || false,
                isFeatured: productToEdit.isFeatured || false,
            });
            setDisplayPrice(formatNumberForDisplay(price));
            
            // Set previews for existing images
            setCoverImagePreview(coverImg ? (coverImg.startsWith('http') ? coverImg : `http://localhost:5000${coverImg}`) : '');
            setGalleryPreviews(galleryImgs.map(img => img.startsWith('http') ? img : `http://localhost:5000${img}`));

            if (productToEdit.price && productToEdit.salePrice) {
                const discount = Math.round(((productToEdit.price - productToEdit.salePrice) / productToEdit.price) * 100);
                setDiscountPercent(discount >= 0 ? discount : 0);
            } else {
                setDiscountPercent(0);
            }
        }
    }, [isEditing, productToEdit]);

    // General handler
    const handleChange = e => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    // Price handler
    const handlePriceChange = (e) => {
        const rawValue = parseDisplayToNumber(e.target.value);
        const formattedValue = formatNumberForDisplay(rawValue);
        setFormData(prev => ({ ...prev, price: rawValue }));
        setDisplayPrice(formattedValue);
    };

    // Checkbox list handler
    const handleCheckboxChange = (fieldName) => (e) => {
        const { value, checked } = e.target;
        setFormData(prev => {
            const list = prev[fieldName] || [];
            return {
                ...prev,
                [fieldName]: checked
                    ? [...list, value]
                    : list.filter(id => id !== value),
            };
        });
    };

    // Handle cover image upload
    const handleCoverImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Vui lòng chọn file ảnh');
            return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Kích thước file không được vượt quá 5MB');
            return;
        }

        setCoverImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setCoverImagePreview(reader.result);
        };
        reader.readAsDataURL(file);

        // Upload image
        setIsUploading(true);
        try {
            const response = await uploadImage(file);
            setFormData(prev => ({ ...prev, coverImage: response.data.imageUrl }));
            toast.success('Đã upload ảnh chính thành công!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Lỗi khi upload ảnh');
            setCoverImageFile(null);
            setCoverImagePreview('');
        } finally {
            setIsUploading(false);
        }
    };

    // Handle gallery images upload
    const handleGalleryImagesChange = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        // Validate files
        const validFiles = files.filter(file => {
            if (!file.type.startsWith('image/')) {
                toast.error(`${file.name} không phải là file ảnh`);
                return false;
            }
            if (file.size > 5 * 1024 * 1024) {
                toast.error(`${file.name} vượt quá 5MB`);
                return false;
            }
            return true;
        });

        if (validFiles.length === 0) return;

        // Create previews
        const previewPromises = validFiles.map(file => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(file);
            });
        });

        const newPreviews = await Promise.all(previewPromises);
        setGalleryPreviews(prev => [...prev, ...newPreviews]);
        setGalleryFiles(prev => [...prev, ...validFiles]);

        // Upload images
        setIsUploading(true);
        try {
            const response = await uploadImages(validFiles);
            setFormData(prev => ({ ...prev, images: [...prev.images, ...response.data.imageUrls] }));
            toast.success(`Đã upload ${validFiles.length} ảnh thành công!`);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Lỗi khi upload ảnh');
            // Remove failed previews
            setGalleryPreviews(prev => prev.slice(0, prev.length - validFiles.length));
            setGalleryFiles(prev => prev.slice(0, prev.length - validFiles.length));
        } finally {
            setIsUploading(false);
        }
    };

    // Remove gallery image
    const handleRemoveGalleryImage = (index) => {
        setFormData(prev => {
            const newImages = [...prev.images];
            newImages.splice(index, 1);
            return { ...prev, images: newImages };
        });
        setGalleryPreviews(prev => {
            const newPreviews = [...prev];
            newPreviews.splice(index, 1);
            return newPreviews;
        });
        setGalleryFiles(prev => {
            const newFiles = [...prev];
            newFiles.splice(index, 1);
            return newFiles;
        });
    };

    // Submit handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (isUploading) {
            toast.error('Vui lòng đợi upload ảnh hoàn tất');
            return;
        }

        const salePrice = (discountPercent > 0 && formData.price > 0)
            ? Math.round(formData.price * (1 - discountPercent / 100))
            : null;
        const processedData = {
            ...formData,
            price: Number(formData.price),
            salePrice,
            images: Array.isArray(formData.images) ? formData.images : [],
            platforms: formData.platforms,
            genres: formData.genres,
        };
        const action = isEditing
            ? updateProduct({ id: productToEdit._id, productData: processedData })
            : createProduct(processedData);
        toast.promise(dispatch(action).unwrap(), {
            loading: 'Đang lưu...',
            success: `Đã ${isEditing ? 'cập nhật' : 'tạo'} sản phẩm!`,
            error: (err) => `Lỗi: ${err || 'Vui lòng thử lại'}`,
        }).then(() => {
            navigate('/admin/products');
        });
    };

    const isLoading = productStatus === 'loading' || platformStatus === 'loading' || genreStatus === 'loading' || adminCategoryStatus === 'loading';

    if (isEditing && productStatus === 'loading') {
        return <p className="text-white text-center py-10">Đang tải dữ liệu sản phẩm...</p>;
    }

    return (
        <div className="text-white min-h-screen">
            <Link to="/admin/products" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-6 transition-colors">
                <span>&larr;</span>
                <span>Quay lại danh sách</span>
            </Link>
            <div className="mb-8">
                <h1 className="text-4xl font-extrabold mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    {isEditing ? `Chỉnh sửa: ${productToEdit?.name || ''}` : 'Tạo Sản phẩm mới'}
                </h1>
                <div className="h-1 w-24 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"></div>
            </div>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Cột trái (Thông tin chính) */}
                <div className="lg:col-span-2 bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl space-y-6 shadow-lg border border-gray-700/50">
                    <div>
                        <label htmlFor="name" className="block mb-2 font-medium text-gray-300">Tên sản phẩm</label>
                        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="w-full bg-gray-700 p-2 rounded-md border border-gray-600 focus:ring-cyan-500 focus:border-cyan-500 outline-none" required />
                    </div>
                    <div>
                        <label htmlFor="shortDescription" className="block mb-2 font-medium text-gray-300">Mô tả ngắn</label>
                        <textarea name="shortDescription" id="shortDescription" value={formData.shortDescription} onChange={handleChange} rows="3" className="w-full bg-gray-700 p-2 rounded-md border border-gray-600 focus:ring-cyan-500 focus:border-cyan-500 outline-none" required></textarea>
                    </div>
                    <div>
                        <label htmlFor="description" className="block mb-2 font-medium text-gray-300">Mô tả chi tiết (Hỗ trợ HTML)</label>
                        <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows="8" className="w-full bg-gray-700 p-2 rounded-md border border-gray-600 focus:ring-cyan-500 focus:border-cyan-500 outline-none" required></textarea>
                    </div>
                    {/* Gallery Images Upload */}
                    <div>
                        <label className="block mb-2 font-medium text-gray-300">Ảnh Gallery</label>
                        <input
                            type="file"
                            ref={galleryInputRef}
                            onChange={handleGalleryImagesChange}
                            multiple
                            accept="image/*"
                            className="hidden"
                            disabled={isUploading}
                        />
                        <button
                            type="button"
                            onClick={() => galleryInputRef.current?.click()}
                            disabled={isUploading}
                            className="w-full bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 border-2 border-dashed border-cyan-500/30 hover:border-cyan-500/50 rounded-lg p-6 text-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <HiOutlineCloudUpload className="mx-auto mb-2 text-cyan-400" size={32} />
                            <p className="text-gray-300 font-medium">Chọn nhiều ảnh để upload</p>
                            <p className="text-gray-500 text-sm mt-1">JPG, PNG, GIF, WEBP (tối đa 5MB mỗi ảnh)</p>
                        </button>
                        
                        {/* Gallery Preview Grid */}
                        {galleryPreviews.length > 0 && (
                            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {galleryPreviews.map((preview, index) => (
                                    <div key={index} className="relative group">
                                        <img
                                            src={preview}
                                            alt={`Gallery ${index + 1}`}
                                            className="w-full h-32 object-cover rounded-lg border-2 border-gray-700 group-hover:border-cyan-500 transition-colors"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveGalleryImage(index)}
                                            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                        >
                                            <HiX size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Cột phải (Tùy chọn) */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Tùy chọn hiển thị */}
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-lg border border-gray-700/50">
                        <h3 className="text-lg font-semibold border-b border-gray-700 pb-3 mb-4">Tùy chọn hiển thị</h3>
                        <div className="space-y-3">
                            <label className="flex items-center justify-between cursor-pointer"><span className="font-medium text-gray-300">Nổi bật (Banner)</span><input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="toggle-switch" /></label>
                            <label className="flex items-center justify-between cursor-pointer"><span className="font-medium text-gray-300">Game Mới</span><input type="checkbox" name="isNew" checked={formData.isNew} onChange={handleChange} className="toggle-switch" /></label>
                            <label className="flex items-center justify-between cursor-pointer"><span className="font-medium text-gray-300">Game Hot</span><input type="checkbox" name="isHot" checked={formData.isHot} onChange={handleChange} className="toggle-switch" /></label>
                        </div>
                    </div>
                    {/* Thông tin & Giá */}
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-lg border border-gray-700/50">
                        <h3 className="text-lg font-semibold border-b border-gray-700 pb-3 mb-4">Thông tin & Giá</h3>
                        <div className="space-y-4">
                            {/* Cover Image Upload */}
                            <div>
                                <label className="block mb-2 font-medium text-gray-300">Ảnh chính</label>
                                <input
                                    type="file"
                                    ref={coverImageInputRef}
                                    onChange={handleCoverImageChange}
                                    accept="image/*"
                                    className="hidden"
                                    disabled={isUploading}
                                />
                                
                                {coverImagePreview ? (
                                    <div className="relative group">
                                        <img
                                            src={coverImagePreview}
                                            alt="Cover preview"
                                            className="w-full h-48 object-cover rounded-lg border-2 border-gray-700 group-hover:border-cyan-500 transition-colors"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setCoverImagePreview('');
                                                setCoverImageFile(null);
                                                setFormData(prev => ({ ...prev, coverImage: '' }));
                                                if (coverImageInputRef.current) {
                                                    coverImageInputRef.current.value = '';
                                                }
                                            }}
                                            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                        >
                                            <HiX size={18} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => coverImageInputRef.current?.click()}
                                            disabled={isUploading}
                                            className="absolute bottom-2 left-2 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg font-medium opacity-0 group-hover:opacity-100 transition-opacity shadow-lg disabled:opacity-50"
                                        >
                                            Thay đổi
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => coverImageInputRef.current?.click()}
                                        disabled={isUploading}
                                        className="w-full bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 border-2 border-dashed border-cyan-500/30 hover:border-cyan-500/50 rounded-lg p-8 text-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <HiOutlinePhotograph className="mx-auto mb-3 text-cyan-400" size={40} />
                                        <p className="text-gray-300 font-medium">Chọn ảnh chính</p>
                                        <p className="text-gray-500 text-sm mt-1">JPG, PNG, GIF, WEBP (tối đa 5MB)</p>
                                    </button>
                                )}
                                
                                {isUploading && (
                                    <div className="mt-2 text-center">
                                        <span className="text-cyan-400 text-sm animate-pulse">Đang upload...</span>
                                    </div>
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="price" className="block mb-2 font-medium text-gray-300">Giá gốc (VNĐ)</label>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        name="price"
                                        id="price"
                                        value={displayPrice}
                                        onChange={handlePriceChange}
                                        className="w-full bg-gray-700 p-2 rounded-md border border-gray-600 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="discountPercent" className="block mb-2 font-medium text-gray-300">Giảm giá (%)</label>
                                    <input
                                        type="number"
                                        id="discountPercent"
                                        value={discountPercent}
                                        onChange={e => setDiscountPercent(e.target.value)}
                                        className="w-full bg-gray-700 p-2 rounded-md border border-gray-600 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
                                        min="0" max="100"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Nền tảng */}
                    <CheckboxList
                        title="Nền tảng hỗ trợ"
                        items={allPlatforms}
                        selectedItems={formData.platforms}
                        onChange={handleCheckboxChange('platforms')}
                        status={platformStatus}
                    />
                    {/* Thể loại */}
                    <CheckboxList
                        title="Thể loại"
                        items={allGenres}
                        selectedItems={formData.genres}
                        onChange={handleCheckboxChange('genres')}
                        status={genreStatus}
                    />

                    {/* Nút Submit */}
                    <button 
                        type="submit" 
                        disabled={isLoading || isUploading} 
                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-3 px-4 rounded-lg text-lg transition-all duration-300 shadow-lg hover:shadow-cyan-500/50 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isUploading ? 'Đang upload ảnh...' : (isEditing ? 'Cập nhật Sản phẩm' : 'Tạo Sản phẩm')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminProductForm;