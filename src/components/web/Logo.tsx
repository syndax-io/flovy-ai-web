"use client";

import React, { useEffect, useRef } from "react";

const Logo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
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
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      fill="none"
      aria-label="Flovy Logo"
      className="animate-fade-in-scale"
      style={{
        opacity: 0,
        transform: "scale(0.8) translateY(10px)",
      }}
      {...props}
    >
      {" "}
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941"
      />{" "}
    </svg>
  );
};

export default Logo;
