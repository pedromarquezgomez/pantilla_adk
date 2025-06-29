# Dockerfile
FROM python:3.13-slim
WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

RUN adduser --disabled-password --gecos "" myuser

COPY . .

# Cambiar permisos después de copiar los archivos
RUN chown -R myuser:myuser /app && \
    chmod -R 755 /app

USER myuser

ENV PATH="/home/myuser/.local/bin:$PATH"
ENV PORT=8080

CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8080}"] 