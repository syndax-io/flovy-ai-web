import React, { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  variant?: "blue" | "green" | "purple" | "gray" | "red" | "yellow";
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  variant = "blue",
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case "blue":
        return {
          bg: "bg-blue-50 dark:bg-blue-900/20",
          title: "text-blue-900 dark:text-blue-100",
          border: "border-blue-200 dark:border-blue-800",
        };
      case "green":
        return {
          bg: "bg-green-50 dark:bg-green-900/20",
          title: "text-green-900 dark:text-green-100",
          border: "border-green-200 dark:border-green-800",
        };
      case "purple":
        return {
          bg: "bg-purple-50 dark:bg-purple-900/20",
          title: "text-purple-900 dark:text-purple-100",
          border: "border-purple-200 dark:border-purple-800",
        };
      case "red":
        return {
          bg: "bg-red-50 dark:bg-red-900/20",
          title: "text-red-900 dark:text-red-100",
          border: "border-red-200 dark:border-red-800",
        };
      case "yellow":
        return {
          bg: "bg-yellow-50 dark:bg-yellow-900/20",
          title: "text-yellow-900 dark:text-yellow-100",
          border: "border-yellow-200 dark:border-yellow-800",
        };
      case "gray":
      default:
        return {
          bg: "bg-gray-50 dark:bg-gray-900/20",
          title: "text-gray-900 dark:text-gray-100",
          border: "border-gray-200 dark:border-gray-700",
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 dark:bg-opacity-70"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative w-full max-w-2xl mx-4 ${styles.bg} rounded-lg shadow-xl border ${styles.border}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className={`text-xl font-semibold ${styles.title}`}>{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="Close modal"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
