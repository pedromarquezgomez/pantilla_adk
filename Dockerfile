# Dockerfile
FROM python:3.12-slim
WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# El comando final y correcto para arrancar el servidor
# Le decimos a Uvicorn: "inicia la variable 'app' que está en el archivo 'main',
# escúchala en TODAS las direcciones IP (0.0.0.0) y en el puerto que nos dé Cloud Run"
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"] 