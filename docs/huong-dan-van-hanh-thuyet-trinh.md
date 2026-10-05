# Hướng dẫn vận hành buổi thuyết trình "Tỉnh Lướt"

> Tỉnh táo khi lướt – Tôn trọng khi khác biệt

Tài liệu cho cả nhóm: ai làm gì, bấm gì, lúc nào, và xử lý khi có sự cố. Đọc hết một lần trước buổi tập đầu tiên.

## 1. Các đường link

| Trang | Link | Dùng khi |
|---|---|---|
| Trang chính | https://dotuananhtb.github.io/tinh-luot/ | Chiếu hành trình 6 phần |
| Bỏ phiếu (khán giả) | https://dotuananhtb.github.io/tinh-luot/bo-phieu/ | Cả lớp quét QR, bỏ phiếu trên điện thoại |
| Trình chiếu | https://dotuananhtb.github.io/tinh-luot/trinh-chieu/ | Máy chiếu + điều khiển buổi diễn (cần đăng nhập) |
| Quản trị | https://dotuananhtb.github.io/tinh-luot/quan-tri/ | Sửa nội dung, quản lý thành viên (cần đăng nhập) |

Mã QR **tự hiện trên trang Trình chiếu**, không cần tạo QR riêng.

> ⚠️ **Mở `/trinh-chieu` và `/quan-tri` bằng Safari hoặc Chrome**, không bấm link ngay trong Zalo/Messenger/Facebook: Google chặn đăng nhập trong trình duyệt của các app này. Trang sẽ tự cảnh báo và có nút sao chép link. Khán giả mở `/bo-phieu` trong Zalo vẫn được.

## 2. Phân vai trong buổi diễn

| Vai | Số người | Thiết bị | Việc chính |
|---|---|---|---|
| **MC** | 1 | Điện thoại (đã đăng nhập `/trinh-chieu`) | Dẫn chuyện, hỏi lớp, bấm "Lật đáp án" từ điện thoại nếu muốn |
| **Người thao tác máy** | 1 | Laptop nối máy chiếu | Chuyển tab, rê Kính Tỉnh, bấm phím tắt |
| **Người hỗ trợ / kiểm duyệt** | 1 | Điện thoại hoặc laptop (đã đăng nhập) | Mời từng bàn quét QR, theo dõi bức tường cam kết, ẩn tên không phù hợp |

MC, người thao tác và người kiểm duyệt **đều phải là biên tập viên** (xem mục 7) để điều khiển được màn trình chiếu. Ba người bấm trên ba thiết bị khác nhau thì máy chiếu vẫn đồng bộ theo thời gian thực.

## 3. Chuẩn bị

### Trước buổi diễn 1 tuần
- [ ] Tất cả thành viên vào `/quan-tri` bằng mã mời (mục 7). Người nào vào được rồi thì báo trưởng nhóm.
- [ ] Nhóm nội dung (người 1–10) đối chiếu chữ trên web với giáo trình, sửa thẳng ở `/quan-tri` rồi bấm **Lưu**.
- [ ] Tập trọn kịch bản (mục 4) **2 lần** với điện thoại thật, đúng như ngày diễn.
- [ ] Rủ trước 10–15 bạn ngoài nhóm vào ký cam kết thử, để bộ đếm không bắt đầu từ 0.
- [ ] Nắm sĩ số lớp: gói Firebase miễn phí cho tối đa **100 kết nối cùng lúc**. Web tự ngắt các tab bị ẩn sau 30 giây nên lớp 40–80 người là an toàn. Lớp ghép đông hơn thì owner nâng Firebase lên gói Blaze (trả theo dùng, một buổi gần như 0 đồng).

### Ngày hôm trước
- [ ] Sau lần sửa nội dung **cuối cùng**, owner vào GitHub repo → tab **Actions** → **Deploy to GitHub Pages** → **Run workflow**. Nội dung mới sẽ được nhúng sẵn vào trang, nên cả lớp quét QR thấy đúng chữ ngay, không bị đổi chữ sau khi tải.
- [ ] Owner bấm **Tắt mã** mời trong `/quan-tri` → **Thành viên**, để người ngoài không vào được nữa.
- [ ] Quay sẵn **video demo dự phòng** (khoảng 2 phút) phòng khi mạng lớp hỏng hẳn.
- [ ] Sạc đầy laptop, điện thoại MC, mang theo cục phát wifi hoặc bật sẵn 4G để phát hotspot.

### 30 phút trước khi lên
- [ ] Laptop: mở **Chrome**, zoom trình duyệt **100%**, tắt thông báo (Không làm phiền).
- [ ] Mở sẵn **2 tab**:
  - **Tab A**: trang chính, cuộn về đầu trang.
  - **Tab B**: `/trinh-chieu`, đã đăng nhập.
