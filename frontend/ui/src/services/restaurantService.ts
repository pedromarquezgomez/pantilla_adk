import { db } from '@/firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy,
  Timestamp,
  DocumentData 
} from 'firebase/firestore';

export interface MenuItem {
  id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
  allergens?: string[];
  imageUrl?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface RestaurantConfig {
  id?: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  openingHours: {
    [key: string]: {
      open: string;
      close: string;
    };
  };
  theme: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
  };
  features: {
    chatEnabled: boolean;
    reservationsEnabled: boolean;
    deliveryEnabled: boolean;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ChatMessage {
  id?: string;
  userId: string;
  userName: string;
  message: string;
  response: string;
  metadata?: {
    confidence?: number;
    wine_type?: string;
    dish?: string;
    alternatives?: number;
  };
  createdAt: Timestamp;
}

// --- SERVICIOS DE CONFIGURACIÓN ---
export const getRestaurantConfig = async (restaurantSlug: string): Promise<RestaurantConfig | null> => {
  try {
    const configRef = doc(db, `restaurants/${restaurantSlug}/config/general`);
    const configDoc = await getDoc(configRef);
    
    if (configDoc.exists()) {
      return { id: configDoc.id, ...configDoc.data() } as RestaurantConfig;
    }
    return null;
  } catch (error) {
    console.error('Error al obtener configuración del restaurante:', error);
    throw error;
  }
};

export const updateRestaurantConfig = async (
  restaurantSlug: string, 
  config: Partial<RestaurantConfig>
): Promise<void> => {
  try {
    const configRef = doc(db, `restaurants/${restaurantSlug}/config/general`);
    await updateDoc(configRef, {
      ...config,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error al actualizar configuración del restaurante:', error);
    throw error;
  }
};

// --- SERVICIOS DE MENÚ ---
export const getMenuItems = async (restaurantSlug: string): Promise<MenuItem[]> => {
  try {
    const menuRef = collection(db, `restaurants/${restaurantSlug}/menu_items`);
    const menuQuery = query(menuRef, orderBy('category'), orderBy('name'));
    const menuSnapshot = await getDocs(menuQuery);
    
    return menuSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as MenuItem[];
  } catch (error) {
    console.error('Error al obtener menú:', error);
    throw error;
  }
};

export const getMenuItemsByCategory = async (
  restaurantSlug: string, 
  category: string
): Promise<MenuItem[]> => {
  try {
    const menuRef = collection(db, `restaurants/${restaurantSlug}/menu_items`);
    const menuQuery = query(
      menuRef, 
      where('category', '==', category),
      where('available', '==', true),
      orderBy('name')
    );
    const menuSnapshot = await getDocs(menuQuery);
    
    return menuSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as MenuItem[];
  } catch (error) {
    console.error('Error al obtener menú por categoría:', error);
    throw error;
  }
};

export const addMenuItem = async (
  restaurantSlug: string, 
  menuItem: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  try {
    const menuRef = collection(db, `restaurants/${restaurantSlug}/menu_items`);
    const newItem = {
      ...menuItem,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    
    const docRef = await setDoc(doc(menuRef), newItem);
    return docRef.id;
  } catch (error) {
    console.error('Error al agregar item del menú:', error);
    throw error;
  }
};

export const updateMenuItem = async (
  restaurantSlug: string, 
  itemId: string, 
  updates: Partial<MenuItem>
): Promise<void> => {
  try {
    const itemRef = doc(db, `restaurants/${restaurantSlug}/menu_items/${itemId}`);
    await updateDoc(itemRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error al actualizar item del menú:', error);
    throw error;
  }
};

// --- SERVICIOS DE CHAT ---
export const saveChatMessage = async (
  restaurantSlug: string,
  chatMessage: Omit<ChatMessage, 'id' | 'createdAt'>
): Promise<string> => {
  try {
    const chatRef = collection(db, `restaurants/${restaurantSlug}/chat_history`);
    const newMessage = {
      ...chatMessage,
      createdAt: Timestamp.now()
    };
    
    const docRef = await setDoc(doc(chatRef), newMessage);
    return docRef.id;
  } catch (error) {
    console.error('Error al guardar mensaje de chat:', error);
    throw error;
  }
};

export const getUserChatHistory = async (
  restaurantSlug: string,
  userId: string
): Promise<ChatMessage[]> => {
  try {
    const chatRef = collection(db, `restaurants/${restaurantSlug}/chat_history`);
    const chatQuery = query(
      chatRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const chatSnapshot = await getDocs(chatQuery);
    return chatSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ChatMessage[];
  } catch (error) {
    console.error('Error al obtener historial de chat:', error);
    throw error;
  }
}; 