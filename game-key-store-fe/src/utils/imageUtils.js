// Utility function to get full image URL
// If the URL is already a full URL (starts with http:// or https://), return it as is
// Otherwise, prepend the backend base URL
const BACKEND_BASE_URL = 'http://localhost:5000';

export const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }
    
    // If it's a relative path, prepend backend base URL
    // Remove leading slash if present to avoid double slashes
    const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    return `${BACKEND_BASE_URL}${cleanPath}`;
};

// Helper to get multiple image URLs
export const getImageUrls = (imagePaths) => {
    if (!Array.isArray(imagePaths)) return [];
    return imagePaths.map(getImageUrl).filter(Boolean);
};

