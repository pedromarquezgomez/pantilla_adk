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
3. **`firebase.json`** - Configuración de hosting con headers de seguridad

### Assets y Favicons

- **`public/favicon.svg`** - Favicon principal con copa de vino (SVG)
- **`public/favicon.ico`** - Favicon de respaldo (ICO)
- **`public/manifest.json`** - Manifest para PWA

### Servicios de Autenticación

- **`src/services/authService.ts`** - Servicio robusto de autenticación
- Manejo automático de errores de popup y redirect
- Fallback automático de popup a redirect si es necesario
- Configuración optimizada para evitar errores de COOP

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

### Servicios Firebase Utilizados

- **Authentication** - Login con Google (popup + redirect fallback)
- **Firestore** - Almacenamiento de conversaciones y datos de usuario
- **Analytics** - Métricas de uso (opcional)

### Variables de Entorno

El proyecto ya no requiere variables de entorno para Firebase, ya que la configuración está hardcodeada en `src/firebase.ts` para mayor simplicidad.

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

### Headers de Seguridad Configurados

```json
{
  "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
  "Cross-Origin-Embedder-Policy": "unsafe-none"
}
```

Estos headers permiten que Firebase Auth funcione correctamente con popups mientras mantienen la seguridad. 