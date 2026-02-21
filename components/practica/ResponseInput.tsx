"use client";

import { useState, KeyboardEvent } from "react";
import Button from "@/components/ui/Button";

interface ResponseInputProps {
  onSubmit: (respuesta: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

const MAX_CHARS = 500;
const MIN_CHARS = 5;

export default function ResponseInput({
  onSubmit,
  isLoading,
  disabled,
}: ResponseInputProps) {
  const [value, setValue] = useState("");

  const canSubmit = value.trim().length >= MIN_CHARS && !isLoading && !disabled;

  function handleSubmit() {
    if (canSubmit) {
      onSubmit(value.trim());
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && canSubmit) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div className="animate-fade-up flex flex-col gap-3">
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value.slice(0, MAX_CHARS))}
          onKeyDown={handleKeyDown}
          placeholder="Escribe tu respuesta asertiva aquí... (⌘+Enter para enviar)"
          rows={4}
          disabled={disabled || isLoading}
          className="w-full rounded-2xl border border-cream-300 bg-white px-4 py-3 text-sm font-body text-warm-900
            placeholder:text-warm-300 resize-none
            focus:outline-none focus:ring-2 focus:ring-sage-300 focus:border-sage-400
            hover:border-cream-400
            transition-all duration-150
            disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <span
          className={`absolute bottom-3 right-3 text-xs font-body ${
            value.length > MAX_CHARS * 0.9 ? "text-amber-500" : "text-warm-300"
          }`}
        >
          {value.length}/{MAX_CHARS}
        </span>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={!canSubmit}
        loading={isLoading}
        size="lg"
        className="w-full"
      >
        {isLoading ? "Analizando..." : "Analizar mi respuesta"}
      </Button>

      {!isLoading && value.trim().length > 0 && value.trim().length < MIN_CHARS && (
        <p className="text-xs text-warm-400 text-center font-body">
          Escribe al menos {MIN_CHARS} caracteres
        </p>
      )}
    </div>
  );
}
