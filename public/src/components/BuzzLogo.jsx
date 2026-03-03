import React from 'react';

export default function BuzzLogo({ size = 36 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="bz-bg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7C3AED" />
          <stop offset="1" stopColor="#EC4899" />
        </linearGradient>
      </defs>

      {/* Rounded square background */}
      <rect width="40" height="40" rx="11" fill="url(#bz-bg)" />

      {/* Speech bubble */}
      <path
        d="M8 12C8 10.3 9.3 9 11 9H29C30.7 9 32 10.3 32 12V22C32 23.7 30.7 25 29 25H22.5L16 31.5V25H11C9.3 25 8 23.7 8 22V12Z"
        fill="white"
      />

      {/* Three dots inside bubble */}
      <circle cx="15" cy="17" r="2" fill="url(#bz-bg)" />
      <circle cx="20" cy="17" r="2" fill="url(#bz-bg)" />
      <circle cx="25" cy="17" r="2" fill="url(#bz-bg)" />
    </svg>
  );
}
