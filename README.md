# ADK Agent Template

Plantilla básica para desarrollar agentes con Google ADK usando la implementación oficial.

## Estructura

```
├── adk_short_bot/          # Código del agente
│   ├── __init__.py         # Importa el agente
│   ├── agent.py            # Define root_agent
│   ├── prompt.py           # Prompts del agente
│   └── tools/              # Herramientas del agente
├── main.py                 # API FastAPI (implementación oficial)
├── requirements.txt        # Dependencias (solo google_adk)
├── Dockerfile             # Contenedor (Python 3.13)
├── deploy-cloudrun.sh     # Deploy con ADK CLI oficial
├── deploy-cloudrun-image.sh # Deploy con imagen específica
├── test_service.py        # Script de prueba Python
├── test_service.sh        # Script de prueba Bash
├── TESTING.md             # Documentación de pruebas
└── .env.example           # Variables de entorno
```

## Prerequisitos

- Python 3.13+
- Google ADK CLI (`pip install google_adk`)
- Google Cloud CLI (`gcloud`)
- Proyecto de Google Cloud con Vertex AI habilitado

## Configuración Inicial

### 1. Clonar y Configurar Entorno

```bash
# Clonar el repositorio
git clone https://github.com/pedromarquezgomez/pantilla_adk.git
cd pantilla_adk

# Crear entorno virtual
python3 -m venv .venv

# Activar entorno virtual
# En macOS/Linux:
source .venv/bin/activate
# En Windows:
# .venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt
```

### 2. Configurar Google Cloud
```bash
# Autenticarse con Google Cloud
gcloud auth login
gcloud auth application-default login

# Configurar proyecto
gcloud config set project TU_PROYECTO_ID
gcloud config set compute/region us-central1

# Habilitar APIs necesarias
gcloud services enable aiplatform.googleapis.com run.googleapis.com artifactregistry.googleapis.com
```

### 3. Variables de Entorno
```bash
# Configurar variables de entorno requeridas
export GOOGLE_CLOUD_PROJECT="tu-proyecto-id"
export GOOGLE_CLOUD_LOCATION="us-central1"
export GOOGLE_GENAI_USE_VERTEXAI=True
```

## Uso Rápido

### Desarrollo Local con Python
```bash
# Asegúrate de tener el entorno virtual activado
source .venv/bin/activate

# Ejecutar directamente
uvicorn main:app --host 0.0.0.0 --port 8080
```

### Desarrollo Local con Docker

#### 1. Construir Imagen
```bash
docker build -t adk-short-bot .
```

#### 2. Ejecutar Contenedor
```bash
# Comando completo con credenciales y variables de entorno
docker run -d --name adk-short-bot \
  -p 8081:8080 \
  -v ~/.config/gcloud:/home/myuser/.config/gcloud \
  -e GOOGLE_CLOUD_PROJECT=TU_PROYECTO_ID \
  -e GOOGLE_CLOUD_LOCATION=us-central1 \
  -e GOOGLE_GENAI_USE_VERTEXAI=True \
  adk-short-bot
```

**Notas importantes:**
- **Puerto**: Usar 8081 para evitar conflictos con otros servicios
- **Credenciales**: Montar `~/.config/gcloud` para autenticación
- **Variables**: Configurar todas las variables de entorno requeridas

#### 3. Verificar Funcionamiento
```bash
# Health check
curl http://localhost:8081/

# Acceder a la UI web (si está habilitada)
open http://localhost:8081
```

## Deployment a Cloud Run

### Opción 1: Deployment con ADK CLI (Recomendado)

El script `deploy-cloudrun.sh` usa el comando oficial de ADK:

```bash
# Configurar variables de entorno
export GOOGLE_CLOUD_PROJECT="tu-proyecto-id"
export GOOGLE_CLOUD_LOCATION="us-central1"
export GOOGLE_GENAI_USE_VERTEXAI=True

# Desplegar con ADK CLI oficial
./deploy-cloudrun.sh
```

