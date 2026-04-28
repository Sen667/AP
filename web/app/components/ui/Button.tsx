import { ReactNode } from "react";

type ButtonProps = {
  type?: "primary" | "red" | "gray";
  icon?: ReactNode;
  text: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
};

export default function Button({
  type = "primary",
  icon,
  text,
  onClick,
  disabled = false,
  className = "",
}: ButtonProps) {
  const baseClasses =
    "px-4 py-2 text-sm rounded-sm hover:opacity-90 transition whitespace-nowrap cursor-pointer font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const typeClasses = {
    primary: "bg-primary text-white",
    red: "bg-red-500 text-white hover:bg-red-600",
    gray: "bg-gray-200 text-gray-800 hover:bg-gray-300",
  }[type];

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${typeClasses} ${className}`}
    >
      {icon}
      {text}
    </button>
  );
}
