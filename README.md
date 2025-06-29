# ADK Agent Template

Plantilla básica para desarrollar agentes con Google ADK.

## Estructura

```
├── adk_short_bot/          # Código del agente
├── main.py                 # API FastAPI
├── requirements.txt        # Dependencias
├── Dockerfile             # Contenedor
├── deploy-cloudrun.sh     # Deploy automático (build + deploy)
├── deploy-cloudrun-image.sh # Deploy con imagen específica
└── .env.example           # Variables de entorno
```

## Prerequisitos

- Python 3.12+
- Docker
- Google Cloud CLI (`gcloud`)
- Proyecto de Google Cloud con Vertex AI habilitado

## Configuración Inicial

### 1. Configurar Google Cloud
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

### 2. Instalar Dependencias
```bash
# Instalar dependencias locales
pip install -r requirements.txt
```

## Uso Rápido

### Desarrollo Local con Python
```bash
# Ejecutar directamente
uvicorn main:app --host 0.0.0.0 --port 8080
```

### Desarrollo Local con Docker

#### 1. Construir Imagen
```bash
docker build -t plantilla-agent-adk .
```

#### 2. Ejecutar Contenedor
```bash
# Comando completo con credenciales y variables de entorno
docker run -d --name plantilla-agent-adk \
  -p 8081:8080 \
  -v ~/.config/gcloud:/root/.config/gcloud \
  -e GOOGLE_CLOUD_PROJECT=TU_PROYECTO_ID \
  -e GOOGLE_CLOUD_LOCATION=us-central1 \
  plantilla-agent-adk
```

**Notas importantes:**
- **Puerto**: Usar 8081 para evitar conflictos con otros servicios
- **Credenciales**: Montar `~/.config/gcloud` para autenticación
- **Variables**: Configurar `GOOGLE_CLOUD_PROJECT` y `GOOGLE_CLOUD_LOCATION`

#### 3. Verificar Funcionamiento
```bash
# Health check
curl http://localhost:8081/

# Crear sesión
curl -X POST http://localhost:8081/sessions \
  -H "Content-Type: application/json" \
  -d '{}'

# Chat (acortar mensaje)
curl -X POST http://localhost:8081/chat \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "tu-session-id",
    "message": "Acorta este mensaje: Hola, ¿cómo estás hoy?"
  }'
```

## Deployment a Cloud Run

### Opción 1: Deployment Automático (Recomendado para desarrollo)

El script `deploy-cloudrun.sh` construye la imagen automáticamente:

```bash
# Configurar variables de entorno
export GOOGLE_CLOUD_PROJECT="tu-proyecto-id"
export GOOGLE_CLOUD_LOCATION="us-central1"

# Desplegar (construye imagen automáticamente)
./deploy-cloudrun.sh
```

**Ventajas:**
- ✅ Automático - No necesitas crear imagen manualmente
- ✅ Simple - Un solo comando
- ✅ Siempre actualizado - Usa el código actual

### Opción 2: Deployment con Imagen Específica (Recomendado para producción)

El script `deploy-cloudrun-image.sh` usa una imagen pre-construida:

#### 1. Crear Repositorio (solo la primera vez)
```bash
gcloud artifacts repositories create adk-agents-repo \
  --repository-format=docker \
  --location=us-central1 \
  --description="Repository for ADK agents"
```

#### 2. Configurar Docker
```bash
gcloud auth configure-docker us-central1-docker.pkg.dev
```

#### 3. Construir y Subir Imagen
```bash
# Construir imagen AMD64
docker build --platform linux/amd64 \
  -t us-central1-docker.pkg.dev/TU_PROYECTO_ID/adk-agents-repo/plantilla-agent-adk:v1 .

# Subir al repositorio
docker push us-central1-docker.pkg.dev/TU_PROYECTO_ID/adk-agents-repo/plantilla-agent-adk:v1
```

#### 4. Desplegar
```bash
# Configurar variables de entorno
export GOOGLE_CLOUD_PROJECT="tu-proyecto-id"
export GOOGLE_CLOUD_LOCATION="us-central1"

# Desplegar con imagen específica
./deploy-cloudrun-image.sh
```