**Ventajas:**
- ✅ Implementación oficial de Google ADK
- ✅ UI web integrada automáticamente
- ✅ Gestión de sesiones con base de datos
- ✅ Configuración automática de CORS
- ✅ Soporte para múltiples agentes

### Opción 2: Deployment Manual con gcloud

Si prefieres control total sobre el despliegue:

```bash
# Configurar variables de entorno
export GOOGLE_CLOUD_PROJECT="tu-proyecto-id"
export GOOGLE_CLOUD_LOCATION="us-central1"
export GOOGLE_GENAI_USE_VERTEXAI=True

# Desplegar con gcloud
gcloud run deploy adk-short-bot-service \
  --source . \
  --region $GOOGLE_CLOUD_LOCATION \
  --project $GOOGLE_CLOUD_PROJECT \
  --allow-unauthenticated \
  --set-env-vars="GOOGLE_CLOUD_PROJECT=$GOOGLE_CLOUD_PROJECT,GOOGLE_CLOUD_LOCATION=$GOOGLE_CLOUD_LOCATION,GOOGLE_GENAI_USE_VERTEXAI=$GOOGLE_GENAI_USE_VERTEXAI"
```

## Características de la Implementación Oficial

### ✅ UI Web Integrada
- Interfaz visual para interactuar con el agente
- Gestión de sesiones desde el navegador
- Visualización de logs y ejecución

### ✅ Gestión de Sesiones Persistente
- Base de datos SQLite para sesiones
- Persistencia entre reinicios
- Múltiples usuarios simultáneos

### ✅ API REST Completa
- Endpoints automáticos para todas las operaciones
- Documentación automática con Swagger
- Soporte para CORS configurado

### ✅ Configuración Automática
- No necesitas configurar FastAPI manualmente
- Endpoints generados automáticamente
- Manejo de errores integrado

## Probar el Servicio Desplegado

```bash
# Obtener URL del servicio
gcloud run services describe adk-short-bot \
  --region=us-central1 \
  --format="value(status.url)"

# Health check
curl https://adk-short-bot-XXXXX-uc.a.run.app/

# Crear sesión
curl -X POST https://adk-short-bot-XXXXX-uc.a.run.app/sessions \
  -H "Content-Type: application/json" -d '{}'

# Chat
curl -X POST https://adk-short-bot-XXXXX-uc.a.run.app/chat \
  -H "Content-Type: application/json" \
  -d '{"session_id": "tu-session-id", "message": "Mensaje para acortar"}'
```

## Troubleshooting

### Problemas Comunes

#### 1. Error de Entorno Virtual
```
ModuleNotFoundError: No module named 'fastapi'
```
**Solución**: 
- Verificar que el entorno virtual esté activado: `source .venv/bin/activate`
- Reinstalar dependencias: `pip install -r requirements.txt`
- Verificar que estés en el directorio correcto

#### 2. Error de Autenticación
```
GoogleAuthError: Unable to find your project
```
**Solución**: 
- Verificar que `gcloud auth application-default login` esté ejecutado
- Configurar proyecto con `gcloud config set project TU_PROYECTO_ID`

#### 3. Puerto Ocupado
```
Bind for 0.0.0.0:8080 failed: port is already allocated
```
**Solución**: Usar otro puerto (ej: 8081, 8082, etc.)

#### 4. Contenedor se Cierra
```
ValueError: Unable to find your project
```
**Solución**: 
- Montar credenciales: `-v ~/.config/gcloud:/root/.config/gcloud`
- Configurar variables de entorno: `-e GOOGLE_CLOUD_PROJECT=...`

#### 5. Error en Deployment
```
ERROR: (gcloud.run.deploy) INVALID_ARGUMENT: Invalid image
```
**Solución**: 
- Verificar que la imagen existe en el repositorio
- Usar el script de deployment automático en su lugar

