# Tỉnh Lướt

> Tỉnh táo khi lướt – Tôn trọng khi khác biệt

Website tương tác (Sản phẩm sáng tạo môn CNXHKH) về vấn đề tôn giáo trong thời kỳ quá độ lên CNXH và tôn giáo trên mạng xã hội ở Việt Nam.

Hành trình 6 phần: Mở đầu → Hiểu đúng (12 thẻ lật) → Lướt thử (bảng tin giả lập, chấm điểm) → Phân loại (kéo thả) → Tôn giáo ở Việt Nam → Cam kết “5 không” và chứng nhận.

## Chạy ở local

```bash
python3 -m http.server 5173
# mở http://localhost:5173
```

Toàn bộ là một file `index.html` (HTML + CSS + JS), không cần build.

## Ghi chú

- Bức tường cam kết lưu bằng `localStorage`, tức chỉ trên từng thiết bị.
- Link Blooket: điền vào hằng số `BLOOKET_URL` trong `index.html`.
