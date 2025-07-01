<template>
  <div class="admin-login-container">
    <div class="login-card">
      <div class="login-header">
        <img src="/src/assets/sumi.png" alt="Sumy Logo" class="logo" />
        <h1>Panel de Administración</h1>
        <p>Accede a la gestión de tu restaurante</p>
      </div>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">Email de Administrador</label>
          <input 
            type="email" 
            id="email" 
            v-model="email" 
            required
            placeholder="admin@turestaurante.com"
            class="form-input"
          />
        </div>
        
        <div class="form-group">
          <label for="password">Contraseña</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            required
            placeholder="Tu contraseña"
            class="form-input"
          />
        </div>
        
        <button type="submit" :disabled="isLoading" class="login-btn">
          <span v-if="isLoading" class="loading-spinner"></span>
          {{ isLoading ? 'Iniciando sesión...' : 'Acceder' }}
        </button>
        
        <div v-if="errorMsg" class="error-message">
          {{ errorMsg }}
        </div>
      </form>
      
      <div class="login-footer">
        <p>¿No tienes acceso? Contacta con el administrador del sistema.</p>
        <router-link to="/" class="back-link">← Volver al restaurante</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const email = ref('');
const password = ref('');
const errorMsg = ref('');
const isLoading = ref(false);
const router = useRouter();
const authStore = useAuthStore();

const handleLogin = async () => {
  try {
    isLoading.value = true;
    errorMsg.value = '';
    
    await authStore.signInAsAdmin(email.value, password.value);
    
    // Verificar que realmente es admin
    if (!authStore.isAdmin) {
      throw new Error('No tienes permisos de administrador');
    }
    
    router.push({ name: 'admin-dashboard' });
  } catch (error: any) {
    console.error('Error en login de administrador:', error);
    
    if (error.message === 'No tienes permisos de administrador') {
      errorMsg.value = 'No tienes permisos de administrador para este restaurante.';
    } else if (error.code === 'auth/user-not-found') {
      errorMsg.value = 'No existe una cuenta con este email.';
    } else if (error.code === 'auth/wrong-password') {
      errorMsg.value = 'Contraseña incorrecta.';
    } else if (error.code === 'auth/invalid-email') {
      errorMsg.value = 'Email inválido.';
    } else {
      errorMsg.value = 'Error al iniciar sesión. Verifica tus credenciales.';
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.admin-login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #EFE6DD 0%, #F5F5F5 100%);
  padding: 1rem;
}

.login-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 3rem;
  width: 100%;
  max-width: 400px;
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo {
  width: 60px;
  height: 60px;
  margin-bottom: 1rem;
}

.login-header h1 {
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  color: #2B2118;
  margin: 0 0 0.5rem 0;
}

.login-header p {
  color: #666;
  margin: 0;
}

.login-form {
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #2B2118;
}

.form-input {
  width: 100%;
  padding: 1rem;
  border: 2px solid #eee;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #6F1A07;
}

.login-btn {
  width: 100%;
  background: #6F1A07;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.login-btn:hover:not(:disabled) {
  background: #A52A2A;
}

.login-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  background: #fee;
  color: #c33;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
  text-align: center;
  border: 1px solid #fcc;
}

.login-footer {
  text-align: center;
  border-top: 1px solid #eee;
  padding-top: 1.5rem;
}

.login-footer p {
  color: #666;
  margin: 0 0 1rem 0;
  font-size: 0.9rem;
}

.back-link {
  color: #6F1A07;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

.back-link:hover {
  color: #A52A2A;
}

/* Responsive */
@media (max-width: 480px) {
  .login-card {
    padding: 2rem;
  }
  
  .login-header h1 {
    font-size: 1.5rem;
  }
}
</style> 