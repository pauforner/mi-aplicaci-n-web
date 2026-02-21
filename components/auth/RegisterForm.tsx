"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });

    if (error) {
      setError(
        error.message.includes("already registered")
          ? "Este email ya está registrado. ¿Quieres iniciar sesión?"
          : "No se pudo crear la cuenta. Inténtalo de nuevo."
      );
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <div className="text-center py-4 flex flex-col gap-4">
        <div className="text-5xl">📬</div>
        <h3 className="font-display text-xl text-warm-900">
          ¡Revisa tu email!
        </h3>
        <p className="text-warm-500 text-sm font-body leading-relaxed">
          Te enviamos un enlace de confirmación a{" "}
          <strong className="text-warm-700">{email}</strong>. Haz clic en él
          para activar tu cuenta.
        </p>
        <Link
          href="/login"
          className="text-sage-600 font-medium text-sm hover:text-sage-700 underline underline-offset-2 font-body"
        >
          Volver al inicio de sesión
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Input
        label="Correo electrónico"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="tu@email.com"
        required
        autoComplete="email"
      />
      <Input
        label="Contraseña"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Mínimo 6 caracteres"
        required
        autoComplete="new-password"
        hint="Al menos 6 caracteres"
      />

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3 font-body">
          {error}
        </p>
      )}

      <Button type="submit" size="lg" loading={loading} className="w-full mt-1">
        Crear cuenta
      </Button>

      <p className="text-center text-sm text-warm-500 font-body">
        ¿Ya tienes cuenta?{" "}
        <Link
          href="/login"
          className="text-sage-600 font-medium hover:text-sage-700 underline underline-offset-2"
        >
          Inicia sesión
        </Link>
      </p>
    </form>
  );
}
