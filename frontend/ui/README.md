# Frontend UI - Hostelería IA

## Configuración de Firebase

Este proyecto está configurado para usar el proyecto de Firebase **hosteler-ia** con la siguiente configuración:

### Datos del Proyecto
- **Project ID**: `hosteler-ia`
- **Auth Domain**: `hosteler-ia.firebaseapp.com`
- **Storage Bucket**: `hosteler-ia.firebasestorage.app`
- **Messaging Sender ID**: `171179711118`
- **App ID**: `1:171179711118:web:e41d62f13d525a20d9c7df`
- **Measurement ID**: `G-9NBTNPE1RS`

### Archivos de Configuración

1. **`src/firebase.ts`** - Configuración centralizada de Firebase
2. **`.firebaserc`** - Proyecto por defecto configurado como `hosteler-ia`
3. **`firebase.json`** - Configuración de hosting y Firestore
4. **`firestore.rules`** - Reglas de seguridad de Firestore
5. **`firestore.indexes.json`** - Índices optimizados para consultas

### Assets y Favicons

- **`public/favicon.svg`** - Favicon principal con copa de vino (SVG)
- **`public/favicon.ico`** - Favicon de respaldo (ICO)
- **`public/manifest.json`** - Manifest para PWA

### Servicios de Autenticación

- **`src/services/authService.ts`** - Servicio robusto de autenticación
- Manejo automático de errores de popup y redirect
- Fallback automático de popup a redirect si es necesario
- Configuración optimizada para evitar errores de COOP

### Firebase Admin SDK

- **`setAdmin.cjs`** - Script para configurar administradores
- **`listUsers.cjs`** - Script para listar usuarios de Firebase Auth
- **`firebase-admin`** - Dependencia instalada para administración

#### Configuración de Admin SDK

1. **Obtener clave de servicio**:
   - Ve a https://console.firebase.google.com/project/hosteler-ia
   - Configuración del proyecto → Cuentas de servicio
   - Generar nueva clave privada
   - Descarga y renombra a `serviceAccountKey.json`
   - Colócalo en este directorio

2. **Usar scripts de administración**:
   ```bash
   # Listar usuarios existentes
   node listUsers.cjs
   
   # Configurar administrador (editar UID en el script primero)
   node setAdmin.cjs
   
   # Usar variables de entorno
   ADMIN_UID="tu_uid_aqui" RESTAURANT_SLUG="mi_restaurante" node setAdmin.cjs
   ```

### Firestore - Estructura de Datos

#### Colecciones Principales

```
restaurants/{restaurantSlug}/
├── config/
│   └── general (configuración del restaurante)
├── menu_items/
│   ├── {itemId} (items del menú)
│   └── ...
└── chat_history/
    ├── {chatId} (historial de conversaciones)
    └── ...
```

#### Reglas de Seguridad

- **Configuración y Menú**: Lectura pública, escritura solo para administradores
- **Chat History**: Solo el usuario propietario puede leer/escribir
- **Claims personalizados**: `admin: true` y `restaurant: "slug"`

#### Servicios de Firestore

- **`src/services/restaurantService.ts`** - Gestión de restaurantes, menú y configuración
- **`src/services/conversationService.ts`** - Historial de conversaciones (legacy + nueva estructura)

### Scripts de Firestore

- **`deployFirestore.cjs`** - Desplegar reglas e índices
- **`initFirestore.cjs`** - Inicializar datos de ejemplo

#### Uso de Scripts

```bash
# Desplegar reglas e índices
node deployFirestore.cjs

# Inicializar datos de ejemplo (requiere serviceAccountKey.json)
node initFirestore.cjs
```

### Instalación y Desarrollo

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build

# Desplegar a Firebase Hosting
npm run deploy
```

### Estructura del Proyecto

- `src/firebase.ts` - Configuración centralizada de Firebase
- `src/App.vue` - Componente principal de la aplicación
- `src/components/` - Componentes Vue
- `src/services/` - Servicios para Firebase y APIs
- `public/` - Assets estáticos (favicons, manifest)
- `*.cjs` - Scripts de administración de Firebase
- `firestore.rules` - Reglas de seguridad
- `firestore.indexes.json` - Índices optimizados

### Servicios Firebase Utilizados

- **Authentication** - Login con Google (popup + redirect fallback)
- **Firestore** - Almacenamiento estructurado por restaurantes
- **Analytics** - Métricas de uso (opcional)
- **Admin SDK** - Administración de usuarios y roles

### Variables de Entorno

El proyecto ya no requiere variables de entorno para Firebase, ya que la configuración está hardcodeada en `src/firebase.ts` para mayor simplicidad.

**Para Admin SDK** (opcional):
- `FIREBASE_SERVICE_ACCOUNT` - JSON de clave de servicio como string
- `ADMIN_UID` - UID del usuario a hacer administrador
- `RESTAURANT_SLUG` - Slug del restaurante a asignar

### Deployment

Para desplegar a Firebase Hosting:

```bash
# Login a Firebase (si no estás logueado)
firebase login

# Inicializar proyecto (si es necesario)
firebase init hosting

# Desplegar
firebase deploy
```

El proyecto se desplegará en: https://hosteler-ia.web.app

### Solución de Problemas

**Error 404 en favicon.ico**: 
- ✅ Solucionado: Se agregaron favicons SVG e ICO en la carpeta `public/`
- ✅ Se configuró Vite para servir assets estáticos correctamente
- ✅ Se agregó manifest.json para mejor experiencia PWA

**Errores de Cross-Origin-Opener-Policy (COOP)**:
- ✅ Solucionado: Headers de seguridad configurados en Vite y Firebase Hosting
- ✅ Servicio de autenticación robusto con fallback popup → redirect
- ✅ Manejo automático de errores de popup bloqueado
- ✅ Configuración `same-origin-allow-popups` para permitir popups de autenticación

**Error de Firebase Admin SDK**:
- ✅ Solucionado: `firebase-admin` instalado
- ✅ Scripts mejorados con manejo de errores
- ✅ Soporte para variables de entorno como alternativa
- ✅ Archivo `.gitignore` para proteger claves de servicio

**Configuración de Firestore**:
- ✅ Reglas de seguridad implementadas
- ✅ Estructura de datos optimizada por restaurantes
- ✅ Índices para consultas eficientes
- ✅ Scripts de despliegue e inicialización

### Headers de Seguridad Configurados

```json
{
  "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
  "Cross-Origin-Embedder-Policy": "unsafe-none"
}
```

Estos headers permiten que Firebase Auth funcione correctamente con popups mientras mantienen la seguridad.

### Estructura de Datos de Ejemplo

El script `initFirestore.cjs` crea:
- **Restaurante**: "restaurante-demo"
- **Configuración**: Horarios, tema, características
- **Menú**: 5 items de ejemplo (vinos y platos)
- **Chat**: Estructura preparada para conversaciones 