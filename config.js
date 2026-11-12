// Cấu hình Firebase cho Website Ngữ Văn 10
// Điền 4 thông số lấy từ Firebase Console vào giữa hai dấu ngoặc kép bên dưới:

const FIREBASE_CONFIG = {
  apiKey: "",          // Ví dụ: "AIzaSy..."
  authDomain: "",      // Ví dụ: "eng8-53ba0.firebaseapp.com" hoặc project mới của bạn
  projectId: "",       // Ví dụ: "eng8-53ba0" hoặc ID project của bạn
  appId: ""            // Ví dụ: "1:..."
};

// Cấu hình hiển thị
const APP_SETTINGS = {
  collectionName: "stats_nv10", // Tên collection riêng trên Firestore (không trùng với Tiếng Anh 8 hay Tiếng Việt 5)
  hienThiToiThieu: 1            // Chỉ hiển thị số khi lượt xem/tải đạt mức này trở lên
};
