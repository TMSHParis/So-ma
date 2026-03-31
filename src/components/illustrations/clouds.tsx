export function CloudsIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Cloud 1 - large, left */}
      <g opacity="0.18">
        <ellipse cx="180" cy="160" rx="120" ry="50" fill="#C4956A" />
        <ellipse cx="140" cy="140" rx="80" ry="45" fill="#C4956A" />
        <ellipse cx="230" cy="135" rx="70" ry="40" fill="#C4956A" />
        <ellipse cx="185" cy="125" rx="60" ry="38" fill="#C4956A" />
      </g>

      {/* Cloud 2 - medium, center-right */}
      <g opacity="0.12">
        <ellipse cx="750" cy="100" rx="100" ry="42" fill="#8FA586" />
        <ellipse cx="710" cy="82" rx="65" ry="36" fill="#8FA586" />
        <ellipse cx="800" cy="78" rx="58" ry="32" fill="#8FA586" />
        <ellipse cx="755" cy="70" rx="50" ry="30" fill="#8FA586" />
      </g>

      {/* Cloud 3 - small, top right */}
      <g opacity="0.14">
        <ellipse cx="1020" cy="180" rx="80" ry="34" fill="#D4AD6A" />
        <ellipse cx="990" cy="165" rx="52" ry="28" fill="#D4AD6A" />
        <ellipse cx="1050" cy="162" rx="46" ry="26" fill="#D4AD6A" />
        <ellipse cx="1020" cy="155" rx="40" ry="24" fill="#D4AD6A" />
      </g>

      {/* Cloud 4 - tiny, floating left-center */}
      <g opacity="0.10">
        <ellipse cx="450" cy="200" rx="60" ry="25" fill="#C4956A" />
        <ellipse cx="430" cy="190" rx="40" ry="20" fill="#C4956A" />
        <ellipse cx="470" cy="188" rx="35" ry="18" fill="#C4956A" />
      </g>

      {/* Cloud 5 - wispy, far right */}
      <g opacity="0.08">
        <ellipse cx="1140" cy="90" rx="55" ry="22" fill="#8FA586" />
        <ellipse cx="1120" cy="80" rx="35" ry="17" fill="#8FA586" />
        <ellipse cx="1155" cy="78" rx="30" ry="15" fill="#8FA586" />
      </g>
    </svg>
  );
}
