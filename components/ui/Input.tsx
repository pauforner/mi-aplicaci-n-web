import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-warm-700 font-body"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full rounded-xl border bg-white px-4 py-2.5 text-sm font-body text-warm-900",
            "placeholder:text-warm-300",
            "transition-all duration-150",
            "focus:outline-none focus:ring-2 focus:ring-sage-300 focus:border-sage-400",
            error
              ? "border-red-300 focus:ring-red-200 focus:border-red-400"
              : "border-cream-300 hover:border-cream-400",
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-xs text-red-600 font-body">{error}</p>
        )}
        {hint && !error && (
          <p className="text-xs text-warm-500 font-body">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
