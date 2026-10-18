# Nóva — Frontend e-commerce FSJ35

Frontend académico construido con **Next.js App Router, TypeScript y CSS**, preparado para consumir una API REST de Laravel 12 y conectar un flujo de pago mediante Stripe.

> Importante: las rutas y el formato exacto de respuesta dependen de tu API. Este frontend usa rutas comunes como valores iniciales. Antes de presentar, compara `API_*_PATH` y el formato del token/checkout con Swagger.

## Requisitos

- Node.js compatible con Next.js 16
- npm
- API Laravel ejecutándose localmente
- Endpoints de registro, login, productos, órdenes y Stripe implementados en Laravel
- Cuenta/configuración Stripe gestionada por el backend (no colocar claves secretas en el frontend)

## Configuración

```bash
npm install
cp .env.example .env.local
```

Edita `.env.local`:

```env
API_BASE_URL=http://127.0.0.1:8000
API_PRODUCTS_PATH=/api/products
API_REGISTER_PATH=/api/register
API_LOGIN_PATH=/api/login
API_LOGOUT_PATH=/api/logout
API_ORDERS_PATH=/api/orders
API_ORDER_HISTORY_PATH=/api/orders
API_STRIPE_CHECKOUT_PATH=/api/checkout/session
AUTH_COOKIE_NAME=ecommerce_token
COOKIE_SECURE=false
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Ajusta las rutas de acuerdo con Swagger. Si Laravel corre en Docker, `127.0.0.1` puede no ser accesible desde el contenedor de Next.js; usa el host/URL correspondiente a tu entorno.

## Ejecutar

```bash
npm run dev
```

Abre http://localhost:3000. Para validar compilación:

```bash
npm run build
npm run start
```

## Rutas de frontend

| Ruta | Descripción |
|---|---|
| `/` | Landing y productos destacados |
| `/productos` | Catálogo público |
| `/productos/[id]` | Detalle de producto |
| `/registro` | Registro consumiendo Laravel |
| `/login` | Login y cookie httpOnly |
| `/carrito` | Carrito local y checkout |
| `/checkout/success` | Retorno desde Stripe; advierte que debe verificarse el pago |
| `/compras` | Historial protegido de órdenes |

## Arquitectura y requisitos cubiertos

- Lecturas de catálogo/detalle e historial en Server Components.
- Mutaciones de registro, login y creación de orden en Server Actions.
- Token de autenticación guardado en cookie `httpOnly`, `sameSite=lax` y `secure` configurable.
- Carrito del navegador almacenado en `localStorage` para conservarlo entre recargas.
- `loading.tsx` para catálogo, detalle y checkout; `error.tsx` para segmentos.
- `Suspense` en la sección de catálogo destacado y lista del catálogo.
- `revalidatePath()` / `revalidateTag()` después de crear una orden.
- Estados de error de API y formularios.
- Diseño responsive y skeletons de carga.

## Contrato esperado de la API

Los nombres pueden cambiar. El código intenta reconocer envolturas comunes (`data`, `products`, `orders`), pero verifica las respuestas reales.

- Productos: `GET API_PRODUCTS_PATH` debe retornar un array o `{ data: [...] }`.
- Detalle: `GET API_PRODUCTS_PATH/{id}`.
- Registro: `POST API_REGISTER_PATH` con `{ name, email, password, password_confirmation }`.
- Login: `POST API_LOGIN_PATH` con `{ email, password }`, idealmente `{ token: "..." }` o `{ access_token: "..." }`.
- Órdenes: `POST API_ORDERS_PATH` con `{ items: [{ product_id, quantity }] }`.
- Stripe: `POST API_STRIPE_CHECKOUT_PATH` con datos de orden/ítems; se espera `{ url: "https://checkout.stripe.com/..." }` o `{ checkout_url: "..." }`.
- Historial: `GET API_ORDER_HISTORY_PATH` con Bearer token.

Si tu API usa otros campos (por ejemplo `productId`, `items.*.id`, `payment_intent` o un endpoint que combina orden y checkout), adapta `lib/actions.ts` y `lib/api.ts`.

## Seguridad importante

- No guardar tokens en `localStorage`; el token de sesión se guarda en cookie httpOnly.
- No incluir claves secretas de Stripe ni secretos de Laravel en variables `NEXT_PUBLIC_*`.
- El backend debe validar precios, stock, usuario propietario de la orden y cantidades. Nunca confiar en el total calculado por el navegador.
- El backend debe verificar el pago con Stripe y, preferiblemente, procesar webhooks firmados. La página de éxito solo indica que el usuario volvió desde Stripe, no demuestra que el pago haya sido confirmado.
- En producción, habilita HTTPS y `COOKIE_SECURE=true`; revisa CSRF, CORS, rate limiting y expiración de tokens según la autenticación Laravel.
- En este scaffold, la API devuelve un token Bearer que Next.js guarda en cookie. Si Laravel usa autenticación Sanctum basada en cookies/CSRF en vez de tokens Bearer, el flujo debe adaptarse.

## Evidencia requerida para la actividad

1. **Swagger:** capturas de endpoints de productos, registro/login, creación de órdenes, pago y listado de órdenes; incluye respuestas 200/201 y errores relevantes.
2. **Flujo de compra:** capturas de catálogo, detalle, carrito, Stripe en modo prueba y estado de la orden después del pago.
3. **Lighthouse:** ejecuta Chrome DevTools → Lighthouse → Mobile → Analyze page load en `/` y guarda el reporte. Repite en `/productos`. Adjunta captura o exporta JSON/HTML/PDF desde Lighthouse.
4. **GitHub:** publica el proyecto sin `.env.local`, tokens ni claves.

## Lighthouse: lista de comprobación

- Ejecuta un build de producción (`npm run build` y `npm run start`) antes de medir.
- Mide en modo incógnito, con extensiones desactivadas.
- Registra Performance, Accessibility, Best Practices y SEO.
- Comprueba LCP, INP y CLS; evita inventar resultados: adjunta los valores reales de tu ejecución.
- Las imágenes de productos deben tener URLs válidas y tamaños adecuados. Considera `next/image` con dominios configurados si la API sirve imágenes remotas.
