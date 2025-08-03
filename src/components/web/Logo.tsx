"use client";

import React, { useEffect, useRef } from "react";

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

const Logo: React.FC<LogoProps> = ({ size = 32, ...props }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (svgRef.current) {
      // Small delay to ensure the animation triggers
      const timer = setTimeout(() => {
        if (svgRef.current) {
          svgRef.current.classList.remove("animate-fade-in-scale");
          // Force reflow
          svgRef.current.getBoundingClientRect();
          svgRef.current.classList.add("animate-fade-in-scale");
        }
      }, 10);

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <svg
      ref={svgRef}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="none"
      aria-label="Flovy Logo"
      className="animate-fade-in-scale"
      style={{
        opacity: 0,
        transform: "scale(0.2) translateY(10px)",
      }}
      {...props}
    >
      <rect width="32" height="32" rx="6" fill="#3B82F6" />
      <path
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 24L12 18L16.306 22.306A11.95 11.95 0 0 1 22.12 16.788L24.86 15.568m0 0L18.92 13.287m5.94 2.28L21.64 21.508"
      />
    </svg>
  );
};

export default Logo;
