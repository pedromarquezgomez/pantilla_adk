import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import RestaurantView from '../views/RestaurantView.vue';
import AdminLoginView from '../views/AdminLoginView.vue';
import AdminDashboardView from '../views/AdminDashboardView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // --- Rutas para Clientes ---
    {
      path: '/r/:slug',
      name: 'restaurant-chat',
      component: RestaurantView,
    },
    // --- Rutas para Administradores ---
    {
      path: '/admin/login',
      name: 'admin-login',
      component: AdminLoginView,
    },
    {
      path: '/admin/dashboard',
      name: 'admin-dashboard',
      component: AdminDashboardView,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    // Redirección por defecto
    {
      path: '/',
      redirect: '/r/restaurante-demo',
    },
  ],
});

// --- GUARDIA DE NAVEGACIÓN SIMPLIFICADA ---
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const requiresAuth = to.meta.requiresAuth;
  const requiresAdmin = to.meta.requiresAdmin;

  // Si la ruta requiere ser admin y el usuario no lo es, redirige a login
  if (requiresAdmin && !authStore.isAdmin) {
    next({ name: 'admin-login' });
  } else {
    // En cualquier otro caso, permite el acceso
    next();
  }
});

export default router; 