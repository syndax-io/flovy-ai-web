import React, { useEffect, useState } from "react";

const slogans = [
  "Your AI Clarity Coach",
  "Your Personal Success Architect",
  "Unlocking Your Potential",
  "Your Path to Peak Performance",
  "Achieving More, Effortlessly",
  "Your Daily Dose of Clarity",
  "Guiding You to Greatness",
  "Where Ambition Meets Action",
  "Mastering Your Day, Every Day",
  "Empowering Your Best Self",
  "Simplifying Success",
  "Your AI for Breakthroughs",
  "Making Success Inevitable",
  "Your Intelligent Guide to Growth",
  "Transforming Your Vision into Reality",
];

const FlovySlogan: React.FC = () => {
  const [currentSloganIndex, setCurrentSloganIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    const currentSlogan = slogans[currentSloganIndex];
    let charIndex = 0;

    // Typing animation
    const typeInterval = setInterval(() => {
      if (charIndex <= currentSlogan.length) {
        setDisplayedText(currentSlogan.slice(0, charIndex));
        charIndex++;
      } else {
        clearInterval(typeInterval);

        // Wait before next slogan
        setTimeout(() => {
          setCurrentSloganIndex((prev) => (prev + 1) % slogans.length);
        }, 2000); // Wait 2 seconds before next slogan
      }
    }, 100); // Type speed

    return () => clearInterval(typeInterval);
  }, [currentSloganIndex]);

  return (
    <div className="text-center">
      <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-tight">
        Your Personal AI <br />
        <span className="gradient-text">
          {displayedText}
          <span className="inline-block ml-1 text-5xl md:text-7xl">_</span>
        </span>
      </h1>
    </div>
  );
};

export default FlovySlogan;
