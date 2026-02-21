import RegisterForm from "@/components/auth/RegisterForm";

export const metadata = {
  title: "Crear cuenta — Practica la Asertividad",
};

export default function RegisterPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-2xl text-warm-900">
          Crea tu cuenta
        </h2>
        <p className="text-warm-500 text-sm font-body mt-1">
          Empieza a practicar hoy, gratis
        </p>
      </div>
      <RegisterForm />
    </div>
  );
}
