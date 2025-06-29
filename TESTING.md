# Scripts de Prueba para ADK Short Bot

Este directorio contiene scripts para probar el servicio ADK Short Bot desplegado en Cloud Run.

## Servicio
- **URL**: https://plantilla-agent-adk-904733965277.us-central1.run.app
- **Descripción**: Bot que acorta mensajes usando Google Vertex AI ADK

## Scripts Disponibles

### 1. `test_service.py` - Script Python Completo
Script de prueba completo con manejo de errores y reportes detallados.

**Requisitos:**
```bash
pip install requests
```

**Ejecutar:**
```bash
python3 test_service.py
```

**Características:**
- ✅ Prueba todos los endpoints
- ✅ Manejo de errores robusto
- ✅ Reporte de resultados detallado
- ✅ Pruebas de funcionalidad principal
- ✅ Validación de respuestas

### 2. `test_service.sh` - Script Bash Rápido
Script simple para pruebas rápidas usando curl.

**Requisitos:**
- `curl` (incluido en macOS/Linux)
- `jq` (opcional, para formateo JSON)

**Ejecutar:**
```bash
./test_service.sh
```

**Características:**
- ⚡ Ejecución rápida
- 🔧 No requiere dependencias Python
- 📊 Formateo JSON con jq (si está disponible)
- 🧪 Pruebas básicas de todos los endpoints

## Endpoints Probados

### 1. Health Check
```bash
GET /
```
Verifica que el servicio esté funcionando.

### 2. Crear Sesión
```bash
POST /sessions
Content-Type: application/json

{
  "user_id": "usuario_prueba"
}
```
Crea una nueva sesión para el usuario.

### 3. Chat (sin sesión)
```bash
POST /chat
Content-Type: application/json

{
  "message": "Hola, ¿cómo estás?",
  "user_id": "usuario_prueba"
}
```
Envía un mensaje al bot (crea sesión automáticamente).

### 4. Chat (con sesión)
```bash
POST /chat
Content-Type: application/json

{
  "message": "¿Cuál es tu función?",
  "user_id": "usuario_prueba",
  "session_id": "SESSION_ID_FROM_PREVIOUS_RESPONSE"
}
```
Envía un mensaje usando una sesión existente.

## Ejemplos de Uso Manual

### Probar Health Check
```bash
curl -X GET "https://plantilla-agent-adk-904733965277.us-central1.run.app/"
```

### Crear Sesión
```bash
curl -X POST "https://plantilla-agent-adk-904733965277.us-central1.run.app/sessions" \
  -H "Content-Type: application/json" \
  -d '{"user_id": "mi_usuario"}'
```

### Enviar Mensaje
```bash
curl -X POST "https://plantilla-agent-adk-904733965277.us-central1.run.app/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Este es un mensaje muy largo que debería ser acortado",
    "user_id": "mi_usuario"
  }'
```

## Interpretación de Resultados

### Respuestas Exitosas
- **Status Code**: 200
- **Response**: JSON con datos de la respuesta

### Posibles Errores
- **400**: Datos de entrada inválidos
- **500**: Error interno del servidor
- **Timeout**: El servicio puede tardar en responder

## Notas Importantes

1. **Tiempo de Respuesta**: El servicio puede tardar varios segundos en responder debido al procesamiento de IA
2. **Sesiones**: Cada sesión mantiene el contexto de la conversación
3. **Rate Limiting**: El servicio puede tener límites de uso
4. **Autenticación**: El servicio actualmente no requiere autenticación

## Troubleshooting

### Error de Conexión
```bash
curl: (7) Failed to connect to plantilla-agent-adk-904733965277.us-central1.run.app
```
- Verificar conectividad a internet
- Verificar que la URL sea correcta

### Error 403/404
- Verificar que el servicio esté desplegado
- Verificar permisos de acceso

### Error 500
- Error interno del servidor
- Revisar logs del servicio en Cloud Run 