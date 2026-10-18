# E-commerce FSJ35

Aplicación de comercio electrónico desarrollada como proyecto de Full Stack Junior (FSJ35).

El proyecto utiliza Next.js y TypeScript para el frontend, Laravel y PHP para el backend, y Stripe para procesar pagos en modo de prueba.

## Tecnologías

### Frontend
- Next.js con App Router
- React y TypeScript
- Integración con la API de Laravel
- Carrito de compras
- Autenticación de usuarios
- Checkout con Stripe

### Backend
- Laravel
- PHP
- Laravel Sanctum para autenticación mediante tokens
- Base de datos SQLite
- API REST para productos, usuarios y órdenes
- Integración con Stripe

## Estructura del proyecto

```text
ecommerce-fsj35/
├── frontend/   # Aplicación Next.js
├── backend/    # API Laravel
├── .gitignore
└── README.md
```

## Requisitos previos

- Node.js y npm
- PHP y Composer
- Extensiones de PHP requeridas por Laravel
- Una cuenta de Stripe para realizar pruebas de pago

## Configuración del backend

Abre una terminal y entra a la carpeta del backend:

```bash
cd backend
composer install
cp .env.example .env
```

Genera la clave de Laravel:

```bash
php artisan key:generate
```

Crea el archivo de base de datos SQLite si no existe:

```bash
touch database/database.sqlite
```

Verifica que el archivo `.env` tenga una configuración de base de datos SQLite válida. Después ejecuta:

```bash
php artisan migrate --seed
php artisan serve --host=127.0.0.1 --port=8002
```

La API estará disponible en:

http://127.0.0.1:8002

Mantén esta terminal abierta mientras utilizas el frontend.

## Configuración del frontend

Abre una segunda terminal desde la raíz del repositorio:

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev -- --port 3001
```

El frontend estará disponible en:

http://localhost:3001

Verifica que las variables de entorno del frontend apunten al backend en `http://127.0.0.1:8002`.

## Configuración de Stripe

Para realizar pagos de prueba:

1. Configura `STRIPE_SECRET` en el archivo `backend/.env` con tu clave secreta de prueba.
2. Configura `STRIPE_WEBHOOK_SECRET` con el secreto de webhook correspondiente, si utilizas webhooks.
3. Mantén `FRONTEND_URL` configurada como `http://localhost:3001`.
4. Utiliza tarjetas de prueba oficiales de Stripe.

Nunca publiques claves reales ni archivos `.env` en GitHub.

## Variables de entorno

Los archivos `.env.example` de cada aplicación contienen ejemplos de configuración.

Crea tus propios archivos `.env` y `.env.local` según corresponda. No compartas credenciales secretas.

## API

La API incluye funcionalidades para:

- Consultar productos.
- Registrar usuarios e iniciar sesión.
- Gestionar órdenes.
- Iniciar el proceso de checkout con Stripe.
- Procesar notificaciones de Stripe mediante webhook.

Consulta `backend/routes/api.php` para revisar las rutas implementadas.

## Notas

- El proyecto está preparado para ejecución local.
- Los pagos deben probarse utilizando las credenciales de prueba de Stripe.
- Las credenciales, dependencias instaladas y archivos locales no se incluyen en el repositorio.
- Antes de desplegar en producción, configura HTTPS, credenciales seguras, base de datos de producción y las URLs correspondientes.

## Autoría

Proyecto académico FSJ35.
