export function OliveTreeIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Trunk */}
      <path
        d="M195 500 L195 320 C195 300 185 280 180 260 C175 240 178 220 185 200 C188 190 192 185 195 180 L200 180 C203 185 207 190 210 200 C217 220 220 240 215 260 C210 280 200 300 200 320 L200 500Z"
        fill="#A0845C"
        opacity="0.5"
      />
      {/* Trunk texture lines */}
      <path
        d="M192 480 C190 440 188 400 190 360 C191 340 189 320 186 300"
        stroke="#8B7048"
        strokeWidth="0.8"
        opacity="0.3"
        fill="none"
      />
      <path
        d="M203 480 C204 430 206 380 204 340 C203 320 206 300 210 280"
        stroke="#8B7048"
        strokeWidth="0.8"
        opacity="0.3"
        fill="none"
      />

      {/* Main branch left */}
      <path
        d="M185 240 C170 225 145 215 125 210 C110 207 95 210 85 215"
        stroke="#A0845C"
        strokeWidth="3.5"
        strokeLinecap="round"
        opacity="0.45"
        fill="none"
      />

      {/* Main branch right */}
      <path
        d="M210 230 C225 215 250 205 275 200 C290 197 305 200 315 205"
        stroke="#A0845C"
        strokeWidth="3.5"
        strokeLinecap="round"
        opacity="0.45"
        fill="none"
      />

      {/* Upper branch left */}
      <path
        d="M190 200 C175 185 155 175 135 170 C120 167 105 170 95 175"
        stroke="#A0845C"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.4"
        fill="none"
      />

      {/* Upper branch right */}
      <path
        d="M205 195 C220 180 245 168 265 165 C280 163 295 168 305 172"
        stroke="#A0845C"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.4"
        fill="none"
      />

      {/* Small upper branches */}
      <path
        d="M195 185 C185 165 170 150 155 140"
        stroke="#A0845C"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.35"
        fill="none"
      />
      <path
        d="M200 185 C215 162 235 148 250 140"
        stroke="#A0845C"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.35"
        fill="none"
      />

      {/* Foliage clusters - left side */}
      <g opacity="0.22">
        <ellipse cx="90" cy="185" rx="40" ry="28" fill="#8FA586" />
        <ellipse cx="70" cy="175" rx="30" ry="22" fill="#8FA586" />
        <ellipse cx="115" cy="175" rx="32" ry="24" fill="#8FA586" />
        <ellipse cx="95" cy="168" rx="28" ry="20" fill="#8FA586" />
      </g>

      <g opacity="0.18">
        <ellipse cx="120" cy="220" rx="35" ry="25" fill="#8FA586" />
        <ellipse cx="100" cy="212" rx="28" ry="20" fill="#8FA586" />
        <ellipse cx="140" cy="210" rx="25" ry="18" fill="#8FA586" />
      </g>

      <g opacity="0.20">
        <ellipse cx="140" cy="155" rx="32" ry="24" fill="#8FA586" />
        <ellipse cx="155" cy="145" rx="26" ry="20" fill="#8FA586" />
        <ellipse cx="125" cy="148" rx="24" ry="18" fill="#8FA586" />
      </g>

      {/* Foliage clusters - right side */}
      <g opacity="0.22">
        <ellipse cx="305" cy="180" rx="38" ry="26" fill="#8FA586" />
        <ellipse cx="325" cy="170" rx="30" ry="22" fill="#8FA586" />
        <ellipse cx="285" cy="172" rx="28" ry="20" fill="#8FA586" />
        <ellipse cx="305" cy="165" rx="26" ry="18" fill="#8FA586" />
      </g>

      <g opacity="0.18">
        <ellipse cx="275" cy="210" rx="33" ry="24" fill="#8FA586" />
        <ellipse cx="295" cy="202" rx="26" ry="18" fill="#8FA586" />
        <ellipse cx="255" cy="204" rx="24" ry="17" fill="#8FA586" />
      </g>

      <g opacity="0.20">
        <ellipse cx="260" cy="155" rx="30" ry="22" fill="#8FA586" />
        <ellipse cx="245" cy="145" rx="24" ry="18" fill="#8FA586" />
        <ellipse cx="275" cy="148" rx="22" ry="16" fill="#8FA586" />
      </g>

      {/* Foliage - top center crown */}
      <g opacity="0.25">
        <ellipse cx="197" cy="140" rx="45" ry="30" fill="#8FA586" />
        <ellipse cx="180" cy="128" rx="35" ry="24" fill="#8FA586" />
        <ellipse cx="215" cy="126" rx="33" ry="22" fill="#8FA586" />
        <ellipse cx="197" cy="118" rx="30" ry="22" fill="#8FA586" />
      </g>

      {/* Olives scattered */}
      <circle cx="105" cy="195" r="4" fill="#6B7F5E" opacity="0.35" />
      <circle cx="130" cy="218" r="3.5" fill="#6B7F5E" opacity="0.30" />
      <circle cx="290" cy="188" r="4" fill="#6B7F5E" opacity="0.35" />
      <circle cx="260" cy="212" r="3.5" fill="#6B7F5E" opacity="0.30" />
      <circle cx="190" cy="135" r="3.5" fill="#6B7F5E" opacity="0.32" />
      <circle cx="210" cy="130" r="3" fill="#6B7F5E" opacity="0.28" />
      <circle cx="155" cy="150" r="3" fill="#6B7F5E" opacity="0.30" />
      <circle cx="250" cy="152" r="3" fill="#6B7F5E" opacity="0.30" />
      <circle cx="80" cy="178" r="3" fill="#6B7F5E" opacity="0.28" />
      <circle cx="315" cy="175" r="3" fill="#6B7F5E" opacity="0.28" />

      {/* Ground shadow */}
      <ellipse cx="197" cy="500" rx="80" ry="8" fill="#8FA586" opacity="0.08" />
    </svg>
  );
}
