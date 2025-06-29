#!/bin/bash

# Script de deployment para Cloud Run usando imagen específica
# Asegúrate de tener configuradas las variables de entorno antes de ejecutar

set -e

echo "🚀 Desplegando Plantilla Agent ADK en Cloud Run..."

# Verificar variables de entorno requeridas
if [ -z "$GOOGLE_CLOUD_PROJECT" ]; then
    echo "❌ Error: GOOGLE_CLOUD_PROJECT no está configurado"
    exit 1
fi

if [ -z "$GOOGLE_CLOUD_LOCATION" ]; then
    echo "❌ Error: GOOGLE_CLOUD_LOCATION no está configurado"
    exit 1
fi

# Configuración de la imagen
IMAGE_URL="us-central1-docker.pkg.dev/sumy-464008/adk-agents-repo/plantilla-agent-adk:v1"
SERVICE_NAME="plantilla-agent-adk"

echo "📋 Configuración:"
echo "   Proyecto: $GOOGLE_CLOUD_PROJECT"
echo "   Región: $GOOGLE_CLOUD_LOCATION"
echo "   Servicio: $SERVICE_NAME"
echo "   Imagen: $IMAGE_URL"

echo "🔧 Desplegando..."

gcloud run deploy $SERVICE_NAME \
  --image $IMAGE_URL \
  --region $GOOGLE_CLOUD_LOCATION \
  --project $GOOGLE_CLOUD_PROJECT \
  --allow-unauthenticated \
  --set-env-vars="GOOGLE_GENAI_USE_VERTEXAI=True,GOOGLE_CLOUD_PROJECT=$GOOGLE_CLOUD_PROJECT,GOOGLE_CLOUD_LOCATION=$GOOGLE_CLOUD_LOCATION" \
  --memory 1Gi \
  --cpu 1 \
  --timeout 300 \
  --max-instances 10 \
  --platform managed

echo "✅ ¡Deployment completado!"
echo "🌐 Tu servicio estará disponible en la URL que aparece arriba"
echo "🔗 Para probar: curl https://plantilla-agent-adk-XXXXX-uc.a.run.app/" 