### Comandos Útiles

```bash
# Gestión del entorno virtual
python3 -m venv .venv                    # Crear entorno virtual
source .venv/bin/activate                # Activar entorno (macOS/Linux)
deactivate                               # Desactivar entorno
pip list                                 # Ver paquetes instalados
pip install -r requirements.txt          # Instalar dependencias
pip freeze > requirements.txt            # Actualizar requirements.txt

# Ver logs del contenedor local
docker logs adk-short-bot

# Ver estado del contenedor local
docker ps

# Ver logs del servicio en Cloud Run
gcloud logs tail --service=adk-short-bot

# Ver información del servicio
gcloud run services describe adk-short-bot --region=us-central1

# Listar imágenes en el repositorio
gcloud artifacts docker images list us-central1-docker.pkg.dev/TU_PROYECTO_ID/adk-agents-repo
```

## Personalizar

- **Agente**: Editar `adk_short_bot/agent.py`
- **Prompts**: Editar `adk_short_bot/prompt.py`
- **API**: Editar `main.py`
- **Herramientas**: Agregar en `adk_short_bot/tools/`

## Dependencias

```
fastapi>=0.115.14
uvicorn>=0.32.0
pydantic>=2.10.0
google-cloud-aiplatform[adk,agent_engines]>=1.100.0
google-adk>=1.5.0
```

## Workflow Recomendado

### Para Desarrollo
1. **Editar código** en `adk_short_bot/`
2. **Test local**: `docker run -d --name adk-short-bot -p 8081:8080 -v ~/.config/gcloud:/home/myuser/.config/gcloud -e GOOGLE_CLOUD_PROJECT=TU_PROYECTO_ID -e GOOGLE_CLOUD_LOCATION=us-central1 -e GOOGLE_GENAI_USE_VERTEXAI=True adk-short-bot`
3. **Probar**: `curl http://localhost:8081/`
4. **Deploy rápido**: `./deploy-cloudrun.sh`

### Para Producción
1. **Desarrollo**: Editar código en `adk_short_bot/`
2. **Test local**: Usar Docker local
3. **Construir imagen**: `docker build --platform linux/amd64 -t us-central1-docker.pkg.dev/TU_PROYECTO_ID/adk-agents-repo/adk-short-bot:v1 .`
4. **Subir imagen**: `docker push us-central1-docker.pkg.dev/TU_PROYECTO_ID/adk-agents-repo/adk-short-bot:v1`
5. **Deploy**: `./deploy-cloudrun-image.sh`


#RECUERDOS DESPLEGUE
## 📋 **Resumen Completo del Despliegue - Pasos y Comandos**

Aquí tienes todos los pasos que ejecutamos para desplegar exitosamente tu agente ADK en Cloud Run:

---

## **🔧 1. Construcción de la Imagen AMD64**

### **Paso 1.1: Construir imagen optimizada para Cloud Run**
```bash
docker build --platform linux/amd64 -t adk-short-bot:amd64 .
```
- **Resultado**: Imagen de 143MB optimizada para arquitectura AMD64
- **ID**: `1632457af69b`

### **Paso 1.2: Verificar imágenes creadas**
```bash
docker images | grep adk-short-bot
```
- **Resultado**: 
  - `adk-short-bot:amd64` (143MB) - Nueva imagen optimizada
  - `adk-short-bot:latest` (781MB) - Imagen local anterior

---

## **📤 2. Subida al Repositorio de Google**

### **Paso 2.1: Configurar Docker para Google Cloud**
```bash
gcloud auth configure-docker
```
- **Resultado**: Docker configurado para autenticarse con Google Container Registry

### **Paso 2.2: Etiquetar imagen para Google Container Registry**
```bash
docker tag adk-short-bot:amd64 gcr.io/sumy-464008/adk-short-bot:latest
```
- **Resultado**: Imagen etiquetada con formato GCR

