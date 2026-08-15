import { ImageResponse } from "next/og";

export const alt = "HemoLink — Vous avez déjà tout ce qu’il faut";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f7f5f3",
          padding: "72px",
          color: "#1A1012",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 28,
              height: 36,
              background: "#B91C2C",
              borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
            }}
          />
          <div style={{ fontSize: 32, letterSpacing: -1 }}>HemoLink</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 72, lineHeight: 0.95, letterSpacing: -2, maxWidth: 900 }}>
            Vous avez déjà tout ce qu’il faut.
          </div>
          <div style={{ fontSize: 28, color: "#4A3538", maxWidth: 720 }}>
            Éligibilité, centres, 45 minutes. Le don de sang, enfin expliqué.
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
