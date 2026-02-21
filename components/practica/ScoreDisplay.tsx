"use client";

import { useEffect, useState } from "react";

interface ScoreDisplayProps {
  puntuacion: number;
}

function getScoreConfig(score: number) {
  if (score <= 3)
    return {
      color: "#c85a5a",
      bg: "#fdf0f0",
      ring: "#f0c4c4",
      label: "Muy sumiso/a",
      emoji: "🌱",
    };
  if (score <= 5)
    return {
      color: "#c8845a",
      bg: "#fdf6ef",
      ring: "#f0d4b8",
      label: "En progreso",
      emoji: "🌿",
    };
  if (score <= 8)
    return {
      color: "#4d824d",
      bg: "#f2f7f2",
      ring: "#c6dfc6",
      label: "Asertivo/a",
      emoji: "🌳",
    };
  return {
    color: "#2d6a4f",
    bg: "#edf7f2",
    ring: "#a8d5bb",
    label: "Muy asertivo/a",
    emoji: "✨",
  };
}

export default function ScoreDisplay({ puntuacion }: ScoreDisplayProps) {
  const [displayed, setDisplayed] = useState(0);
  const config = getScoreConfig(puntuacion);

  // Animación de conteo
  useEffect(() => {
    setDisplayed(0);
    const duration = 1000;
    const steps = 20;
    const increment = puntuacion / steps;
    let current = 0;

    const interval = setInterval(() => {
      current += increment;
      if (current >= puntuacion) {
        setDisplayed(puntuacion);
        clearInterval(interval);
      } else {
        setDisplayed(Math.round(current));
      }
    }, duration / steps);

    return () => clearInterval(interval);
  }, [puntuacion]);

  // Gauge circular SVG
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const progress = (puntuacion / 10) * circumference;

  return (
    <div className="flex flex-col items-center gap-3 animate-scale-in">
      <div className="relative" style={{ width: 140, height: 140 }}>
        {/* Fondo circular */}
        <svg width="140" height="140" className="rotate-[-90deg]">
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill={config.bg}
            stroke={config.ring}
            strokeWidth="10"
          />
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="transparent"
            stroke={config.color}
            strokeWidth="10"
            strokeDasharray={`${progress} ${circumference}`}
            strokeLinecap="round"
            style={{
              transition: "stroke-dasharray 1s ease-out",
            }}
          />
        </svg>

        {/* Número central */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="font-display text-4xl font-bold leading-none"
            style={{ color: config.color }}
          >
            {displayed}
          </span>
          <span className="text-xs text-warm-400 font-body">/10</span>
        </div>
      </div>

      <div className="text-center">
        <span className="text-lg">{config.emoji}</span>
        <p className="font-body text-sm font-medium mt-0.5" style={{ color: config.color }}>
          {config.label}
        </p>
      </div>
    </div>
  );
}
