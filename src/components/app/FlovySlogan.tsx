import React, { useState, useEffect } from "react";

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
    <div className="rounded-lg p-8 mb-8">
      <div className="text-center">
        <h1 className="text-3xl md:text-3xl font text-gray-700 dark:text-white mb-4">
          <span className="font-bold text-4xl md:text-8xl gradient-text text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-purple-600">
            Flovy AI
          </span>
          <span className="block mt-2" style={{ minHeight: "1.5em" }}>
            {displayedText}
            <span className="inline-block text-gray-700 dark:text-white ml-1 text-3xl md:text-4xl">
              _
            </span>
          </span>
        </h1>
      </div>
    </div>
  );
};

export default FlovySlogan;
