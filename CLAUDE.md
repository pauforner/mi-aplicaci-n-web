# Practica la Asertividad — Guía del proyecto

Aplicación web donde los usuarios practican comunicación asertiva con ayuda de IA. La IA genera frases provocadoras, el usuario responde, y la IA analiza la asertividad de la respuesta (puntuación 1-10 + sugerencias).

## Stack

- **Framework:** Next.js 14 (App Router) — desplegado en Vercel
- **Auth + BD:** Supabase (email/contraseña, PostgreSQL con RLS)
- **Pagos:** Stripe (modo test, producto `prod_U1MZC15FFpUrSV`, precio `price_1T3JpxLf9aXbTUWU2AVaMz4o` a €0)
- **IA:** OpenAI `gpt-5-mini` — todas las llamadas son server-side
- **Estilos:** Tailwind CSS — diseño "Botanical Sanctuary" (verdes sage, Fraunces + DM Sans)

## Estructura de archivos clave

```
app/
  (auth)/login, (auth)/register   — Páginas de autenticación
  (app)/practica                  — Interfaz principal de práctica
  (app)/historial                 — Historial de sesiones del usuario
  (app)/upgrade                   — Página de precios / upgrade a Pro
  (app)/success                   — Confirmación post-pago (verifica session_id con Stripe)
  api/frase/               GET    — Genera frase provocadora (OpenAI)
  api/analizar/            POST   — Analiza respuesta del usuario (OpenAI)
  api/sesion/              POST   — Crea sesión en BD
  api/sesion/[id]/         PATCH  — Guarda ronda o cierra sesión
  api/checkout/            POST   — Crea sesión Stripe Checkout → devuelve { url }
  api/webhooks/stripe/     POST   — Recibe eventos Stripe, actualiza subscription_tier en BD

components/practica/ChatContainer.tsx      — Orquestador principal (state machine)
components/upgrade/UpgradeButton.tsx       — Client component: fetch checkout + redirect
hooks/usePractica.ts                       — Estado y lógica del flujo de práctica
lib/prompts/generarFrase.ts                — System prompt para frases provocadoras
lib/prompts/analizarRespuesta.ts           — System prompt para análisis de asertividad
lib/supabase/client.ts                     — Cliente browser (componentes client-side)
lib/supabase/server.ts                     — Cliente servidor con cookies (API routes, Server Components)
lib/supabase/service.ts                    — Cliente service_role (solo webhook — bypasa RLS)
lib/utils/parseAnalisis.ts                 — Parsea y valida JSON de OpenAI
middleware.ts                              — Refresco de sesión Supabase + protección de rutas
supabase-schema.sql                        — Schema completo (ya ejecutado en el proyecto Supabase)
```

## Flujo del usuario

`idle → loading_frase → esperando_respuesta → analizando → mostrando_resultado`

1. Pulsa "Empezar" → se crea sesión en BD, se carga primera frase
2. Escribe respuesta asertiva → se analiza con OpenAI
3. Ve puntuación (gauge animado) + 3 sugerencias concretas
4. Pulsa "Siguiente frase" → nueva frase, misma sesión
5. Pulsa "Terminar sesión" → se calcula avg_score y se cierra

## Flujo de pago (Stripe)

1. Usuario free ve link "Pro ✦" en la nav → va a `/upgrade`
2. Pulsa "Obtener acceso Pro" → `POST /api/checkout` crea Stripe Checkout Session
3. Redirige a Stripe Checkout (tarjeta test: `4242 4242 4242 4242`)
4. Stripe envía `checkout.session.completed` a `/api/webhooks/stripe`
5. El webhook verifica firma y actualiza `profiles.subscription_tier = 'pro'`
6. Usuario llega a `/success` → ve badge "Plan Pro Activo"
7. El header muestra badge "Pro" y desaparece el link de upgrade

## Base de datos (Supabase)

**Proyecto:** `practica-asertividad` (ID: `yvmnmhonfllfemucptme`, región: `eu-west-3`)

Tablas: `profiles` (auto-creado por trigger al registrarse) → `sessions` → `rounds`

```
profiles:
  id, email, subscription_tier ('free'|'pro'), subscription_updated_at, created_at

sessions:
  id, user_id, started_at, ended_at, total_rounds, avg_score

rounds:
  id, session_id, user_id, frase, respuesta, puntuacion, sugerencias, created_at
```

RLS activo en las 3 tablas: cada usuario solo accede a sus propios datos.
- API routes normales: cliente servidor con cookie del usuario (anon key)
- Webhook de Stripe: `createServiceClient()` con service_role key (bypasa RLS, sin sesión)

## Variables de entorno

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://yvmnmhonfllfemucptme.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...     # Solo server-side — webhook Stripe

# OpenAI
OPENAI_API_KEY=...                # Sin NEXT_PUBLIC_ — solo server-side

