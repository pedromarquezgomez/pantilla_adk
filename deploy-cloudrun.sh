#!/bin/bash

# Script de deployment para Cloud Run
# Asegúrate de tener configuradas las variables de entorno antes de ejecutar

set -e

echo "🚀 Desplegando ADK Short Bot en Cloud Run..."

# Verificar variables de entorno requeridas
if [ -z "$GOOGLE_CLOUD_PROJECT" ]; then
    echo "❌ Error: GOOGLE_CLOUD_PROJECT no está configurado"
    exit 1
fi

if [ -z "$GOOGLE_CLOUD_LOCATION" ]; then
    echo "❌ Error: GOOGLE_CLOUD_LOCATION no está configurado"
    exit 1
fi

echo "📋 Configuración:"
echo "   Proyecto: $GOOGLE_CLOUD_PROJECT"
echo "   Región: $GOOGLE_CLOUD_LOCATION"
echo "   Servicio: short-bot-service"

echo "🔧 Desplegando..."

gcloud run deploy short-bot-service \
  --source . \
  --region $GOOGLE_CLOUD_LOCATION \
  --project $GOOGLE_CLOUD_PROJECT \
  --allow-unauthenticated \
  --set-env-vars="GOOGLE_GENAI_USE_VERTEXAI=True" \
  --memory 1Gi \
  --cpu 1 \
  --timeout 300 \
  --max-instances 10

echo "✅ ¡Deployment completado!"
echo "🌐 Tu servicio estará disponible en la URL que aparece arriba" 