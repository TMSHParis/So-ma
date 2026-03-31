"use client";

function Cloud1({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      {/* Back large cloud */}
      <ellipse cx="105" cy="62" rx="65" ry="40" fill="#C4956A" opacity="0.35" />
      <ellipse cx="70" cy="50" rx="42" ry="32" fill="#C4956A" opacity="0.4" />
      <ellipse cx="140" cy="55" rx="38" ry="30" fill="#b5845c" opacity="0.35" />
      <ellipse cx="105" cy="42" rx="35" ry="28" fill="#C4956A" opacity="0.45" />
      {/* Back cloud stroke */}
      <path d="M40 75 C40 50 55 30 80 28 C90 15 110 12 125 22 C140 15 165 22 172 40 C185 42 195 55 190 70 C192 80 182 90 168 88 L48 88 C35 88 30 78 40 75Z" stroke="#C4956A" strokeWidth="2.2" fill="none" opacity="0.3" />
      {/* Front white cloud */}
      <ellipse cx="125" cy="82" rx="48" ry="28" fill="white" opacity="0.7" />
      <ellipse cx="105" cy="75" rx="30" ry="22" fill="white" opacity="0.75" />
      <ellipse cx="148" cy="78" rx="25" ry="20" fill="#faf8f5" opacity="0.65" />
      {/* Front cloud stroke */}
      <path d="M82 95 C78 85 85 72 100 70 C102 60 115 55 128 60 C136 55 150 58 155 68 C165 70 172 78 168 88 C170 95 162 100 152 98 L90 98 C80 98 76 92 82 95Z" stroke="#C4956A" strokeWidth="1.8" fill="none" opacity="0.35" />
    </svg>
  );
}

function Cloud2({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 180 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      {/* Main cloud body */}
      <ellipse cx="90" cy="58" rx="60" ry="32" fill="white" opacity="0.75" />
      <ellipse cx="60" cy="48" rx="35" ry="26" fill="white" opacity="0.8" />
      <ellipse cx="120" cy="50" rx="32" ry="24" fill="#faf8f5" opacity="0.7" />
      <ellipse cx="90" cy="40" rx="28" ry="22" fill="white" opacity="0.85" />
      {/* Cloud outline */}
      <path d="M30 68 C28 55 38 42 55 40 C58 28 72 22 88 26 C98 20 115 24 122 35 C135 35 148 44 145 58 C150 65 142 75 130 73 L40 73 C30 73 24 66 30 68Z" stroke="#C4956A" strokeWidth="2" fill="none" opacity="0.4" />
      {/* Light shine */}
      <ellipse cx="80" cy="62" rx="40" ry="10" fill="white" opacity="0.3" />
    </svg>
  );
}

function Cloud3({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 90" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      {/* Back darker cloud */}
      <ellipse cx="85" cy="48" rx="52" ry="30" fill="#8FA586" opacity="0.25" />
      <ellipse cx="60" cy="40" rx="30" ry="24" fill="#8FA586" opacity="0.3" />
      <ellipse cx="110" cy="42" rx="28" ry="22" fill="#7d9474" opacity="0.25" />
      <ellipse cx="85" cy="32" rx="26" ry="20" fill="#8FA586" opacity="0.35" />
      {/* Back stroke */}
      <path d="M35 58 C34 48 42 36 55 34 C58 24 68 20 80 23 C88 18 100 20 106 30 C115 30 125 38 122 48 C126 54 120 62 110 60 L42 60 C34 60 30 55 35 58Z" stroke="#8FA586" strokeWidth="2" fill="none" opacity="0.3" />
      {/* Front light cloud */}
      <ellipse cx="100" cy="65" rx="38" ry="20" fill="white" opacity="0.65" />
      <ellipse cx="85" cy="60" rx="24" ry="16" fill="white" opacity="0.7" />
      <ellipse cx="118" cy="62" rx="20" ry="15" fill="#faf8f5" opacity="0.6" />
      {/* Front stroke */}
      <path d="M66 75 C64 68 70 60 80 58 C82 50 90 47 100 50 C106 46 115 48 118 55 C125 56 130 62 128 70 C130 74 124 78 118 77 L72 77 C66 77 62 73 66 75Z" stroke="#8FA586" strokeWidth="1.6" fill="none" opacity="0.35" />
    </svg>
  );
}

function CloudSmall({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 70" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      {/* Simple outlined cloud */}
      <ellipse cx="60" cy="40" rx="40" ry="22" fill="white" opacity="0.7" />
      <ellipse cx="42" cy="34" rx="22" ry="17" fill="white" opacity="0.75" />
      <ellipse cx="78" cy="35" rx="20" ry="16" fill="#faf8f5" opacity="0.65" />
      <ellipse cx="60" cy="28" rx="18" ry="15" fill="white" opacity="0.8" />
      {/* Outline */}
      <path d="M22 48 C20 40 28 30 40 28 C42 20 52 16 62 18 C70 14 80 16 85 24 C94 24 102 32 100 42 C103 47 98 52 90 50 L28 50 C22 50 18 45 22 48Z" stroke="#D4AD6A" strokeWidth="1.8" fill="none" opacity="0.4" />
    </svg>
  );
}

export function AnimatedClouds() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Large cloud - left */}
      <div className="cloud-1 absolute top-[10%] left-[2%] w-[180px] h-[110px] md:w-[240px] md:h-[140px]">
        <Cloud1 className="w-full h-full" />
      </div>
      {/* Medium cloud - right */}
      <div className="cloud-2 absolute top-[5%] right-[5%] w-[150px] h-[85px] md:w-[200px] md:h-[110px]">
        <Cloud3 className="w-full h-full" />
      </div>
      {/* White cloud - center */}
      <div className="cloud-3 absolute top-[45%] left-[25%] w-[140px] h-[80px] md:w-[190px] md:h-[105px]">
        <Cloud2 className="w-full h-full" />
      </div>
      {/* Small cloud - upper right */}
      <div className="cloud-1 absolute top-[25%] right-[25%] w-[100px] h-[58px] md:w-[130px] md:h-[75px]">
        <CloudSmall className="w-full h-full" />
      </div>
      {/* Tiny cloud - far left bottom */}
      <div className="cloud-2 absolute top-[60%] left-[12%] w-[90px] h-[52px] md:w-[110px] md:h-[65px] opacity-70">
        <CloudSmall className="w-full h-full" />
      </div>
    </div>
  );
}