- [ ] Ở Tab B bấm **"Buổi mới (đếm phiếu lại từ 0)"** (bấm 2 lần để xác nhận) để xóa phiếu của các buổi tập. Chữ ký cam kết **không** bị xóa.
- [ ] Ở Tab B bấm phím **1** để về màn **Chờ** (QR lớn).
- [ ] Thử nối máy chiếu, nhấn **F** ở Tab B xem toàn màn hình có vừa không.
- [ ] Điện thoại MC: mở `/trinh-chieu`, đăng nhập, thử bấm "Lật đáp án" rồi bấm lại "Ẩn đáp án".

## 4. Kịch bản từng phút (6–7 phút)

| Thời gian | Màn hình | MC nói / làm | Người thao tác bấm |
|---|---|---|---|
| **0:00–0:45** | Tab A · Mở đầu | Hỏi cả lớp: *"Tôn giáo từ đâu mà có – do thần linh hay do con người tạo ra?"* | Rê chuột **chậm** qua tường chữ đỏ để Kính Tỉnh soi ra câu hỏi thật. Bấm **"Bắt đầu lướt"** |
| | Tab A · Câu nói bị cắt | *"Câu này được chia sẻ hàng triệu lần. Nhưng đây có phải điều Mác thực sự nói?"* | Rê kính qua bài đăng → cả đoạn đầy đủ hiện ra. Đây là **khoảnh khắc ấn tượng nhất**, dừng 3–4 giây cho cả lớp đọc |
| | | Chốt: *"Lớp ồn là hiện tượng, lớp vàng là bản chất, Kính Tỉnh là tư duy biện chứng"* | Cuộn xuống bảng đối chiếu ba dòng |
| **0:45–1:45** | Tab A · Hiểu đúng | Đọc câu hỏi trên thẻ, hỏi lớp đoán trước | **Giữ chuột** trên 3–4 thẻ cho chữ hiện rõ. Soi nhanh 1 thẻ "Ngộ nhận" ở khối 4 nguyên tắc |
| **1:45–2:00** | **Tab B** · màn Chờ | *"Mọi người mở điện thoại, quét mã, đặt tên của mình"* | Chuyển sang Tab B (QR lớn). Người hỗ trợ đi mời từng bàn |
| **2:00–4:00** | Tab B · Bỏ phiếu | Với mỗi bài: *"Bạn sẽ làm gì với bài này?"* Cho cả lớp 10–15 giây bỏ phiếu, rồi đọc kết quả biểu đồ | Phím **2** vào màn Bỏ phiếu → chờ phiếu → **Space** lật đáp án (pháo giấy bắn) → **→** sang bài sau |
| | | Giải thích kỹ **bài 2, 3 và 7** (theo kế hoạch); các bài còn lại lật nhanh | |
| **4:00–4:45** | Tab A · Phân loại | Mời 1 bạn lên kéo thả 9 thẻ | Chuyển về Tab A, cuộn tới phần 4. Xong 9/9 có pháo giấy |
| **4:45–5:30** | Tab A · Việt Nam | Đọc tiêu đề "Tắt bảng tin. Mở trang báo", điểm qua 5 đặc điểm, dòng thời gian | Cuộn chậm, các dòng tự "in" ra |
| **5:30–6:30** | **Tab B** · Cam kết | *"Quét mã, tắt 5 thói quen và ký tên. Tên các bạn sẽ hiện ngay trên màn hình này"* | Phím **3**. Bộ đếm và tên chạy lên theo thời gian thực. Người kiểm duyệt theo dõi tên |
| **6:30–7:00** | Tab B · Cam kết | Chốt: ***"Tỉnh táo khi lướt – Tôn trọng khi khác biệt"*** | Để nguyên màn bộ đếm làm hình nền chốt |

**Mẹo để mượt:**
- Lúc đổi bài, MC nói câu dẫn trước rồi người thao tác mới bấm **→**, tránh khoảng lặng.
- Khi lớp đang bỏ phiếu, MC đọc to số người đã vote (góc phải, có biểu tượng người) để tạo không khí.
- Tối đa khoảng 15 giây mỗi bài; bài không quan trọng thì lật ngay khi có đủ 2/3 lớp bỏ phiếu.
- Ở Tab A, nếu máy chiếu mờ hoặc người xem ở xa khó nhìn kính, bấm **"Soi toàn trang"** (góc trên phải) để mở hết lớp vàng.

## 5. Phím tắt trang Trình chiếu

