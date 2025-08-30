import Image from "next/image";
import React from "react";

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

const Logo: React.FC<LogoProps> = ({ className, width = 30, height = 30 }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <div className="relative">
        <Image
          src="/flovy-logo.svg"
          alt="Flovy AI Logo"
          width={width}
          height={height}
          priority
          className="dark:brightness-0 dark:invert"
        />
      </div>
      <span className="text-xl sm:text-2xl font-extrabold tracking-tight ml-2">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 dark:from-blue-300 dark:to-purple-400">
          Flovy
        </span>
        <span className="text-purple-600 dark:text-purple-400">.ai</span>
      </span>
    </div>
  );
};

export default Logo;
