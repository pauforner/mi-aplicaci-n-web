import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "sage" | "amber" | "red" | "neutral" | "emerald";
}

export default function Badge({
  className,
  variant = "sage",
  children,
  ...props
}: BadgeProps) {
  const variants = {
    sage: "bg-sage-100 text-sage-700 border border-sage-200",
    amber: "bg-amber-100 text-amber-700 border border-amber-200",
    red: "bg-red-50 text-red-700 border border-red-200",
    neutral: "bg-cream-100 text-warm-600 border border-cream-200",
    emerald: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium font-body",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
