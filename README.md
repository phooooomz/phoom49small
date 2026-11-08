# Phoom49small

เว็บไซต์นี้รองรับ SPA Navigation ผ่าน `index.html` และ `router.js`

- หน้า Home: `#/home`
- Store: `#/store`
- About: `#/about`
- Contact / Socials: `#/contact`
- เนื้อหาแต่ละหน้าอยู่ใน `views/`
- `admin.html` ยังคงเป็นหน้าแยก

ต้องเปิดผ่าน HTTP/HTTPS เช่น GitHub Pages หรือ Cloudflare Pages ไม่รองรับการเปิด `index.html` ด้วย `file://` โดยตรง เนื่องจาก Router ใช้ Fetch โหลดไฟล์ใน `views/`
