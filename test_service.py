#!/usr/bin/env python3
"""
Script de prueba para el servicio ADK Short Bot
Prueba todos los endpoints del servicio desplegado en Cloud Run
"""

import requests
import json
import time
from typing import Dict, Any

# Configuración del servicio
BASE_URL = "https://plantilla-agent-adk-904733965277.us-central1.run.app"
HEADERS = {"Content-Type": "application/json"}

def print_separator(title: str):
    """Imprime un separador visual para organizar las pruebas"""
    print(f"\n{'='*60}")
    print(f"🧪 {title}")
    print(f"{'='*60}")

def test_health_check():
    """Prueba el endpoint de health check"""
    print_separator("HEALTH CHECK")
    try:
        response = requests.get(f"{BASE_URL}/")
        print(f"✅ Status Code: {response.status_code}")
        print(f"📄 Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_create_session():
    """Prueba la creación de una sesión"""
    print_separator("CREAR SESIÓN")
    try:
        data = {"user_id": "usuario_prueba_script"}
        response = requests.post(f"{BASE_URL}/sessions", headers=HEADERS, json=data)
        print(f"✅ Status Code: {response.status_code}")
        print(f"📄 Response: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")
        
        if response.status_code == 200:
            session_data = response.json()
            return session_data.get("session_id")
        return None
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

def test_chat_without_session():
    """Prueba el chat sin especificar sesión (debe crear una automáticamente)"""
    print_separator("CHAT SIN SESIÓN")
    try:
        data = {
            "message": "Hola, ¿cómo estás? ¿Puedes presentarte?",
            "user_id": "usuario_prueba_script"
        }
        response = requests.post(f"{BASE_URL}/chat", headers=HEADERS, json=data)
        print(f"✅ Status Code: {response.status_code}")
        print(f"📄 Response: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_chat_with_session(session_id: str):
    """Prueba el chat con una sesión específica"""
    print_separator("CHAT CON SESIÓN")
    try:
        data = {
            "message": "¿Cuál es tu función principal?",
            "user_id": "usuario_prueba_script",
            "session_id": session_id
        }
        response = requests.post(f"{BASE_URL}/chat", headers=HEADERS, json=data)
        print(f"✅ Status Code: {response.status_code}")
        print(f"📄 Response: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_message_shortening():
    """Prueba la funcionalidad principal de acortar mensajes"""
    print_separator("ACORTAR MENSAJE")
    try:
        long_message = """
        Este es un mensaje extremadamente largo que contiene mucha información 
        innecesaria y debería ser acortado para que sea más conciso y fácil de leer. 
        El objetivo es mantener solo la información esencial y eliminar todo el 
        contenido redundante o irrelevante que no aporta valor al mensaje principal.
        """
        
        data = {
            "message": long_message.strip(),
            "user_id": "usuario_prueba_script"
        }
        response = requests.post(f"{BASE_URL}/chat", headers=HEADERS, json=data)
        print(f"✅ Status Code: {response.status_code}")
        print(f"📄 Response: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_error_handling():
    """Prueba el manejo de errores con datos inválidos"""
    print_separator("MANEJO DE ERRORES")
    try:
        # Prueba con datos faltantes
        data = {"user_id": "usuario_prueba_script"}  # Falta 'message'
        response = requests.post(f"{BASE_URL}/chat", headers=HEADERS, json=data)
        print(f"📝 Prueba con datos faltantes:")
        print(f"   Status Code: {response.status_code}")
        print(f"   Response: {response.text}")
        
        # Prueba con JSON malformado
        response = requests.post(f"{BASE_URL}/chat", headers=HEADERS, data="invalid json")
        print(f"\n📝 Prueba con JSON malformado:")
        print(f"   Status Code: {response.status_code}")
        print(f"   Response: {response.text}")
        
        return True
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def main():
    """Función principal que ejecuta todas las pruebas"""
    print("🚀 INICIANDO PRUEBAS DEL SERVICIO ADK SHORT BOT")
    print(f"🌐 URL del servicio: {BASE_URL}")
    
    results = []
    
    # Ejecutar todas las pruebas
    results.append(("Health Check", test_health_check()))
    
    session_id = test_create_session()
    results.append(("Crear Sesión", session_id is not None))
    
    results.append(("Chat sin Sesión", test_chat_without_session()))
    
    if session_id:
        results.append(("Chat con Sesión", test_chat_with_session(session_id)))
    
    results.append(("Acortar Mensaje", test_message_shortening()))
    results.append(("Manejo de Errores", test_error_handling()))
    
    # Resumen de resultados
    print_separator("RESUMEN DE PRUEBAS")
    passed = 0
    total = len(results)
    
    for test_name, success in results:
        status = "✅ PASÓ" if success else "❌ FALLÓ"
        print(f"{status} - {test_name}")
        if success:
            passed += 1
    
    print(f"\n📊 Resultados: {passed}/{total} pruebas pasaron")
    
    if passed == total:
        print("🎉 ¡Todas las pruebas pasaron exitosamente!")
    else:
        print("⚠️  Algunas pruebas fallaron. Revisa los logs arriba.")

if __name__ == "__main__":
    main() 