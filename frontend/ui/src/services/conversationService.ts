import { db } from '@/firebase';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  Timestamp,
  DocumentData 
} from 'firebase/firestore';

export interface Conversation {
  id?: string;
  userId: string;
  query: string;
  response: string;
  metadata?: {
    confidence?: number;
    dish?: string;
    wine_type?: string;
    alternatives?: number;
  };
  timestamp: Date;
}

// --- SERVICIO LEGACY (mantener compatibilidad) ---
export const saveConversation = async (conversation: Omit<Conversation, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, 'conversations'), {
      ...conversation,
      timestamp: Timestamp.fromDate(conversation.timestamp)
    });
    return docRef.id;
  } catch (error) {
    console.error('Error al guardar la conversación:', error);
    throw error;
  }
};

export const getUserConversations = async (userId: string): Promise<Conversation[]> => {
  try {
    const q = query(
      collection(db, 'conversations'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp.toDate()
    })) as Conversation[];
  } catch (error) {
    console.error('Error al obtener las conversaciones:', error);
    throw error;
  }
};

// --- SERVICIO NUEVO (usar esta estructura) ---
export const saveConversationToRestaurant = async (
  restaurantSlug: string,
  conversation: Omit<Conversation, 'id'>
) => {
  try {
    const docRef = await addDoc(collection(db, `restaurants/${restaurantSlug}/chat_history`), {
      userId: conversation.userId,
      userName: 'Usuario', // Se puede mejorar obteniendo el nombre del usuario
      message: conversation.query,
      response: conversation.response,
      metadata: conversation.metadata,
      createdAt: Timestamp.fromDate(conversation.timestamp)
    });
    return docRef.id;
  } catch (error) {
    console.error('Error al guardar la conversación en el restaurante:', error);
    throw error;
  }
};

export const getUserConversationsFromRestaurant = async (
  restaurantSlug: string,
  userId: string
): Promise<Conversation[]> => {
  try {
    const q = query(
      collection(db, `restaurants/${restaurantSlug}/chat_history`),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        query: data.message,
        response: data.response,
        metadata: data.metadata,
        timestamp: data.createdAt.toDate()
      };
    }) as Conversation[];
  } catch (error) {
    console.error('Error al obtener las conversaciones del restaurante:', error);
    throw error;
  }
}; 