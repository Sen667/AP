"use client";

import { Eye, EyeOff } from "@deemlol/next-icons";
import { useState } from "react";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface PasswordInputProps {
  id: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  register: UseFormRegisterReturn;
  error?: FieldError;
  autoComplete?: string;
  compact?: boolean; // Pour RegisterForm qui utilise des tailles plus petites
}

export default function PasswordInput({
  id,
  label,
  placeholder = "••••••••••",
  required = true,
  register,
  error,
  autoComplete = "current-password",
  compact = false,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const baseClasses = compact
    ? "w-full text-xs sm:text-[.85rem] border rounded-sm outline-none focus:ring-1 focus:ring-primary"
    : "w-full px-3 py-2 text-[.85rem] border rounded-sm focus:ring-1 focus:ring-primary outline-none";

  const paddingClasses = compact ? "px-2 sm:px-3 py-1.5 pr-8 sm:pr-9" : "pr-9";

  return (
    <div>
      <label
        htmlFor={id}
        className={`block font-medium text-gray-600 mb-1 ${compact ? "text-xs" : "text-xs"}`}
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div className="relative">
        <input
          id={id}
          type={showPassword ? "text" : "password"}
          autoComplete={autoComplete}
          {...register}
          placeholder={placeholder}
          className={`${baseClasses} ${paddingClasses} ${
            error ? "border-red-500" : "border-gray-300"
          } transition`}
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition p-1"
          tabIndex={-1}
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      {error && (
        <p
          className={`text-red-500 mt-1 font-medium ${compact ? "text-xs" : "text-xs mt-2"}`}
        >
          {error.message}
        </p>
      )}
    </div>
  );
}
