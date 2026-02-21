export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-texture flex flex-col items-center justify-center px-4 py-12">
      {/* Logo / marca */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-sage-100 border border-sage-200 mb-4 shadow-soft">
          <span className="text-2xl">🌿</span>
        </div>
        <h1 className="font-display text-2xl text-warm-900">
          Practica la Asertividad
        </h1>
        <p className="text-sm text-warm-500 font-body mt-1">
          Comunícate con claridad y respeto
        </p>
      </div>

      {/* Card de auth */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-soft-lg border border-cream-200 p-8">
        {children}
      </div>
    </div>
  );
}
