#!/bin/bash

# Script de prueba simple para el servicio ADK Short Bot
# URL del servicio
SERVICE_URL="https://plantilla-agent-adk-904733965277.us-central1.run.app"

echo "🚀 INICIANDO PRUEBAS RÁPIDAS DEL SERVICIO ADK SHORT BOT"
echo "🌐 URL: $SERVICE_URL"
echo ""

# Función para imprimir separadores
print_separator() {
    echo ""
    echo "============================================================"
    echo "🧪 $1"
    echo "============================================================"
}

# 1. Health Check
print_separator "HEALTH CHECK"
echo "Probando endpoint GET /"
curl -s -X GET "$SERVICE_URL/" | jq '.' 2>/dev/null || curl -s -X GET "$SERVICE_URL/"

# 2. Crear sesión
print_separator "CREAR SESIÓN"
echo "Probando endpoint POST /sessions"
SESSION_RESPONSE=$(curl -s -X POST "$SERVICE_URL/sessions" \
  -H "Content-Type: application/json" \
  -d '{"user_id": "usuario_prueba_bash"}')

echo "$SESSION_RESPONSE" | jq '.' 2>/dev/null || echo "$SESSION_RESPONSE"

# Extraer session_id si está disponible
SESSION_ID=$(echo "$SESSION_RESPONSE" | jq -r '.session_id' 2>/dev/null)
if [ "$SESSION_ID" != "null" ] && [ -n "$SESSION_ID" ]; then
    echo "✅ Session ID obtenido: $SESSION_ID"
else
    echo "⚠️  No se pudo obtener Session ID"
fi

# 3. Chat sin sesión
print_separator "CHAT SIN SESIÓN"
echo "Probando endpoint POST /chat sin session_id"
curl -s -X POST "$SERVICE_URL/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hola, ¿cómo estás? ¿Puedes presentarte?",
    "user_id": "usuario_prueba_bash"
  }' | jq '.' 2>/dev/null || curl -s -X POST "$SERVICE_URL/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hola, ¿cómo estás? ¿Puedes presentarte?",
    "user_id": "usuario_prueba_bash"
  }'

# 4. Chat con sesión (si se obtuvo session_id)
if [ -n "$SESSION_ID" ] && [ "$SESSION_ID" != "null" ]; then
    print_separator "CHAT CON SESIÓN"
    echo "Probando endpoint POST /chat con session_id: $SESSION_ID"
    curl -s -X POST "$SERVICE_URL/chat" \
      -H "Content-Type: application/json" \
      -d "{
        \"message\": \"¿Cuál es tu función principal?\",
        \"user_id\": \"usuario_prueba_bash\",
        \"session_id\": \"$SESSION_ID\"
      }" | jq '.' 2>/dev/null || curl -s -X POST "$SERVICE_URL/chat" \
      -H "Content-Type: application/json" \
      -d "{
        \"message\": \"¿Cuál es tu función principal?\",
        \"user_id\": \"usuario_prueba_bash\",
        \"session_id\": \"$SESSION_ID\"
      }"
fi

# 5. Probar acortamiento de mensaje
print_separator "ACORTAR MENSAJE"
echo "Probando funcionalidad de acortar mensaje largo"
curl -s -X POST "$SERVICE_URL/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Este es un mensaje extremadamente largo que contiene mucha información innecesaria y debería ser acortado para que sea más conciso y fácil de leer. El objetivo es mantener solo la información esencial.",
    "user_id": "usuario_prueba_bash"
  }' | jq '.' 2>/dev/null || curl -s -X POST "$SERVICE_URL/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Este es un mensaje extremadamente largo que contiene mucha información innecesaria y debería ser acortado para que sea más conciso y fácil de leer. El objetivo es mantener solo la información esencial.",
    "user_id": "usuario_prueba_bash"
  }'

# 6. Prueba de error
print_separator "PRUEBA DE ERROR"
echo "Probando con datos faltantes (debería dar error)"
curl -s -X POST "$SERVICE_URL/chat" \
  -H "Content-Type: application/json" \
  -d '{"user_id": "usuario_prueba_bash"}' | jq '.' 2>/dev/null || curl -s -X POST "$SERVICE_URL/chat" \
  -H "Content-Type: application/json" \
  -d '{"user_id": "usuario_prueba_bash"}'

print_separator "PRUEBAS COMPLETADAS"
echo "✅ Script de pruebas terminado"
echo "📝 Revisa los resultados arriba para verificar el funcionamiento del servicio" 