# Sumy - Frontend Vue.js

Frontend moderno para el sistema de sumiller virtual con autenticación, Firestore y gestión multi-restaurante.

## 🚀 Características

- **Autenticación completa**: Google OAuth y email/contraseña para administradores
- **Sistema multi-restaurante**: Cada restaurante tiene su propio espacio de datos
- **Chat inteligente**: Interfaz de chat con Sumy, el sumiller virtual
- **Panel de administración**: Dashboard para gestionar conversaciones y configuración
- **Responsive design**: Optimizado para móviles y desktop
- **Firestore integration**: Base de datos en tiempo real
- **Vue 3 + TypeScript**: Stack moderno y tipado

## 📋 Prerrequisitos

- Node.js 18+ 
- npm o yarn
- Proyecto Firebase configurado
- Backend ADK funcionando

## 🛠️ Instalación

1. **Clonar y instalar dependencias**:
```bash
cd pantilla_adk/frontend/ui
npm install
```

2. **Configurar variables de entorno**:
```bash
cp env.example .env.local
```

Editar `.env.local` con tus credenciales de Firebase:
```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=tu_api_key_de_firebase
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_project_id
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=tu_app_id

# Backend API URL
VITE_MAITRE_URL=https://tu-backend-url.com

# Development
VITE_DEV_MODE=true
```

3. **Configurar Firebase**:
   - Habilitar Authentication con Google y Email/Password
   - Configurar Firestore con las reglas proporcionadas
   - Crear usuarios administradores con el script `setAdmin.cjs`

## 🏃‍♂️ Desarrollo

```bash
# Servidor de desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

## 🏗️ Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── Login.vue       # Componente de autenticación
│   ├── WineMenu.vue    # Menú de vinos
│   └── ConsentBanner.vue # Banner de cookies
├── views/              # Vistas de la aplicación
│   ├── RestaurantView.vue      # Vista principal del restaurante
│   ├── AdminLoginView.vue      # Login de administradores
│   └── AdminDashboardView.vue  # Dashboard de administración
├── stores/             # Stores de Pinia
│   └── authStore.ts    # Store de autenticación
├── services/           # Servicios de API
│   ├── authService.ts  # Servicio de autenticación
│   └── conversationService.ts # Servicio de conversaciones
├── router/             # Configuración de rutas
│   └── index.ts        # Definición de rutas
└── main.ts             # Punto de entrada
```

## 🛣️ Rutas

- `/` - Redirige al restaurante por defecto
- `/:slug` - Vista del restaurante específico (ej: `/restaurante-abc`)
- `/:slug/admin/login` - Login de administradores
- `/:slug/admin/dashboard` - Panel de administración

## 🔐 Autenticación

### Para Clientes
- **Google OAuth**: Login rápido con cuenta de Google
- **Sin registro**: Los clientes pueden usar el chat sin crear cuenta

### Para Administradores
- **Email/Password**: Login con credenciales específicas
- **Roles**: Solo usuarios con rol `admin` pueden acceder al panel
- **Restaurante específico**: Cada admin solo ve datos de su restaurante

## 📊 Funcionalidades

### Vista del Cliente
- Chat interactivo con Sumy
- Menú de vinos integrado
- Autenticación opcional
- Historial de conversaciones

### Panel de Administración
- **Resumen**: Estadísticas de conversaciones y usuarios
- **Conversaciones**: Historial completo de chats
- **Configuración**: Gestión del restaurante

## 🔧 Configuración de Firebase

### 1. Authentication
```bash
# Habilitar proveedores en Firebase Console:
# - Google
# - Email/Password
```

### 2. Firestore Rules
Las reglas ya están configuradas en `firestore.rules`:
- Lectura pública para menús
- Escritura solo para usuarios autenticados
- Administradores pueden leer todas las conversaciones de su restaurante

### 3. Crear Administradores
```bash
# Usar el script de configuración
node setAdmin.cjs

# O configurar manualmente en Firebase Console
```

## 🚀 Despliegue

### Desarrollo Local
```bash
npm run dev
# Acceder a http://localhost:5173
```

### Producción
```bash
npm run build
# Los archivos se generan en dist/
```

### Firebase Hosting
```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Login y deploy
firebase login
firebase deploy
```

## 🧪 Testing

```bash
# Ejecutar tests
npm run test

# Tests en modo watch
npm run test:watch
```

## 📱 Responsive Design

La aplicación está optimizada para:
- **Móviles**: 320px - 768px
- **Tablets**: 768px - 1024px  
- **Desktop**: 1024px+

## 🔍 Debugging

### Console Logs
- Trazabilidad completa de conversaciones
- Metadatos de RAG y fuentes de datos
- Errores de autenticación y API

### Firebase Console
- Ver conversaciones en tiempo real
- Monitorear autenticación
- Revisar reglas de seguridad

## 🐛 Troubleshooting

### Error de Autenticación
1. Verificar credenciales de Firebase en `.env.local`
2. Comprobar que Authentication esté habilitado
3. Revisar reglas de Firestore

### Error de API
1. Verificar `VITE_MAITRE_URL` en variables de entorno
2. Comprobar que el backend esté funcionando
3. Revisar logs del servidor

### Error de Build
1. Verificar que todas las variables de entorno estén configuradas
2. Comprobar dependencias: `npm install`
3. Limpiar cache: `npm run build --force`

## 📞 Soporte

Para problemas técnicos:
1. Revisar logs de la consola del navegador
2. Verificar configuración de Firebase
3. Comprobar variables de entorno
4. Revisar documentación de Vue 3 y Firebase

## 🔄 Actualizaciones

Para actualizar el proyecto:
```bash
git pull origin main
npm install
npm run build
```

---

**Sumy** - Tu Sumiller Personal con IA 🍷 