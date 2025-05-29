# Tastify - Guía de Configuración

## Requisitos Previos

Antes de comenzar, asegúrese de tener instalado en su sistema:

- Node.js (versión 18 o superior)
- npm (viene incluido con Node.js)
- Git

## Pasos para Configurar el Proyecto

### 1. Clonar el Repositorio

```bash
git clone https://github.com/keevin-21/Tastify.git
cd Tastify
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configuración del Entorno

El proyecto requiere algunas variables de entorno para funcionar correctamente. Cree un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Base de datos
DATABASE_URL=

# Clerk (Autenticación)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Cloudinary (Almacenamiento de imágenes)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Stripe (Pagos)
STRIPE_API_KEY=
STRIPE_WEBHOOK_SECRET=
```

Contacte al administrador del proyecto para obtener los valores correctos de estas variables.

### 4. Configuración de la Base de Datos

El proyecto utiliza Drizzle ORM con PostgreSQL. Para configurar la base de datos:

```bash
# Aplicar migraciones
npm run db:push
```

### 5. Iniciar el Servidor de Desarrollo

```bash
npm run dev
```

El servidor se iniciará en `http://localhost:3000`

## Comandos Disponibles

- `npm run dev`: Inicia el servidor de desarrollo
- `npm run build`: Construye la aplicación para producción
- `npm run start`: Inicia el servidor en modo producción
- `npm run lint`: Ejecuta el linter
- `npm run db:studio`: Abre Drizzle Studio para gestionar la base de datos
- `npm run db:push`: Aplica las migraciones de la base de datos
- `npm run db:seed`: Carga datos de prueba
- `npm run db:reset`: Reinicia la base de datos

## Estructura del Proyecto

```
tastify/
├── app/              # Páginas y rutas de Next.js
├── components/       # Componentes React reutilizables
├── public/          # Archivos estáticos
├── lib/             # Utilidades y configuraciones
├── hooks/           # Custom React hooks
├── db/              # Configuración de la base de datos
├── actions/         # Server actions de Next.js
└── scripts/         # Scripts de utilidad
```

## Tecnologías Principales

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Drizzle ORM
- PostgreSQL
- Clerk (Autenticación)
- Cloudinary (Almacenamiento de imágenes)
- Stripe (Procesamiento de pagos)

## Solución de Problemas Comunes

### Error de conexión a la base de datos

- Verifique que la URL de la base de datos en `.env` sea correcta
- Asegúrese de que el servidor PostgreSQL esté en ejecución

### Problemas con las dependencias

- Elimine la carpeta `node_modules` y el archivo `package-lock.json`
- Ejecute `npm install` nuevamente

### Error en la compilación

- Asegúrese de tener todas las variables de entorno configuradas
- Ejecute `npm run lint` para verificar errores de código

## Soporte

Si encuentra algún problema durante la configuración, por favor:

1. Revise que todas las variables de entorno estén correctamente configuradas
2. Verifique que todas las dependencias estén instaladas
3. Consulte la documentación de las tecnologías utilizadas
4. Contacte al equipo de desarrollo

## Notas Adicionales

- El proyecto utiliza Next.js con el nuevo App Router
- Se recomienda usar VS Code con las extensiones ESLint y Prettier
- Para desarrollo local, asegúrese de tener suficiente espacio en disco (mínimo 1GB libre)
- La aplicación requiere una conexión a Internet para funcionar correctamente debido a los servicios externos
