import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithRedirect,
  onAuthStateChanged, 
  signOut as firebaseSignOut, 
  User,
  AuthError,
  browserPopupRedirectResolver
} from 'firebase/auth';
import { auth } from '../firebase';

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

  async signOut(): Promise<void> {
    try {
      await firebaseSignOut(auth);
      console.log('Logout exitoso');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    }
  }

  onAuthStateChange(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, callback);
  }

  getCurrentUser(): User | null {
    return auth.currentUser;
  }

  isAuthenticated(): boolean {
    return auth.currentUser !== null;
  }
}

// Exportar instancia singleton
export const authService = AuthService.getInstance(); 