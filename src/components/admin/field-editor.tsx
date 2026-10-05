"use client";

import { BINS, REACTIONS } from "@/lib/content";
import { cn } from "@/lib/utils";

type Json = string | number | boolean | null | Json[] | { [k: string]: Json };

/** Nhãn tiếng Việt cho các khóa nội dung. Khóa không có ở đây hiện nguyên tên. */
const LABELS: Record<string, string> = {
  question: "Câu hỏi lớn", sub: "Dòng phụ", sticker: "Tít giật gân (lớp ồn)", stickerSub: "Dòng phụ của tít",
  cut: "Câu bị cắt (lan truyền trên mạng)", full: "Các câu phía trước (bị cắt mất)", author: "Tác giả",
  group: "Nhóm", cards: "Thẻ", q: "Mặt trước (câu hỏi)", a: "Mặt sau (câu trả lời)",
  myth: "Ngộ nhận (lớp ồn)", title: "Nguyên tắc", body: "Giải thích",
  label: "Tên", nature: "Tính chất", method: "Cách giải quyết",
  text: "Nội dung", face: "Thuộc mặt", name: "Tên tài khoản", initials: "Chữ trên avatar", color: "Màu avatar",
  meta: "Dòng thời gian / trạng thái", media: "Video / ảnh", caption: "Chú thích khi soi kính", live: "Đang trực tiếp",
  stats: "Lượt thích · bình luận · chia sẻ", flags: "Cụm từ Kính Tỉnh đánh dấu", note: "Nhãn", tone: "Loại dấu hiệu",
  answer: "Phản ứng đúng", explain: "Giải thích khi chọn", kind: "Kiểu", bin: "Ô đúng", def: "Định nghĩa", key: "Mã",
  year: "Năm", on: "Thói quen (đang bật)", off: "Cam kết (khi tắt)",
};

const SELECTS: Record<string, { value: string; label: string }[]> = {
  answer: REACTIONS.map((r) => ({ value: r.key, label: r.label })),
  tone: [
    { value: "bad", label: "Thao túng (đỏ)" },
    { value: "good", label: "Lành mạnh (xanh)" },
  ],
  bin: BINS.map((b) => ({ value: b.key, label: b.label })),
  face: [
    { value: "tutuong", label: "Mặt tư tưởng" },
    { value: "chinhtri", label: "Mặt chính trị" },
  ],
};

const READ_ONLY = new Set(["key", "kind"]);
const inputCls =
  "w-full rounded-lg border-2 border-ink/25 bg-white px-3 py-2 text-[15px] outline-none transition-colors focus:border-ink focus:ring-4 focus:ring-lime";

const setAt = (obj: Json, path: (string | number)[], value: Json): Json => {
  if (!path.length) return value;
  const [head, ...rest] = path;
  if (Array.isArray(obj)) return obj.map((v, i) => (i === head ? setAt(v, rest, value) : v));
  const o = obj as { [k: string]: Json };
  return { ...o, [head]: setAt(o[head as string], rest, value) };
};

/** Trình sửa đệ quy theo đúng hình dạng dữ liệu. Số lượng phần tử mảng giữ nguyên (bố cục cố định). */
export function FieldEditor({
  value,
  onChange,
  name,
  path = [],
  depth = 0,
}: {
  value: Json;
  onChange: (path: (string | number)[], v: Json) => void;
  name?: string;
  path?: (string | number)[];
  depth?: number;
}) {
  const label = name !== undefined ? (LABELS[name] ?? name) : undefined;
  const id = `f-${path.join("-")}`;

  if (typeof value === "string") {
    if (name && READ_ONLY.has(name)) {
      return (
        <p className="text-sm text-muted-ink">
          {label}: <code className="font-mono">{value}</code>
        </p>
      );
    }
    const options = name ? SELECTS[name] : undefined;
    return (
      <label htmlFor={id} className="block">
        {label && <span className="mb-1 block text-xs font-bold text-muted-ink">{label}</span>}
        {options ? (
          <select id={id} className={inputCls} value={value} onChange={(e) => onChange(path, e.target.value)}>
            {options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        ) : name === "color" ? (
          <input id={id} type="color" className="h-10 w-20 cursor-pointer rounded border-2 border-ink/25" value={value} onChange={(e) => onChange(path, e.target.value)} />
        ) : value.length > 70 || ["explain", "def", "body", "a", "full", "text"].includes(name ?? "") ? (
          <textarea id={id} rows={Math.min(6, Math.max(2, Math.ceil(value.length / 70)))} className={inputCls} value={value} onChange={(e) => onChange(path, e.target.value)} />
        ) : (
          <input id={id} className={inputCls} value={value} onChange={(e) => onChange(path, e.target.value)} />
        )}
      </label>
    );
  }

  if (typeof value === "boolean") {
    return (
      <label htmlFor={id} className="flex cursor-pointer items-center gap-2 text-sm font-semibold">
        <input id={id} type="checkbox" className="size-4 accent-ink" checked={value} onChange={(e) => onChange(path, e.target.checked)} />
        {label}
      </label>
    );
  }

  if (typeof value === "number") {
    return (
      <label htmlFor={id} className="block">
        <span className="mb-1 block text-xs font-bold text-muted-ink">{label}</span>
        <input id={id} type="number" className={inputCls} value={value} onChange={(e) => onChange(path, Number(e.target.value))} />
      </label>
    );
  }

  if (Array.isArray(value)) {
    const primitive = value.every((v) => typeof v === "string");
    return (
      <fieldset className="space-y-2">
        {label && <legend className="mb-2 text-xs font-bold text-muted-ink">{label}</legend>}
        {value.map((v, i) =>
          primitive ? (
            <div key={i} className="flex items-start gap-2">
              <span className="mt-2.5 w-6 shrink-0 text-right font-mono text-xs text-muted-ink">{i + 1}</span>
              <div className="flex-1">
                <FieldEditor value={v} onChange={onChange} path={[...path, i]} depth={depth + 1} />
              </div>
            </div>
          ) : (
            <details key={i} open={depth > 0 || value.length <= 5} className="rounded-xl border-2 border-ink/15 bg-white open:border-ink/40">
              <summary className="cursor-pointer px-4 py-2.5 font-mono text-sm font-bold select-none">
                #{i + 1} {summaryOf(v)}
              </summary>
              <div className="border-t border-ink/10 p-4">
                <FieldEditor value={v} onChange={onChange} path={[...path, i]} depth={depth + 1} />
              </div>
            </details>
          ),
        )}
      </fieldset>
    );
  }

  if (value && typeof value === "object") {
    return (
      <div className={cn("space-y-3", depth > 1 && label && "rounded-lg bg-paper/60 p-3")}>
        {label && depth > 1 && <p className="text-xs font-bold text-muted-ink">{label}</p>}
        {Object.entries(value).map(([k, v]) => (
          <FieldEditor key={k} name={k} value={v} onChange={onChange} path={[...path, k]} depth={depth + 1} />
        ))}
      </div>
    );
  }
  return null;
}

/** Dòng tóm tắt cho mỗi mục thu gọn. */
function summaryOf(v: Json): string {
  if (v && typeof v === "object" && !Array.isArray(v)) {
    const s = (v.name ?? v.q ?? v.myth ?? v.text ?? v.title ?? v.label ?? v.group ?? v.year ?? v.on ?? "") as string;
    return typeof s === "string" ? `· ${s.slice(0, 60)}${s.length > 60 ? "…" : ""}` : "";
  }
  return "";
}

export { setAt, type Json };
