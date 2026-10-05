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

## Các trang

| Route | Ai dùng | Việc |
|---|---|---|
| `/` | mọi người | hành trình 6 phần; bức tường cam kết realtime |
| `/bo-phieu` | khán giả (quét QR) | đặt tên hiển thị (không cần đăng ký), bỏ phiếu theo bài MC đang chiếu |
| `/trinh-chieu` | thành viên nhóm | máy chiếu: QR, biểu đồ phiếu realtime, lật đáp án, bộ đếm + kiểm duyệt tên. Phím: ← → đổi bài · Space lật · 1/2/3 đổi màn · F toàn màn hình |
| `/quan-tri` | thành viên nhóm | sửa toàn bộ nội dung, lịch sử + khôi phục; owner thêm thành viên |

Thành viên đăng nhập Google rồi nhập **mã mời** do owner tạo ở `/quan-tri` → mục **Thành viên** (owner cũng có thể thêm email trực tiếp).

## Dữ liệu (Firebase Realtime Database)

Quyền truy cập nằm ở `database.rules.json` (khán giả: mỗi thiết bị 1 phiếu/bài, 1 chữ ký; chỉ thành viên mới sửa nội dung, điều khiển màn chiếu, ẩn tên).
Triển khai rules: `firebase deploy --only database`.

## Tech stack

Next.js 16 (App Router, static export) · TypeScript · Tailwind CSS v4 · shadcn/ui (Base UI) · Motion · lucide-react · Firebase (Auth ẩn danh + Google, Realtime Database).

## Chạy ở local

```bash
npm install
npm run dev -- -p 5173   # http://localhost:5173
```

Build tĩnh: `npm run build`, kết quả nằm ở `out/`.

## Sửa nội dung

Cách nhanh: vào `/quan-tri`. Nội dung gốc (mặc định khi chưa ai sửa) nằm trong `src/lib/content.ts`.

## Deploy

Push lên `main` thì GitHub Actions (`.github/workflows/deploy-pages.yml`) build và đăng lên GitHub Pages.
Mất mạng thì bức tường cam kết tự lưu trên thiết bị (`localStorage`).

Bản HTML một file cũ được giữ ở tag `v1-html`.
