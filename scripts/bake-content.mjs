// Lấy nội dung nhóm đã sửa trên Firebase lúc build, nhúng vào trang tĩnh
// để người xem lần đầu thấy đúng chữ ngay (không bị đổi chữ sau khi tải).
// Chỉ chạy khi BAKE_CONTENT=1 (GitHub Actions); local giữ file mặc định `null`.
import { writeFile } from "node:fs/promises";

const DB = "https://mln131-4f80d-default-rtdb.asia-southeast1.firebasedatabase.app";
const out = new URL("../src/lib/content-snapshot.json", import.meta.url);

if (process.env.BAKE_CONTENT !== "1") process.exit(0);
try {
  const res = await fetch(`${DB}/content.json`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  await writeFile(out, JSON.stringify(data) + "\n");
  console.log(data ? "bake-content: đã nhúng nội dung từ Firebase" : "bake-content: chưa có nội dung sửa, dùng mặc định");
} catch (e) {
  // Không chặn build: trang vẫn tải nội dung mới nhất lúc chạy.
  console.warn("bake-content: bỏ qua,", e.message);
}
