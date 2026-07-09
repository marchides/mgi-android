import { useState } from "react";

/**
 * MGI brand mark based on the Z.ai logomark.
 * The logo is bundled at /zai-logo.png (public/) so it ships inside
 * dist/client and works offline in the Capacitor Android WebView.
 * If the image ever fails to load, we fall back to a tinted "Z" glyph
 * so the app never renders a broken image.
 */
const LOGO_URL = "/zai-logo.png";

interface Props {
  size?: number;
  className?: string;
  /** Solid tinted tile (accent bg + white mark) vs bare mark on transparent. */
  variant?: "tile" | "mark";
}

function FallbackGlyph({ size, color }: { size: number; color: string }) {
  return (
    <span
      aria-hidden="true"
      style={{
        display: "inline-grid",
        placeItems: "center",
        width: size,
        height: size,
        fontFamily: "var(--font-display, system-ui)",
        fontWeight: 800,
        fontSize: Math.round(size * 0.6),
        lineHeight: 1,
        color,
      }}
    >
      Z
    </span>
  );
}

export function MgiLogo({ size = 56, className, variant = "tile" }: Props) {
  const [failed, setFailed] = useState(false);

  if (variant === "mark") {
    if (failed) {
      return (
        <span className={className} style={{ display: "inline-block" }}>
          <FallbackGlyph size={size} color="oklch(var(--accent-oklch))" />
        </span>
      );
    }
    return (
      <img
        src={LOGO_URL}
        alt="MGI logo"
        width={size}
        height={size}
        onError={() => setFailed(true)}
        className={className}
        style={{
          display: "inline-block",
          width: size,
          height: size,
          objectFit: "contain",
        }}
      />
    );
  }

  const inner = Math.round(size * 0.72);
  return (
    <span
      role="img"
      aria-label="MGI logo"
      className={className}
      style={{
        display: "inline-grid",
        placeItems: "center",
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.24),
        background:
          "linear-gradient(135deg, oklch(var(--accent-oklch)), oklch(var(--accent-oklch) / 0.7))",
        boxShadow:
          "0 1px 2px rgb(0 0 0 / 0.15), inset 0 1px 0 oklch(var(--on-accent-oklch) / 0.15)",
      }}
    >
      {failed ? (
        <FallbackGlyph size={inner} color="oklch(var(--on-accent-oklch))" />
      ) : (
        <img
          src={LOGO_URL}
          alt=""
          width={inner}
          height={inner}
          onError={() => setFailed(true)}
          style={{
            width: inner,
            height: inner,
            objectFit: "contain",
            // Tint the black-on-transparent mark to the on-accent color.
            filter: "brightness(0) invert(1)",
          }}
        />
      )}
    </span>
  );
}
