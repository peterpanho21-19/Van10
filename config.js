// Cấu hình Firebase cho Website Ngữ Văn 10
// Điền 4 thông số lấy từ Firebase Console vào giữa hai dấu ngoặc kép bên dưới:

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyBDZ6WxYq_vc3zquP0j6JYUIpFR4RMIbHg",          
  authDomain: "van-10-c4926.firebaseapp.com",    
  projectId: "van-10-c4926",       
  appId: "1:877183655024:web:f926a05cd44ff4242228b5"          
};

// Cấu hình hiển thị
const APP_SETTINGS = {
  collectionName: "stats_nv10", // Tên collection riêng trên Firestore (không trùng với Tiếng Anh 8 hay Tiếng Việt 5)
  hienThiToiThieu: 1            // Chỉ hiển thị số khi lượt xem/tải đạt mức này trở lên
};
