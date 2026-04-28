"use client";

import { useRouter } from "next/navigation";

type BackButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};

export function BackButton({ className = "", children }: BackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    router.back();
  };

  return (
    <button
      onClick={handleClick}
      className={className}
      aria-label="Revenir en arrière"
    >
      {children}
    </button>
  );
}
