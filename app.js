// Danh sách tài liệu Ngữ Văn 10 - Kết nối tri thức với cuộc sống (Tập 1)
const DOCS_LOTRINH = [
  {
    id: "nv10-lo-trinh-tu-hoc-hk1",
    title: "Lộ trình tự học Ngữ văn 10 – Học kỳ I (18 tuần)",
    badge: "Kế hoạch 18 tuần",
    desc: "Phân chia 5 bài học lớn theo tuần, lịch tự học 5 buổi/tuần, bộ câu hỏi tự kiểm tra và thang điểm 10.",
    pages: 7,
    file: "pdf/nv10-lo-trinh-tu-hoc-hk1.pdf"
  },
  {
    id: "ngu-van-10-hk1-tron-bo",
    title: "Trọn bộ Lộ trình & Tài liệu Tự học Học kỳ I",
    badge: "Full File HK I",
    desc: "Bản tổng hợp đầy đủ 28 trang gồm lộ trình 18 tuần, chi tiết Bài 3–5, ôn tập tổng hợp và đáp án gợi ý.",
    pages: 28,
    file: "pdf/ngu-van-10-hk1-tron-bo.pdf"
  }
];

const DOCS_BAIHOC = [
  {
    id: "nv10-bai-3-nghi-luan",
    title: "Bài 3: Nghệ thuật thuyết phục trong văn nghị luận",
    badge: "Tuần 7–9",
    desc: "Đọc hiểu Hiền tài là nguyên khí của quốc gia, Yêu và đồng cảm, Chữ bầu lên nhà thơ; thực hành lỗi mạch lạc & liên kết; viết bài luận thuyết phục.",
    pages: 7,
    file: "pdf/nv10-bai-3-nghi-luan.pdf"
  },
  {
    id: "nv10-bai-4-su-thi",
    title: "Bài 4: Sức sống của sử thi",
    badge: "Tuần 10–12",
    desc: "Đọc hiểu Héc-to từ biệt Ăng-đrô-mác, Đăm Săn đi bắt Nữ Thần Mặt Trời; thực hành trích dẫn & cước chú; viết báo cáo nghiên cứu.",
    pages: 6,
    file: "pdf/nv10-bai-4-su-thi.pdf"
  },
  {
    id: "nv10-bai-5-san-khau-dan-gian",
    title: "Bài 5: Tích trò sân khấu dân gian",
    badge: "Tuần 13–16",
    desc: "Đọc hiểu Xúy Vân giả dại (Chèo), Huyện đường (Tuồng), Múa rối nước; so sánh loại hình sân khấu; viết báo cáo văn hóa truyền thống.",
    pages: 7,
    file: "pdf/nv10-bai-5-san-khau-dan-gian.pdf"
  },
  {
    id: "nv10-on-tap-tong-hop-bai-3-5",
    title: "Ôn tập tổng hợp & Gợi ý tự đánh giá (Bài 3 – Bài 5)",
    badge: "Ôn tập & Đáp án",
    desc: "Hệ thống 8 câu hỏi trắc nghiệm, 5 câu tự luận tổng hợp có lời giải chi tiết và bảng kiểm tự đánh giá năng lực sau học.",
    pages: 3,
    file: "pdf/nv10-on-tap-tong-hop-bai-3-5.pdf"
  }
];

let db = null;
let firestoreModule = null;

async function initFirebase() {
  if (!FIREBASE_CONFIG || !FIREBASE_CONFIG.projectId || FIREBASE_CONFIG.projectId === "") {
    console.log("Firebase chưa được cấu hình trong config.js. Trang web hoạt động ở chế độ tĩnh.");
    return false;
  }

  try {
    const { initializeApp } = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js");
    const { getFirestore, doc, getDoc, setDoc, updateDoc, increment } = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js");
    
    const app = initializeApp(FIREBASE_CONFIG);
    db = getFirestore(app);
    firestoreModule = { doc, getDoc, setDoc, updateDoc, increment };
    return true;
  } catch (err) {
    console.warn("Không thể tải Firebase SDK:", err);
    return false;
  }
}

