import LoginForm from "@/components/auth/LoginForm";

export const metadata = {
  title: "Iniciar sesión — Practica la Asertividad",
};

export default function LoginPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-2xl text-warm-900">
          Bienvenida de vuelta
        </h2>
        <p className="text-warm-500 text-sm font-body mt-1">
          Continúa donde lo dejaste
        </p>
      </div>
      <LoginForm />
    </div>
  );
}