**Ventajas:**
- ✅ Control total - Sabes exactamente qué imagen se despliega
- ✅ Reproducible - Misma imagen en todos los entornos
- ✅ Optimizado - Imagen AMD64 para mejor rendimiento
- ✅ Versionado - Puedes tener múltiples versiones

### Comparación de Scripts

| Aspecto | `deploy-cloudrun.sh` | `deploy-cloudrun-image.sh` |
|---------|---------------------|---------------------------|
| **Servicio** | `short-bot-service` | `plantilla-agent-adk` |
| **Imagen** | Construida automáticamente | Específica del repositorio |
| **Arquitectura** | Automática | AMD64 explícita |
| **Uso** | Desarrollo | Producción |
| **Velocidad** | Más lento (build + deploy) | Más rápido (solo deploy) |

## Probar el Servicio Desplegado

```bash
# Obtener URL del servicio
gcloud run services describe plantilla-agent-adk \
  --region=us-central1 \
  --format="value(status.url)"

# Health check
curl https://plantilla-agent-adk-XXXXX-uc.a.run.app/

# Crear sesión
curl -X POST https://plantilla-agent-adk-XXXXX-uc.a.run.app/sessions \
  -H "Content-Type: application/json" -d '{}'

# Chat
curl -X POST https://plantilla-agent-adk-XXXXX-uc.a.run.app/chat \
  -H "Content-Type: application/json" \
  -d '{"session_id": "tu-session-id", "message": "Mensaje para acortar"}'
```

## Troubleshooting

### Problemas Comunes

#### 1. Error de Autenticación
```
GoogleAuthError: Unable to find your project
```
**Solución**: 
- Verificar que `gcloud auth application-default login` esté ejecutado
- Configurar proyecto con `gcloud config set project TU_PROYECTO_ID`

#### 2. Puerto Ocupado
```
Bind for 0.0.0.0:8080 failed: port is already allocated
```
**Solución**: Usar otro puerto (ej: 8081, 8082, etc.)

#### 3. Contenedor se Cierra
```
ValueError: Unable to find your project
```
**Solución**: 
- Montar credenciales: `-v ~/.config/gcloud:/root/.config/gcloud`
- Configurar variables de entorno: `-e GOOGLE_CLOUD_PROJECT=...`

#### 4. Error en Deployment
```
ERROR: (gcloud.run.deploy) INVALID_ARGUMENT: Invalid image
```
**Solución**: 
- Verificar que la imagen existe en el repositorio
- Usar el script de deployment automático en su lugar

### Comandos Útiles

```bash
# Ver logs del contenedor local
docker logs plantilla-agent-adk

# Ver estado del contenedor local
docker ps

# Ver logs del servicio en Cloud Run
gcloud logs tail --service=plantilla-agent-adk

# Ver información del servicio
gcloud run services describe plantilla-agent-adk --region=us-central1

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
2. **Test local**: `docker run -d --name plantilla-agent-adk -p 8081:8080 -v ~/.config/gcloud:/root/.config/gcloud -e GOOGLE_CLOUD_PROJECT=TU_PROYECTO_ID -e GOOGLE_CLOUD_LOCATION=us-central1 plantilla-agent-adk`
3. **Probar**: `curl http://localhost:8081/`
4. **Deploy rápido**: `./deploy-cloudrun.sh`

### Para Producción
1. **Desarrollo**: Editar código en `adk_short_bot/`
2. **Test local**: Usar Docker local
3. **Construir imagen**: `docker build --platform linux/amd64 -t us-central1-docker.pkg.dev/TU_PROYECTO_ID/adk-agents-repo/plantilla-agent-adk:v1 .`
4. **Subir imagen**: `docker push us-central1-docker.pkg.dev/TU_PROYECTO_ID/adk-agents-repo/plantilla-agent-adk:v1`
5. **Deploy**: `./deploy-cloudrun-image.sh`
