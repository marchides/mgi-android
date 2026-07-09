interface Props {
  size?: number;
  className?: string;
}

/**
 * Placeholder MGI logomark. Minimal futuristic "Z" wedge inside a rounded
 * square. Swap the SVG paths when a real Z.ai logo asset is provided.
 */
export function MgiLogo({ size = 56, className }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="MGI logo"
    >
      <defs>
        <linearGradient id="mgi-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="oklch(var(--accent-oklch))" />
          <stop
            offset="100%"
            stopColor="oklch(var(--accent-oklch) / 0.55)"
          />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="60" height="60" rx="16" fill="url(#mgi-g)" />
      <path
        d="M18 20 H46 L22 44 H46"
        stroke="oklch(var(--on-accent-oklch))"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
