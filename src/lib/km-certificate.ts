export const KM_CERTIFICATE_NAME_STORAGE_KEY = "4c-km-certificate-name";

/** Landscape certificate (px) at 2× logical size for sharper PNG. */
const W = 2200;
const H = 1556;

export function loadCertificateDisplayName(): string {
  if (typeof window === "undefined") return "";
  try {
    return localStorage.getItem(KM_CERTIFICATE_NAME_STORAGE_KEY)?.trim() ?? "";
  } catch {
    return "";
  }
}

export function saveCertificateDisplayName(name: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KM_CERTIFICATE_NAME_STORAGE_KEY, name.trim());
  } catch {
    /* ignore */
  }
}

function fitFontSize(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  startPx: number,
  minPx: number,
): number {
  let size = startPx;
  ctx.font = `600 ${size}px "Georgia", "Times New Roman", serif`;
  while (ctx.measureText(text).width > maxWidth && size > minPx) {
    size -= 2;
    ctx.font = `600 ${size}px "Georgia", "Times New Roman", serif`;
  }
  return size;
}

/**
 * Draws the certificate into a new canvas (device pixels = W×H).
 */
export function createCertificateCanvas(
  recipientName: string,
  moduleTitles: string[],
  completionDate: Date = new Date(),
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  // Background
  ctx.fillStyle = "#fafbfc";
  ctx.fillRect(0, 0, W, H);

  // Subtle corner wash
  const g1 = ctx.createLinearGradient(0, 0, W, H);
  g1.addColorStop(0, "rgba(2, 132, 199, 0.08)");
  g1.addColorStop(0.5, "rgba(124, 58, 237, 0.05)");
  g1.addColorStop(1, "rgba(5, 150, 105, 0.07)");
  ctx.fillStyle = g1;
  ctx.fillRect(0, 0, W, H);

  // Outer frame
  const pad = 72;
  ctx.strokeStyle = "#0284c7";
  ctx.lineWidth = 6;
  ctx.strokeRect(pad, pad, W - pad * 2, H - pad * 2);

  ctx.strokeStyle = "#075985";
  ctx.lineWidth = 2;
  ctx.strokeRect(pad + 20, pad + 20, W - (pad + 20) * 2, H - (pad + 20) * 2);

  // Title
  ctx.fillStyle = "#0f172a";
  ctx.font = '600 56px ui-sans-serif, system-ui, sans-serif';
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("Certificate of completion", W / 2, pad + 120);

  ctx.fillStyle = "#64748b";
  ctx.font = '400 28px ui-sans-serif, system-ui, sans-serif';
  ctx.fillText("Knowledge Mobilization · 4C Research Group", W / 2, pad + 188);

  ctx.fillStyle = "#475569";
  ctx.font = '400 24px ui-sans-serif, system-ui, sans-serif';
  ctx.fillText("Cognition · Consciousness · Critical Care", W / 2, pad + 232);

  // Award line
  ctx.fillStyle = "#64748b";
  ctx.font = 'italic 26px Georgia, "Times New Roman", serif';
  ctx.fillText("This certifies that", W / 2, H * 0.38);

  // Name
  const displayName = recipientName.trim() || "Participant";
  const nameSize = fitFontSize(ctx, displayName, W - pad * 4, 96, 44);
  ctx.fillStyle = "#0284c7";
  ctx.font = `600 ${nameSize}px Georgia, "Times New Roman", serif`;
  ctx.fillText(displayName, W / 2, H * 0.46);

  // Body
  ctx.fillStyle = "#334155";
  ctx.font = '400 26px ui-sans-serif, system-ui, sans-serif';
  const body =
    "has successfully completed all refresher modules in this learning track.";
  ctx.fillText(body, W / 2, H * 0.54);

  // Date
  const dateStr = completionDate.toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  ctx.fillStyle = "#64748b";
  ctx.font = '400 22px ui-sans-serif, system-ui, sans-serif';
  ctx.fillText(`Completed on ${dateStr}`, W / 2, H * 0.62);

  // Module list
  ctx.textAlign = "left";
  ctx.fillStyle = "#0f172a";
  ctx.font = '600 22px ui-sans-serif, system-ui, sans-serif';
  const listTop = H * 0.68;
  ctx.fillText("Modules completed:", pad + 80, listTop);

  ctx.fillStyle = "#475569";
  ctx.font = '400 20px ui-sans-serif, system-ui, sans-serif';
  let y = listTop + 44;
  const lineH = 34;
  const maxLines = 8;
  for (let i = 0; i < Math.min(moduleTitles.length, maxLines); i++) {
    ctx.fillText(`· ${moduleTitles[i]}`, pad + 100, y);
    y += lineH;
  }
  if (moduleTitles.length > maxLines) {
    ctx.fillText("· …", pad + 100, y);
  }

  // Footer note
  ctx.textAlign = "center";
  ctx.fillStyle = "#94a3b8";
  ctx.font = '400 18px ui-sans-serif, system-ui, sans-serif';
  ctx.fillText(
    "For verification, progress is stored locally on this device when using the training site.",
    W / 2,
    H - pad - 56,
  );

  return canvas;
}

export function certificateToPngDataUrl(canvas: HTMLCanvasElement): string {
  return canvas.toDataURL("image/png");
}

export function downloadCertificatePng(
  recipientName: string,
  moduleTitles: string[],
): void {
  const canvas = createCertificateCanvas(recipientName, moduleTitles);
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const safe = recipientName.trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").slice(0, 60) || "participant";
    a.href = url;
    a.download = `4C-Knowledge-Mobilization-Certificate-${safe}.png`;
    a.click();
    URL.revokeObjectURL(url);
  }, "image/png");
}

/** Opens a minimal window with the certificate image and triggers print (save as PDF). */
export function printCertificate(
  recipientName: string,
  moduleTitles: string[],
): void {
  const canvas = createCertificateCanvas(recipientName, moduleTitles);
  const dataUrl = certificateToPngDataUrl(canvas);
  const w = window.open("", "_blank", "noopener,noreferrer");
  if (!w) return;
  w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"/><title>Certificate</title>
  <style>
    @page { size: landscape; margin: 12mm; }
    body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #fff; }
    img { max-width: 100%; height: auto; }
  </style></head><body>
  <img src="${dataUrl}" alt="Certificate of completion" />
  <script>window.onload=function(){window.focus();window.print();}</script>
  </body></html>`);
  w.document.close();
}
