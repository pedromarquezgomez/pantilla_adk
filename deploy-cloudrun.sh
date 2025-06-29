#!/bin/bash

# Script de despliegue usando el comando oficial de ADK para Cloud Run
# Basado en la implementación oficial de Google ADK

set -e

# Verificar variables de entorno
if [ -z "$GOOGLE_CLOUD_PROJECT" ]; then
    echo "Error: GOOGLE_CLOUD_PROJECT no está definido"
    echo "Ejecuta: export GOOGLE_CLOUD_PROJECT=tu-proyecto-id"
    exit 1
fi

if [ -z "$GOOGLE_CLOUD_LOCATION" ]; then
    echo "Error: GOOGLE_CLOUD_LOCATION no está definido"
    echo "Ejecuta: export GOOGLE_CLOUD_LOCATION=us-central1"
    exit 1
fi

# Configurar variables por defecto
export GOOGLE_GENAI_USE_VERTEXAI=True

echo "🚀 Desplegando agente ADK a Cloud Run..."
echo "Proyecto: $GOOGLE_CLOUD_PROJECT"
echo "Región: $GOOGLE_CLOUD_LOCATION"

# Usar el comando oficial de ADK para Cloud Run
adk deploy cloud_run \
    --project_id="$GOOGLE_CLOUD_PROJECT" \
    --location="$GOOGLE_CLOUD_LOCATION" \
    --service_name="adk-short-bot-service" \
    --allow_unauthenticated \
    --with_ui

echo "✅ Despliegue completado!"
echo "🌐 Tu agente está disponible en la URL mostrada arriba"
echo "📝 Para ver logs: gcloud run logs tail adk-short-bot-service --region=$GOOGLE_CLOUD_LOCATION" 