### **Paso 2.3: Subir imagen al repositorio**
```bash
docker push gcr.io/sumy-464008/adk-short-bot:latest
```
- **Resultado**: Imagen subida exitosamente con digest `sha256:1632457af69bde060bde065204a0feebb453aca348e5dfaa592abae540f856db`

---

## **⚙️ 3. Configuración del Script de Despliegue**

### **Paso 3.1: Actualizar script con la imagen correcta**
```bash
# Editamos deploy-cloudrun-image.sh para cambiar:
IMAGE_URL="gcr.io/sumy-464008/adk-short-bot:latest"
SERVICE_NAME="adk-short-bot"
```

### **Paso 3.2: Hacer script ejecutable**
```bash
chmod +x deploy-cloudrun-image.sh
```

---

## **🚀 4. Despliegue a Cloud Run**

### **Paso 4.1: Configurar variables de entorno**
```bash
export GOOGLE_CLOUD_PROJECT="sumy-464008"
export GOOGLE_CLOUD_LOCATION="us-central1"
```

### **Paso 4.2: Ejecutar despliegue**
```bash
./deploy-cloudrun-image.sh
```

**Este script ejecutó internamente:**
```bash
gcloud run deploy adk-short-bot \
  --image gcr.io/sumy-464008/adk-short-bot:latest \
  --region us-central1 \
  --project sumy-464008 \
  --allow-unauthenticated \
  --set-env-vars="GOOGLE_GENAI_USE_VERTEXAI=True,GOOGLE_CLOUD_PROJECT=sumy-464008,GOOGLE_CLOUD_LOCATION=us-central1" \
  --memory 1Gi \
  --cpu 1 \
  --timeout 300 \
  --max-instances 10 \
  --platform managed
```

---

## **✅ 5. Verificación del Servicio**

### **Paso 5.1: Verificar endpoints**
```bash
# Probar documentación API
curl https://adk-short-bot-904733965277.us-central1.run.app/docs

# Verificar interfaz web
curl -s https://adk-short-bot-904733965277.us-central1.run.app/dev-ui/ | head -20
```

---

## **📊 Resultado Final**

### **🎯 Servicio Desplegado:**
- **Nombre**: `adk-short-bot`
- **Revisión**: `adk-short-bot-00001-thw`
- **URL**: `https://adk-short-bot-904733965277.us-central1.run.app`

### **⚙️ Configuración:**
- **Imagen**: `gcr.io/sumy-464008/adk-short-bot:latest` (143MB)
- **Memoria**: 1GB
- **CPU**: 1 núcleo
- **Timeout**: 300s
- **Máx instancias**: 10
- **Acceso**: Público

### **🌐 URLs Funcionales:**
1. **Interfaz Web**: `https://adk-short-bot-904733965277.us-central1.run.app/dev-ui/`
2. **API Docs**: `https://adk-short-bot-904733965277.us-central1.run.app/docs`
3. **API Base**: `https://adk-short-bot-904733965277.us-central1.run.app/`

### **💡 Variables de Entorno Configuradas:**
- `GOOGLE_GENAI_USE_VERTEXAI=True`
- `GOOGLE_CLOUD_PROJECT=sumy-464008`
- `GOOGLE_CLOUD_LOCATION=us-central1`

---

## **🔑 Comandos Clave para Futuras Actualizaciones**

```bash
# 1. Reconstruir imagen
docker build --platform linux/amd64 -t adk-short-bot:amd64 .

# 2. Re-etiquetar y subir
docker tag adk-short-bot:amd64 gcr.io/sumy-464008/adk-short-bot:latest
docker push gcr.io/sumy-464008/adk-short-bot:latest

# 3. Re-desplegar
export GOOGLE_CLOUD_PROJECT="sumy-464008"
export GOOGLE_CLOUD_LOCATION="us-central1"
./deploy-cloudrun-image.sh
```

¡Tu agente ADK está ahora completamente desplegado y funcionando en producción! 🎉
