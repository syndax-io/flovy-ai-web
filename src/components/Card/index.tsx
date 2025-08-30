import React from "react";

interface CardProps {
  children?: React.ReactNode;
  title?: string;
  description?: string;
  variant?: "blue" | "green" | "purple" | "gray" | "red" | "yellow";
  className?: string;
  onClick?: () => void;
  clickable?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  description,
  variant = "gray",
  className = "",
  onClick,
  clickable = false,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "blue":
        return {
          bg: "bg-blue-50 dark:bg-blue-900/20",
          title: "text-blue-900 dark:text-blue-100",
          description: "text-blue-700 dark:text-blue-300",
          border: "border-blue-200 dark:border-blue-800",
        };
      case "green":
        return {
          bg: "bg-green-50 dark:bg-green-900/20",
          title: "text-green-900 dark:text-green-100",
          description: "text-green-700 dark:text-green-300",
          border: "border-green-200 dark:border-green-800",
        };
      case "purple":
        return {
          bg: "bg-purple-50 dark:bg-purple-900/20",
          title: "text-purple-900 dark:text-purple-100",
          description: "text-purple-700 dark:text-purple-300",
          border: "border-purple-200 dark:border-purple-800",
        };
      case "red":
        return {
          bg: "bg-red-50 dark:bg-red-900/20",
          title: "text-red-900 dark:text-red-100",
          description: "text-red-700 dark:text-red-300",
          border: "border-red-200 dark:border-red-800",
        };
      case "yellow":
        return {
          bg: "bg-yellow-50 dark:bg-yellow-900/20",
          title: "text-yellow-900 dark:text-yellow-100",
          description: "text-yellow-700 dark:text-yellow-300",
          border: "border-yellow-200 dark:border-yellow-800",
        };
      case "gray":
      default:
        return {
          bg: "bg-gray-50 dark:bg-gray-900/20",
          title: "text-gray-900 dark:text-gray-100",
          description: "text-gray-700 dark:text-gray-300",
          border: "border-gray-200 dark:border-gray-700",
        };
    }
  };

  const styles = getVariantStyles();
  const baseClasses = `${styles.bg} p-6 rounded-lg border ${styles.border}`;
  const interactiveClasses =
    clickable || onClick
      ? "hover:shadow-md hover:scale-105 transition-all duration-200 cursor-pointer"
      : "";

  const combinedClasses = `${baseClasses} ${interactiveClasses} ${className}`;

  const CardContent = () => (
    <>
      {title && (
        <h3 className={`text-lg font-semibold ${styles.title} mb-2`}>
          {title}
        </h3>
      )}
      {description && (
        <p className={`${styles.description} mb-4`}>{description}</p>
      )}
      {children}
    </>
  );

  if (onClick || clickable) {
    return (
      <button onClick={onClick} className={combinedClasses} type="button">
        <CardContent />
      </button>
    );
  }

  return (
    <div className={combinedClasses}>
      <CardContent />
    </div>
  );
};

export default Card;
