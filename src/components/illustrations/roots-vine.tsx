export function RootsLeft({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 1200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMinYMax slice"
    >
      {/* Main root climbing up from bottom */}
      <path
        d="M60 1200 C55 1150 40 1100 35 1040 C30 980 45 920 40 860 C35 800 25 750 30 690 C35 630 50 580 45 520 C40 460 28 410 32 350 C36 290 48 240 44 180 C40 120 30 70 35 20"
        stroke="#A0845C"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.12"
        fill="none"
      />
      {/* Secondary thinner root */}
      <path
        d="M45 1200 C50 1160 60 1120 55 1070 C50 1020 35 980 38 930 C41 880 55 840 50 790 C45 740 32 700 35 650 C38 600 52 560 48 510 C44 460 33 420 36 370 C39 320 50 280 46 230"
        stroke="#8FA586"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.10"
        fill="none"
      />
      {/* Small branches off main root */}
      <path d="M35 1040 C20 1030 10 1015 5 1000" stroke="#A0845C" strokeWidth="1.2" strokeLinecap="round" opacity="0.09" fill="none" />
      <path d="M40 860 C25 845 15 830 8 815" stroke="#A0845C" strokeWidth="1" strokeLinecap="round" opacity="0.08" fill="none" />
      <path d="M30 690 C15 680 8 665 3 645" stroke="#8FA586" strokeWidth="1" strokeLinecap="round" opacity="0.08" fill="none" />
      <path d="M45 520 C30 510 18 495 12 475" stroke="#A0845C" strokeWidth="1" strokeLinecap="round" opacity="0.07" fill="none" />
      <path d="M32 350 C18 340 10 325 5 305" stroke="#8FA586" strokeWidth="0.8" strokeLinecap="round" opacity="0.07" fill="none" />

      {/* Tiny leaf clusters along the vine */}
      <ellipse cx="8" cy="998" rx="8" ry="5" fill="#8FA586" opacity="0.08" transform="rotate(-20 8 998)" />
      <ellipse cx="10" cy="812" rx="7" ry="4.5" fill="#8FA586" opacity="0.07" transform="rotate(-15 10 812)" />
      <ellipse cx="6" cy="642" rx="6" ry="4" fill="#8FA586" opacity="0.06" transform="rotate(-25 6 642)" />
      <ellipse cx="14" cy="472" rx="6" ry="3.5" fill="#8FA586" opacity="0.06" transform="rotate(-10 14 472)" />
      <ellipse cx="8" cy="302" rx="5" ry="3" fill="#8FA586" opacity="0.05" transform="rotate(-20 8 302)" />
    </svg>
  );
}

export function RootsRight({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 1200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMaxYMax slice"
    >
      {/* Main root climbing up - mirrored */}
      <path
        d="M60 1200 C65 1150 80 1100 85 1040 C90 980 75 920 80 860 C85 800 95 750 90 690 C85 630 70 580 75 520 C80 460 92 410 88 350 C84 290 72 240 76 180 C80 120 90 70 85 20"
        stroke="#A0845C"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.12"
        fill="none"
      />
      {/* Secondary root */}
      <path
        d="M75 1200 C70 1160 60 1120 65 1070 C70 1020 85 980 82 930 C79 880 65 840 70 790 C75 740 88 700 85 650 C82 600 68 560 72 510 C76 460 87 420 84 370 C81 320 70 280 74 230"
        stroke="#8FA586"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.10"
        fill="none"
      />
      {/* Small branches */}
      <path d="M85 1040 C100 1030 110 1015 115 1000" stroke="#A0845C" strokeWidth="1.2" strokeLinecap="round" opacity="0.09" fill="none" />
      <path d="M80 860 C95 845 105 830 112 815" stroke="#A0845C" strokeWidth="1" strokeLinecap="round" opacity="0.08" fill="none" />
      <path d="M90 690 C105 680 112 665 117 645" stroke="#8FA586" strokeWidth="1" strokeLinecap="round" opacity="0.08" fill="none" />
      <path d="M75 520 C90 510 102 495 108 475" stroke="#A0845C" strokeWidth="1" strokeLinecap="round" opacity="0.07" fill="none" />
      <path d="M88 350 C102 340 110 325 115 305" stroke="#8FA586" strokeWidth="0.8" strokeLinecap="round" opacity="0.07" fill="none" />

      {/* Leaf clusters */}
      <ellipse cx="112" cy="998" rx="8" ry="5" fill="#8FA586" opacity="0.08" transform="rotate(20 112 998)" />
      <ellipse cx="110" cy="812" rx="7" ry="4.5" fill="#8FA586" opacity="0.07" transform="rotate(15 110 812)" />
      <ellipse cx="114" cy="642" rx="6" ry="4" fill="#8FA586" opacity="0.06" transform="rotate(25 114 642)" />
      <ellipse cx="106" cy="472" rx="6" ry="3.5" fill="#8FA586" opacity="0.06" transform="rotate(10 106 472)" />
      <ellipse cx="112" cy="302" rx="5" ry="3" fill="#8FA586" opacity="0.05" transform="rotate(20 112 302)" />
    </svg>
  );
}
