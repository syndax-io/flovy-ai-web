import React, { useState, useEffect } from "react";

const slogans = [
  "Your AI Clarity Coach.",
  "Your Personal Success Architect.",
  "Unlocking Your Potential.",
  "Your Path to Peak Performance.",
  "Achieving More, Effortlessly.",
  "Your Daily Dose of Clarity.",
  "Guiding You to Greatness.",
  "Where Ambition Meets Action.",
  "Mastering Your Day, Every Day.",
  "Empowering Your Best Self.",
  "Simplifying Success.",
  "Your AI for Breakthroughs.",
  "Making Success Inevitable.",
  "Your Intelligent Guide to Growth.",
  "Transforming Your Vision into Reality.",
];

const FlovySlogan: React.FC = () => {
  const [currentSloganIndex, setCurrentSloganIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      // Fade out
      setIsVisible(false);

      // After fade out completes, change slogan and fade in
      setTimeout(() => {
        setCurrentSloganIndex((prev) => (prev + 1) % slogans.length);
        setIsVisible(true);
      }, 300); // Half of transition duration
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className=" rounded-lg p-8 mb-8">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font text-gray-700 dark:text-white mb-4">
          <span className="block font-bold gradient-text text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-purple-600">
            Flovy AI is
          </span>
          <span
            className={`block mt-2 transition-opacity duration-600 ease-in-out ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
            style={{ minHeight: "1.5em" }} // Prevent layout shift
          >
            {slogans[currentSloganIndex]}
          </span>
        </h1>
      </div>
    </div>
  );
};

export default FlovySlogan;
