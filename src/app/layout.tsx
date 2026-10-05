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

const description =
  "Soi tin tôn giáo trên mạng bằng tư duy biện chứng: lướt thử, bỏ phiếu, cam kết “5 không”. Sản phẩm sáng tạo về vấn đề tôn giáo trong thời kỳ quá độ lên CNXH.";

export const metadata: Metadata = {
  // URL tuyệt đối cho ảnh xem trước khi chia sẻ link (Zalo, Messenger, Facebook).
  metadataBase: new URL("https://dotuananhtb.github.io"), // Next tự thêm basePath /tinh-luot
  title: "Tỉnh Lướt",
  description,
  openGraph: {
    title: "Tỉnh Lướt – Tỉnh táo khi lướt, Tôn trọng khi khác biệt",
    description,
    siteName: "Tỉnh Lướt",
    locale: "vi_VN",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "Tỉnh Lướt – Tỉnh táo khi lướt, Tôn trọng khi khác biệt", description },
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