# Stripe
STRIPE_SECRET_KEY=sk_test_...     # Solo server-side
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...   # stripe listen --print-secret (local) / Dashboard (prod)
STRIPE_PRICE_ID=price_1T3JpxLf9aXbTUWU2AVaMz4o

# App
NEXT_PUBLIC_SITE_URL=http://localhost:3000   # URL de Vercel en producción
```

## Setup inicial (ya realizado — referencia)

### Supabase
- Proyecto creado via API de administración
- `supabase-schema.sql` ya ejecutado (tablas + RLS + trigger)
- Auth redirect URLs configuradas: `http://localhost:3000/api/auth/callback` y `https://practica-asertividad.vercel.app/api/auth/callback`

### Stripe
- Producto `prod_U1MZC15FFpUrSV` — "Practica la Asertividad Pro"
- Precio `price_1T3JpxLf9aXbTUWU2AVaMz4o` — €0 one-time (modo test)

### Desarrollo local
```bash
npm install
npm run dev   # Terminal 1 — http://localhost:3000

stripe listen --forward-to localhost:3000/api/webhooks/stripe --print-secret
# Terminal 2 — copiar el whsec_... a .env.local como STRIPE_WEBHOOK_SECRET y reiniciar dev
```

## Deploy en Vercel

1. Importar repo de GitHub en vercel.com
2. Añadir **todas** las variables de entorno (marcar como sensitive las keys secretas):
   - `OPENAI_API_KEY`
   - `STRIPE_SECRET_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `STRIPE_WEBHOOK_SECRET` ← usar el del Dashboard de Stripe (distinto al de `stripe listen`)
3. Registrar el webhook de producción en Stripe Dashboard:
   - Developers > Webhooks > Add endpoint
   - URL: `https://tu-app.vercel.app/api/webhooks/stripe`
   - Evento: `checkout.session.completed`
   - Copiar el signing secret (nuevo `whsec_...`) a Vercel como `STRIPE_WEBHOOK_SECRET`
4. Actualizar `NEXT_PUBLIC_SITE_URL` a la URL de Vercel
5. Actualizar redirect URL de Supabase Auth con la URL real de Vercel

## Decisiones técnicas importantes

- **OpenAI solo server-side:** La API key nunca llega al cliente. Todas las llamadas pasan por `/api/*`
- **`gpt-5-mini`** es un modelo de razonamiento — restricciones importantes:
  - NO soporta `temperature` ni `presence_penalty`
  - Usar `max_completion_tokens` (no `max_tokens`)
  - Necesita valores altos: 2000 para frases, 4000 para análisis (los tokens de razonamiento interno consumen el presupuesto antes del output)
- **`response_format: json_object`** en el endpoint de análisis para garantizar JSON válido
- **Sesiones en BD:** se crean al pulsar "Empezar" y se cierran (con avg_score calculado) al terminar
- **Rondas:** se guardan en background (sin await) para no bloquear la UI
- **Middleware:** refresca cookies de Supabase en cada request — crítico para que el auth funcione en SSR. `/api/webhooks/stripe` NO está en las rutas protegidas (Stripe no tiene sesión de usuario)
- **Webhook seguridad:** `stripe.webhooks.constructEvent()` verifica HMAC-SHA256 del body raw — usar `request.text()`, nunca `request.json()` antes de verificar
- **service_role key:** solo en `lib/supabase/service.ts`, exclusivamente para el webhook. El resto de routes usan la anon key con la cookie del usuario

## Componentes de diseño

- `ScoreDisplay` — gauge circular SVG con animación count-up (1 segundo)
- `SuggestionList` — 3 tarjetas con stagger animation (150ms delay entre cada una)
- `FraseCard` — skeleton loader mientras carga la frase de la IA
- `UpgradeButton` — client component con estado loading/error, redirige a Stripe Checkout
- Colores del score: rojo (1-3) → ámbar (4-6) → sage (7-8) → esmeralda (9-10)

## Próximos pasos

- [ ] **Deploy en Vercel:** subir repo a GitHub, importar en Vercel, configurar variables de entorno y webhook de producción
- [ ] **Actualizar redirect URL de Supabase** con la URL real de Vercel (actualmente apunta a `practica-asertividad.vercel.app`)
- [ ] **Suscripción recurrente (opcional):** cambiar el precio de Stripe a `recurring[interval]=month` y `mode: "subscription"` en el checkout para cobro mensual real
- [ ] **Gestión de suscripción:** añadir portal de Stripe (`stripe.billingPortal.sessions.create`) para que los usuarios puedan cancelar o cambiar su plan
- [ ] **Downgrade a free:** manejar el evento `customer.subscription.deleted` en el webhook para revertir `subscription_tier` a `'free'`
- [ ] **Rate limiting:** limitar llamadas a `/api/frase` y `/api/analizar` para usuarios free (p.ej. 5 sesiones/día)
- [ ] **Tests:** añadir tests de integración para el webhook y los endpoints de checkout
