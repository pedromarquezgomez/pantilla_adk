import { defineStore } from 'pinia';
import { type User } from 'firebase/auth';
import { authService } from '@/services/authService';

// Definimos la estructura del estado
interface AuthState {
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    isAdmin: false,
    isLoading: true, // Empezamos en true hasta que sepamos si hay usuario o no
  }),

  getters: {
    /**
     * Verifica si el usuario está autenticado
     */
    isAuthenticated: (state) => state.user !== null,
    
    /**
     * Obtiene el nombre del usuario
     */
    userName: (state) => state.user?.displayName || state.user?.email || 'Usuario',
    
    /**
     * Obtiene el email del usuario
     */
    userEmail: (state) => state.user?.email || '',
  },

  actions: {
    /**
     * Establece el usuario actual y comprueba si es administrador.
     * @param {User | null} userPayload - El objeto de usuario de Firebase o null.
     */
    async setUser(userPayload: User | null) {
      this.user = userPayload;
      this.isLoading = false;

      if (userPayload) {
        // Obtenemos el token y verificamos los custom claims
        try {
          const tokenResult = await userPayload.getIdTokenResult();
          this.isAdmin = tokenResult.claims.admin === true;
          console.log('Usuario establecido:', {
            name: userPayload.displayName,
            email: userPayload.email,
            isAdmin: this.isAdmin
          });
        } catch (error) {
          console.error('Error al verificar claims del usuario:', error);
          this.isAdmin = false;
        }
      } else {
        this.isAdmin = false;
        console.log('Usuario deslogueado');
      }
    },

    /**
     * Limpia el estado al cerrar sesión.
     */
    clearUser() {
      this.user = null;
      this.isAdmin = false;
      this.isLoading = false;
    },

    /**
     * Inicia sesión con Google
     */
    async signInWithGoogle() {
      try {
        const user = await authService.signInWithGoogle();
        await this.setUser(user);
        return user;
      } catch (error) {
        console.error('Error en signInWithGoogle:', error);
        throw error;
      }
    },

    /**
     * Inicia sesión como administrador
     */
    async signInAsAdmin(email: string, password: string) {
      try {
        const user = await authService.signInAsAdmin(email, password);
        await this.setUser(user);
        return user;
      } catch (error) {
        console.error('Error en signInAsAdmin:', error);
        throw error;
      }
    },

    /**
     * Cierra la sesión
     */
    async signOut() {
      try {
        await authService.signOut();
        this.clearUser();
      } catch (error) {
        console.error('Error en signOut:', error);
        throw error;
      }
    },

    /**
     * Inicializa el store escuchando cambios de autenticación
     */
    init() {
      return authService.onAuthStateChange((user) => {
        this.setUser(user);
      });
    }
  },
}); 