| Phím | Tác dụng |
|---|---|
| **1** | Màn Chờ (QR lớn để cả lớp vào) |
| **2** | Màn Bỏ phiếu |
| **3** | Màn Cam kết (bộ đếm + bức tường tên + QR ký tên) |
| **→ / ←** | Bài sau / bài trước (tự ẩn đáp án) |
| **Space** | Lật / ẩn đáp án |
| **F** | Bật / tắt toàn màn hình |

Các nút dưới chân màn hình làm được đúng những việc trên, MC có thể bấm bằng điện thoại.

## 6. Xử lý sự cố

| Sự cố | Cách xử lý ngay |
|---|---|
| Nhiều bạn báo không vào được cùng lúc (lớp rất đông) | Nhắc mọi người chỉ mở **một** trang (`/bo-phieu`) và đóng các tab khác; tab ẩn sẽ tự nhả kết nối sau 30 giây |
| Điện thoại khán giả báo "Chưa kết nối được" | Bảo các bạn tắt wifi trường, dùng 4G; hoặc phát hotspot. Trang chính vẫn chơi được khi mất mạng |
| Biểu đồ không nhảy dù lớp đã bấm | Kiểm tra Tab B còn đăng nhập không (góc trên có nút "Đăng xuất"). Tải lại Tab B (Cmd/Ctrl + R), trạng thái vẫn giữ nguyên |
| Có bạn bấm nhầm, muốn đổi phiếu | Không đổi được (mỗi máy 1 phiếu mỗi bài). Đây là chủ ý để kết quả công bằng |
| Tên thô tục hiện trên màn cam kết | Người kiểm duyệt bấm **"Kiểm duyệt tên"** → bấm vào tên đó → tên biến mất trên mọi màn hình. Bấm lại để hiện lại nếu ẩn nhầm |
| Lỡ bấm "Buổi mới" giữa chừng | Phiếu của buổi trước vẫn còn trong dữ liệu nhưng màn chiếu đếm lại từ 0. Cứ tiếp tục, không ảnh hưởng chữ ký cam kết |
| Laptop máy chiếu không đăng nhập được | Điều khiển bằng điện thoại MC (đã đăng nhập sẵn). Nếu cả hai đều không vào được: bỏ phần bỏ phiếu, chạy hành trình trên Tab A và cho lớp ký cam kết ở trang chính |
| Mạng hỏng hẳn | Chiếu video demo dự phòng. Tab A vẫn chạy được các phần 1–6, chỉ mất phần bỏ phiếu và bộ đếm trực tiếp |
| Máy chiếu cắt mất mép | Thoát toàn màn hình (F), chỉnh zoom trình duyệt xuống 90% |

## 7. Vào nhóm và sửa nội dung

**Thành viên mới vào nhóm:**
1. Mở `/quan-tri`, bấm **Đăng nhập với Google** (tài khoản Google nào cũng được).
2. Màn hình báo "Tài khoản chưa có quyền", nhập **mã mời** trưởng nhóm gửi vào ô "Có mã mời từ trưởng nhóm?", bấm **Vào nhóm**.
3. Từ lần sau chỉ cần đăng nhập.

**Sửa nội dung:**
1. Ở `/quan-tri`, chọn mục ở cột trái (xếp theo thứ tự 6 phần trên trang).
2. Sửa chữ. Mục nào có thay đổi chưa lưu sẽ hiện chấm đỏ.
3. Bấm **Lưu** ở thanh dưới cùng. Trang chính cập nhật ngay cho mọi người.
4. Nếu thanh dưới báo lỗi (ví dụ cụm từ đánh dấu không còn khớp với chữ trong bài đăng), sửa theo hướng dẫn rồi mới lưu được.
5. Lỡ tay sửa sai: vào **Lịch sử lưu** → **Khôi phục** bản trước → **Lưu**.

**Lưu ý:** không sửa nội dung trong lúc đang diễn. Nếu thấy cảnh báo "Một thành viên khác vừa lưu bản mới", bấm **Tải bản mới nhất** trước khi sửa tiếp để không ghi đè công sức của bạn khác.

## 8. Sau buổi diễn
- [ ] Ở Tab B, màn Cam kết: **chụp màn hình bộ đếm + bức tường tên** làm minh chứng lan tỏa (tiêu chí "Khả năng lan tỏa").
- [ ] Owner kiểm tra mã mời đã tắt.
- [ ] Gửi link trang chính vào nhóm lớp để các bạn chơi lại và nhận chứng nhận. Dán link vào Zalo/Messenger sẽ hiện ảnh xem trước của "Tỉnh Lướt".
- [ ] Nhắc các bạn bấm **"Chia sẻ lên story"** ở thẻ chứng nhận: trên điện thoại sẽ mở thẳng bảng chia sẻ (Instagram, Facebook, Zalo).
