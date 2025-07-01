import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithRedirect,
  signInWithEmailAndPassword,
  onAuthStateChanged, 
  signOut as firebaseSignOut, 
  User,
  AuthError,
  browserPopupRedirectResolver
} from 'firebase/auth';
import { auth } from '@/firebase';

export class AuthService {
  private static instance: AuthService;
  private googleProvider: GoogleAuthProvider;

  private constructor() {
    this.googleProvider = new GoogleAuthProvider();
    this.googleProvider.setCustomParameters({
      prompt: 'select_account'
    });
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Inicia sesión con Google (para clientes)
   */
  async signInWithGoogle(): Promise<User> {
    try {
      // Intentar primero con popup
      const result = await signInWithPopup(auth, this.googleProvider);
      console.log('Login exitoso con popup:', result.user.displayName);
      return result.user;
    } catch (error: any) {
      console.warn('Error con popup, intentando redirect:', error);
      
      // Si el popup falla, intentar con redirect
      if (error.code === 'auth/popup-closed-by-user' || 
          error.code === 'auth/popup-blocked' ||
          error.code === 'auth/cancelled-popup-request') {
        try {
          await signInWithRedirect(auth, this.googleProvider);
          // El redirect manejará la navegación automáticamente
          throw new Error('Redirect iniciado');
        } catch (redirectError) {
          console.error('Error con redirect:', redirectError);
          throw redirectError;
        }
      }
      
      throw error;
    }
  }

  /**
   * Inicia sesión con email y contraseña (para administradores)
   */
  async signInAsAdmin(email: string, password: string): Promise<User> {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log('Login exitoso como administrador:', result.user.email);
      return result.user;
    } catch (error: any) {
      console.error('Error al iniciar sesión como administrador:', error);
      throw error;
    }
  }

  /**
   * Cierra la sesión del usuario actual
   */
  async signOut(): Promise<void> {
    try {
      await firebaseSignOut(auth);
      console.log('Logout exitoso');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    }
  }

  /**
   * Observador que notifica cambios en el estado de autenticación
   */
  onAuthStateChange(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, callback);
  }

  /**
   * Obtiene el usuario actual
   */
  getCurrentUser(): User | null {
    return auth.currentUser;
  }

  /**
   * Verifica si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    return auth.currentUser !== null;
  }

  /**
   * Verifica si el usuario es administrador
   */
  async isAdmin(): Promise<boolean> {
    try {
      const user = auth.currentUser;
      if (!user) return false;
      
      const tokenResult = await user.getIdTokenResult();
      return tokenResult.claims.admin === true;
    } catch (error) {
      console.error('Error al verificar si es administrador:', error);
      return false;
    }
  }
}

// Exportar instancia singleton
export const authService = AuthService.getInstance();

// Exportar funciones individuales para compatibilidad
export const signInWithGoogle = () => authService.signInWithGoogle();
export const signInAsAdmin = (email: string, password: string) => authService.signInAsAdmin(email, password);
export const signOutUser = () => authService.signOut();
export const onAuthStateChange = (callback: (user: User | null) => void) => authService.onAuthStateChange(callback); 