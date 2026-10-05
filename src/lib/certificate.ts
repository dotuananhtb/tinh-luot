import { MAX_SCORE, PLEDGES, verdict } from "./content";

/** Vẽ thẻ chứng nhận khổ story 1080×1920 lên canvas. */
export async function drawCertificate(canvas: HTMLCanvasElement, { name, score, slogan }: { name: string; score: number | null; slogan: string }) {
  try {
    await document.fonts.ready;
  } catch {}
  const css = getComputedStyle(document.documentElement);
  const MONO = css.getPropertyValue("--font-jet").trim() || "monospace";
  const SANS = css.getPropertyValue("--font-body").trim() || "sans-serif";
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const W = canvas.width;
  const H = canvas.height;
  const INK = "#1E1A1B";
  const LIME = "#E5FD54";

  ctx.fillStyle = "#EDEDED";
  ctx.fillRect(0, 0, W, H);

  // vòng Kính Tỉnh làm hình nền
  ctx.strokeStyle = INK;
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.arc(W / 2, 600, 380, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = LIME;
  ctx.beginPath();
  ctx.arc(W / 2, 600, 360, 0, Math.PI * 2);
  ctx.fill();

  ctx.textAlign = "center";
  ctx.fillStyle = INK;
  ctx.fillRect(W / 2 - 190, 120, 380, 84);
  ctx.fillStyle = LIME;
  ctx.font = `800 46px ${MONO}`;
  ctx.fillText("TỈNH LƯỚT", W / 2, 178);

  ctx.fillStyle = INK;
  ctx.font = `700 38px ${MONO}`;
  ctx.fillText("CHỨNG NHẬN", W / 2, 440);
  ctx.font = `800 96px ${MONO}`;
  ctx.fillText("NGƯỜI LƯỚT", W / 2, 580);
  ctx.fillText("TỈNH TÁO", W / 2, 690);
  ctx.font = `500 34px ${SANS}`;
  ctx.fillText("đã soi trước khi bấm", W / 2, 790);

  ctx.fillStyle = "#5F595B";
  ctx.font = `500 36px ${SANS}`;
  ctx.fillText("Trao cho", W / 2, 1090);
  ctx.fillStyle = INK;
  let size = 80;
  ctx.font = `700 ${size}px ${SANS}`;
  while (ctx.measureText(name).width > W - 200 && size > 40) {
    size -= 4;
    ctx.font = `700 ${size}px ${SANS}`;
  }
  ctx.fillText(name, W / 2, 1190);
  ctx.fillRect(W / 2 - 220, 1230, 440, 5);

  ctx.font = `700 32px ${MONO}`;
  ctx.fillStyle = "#5F595B";
  ctx.fillText("ĐỘ TỈNH TÁO", W / 2, 1340);
  ctx.fillStyle = INK;
  ctx.font = `800 130px ${MONO}`;
  ctx.fillText(score === null ? "—" : String(score), W / 2, 1480);
  ctx.font = `700 36px ${MONO}`;
  ctx.fillText(score === null ? "Chưa lướt thử" : `/ ${MAX_SCORE} · ${verdict(score).title}`, W / 2, 1545);

  ctx.font = `600 30px ${SANS}`;
  ctx.fillText(`Đã tắt ${PLEDGES.length} thói quen · Cam kết “5 không”`, W / 2, 1640);

  ctx.fillStyle = INK;
  ctx.fillRect(0, H - 200, W, 200);
  ctx.fillStyle = LIME;
  ctx.font = `800 40px ${MONO}`;
  // Khẩu hiệu tách hai dòng tại dấu " – "; không có dấu đó thì in một dòng.
  const [a, b] = slogan.split(" – ");
  if (b) {
    ctx.fillText(`${a} –`, W / 2, H - 115);
    ctx.fillText(b, W / 2, H - 60);
  } else {
    ctx.fillText(a, W / 2, H - 88);
  }
}

export function certificateFileName(name: string) {
  const slug = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/gi, "d")
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
  return `tinh-luot-${slug || "chung-nhan"}.png`;
}
