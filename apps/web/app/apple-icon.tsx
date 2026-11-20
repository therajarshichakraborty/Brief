import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0a0a",
        color: "#ffffff",
        fontFamily: "Georgia, serif",
        fontSize: 116,
        fontStyle: "italic",
        fontWeight: 700,
      }}
    >
      B<span style={{ color: "#ef4444", fontStyle: "normal" }}>.</span>
    </div>,
    size,
  );
}