function shouldTrack(docId, actionType) {
  const key = `tracked_${docId}_${actionType}`;
  const lastTime = localStorage.getItem(key);
  const now = Date.now();
  const TWELVE_HOURS = 12 * 60 * 60 * 1000;

  if (!lastTime || now - parseInt(lastTime, 10) > TWELVE_HOURS) {
    localStorage.setItem(key, now.toString());
    return true;
  }
  return false;
}

async function recordInteraction(docId, actionType) {
  if (!db || !firestoreModule) return;
  if (!shouldTrack(docId, actionType)) return;

  const col = APP_SETTINGS.collectionName || "stats_nv10";
  const docRef = firestoreModule.doc(db, col, docId);

  try {
    const docSnap = await firestoreModule.getDoc(docRef);
    if (!docSnap.exists()) {
      await firestoreModule.setDoc(docRef, {
        views: actionType === "view" ? 1 : 0,
        downloads: actionType === "download" ? 1 : 0
      });
    } else {
      const updateData = {};
      updateData[actionType === "view" ? "views" : "downloads"] = firestoreModule.increment(1);
      await firestoreModule.updateDoc(docRef, updateData);
    }
    updateDocCountUI(docId);
  } catch (e) {
    console.warn("Lỗi ghi Firestore counter:", e);
  }
}

async function updateDocCountUI(docId) {
  if (!db || !firestoreModule) return;
  const col = APP_SETTINGS.collectionName || "stats_nv10";
  const docRef = firestoreModule.doc(db, col, docId);

  try {
    const docSnap = await firestoreModule.getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      const minCount = APP_SETTINGS.hienThiToiThieu || 1;
      
      const viewEl = document.getElementById(`view-${docId}`);
      const downEl = document.getElementById(`down-${docId}`);
      
      if (viewEl && typeof data.views === "number") {
        viewEl.textContent = data.views >= minCount ? `${data.views} xem` : "–";
      }
      if (downEl && typeof data.downloads === "number") {
        downEl.textContent = data.downloads >= minCount ? `${data.downloads} tải` : "–";
      }
    }
  } catch (err) {
    console.warn("Lỗi đọc thống kê:", err);
  }
}

function renderCard(doc) {
  return `
    <div class="doc-card" id="card-${doc.id}">
      <div class="doc-header">
        <span class="doc-badge">${doc.badge}</span>
        <span class="doc-pages">${doc.pages} trang</span>
      </div>
      <h3 class="doc-title">${doc.title}</h3>
      <p class="doc-desc">${doc.desc}</p>
      
      <div class="doc-stats">
        <span class="stat-item" title="Lượt xem trực tuyến">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          <span id="view-${doc.id}">–</span>
        </span>
        <span class="stat-item" title="Lượt tải về máy">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          <span id="down-${doc.id}">–</span>
        </span>
      </div>

      <div class="doc-actions">
        <a href="${doc.file}" target="_blank" class="btn btn-view" onclick="recordInteraction('${doc.id}', 'view')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
          Xem online
        </a>
        <a href="${doc.file}" download class="btn btn-download" onclick="recordInteraction('${doc.id}', 'download')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Tải về
        </a>
      </div>
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", async () => {
  const listLotrinh = document.getElementById("list-lotrinh");
  const listBaihoc = document.getElementById("list-baihoc");

  if (listLotrinh) listLotrinh.innerHTML = DOCS_LOTRINH.map(renderCard).join("");
  if (listBaihoc) listBaihoc.innerHTML = DOCS_BAIHOC.map(renderCard).join("");

  const hasFirebase = await initFirebase();
  if (hasFirebase) {
    const allDocs = [...DOCS_LOTRINH, ...DOCS_BAIHOC];
    for (const d of allDocs) {
      updateDocCountUI(d.id);
    }
  }
});
