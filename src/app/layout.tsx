import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro, JetBrains_Mono, Oswald } from "next/font/google";
import "./globals.css";

const body = Be_Vietnam_Pro({
  variable: "--font-body",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
});

const mono = JetBrains_Mono({
  variable: "--font-jet",
  subsets: ["latin", "vietnamese"],
  weight: ["500", "700", "800"],
});

// Phông "la hét" chỉ dùng cho lớp ồn.
const display = Oswald({
  variable: "--font-shout",
  subsets: ["latin", "vietnamese"],
  weight: "700",
});

export const metadata: Metadata = {
  title: "Tỉnh Lướt",
  description: "Tỉnh táo khi lướt – Tôn trọng khi khác biệt. Sản phẩm sáng tạo về vấn đề tôn giáo trong thời kỳ quá độ lên CNXH.",
};

export const viewport: Viewport = {
  themeColor: "#EDEDED",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" className={`${body.variable} ${mono.variable} ${display.variable}`}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
