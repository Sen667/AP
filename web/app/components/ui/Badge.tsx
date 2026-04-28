import { AlertCircle, Check, Clock, Pause, XCircle } from "@deemlol/next-icons";
import React from "react";

export type BadgeVariant =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral"
  | "primary";

export type BadgeSize = "sm" | "md" | "lg";

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  success:
    "bg-green-100 text-green-700 border-green-200 [&_svg]:text-green-900",
  warning:
    "bg-orange-50 text-orange-700 border-orange-200 [&_svg]:text-orange-600",
  danger: "bg-red-50 text-red-700 border-red-200 [&_svg]:text-red-600",
  info: "bg-sky-50 text-sky-700 border-sky-200 [&_svg]:text-sky-600",
  neutral: "bg-gray-50 text-gray-700 border-gray-200 [&_svg]:text-gray-600",
  primary: "bg-primary/10 text-primary border-primary/20 [&_svg]:text-primary",
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-xs gap-1",
  md: "px-3 py-1.5 text-xs gap-1.5",
  lg: "px-4 py-2 text-sm gap-2",
};

const iconSizes: Record<BadgeSize, number> = {
  sm: 12,
  md: 14,
  lg: 16,
};

export default function Badge({
  variant = "neutral",
  size = "md",
  icon,
  children,
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded font-semibold border ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {icon && React.isValidElement(icon)
        ? React.cloneElement(icon as React.ReactElement<any>, {
            size: iconSizes[size],
          })
        : icon}
      {children}
    </span>
  );
}

// Composants pré-configurés pour les statuts courants
export function ValidationBadge({
  status,
}: {
  status: "EN_ATTENTE" | "VALIDE" | "REFUSE";
}) {
  switch (status) {
    case "VALIDE":
      return (
        <Badge variant="success" icon={<Check />}>
          Validé
        </Badge>
      );
    case "EN_ATTENTE":
      return (
        <Badge variant="warning" icon={<Clock />}>
          En attente
        </Badge>
      );
    case "REFUSE":
      return (
        <Badge variant="danger" icon={<XCircle />}>
          Refusé
        </Badge>
      );
  }
}

export function ContratBadge({
  status,
}: {
  status: "ACTIF" | "SUSPENDU" | "TERMINE" | "EN_ATTENTE_VALIDATION";
}) {
  switch (status) {
    case "ACTIF":
      return (
        <Badge variant="success" icon={<Check />}>
          Actif
        </Badge>
      );
    case "EN_ATTENTE_VALIDATION":
      return (
        <Badge variant="warning" icon={<Clock />}>
          En attente validation
        </Badge>
      );
    case "SUSPENDU":
      return (
        <Badge variant="info" icon={<Pause />}>
          Suspendu
        </Badge>
      );
    case "TERMINE":
      return (
        <Badge variant="neutral" icon={<AlertCircle />}>
          Terminé
        </Badge>
      );
  }
}
