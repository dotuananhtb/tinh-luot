// Bức tường cam kết lưu trong localStorage: chỉ trên thiết bị hiện tại (giới hạn của hosting tĩnh).
// Bọc thành external store để React đọc qua useSyncExternalStore (an toàn khi prerender).

export type WallEntry = { name: string; score: number | null; t: number };

const KEY = "tinhluot.wall.v2";
const EMPTY: WallEntry[] = [];
let cache: WallEntry[] | null = null;
const listeners = new Set<() => void>();

function read(): WallEntry[] {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(raw) ? raw : EMPTY;
  } catch {
    return EMPTY;
  }
}

export function getWall() {
  cache ??= read();
  return cache;
}

export const getServerWall = () => EMPTY;

export function subscribeWall(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function addToWall(entry: WallEntry) {
  cache = [...getWall(), entry];
  try {
    localStorage.setItem(KEY, JSON.stringify(cache));
  } catch {
    // Chế độ ẩn danh / bị chặn lưu trữ: bức tường chỉ sống trong phiên.
  }
  listeners.forEach((l) => l());
}
