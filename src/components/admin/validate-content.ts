import type { SiteContent } from "@/lib/content";

/** Kiểm tra nội dung trước khi lưu. Trả về danh sách lỗi; rỗng thì được lưu. */
export function validateContent(c: SiteContent): string[] {
  const issues: string[] = [];

  // Chuỗi rỗng ở bất kỳ đâu (trừ link Blooket) sẽ làm trống một phần giao diện.
  const walk = (v: unknown, where: string) => {
    if (typeof v === "string") {
      if (!v.trim() && where !== "blooketUrl") issues.push(`Ô “${where}” đang để trống.`);
    } else if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${where} #${i + 1}`));
    else if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) walk(x, where ? `${where} › ${k}` : k);
  };
  walk(c, "");

  // Cụm từ được Kính Tỉnh đánh dấu phải xuất hiện nguyên văn trong bài, nếu không sẽ không hiện.
  c.posts.forEach((p, i) =>
    p.flags.forEach((f) => {
      if (f.text && !p.text.includes(f.text)) issues.push(`Bài đăng #${i + 1}: cụm “${f.text}” không có nguyên văn trong nội dung bài.`);
    }),
  );

  // Mỗi ô phân loại cần ít nhất một thẻ.
  for (const b of c.bins) if (!c.chips.some((x) => x.bin === b.key)) issues.push(`Ô phân loại “${b.label}” chưa có thẻ nào.`);

  if (c.blooketUrl && !/^https:\/\//.test(c.blooketUrl)) issues.push("Link Blooket phải bắt đầu bằng https://");

  return issues;
}
