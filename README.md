# Tỉnh Lướt

> Tỉnh táo khi lướt – Tôn trọng khi khác biệt

Website tương tác (Sản phẩm sáng tạo môn CNXHKH) về vấn đề tôn giáo trong thời kỳ quá độ lên CNXH và tôn giáo trên mạng xã hội ở Việt Nam.

## Ý tưởng giao diện: "Hai lớp"

Mỗi màn hình có **lớp ồn** (tiêu đề giật gân, đỏ, la hét) và **lớp sự thật** (bình tĩnh, vàng chanh) nằm bên dưới. Người xem dùng **Kính Tỉnh**, một thấu kính tròn, để soi xuyên lớp ồn. Trên máy tính kính đi theo chuột; trên điện thoại kính cố định, kéo được qua tay cầm, và người xem cuộn nội dung qua bên dưới. Nút "Soi toàn trang" mở toàn bộ lớp sự thật (cho máy chiếu và người dùng bàn phím).

| Phần | Tương tác |
|---|---|
| 1. Mở đầu | Câu hỏi thật nằm dưới bức tường tít báo giật gân |
| 2. Hiểu đúng | 12 câu trả lời bị nhòe, **giữ** thẻ đủ lâu mới rõ |
| 3. Lướt thử | 8 bài đăng; kính soi ra dấu hiệu thao túng / lành mạnh; chấm điểm trên 80 |
| 4. Phân loại | Chồng 9 thẻ, kéo (hoặc bấm ô) vào Tín ngưỡng / Tôn giáo / Mê tín dị đoan |
| 5. Việt Nam | Trang báo in: 5 đặc điểm, 5 chính sách, dòng thời gian |
| 6. Cam kết | Tắt 5 công tắc thói quen, độ ồn của trang giảm dần; ký tên, nhận chứng nhận PNG |

## Tech stack

Next.js 16 (App Router, static export) · TypeScript · Tailwind CSS v4 · shadcn/ui (Base UI) · Motion · lucide-react.

## Chạy ở local

```bash
npm install
npm run dev -- -p 5173   # http://localhost:5173
```

Build tĩnh: `npm run build`, kết quả nằm ở `out/`.

## Sửa nội dung

Toàn bộ chữ nằm trong `src/lib/content.ts`. Link Blooket: hằng số `BLOOKET_URL`.

## Deploy

Push lên `main` thì GitHub Actions (`.github/workflows/deploy-pages.yml`) build và đăng lên GitHub Pages.
Bức tường cam kết lưu bằng `localStorage`, tức chỉ trên từng thiết bị.

Bản HTML một file cũ được giữ ở tag `v1-html`.
