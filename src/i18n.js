import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';

i18n
    .use(HttpBackend) // Tải file ngôn ngữ từ backend hoặc local
    .use(LanguageDetector) // Phát hiện ngôn ngữ
    .use(initReactI18next)
    .init({
        lng: 'vi', // Ngôn ngữ mặc định: Tiếng Việt
        fallbackLng: 'vi', // Ngôn ngữ dự phòng
        debug: true, // Bật debug để kiểm tra lỗi
        interpolation: {
            escapeValue: false, // React đã xử lý XSS
        },
        detection: {
            order: ['localStorage', 'navigator'], // Ưu tiên localStorage
            caches: ['localStorage'], // Lưu ngôn ngữ đã chọn
        },
        backend: {
            loadPath: '/locales/{{lng}}/translation.json', // Đường dẫn file ngôn ngữ
        },
    });

export default i18n;