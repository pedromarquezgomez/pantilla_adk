<template>
  <div class="admin-dashboard">
    <!-- Header -->
    <header class="dashboard-header">
      <div class="header-content">
        <div class="header-left">
          <img src="/src/assets/sumi.png" alt="Sumy Logo" class="logo" />
          <h1>Panel de Administración</h1>
        </div>
        
        <div class="header-right">
          <div class="user-info">
            <img :src="authStore.user?.photoURL" :alt="authStore.userName" class="user-avatar" />
            <span class="user-name">{{ authStore.userName }}</span>
            <button @click="handleSignOut" class="logout-btn">Salir</button>
          </div>
        </div>
      </div>
    </header>

    <!-- Navegación -->
    <nav class="dashboard-nav">
      <div class="nav-content">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="['nav-tab', { active: activeTab === tab.id }]"
        >
          {{ tab.label }}
        </button>
      </div>
    </nav>

    <!-- Contenido Principal -->
    <main class="dashboard-content">
      <!-- Estadísticas Generales -->
      <div v-if="activeTab === 'overview'" class="overview-tab">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">🍷</div>
            <div class="stat-content">
              <h3>Conversaciones</h3>
              <p class="stat-number">{{ stats.totalConversations }}</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon">👥</div>
            <div class="stat-content">
              <h3>Usuarios</h3>
              <p class="stat-number">{{ stats.uniqueUsers }}</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon">📅</div>
            <div class="stat-content">
              <h3>Hoy</h3>
              <p class="stat-number">{{ stats.todayConversations }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Conversaciones -->
      <div v-if="activeTab === 'conversations'" class="conversations-tab">
        <h2>Historial de Conversaciones</h2>
        <div class="conversations-list">
          <div v-for="conversation in conversations" :key="conversation.id" class="conversation-item">
            <div class="conversation-header">
              <span>{{ conversation.userName }}</span>
              <span class="conversation-time">{{ formatTime(conversation.timestamp) }}</span>
            </div>
            <div class="conversation-content">
              <p><strong>Pregunta:</strong> {{ conversation.query }}</p>
              <p><strong>Respuesta:</strong> {{ conversation.response }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Configuración -->
      <div v-if="activeTab === 'settings'" class="settings-tab">
        <h2>Configuración del Restaurante</h2>
        
        <form @submit.prevent="saveRestaurantSettings" class="settings-form">
          <div class="form-group">
            <label>Nombre del Restaurante</label>
            <input v-model="restaurantSettings.name" class="form-input" />
          </div>
          
          <div class="form-group">
            <label>Descripción</label>
            <textarea v-model="restaurantSettings.description" class="form-input"></textarea>
          </div>
          
          <button type="submit" class="save-btn">Guardar Cambios</button>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const restaurantSlug = route.params.slug as string;

// Estado
const activeTab = ref('overview');
const conversations = ref([]);
const stats = ref({
  totalConversations: 0,
  uniqueUsers: 0,
  todayConversations: 0
});
const restaurantSettings = ref({
  name: '',
  description: ''
});

// Tabs de navegación
const tabs = [
  { id: 'overview', label: 'Resumen' },
  { id: 'conversations', label: 'Conversaciones' },
  { id: 'settings', label: 'Configuración' }
];

// Métodos
const handleSignOut = async () => {
  await authStore.signOut();
  router.push({ name: 'restaurant', params: { slug: restaurantSlug } });
};

const formatTime = (timestamp) => {
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(timestamp));
};

const saveRestaurantSettings = async () => {
  console.log('Guardando configuración:', restaurantSettings.value);
};

// Lifecycle
onMounted(() => {
  // Cargar datos iniciales
});
</script>

<style scoped>
.admin-dashboard {
  min-height: 100vh;
  background: #f8f9fa;
}

.dashboard-header {
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 1rem 0;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo {
  width: 40px;
  height: 40px;
}

.header-left h1 {
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  color: #2B2118;
  margin: 0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: #F5F5F5;
  padding: 0.5rem 1rem;
  border-radius: 50px;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid #6F1A07;
}

.user-name {
  font-weight: 600;
  color: #2B2118;
}

.logout-btn {
  background: #6F1A07;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s;
}

.logout-btn:hover {
  background: #A52A2A;
}

.dashboard-nav {
  background: white;
  border-bottom: 1px solid #eee;
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  gap: 0;
}

.nav-tab {
  background: none;
  border: none;
  padding: 1rem 2rem;
  cursor: pointer;
  font-weight: 500;
  color: #666;
  border-bottom: 3px solid transparent;
  transition: all 0.3s;
}

.nav-tab:hover {
  color: #6F1A07;
}

.nav-tab.active {
  color: #6F1A07;
  border-bottom-color: #6F1A07;
}

.dashboard-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

/* Overview Tab */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  font-size: 2rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  border-radius: 12px;
}

.stat-content h3 {
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
}

.stat-number {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  color: #2B2118;
}

.conversations-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.conversation-item {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.conversation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.conversation-time {
  font-size: 0.8rem;
  color: #666;
}

.conversation-content p {
  margin: 0.5rem 0;
  line-height: 1.5;
}

/* Settings Tab */
.settings-form {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  max-width: 600px;
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

.save-btn {
  background: #6F1A07;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}

.save-btn:hover {
  background: #A52A2A;
}

/* Responsive */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style> 