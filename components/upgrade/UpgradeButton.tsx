"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

export default function UpgradeButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpgrade() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/checkout", { method: "POST" });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Error al iniciar el checkout");
        return;
      }

      window.location.href = data.url;
    } catch {
      setError("Error de conexión. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Button
        variant="primary"
        size="lg"
        onClick={handleUpgrade}
        loading={loading}
        className="w-full"
      >
        {loading ? "Redirigiendo..." : "Obtener acceso Pro"}
      </Button>
      {error && (
        <p className="text-sm text-red-600 font-body text-center">{error}</p>
      )}
    </div>
  );
}
