"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import QRCode from "qrcode";

const noop = () => () => {};

/** URL tuyệt đối của một trang trong site (tính cả basePath khi chạy trên GitHub Pages). */
export function useSiteUrl(path: string) {
  const origin = useSyncExternalStore(noop, () => window.location.origin, () => "");
  return origin ? `${origin}${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}` : "";
}

export function QrCode({ url, className }: { url: string; className?: string }) {
  const [src, setSrc] = useState("");
  useEffect(() => {
    if (!url) return;
    let alive = true;
    QRCode.toDataURL(url, { margin: 1, width: 640, color: { dark: "#1E1A1B", light: "#FFFFFF" } }).then((s) => alive && setSrc(s));
    return () => {
      alive = false;
    };
  }, [url]);
  if (!src) return <div className={className} aria-hidden />;
  // eslint-disable-next-line @next/next/no-img-element -- ảnh data URL sinh tại chỗ, không cần tối ưu
  return <img src={src} alt={`Mã QR tới ${url}`} className={className} />;
}
