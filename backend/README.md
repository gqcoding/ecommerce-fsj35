# E-commerce API FSJ35 — Laravel 12

Backend starter para el frontend `ecommerce-frontend-fsj35`. Es un paquete de archivos para aplicar sobre un proyecto Laravel 12 nuevo; no incluye `vendor/` ni una instalación completa de Laravel.

## 1. Crear proyecto limpio

Desde la terminal:

```bash
cd /Applications/XAMPP/xamppfiles/htdocs/BootCamp-FSJ35
composer create-project laravel/laravel ecommerce-api-fsj35 "^12.0"
cd ecommerce-api-fsj35
php artisan install:api
composer require stripe/stripe-php
```

Si `ecommerce-api-fsj35` ya existe, no vuelvas a crearlo. Asegúrate de estar en la carpeta correcta y de tener Laravel 12.

## 2. Aplicar los archivos

Descomprime este ZIP. Copia sus carpetas `app/`, `database/` y `routes/` dentro de la raíz `ecommerce-api-fsj35/`, combinando carpetas y reemplazando `routes/api.php` si el asistente de instalación generó uno. Revisa los archivos antes de reemplazar cualquier cosa.

## 3. Configurar `.env`

Laravel normalmente crea `.env` al instalar. Configura:

```env
APP_NAME="Ecommerce API FSJ35"
APP_URL=http://127.0.0.1:8000

DB_CONNECTION=sqlite
# DB_DATABASE puede quedar sin definir para usar database/database.sqlite

STRIPE_SECRET=sk_test_REEMPLAZAR_CON_TU_CLAVE
STRIPE_WEBHOOK_SECRET=whsec_REEMPLAZAR_CON_TU_SECRETO
FRONTEND_URL=http://localhost:3001
```

Crea la base SQLite si no existe:

```bash
touch database/database.sqlite
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

No compartas ni publiques claves Stripe. Usa solo claves de prueba. No pongas claves secretas en variables `NEXT_PUBLIC_*`.

## 4. Rutas principales

| Método | Ruta | Auth | Propósito |
|---|---|---|---|
| GET | `/api/products` | No | Catálogo |
| GET | `/api/products/{id}` | No | Detalle |
| POST | `/api/register` | No | Registro + token |
| POST | `/api/login` | No | Login + token |
| POST | `/api/logout` | Sí | Revocar token actual |
| GET | `/api/user` | Sí | Usuario actual |
| POST | `/api/orders` | Sí | Crear orden |
| GET | `/api/orders` | Sí | Historial del usuario |
| GET | `/api/orders/{id}` | Sí | Ver orden propia |
| POST | `/api/checkout/session` | Sí | Crear sesión Stripe |
| POST | `/api/stripe/webhook` | Firma Stripe | Actualizar estado desde webhook |

## 5. Ajustar el frontend

En `.env.local` del frontend:

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
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

Reinicia Next.js después de cambiar variables de entorno.

## 6. Swagger / OpenAPI

Este starter incluye rutas y respuestas API, pero no configura automáticamente la interfaz Swagger. Para cumplir la evidencia de Swagger, instala y configura una herramienta OpenAPI compatible con Laravel 12 (por ejemplo, L5-Swagger), documenta estos endpoints y captura la interfaz ejecutando la API. No declares que Swagger está listo hasta verificar que su página abra.

## Seguridad y limitaciones

- El servidor calcula los totales usando precios de base de datos; nunca acepta el total del navegador como autoridad.
- Las órdenes solo pueden ser consultadas por su propietario.
- Stripe Checkout requiere `STRIPE_SECRET` de prueba y configuración del webhook.
- El estado `paid` se actualiza con el webhook firmado, no por la mera visita a la página de éxito.
- Antes de una entrega pública, agrega validaciones de stock, políticas de autorización, rate limiting, pruebas automatizadas, manejo de reintentos de webhooks y documentación Swagger.
