import React from 'react';

interface JanaMenLogoProps extends React.SVGProps<SVGSVGElement> {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Official-style JAÑA MEN movement emblem matching @ne_lishnie_film posters:
 * Bold dynamic slanted yellow-gold "JAÑA" plate stacked over high-contrast black/white "MEN" plate.
 */
export const JanaMenLogo: React.FC<JanaMenLogoProps> = ({ size = 'md', className = '', ...rest }) => {
  const dimensions =
    size === 'sm'
      ? 'h-7 w-auto'
      : size === 'lg'
      ? 'h-12 w-auto'
      : 'h-9 w-auto';

  return (
    <svg
      {...rest}
      viewBox="0 0 132 64"
      className={`${dimensions} select-none flex-shrink-0 ${className}`}
      role="img"
      aria-label="JAÑA MEN"
      fill="none"
    >
      {/* Subtle drop shadow behind stacked badge */}
      <polygon points="14,7 118,5 111,33 7,35" fill="rgba(0,0,0,0.28)" transform="translate(2,3)" />
      <polygon points="24,33 124,31 117,59 17,61" fill="rgba(0,0,0,0.32)" transform="translate(2,3)" />

      {/* Upper Gold-Yellow Slanted Plate: JAÑA */}
      <polygon points="12,5 117,3 110,32 5,34" fill="#F5A623" stroke="#0B0F19" strokeWidth="2.5" strokeLinejoin="round" />
      <text
        x="61"
        y="25.5"
        textAnchor="middle"
        fill="#0B0F19"
        fontFamily="'Unbounded', 'Inter', Arial Black, sans-serif"
        fontWeight="900"
        fontSize="21"
        fontStyle="italic"
        letterSpacing="-0.6"
      >
        JAÑA
      </text>

      {/* Lower Pitch-Black Slanted Plate: MEN */}
      <polygon points="23,31 124,29 117,58 16,60" fill="#0B0F19" stroke="#FFFFFF" strokeWidth="2" strokeLinejoin="round" />
      <text
        x="71"
        y="52"
        textAnchor="middle"
        fill="#FFFFFF"
        fontFamily="'Unbounded', 'Inter', Arial Black, sans-serif"
        fontWeight="900"
        fontSize="21"
        fontStyle="italic"
        letterSpacing="0.5"
      >
        MEN
      </text>
    </svg>
  );
};
