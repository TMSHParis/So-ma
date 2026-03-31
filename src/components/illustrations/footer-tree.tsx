export function FooterTree({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 300 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Roots spreading at the very bottom */}
      <g opacity="0.15">
        <path d="M150 400 C140 390 110 385 70 388 C40 390 15 395 0 400" stroke="#A0845C" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M150 400 C160 390 190 385 230 388 C260 390 285 395 300 400" stroke="#A0845C" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M145 398 C130 392 100 395 60 400" stroke="#A0845C" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M155 398 C170 392 200 395 240 400" stroke="#A0845C" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M140 395 C120 388 85 390 50 398" stroke="#8FA586" strokeWidth="1" strokeLinecap="round" fill="none" />
        <path d="M160 395 C180 388 215 390 250 398" stroke="#8FA586" strokeWidth="1" strokeLinecap="round" fill="none" />
      </g>

      {/* Trunk rising from roots */}
      <path
        d="M148 400 C148 380 146 360 147 340 C148 320 146 300 147 280 C148 260 150 240 149 220"
        stroke="#A0845C"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.18"
        fill="none"
      />
      <path
        d="M152 400 C152 380 154 360 153 340 C152 320 154 300 153 280 C152 260 150 240 151 220"
        stroke="#A0845C"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.18"
        fill="none"
      />

      {/* Branches spreading */}
      <path d="M148 280 C130 265 105 255 80 250" stroke="#A0845C" strokeWidth="2" strokeLinecap="round" opacity="0.14" fill="none" />
      <path d="M152 280 C170 265 195 255 220 250" stroke="#A0845C" strokeWidth="2" strokeLinecap="round" opacity="0.14" fill="none" />
      <path d="M149 250 C135 238 115 230 95 225" stroke="#A0845C" strokeWidth="1.5" strokeLinecap="round" opacity="0.12" fill="none" />
      <path d="M151 250 C165 238 185 230 205 225" stroke="#A0845C" strokeWidth="1.5" strokeLinecap="round" opacity="0.12" fill="none" />
      <path d="M149 230 C140 218 125 210 110 205" stroke="#A0845C" strokeWidth="1.2" strokeLinecap="round" opacity="0.10" fill="none" />
      <path d="M151 230 C160 218 175 210 190 205" stroke="#A0845C" strokeWidth="1.2" strokeLinecap="round" opacity="0.10" fill="none" />

      {/* Upper delicate branches */}
      <path d="M150 220 C140 205 128 195 115 188" stroke="#A0845C" strokeWidth="1" strokeLinecap="round" opacity="0.09" fill="none" />
      <path d="M150 220 C160 205 172 195 185 188" stroke="#A0845C" strokeWidth="1" strokeLinecap="round" opacity="0.09" fill="none" />

      {/* Foliage clusters - very subtle */}
      <g opacity="0.10">
        <ellipse cx="80" cy="245" rx="22" ry="14" fill="#8FA586" />
        <ellipse cx="65" cy="240" rx="16" ry="10" fill="#8FA586" />
        <ellipse cx="95" cy="240" rx="14" ry="9" fill="#8FA586" />
      </g>
      <g opacity="0.10">
        <ellipse cx="220" cy="245" rx="22" ry="14" fill="#8FA586" />
        <ellipse cx="235" cy="240" rx="16" ry="10" fill="#8FA586" />
        <ellipse cx="205" cy="240" rx="14" ry="9" fill="#8FA586" />
      </g>
      <g opacity="0.08">
        <ellipse cx="95" cy="220" rx="18" ry="12" fill="#8FA586" />
        <ellipse cx="205" cy="220" rx="18" ry="12" fill="#8FA586" />
      </g>
      <g opacity="0.08">
        <ellipse cx="115" cy="200" rx="16" ry="10" fill="#8FA586" />
        <ellipse cx="185" cy="200" rx="16" ry="10" fill="#8FA586" />
      </g>
      <g opacity="0.07">
        <ellipse cx="150" cy="195" rx="25" ry="15" fill="#8FA586" />
        <ellipse cx="135" cy="188" rx="18" ry="11" fill="#8FA586" />
        <ellipse cx="165" cy="188" rx="18" ry="11" fill="#8FA586" />
      </g>

      {/* A few olives */}
      <circle cx="75" cy="248" r="2.5" fill="#6B7F5E" opacity="0.12" />
      <circle cx="225" cy="248" r="2.5" fill="#6B7F5E" opacity="0.12" />
      <circle cx="100" cy="222" r="2" fill="#6B7F5E" opacity="0.10" />
      <circle cx="200" cy="222" r="2" fill="#6B7F5E" opacity="0.10" />
      <circle cx="145" cy="192" r="2" fill="#6B7F5E" opacity="0.10" />
      <circle cx="160" cy="190" r="2" fill="#6B7F5E" opacity="0.10" />
    </svg>
  );
}
