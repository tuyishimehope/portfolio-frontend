import { ImageResponse } from "next/og";

// Shared social preview (LinkedIn, Slack, X): the hero's "space" palette, big type, name + role.
export const ogSize = { width: 1200, height: 630 };

export function renderOgImage({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          color: "#f6f9ff",
          backgroundColor: "#030811",
          backgroundImage:
            "radial-gradient(ellipse at 50% -20%, #b2f4ff 0%, #367df4 22%, rgba(22,62,191,0.5) 42%, transparent 66%), radial-gradient(ellipse at 0% 100%, rgba(18,58,155,0.45), transparent 50%)",
        }}
      >
        <div style={{ display: "flex", fontSize: 30, fontWeight: 600, letterSpacing: -0.5 }}>
          Hope<span style={{ color: "#8fa8ff" }}>.</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 22, letterSpacing: 5, color: "#a9d8ff", textTransform: "uppercase" }}>
            {eyebrow}
          </div>
          <div style={{ display: "flex", marginTop: 20, fontSize: 76, fontWeight: 700, lineHeight: 1.04, letterSpacing: -2.5, maxWidth: 1000 }}>
            {title}
          </div>
          <div style={{ display: "flex", marginTop: 26, fontSize: 30, lineHeight: 1.35, color: "#b8c4d9", maxWidth: 980 }}>
            {subtitle}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 24, color: "#95a7c7" }}>
          <div style={{ display: "flex", width: 120, height: 6, borderRadius: 3, backgroundImage: "linear-gradient(90deg, #7798ff, #b7e8f5, #56dff5)" }} />
          Hope Tuyishime · Backend engineer · Kigali · Open to relocation
        </div>
      </div>
    ),
    ogSize,
  );
}
