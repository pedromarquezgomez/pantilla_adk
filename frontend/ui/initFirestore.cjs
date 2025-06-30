// initFirestore.js - Script para inicializar datos de ejemplo en Firestore
const admin = require("firebase-admin");

// Configuración de Firebase Admin
let serviceAccount;

try {
  // Intentar cargar desde archivo local
  serviceAccount = require("./serviceAccountKey.json");
  console.log("✅ Clave de servicio cargada desde archivo local");
} catch (error) {
  // Si no existe el archivo, intentar usar variables de entorno
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      console.log("✅ Clave de servicio cargada desde variables de entorno");
    } catch (parseError) {
      console.error("❌ Error al parsear FIREBASE_SERVICE_ACCOUNT:", parseError);
      process.exit(1);
    }
  } else {
    console.error("❌ No se encontró serviceAccountKey.json ni FIREBASE_SERVICE_ACCOUNT");
    console.log("📋 Para obtener la clave de servicio:");
    console.log("1. Ve a https://console.firebase.google.com/project/hosteler-ia");
    console.log("2. Configuración del proyecto → Cuentas de servicio");
    console.log("3. Generar nueva clave privada");
    console.log("4. Descarga y renombra a serviceAccountKey.json");
    console.log("5. Colócalo en este directorio");
    process.exit(1);
  }
}

// Inicializar Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// --- DATOS DE EJEMPLO ---
const restaurantSlug = "restaurante-demo";

const restaurantConfig = {
  name: "Restaurante Demostración",
  description: "Un restaurante de ejemplo para probar la aplicación de sumiller IA",
  address: "Calle Ejemplo 123, Madrid",
  phone: "+34 91 123 45 67",
  email: "info@restaurantedemo.com",
  openingHours: {
    monday: { open: "12:00", close: "23:00" },
    tuesday: { open: "12:00", close: "23:00" },
    wednesday: { open: "12:00", close: "23:00" },
    thursday: { open: "12:00", close: "23:00" },
    friday: { open: "12:00", close: "00:00" },
    saturday: { open: "12:00", close: "00:00" },
    sunday: { open: "12:00", close: "22:00" }
  },
  theme: {
    primaryColor: "#6F1A07",
    secondaryColor: "#2B2118",
    fontFamily: "Playfair Display"
  },
  features: {
    chatEnabled: true,
    reservationsEnabled: true,
    deliveryEnabled: false
  },
  createdAt: admin.firestore.Timestamp.now(),
  updatedAt: admin.firestore.Timestamp.now()
};

const menuItems = [
  {
    name: "Rioja Reserva 2018",
    description: "Vino tinto de la Rioja con notas de vainilla y frutos rojos",
    price: 45.00,
    category: "Vinos Tintos",
    available: true,
    allergens: [],
    imageUrl: "https://example.com/rioja.jpg",
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now()
  },
  {
    name: "Albariño Rías Baixas 2022",
    description: "Vino blanco gallego con aromas cítricos y minerales",
    price: 32.00,
    category: "Vinos Blancos",
    available: true,
    allergens: [],
    imageUrl: "https://example.com/albarino.jpg",
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now()
  },
  {
    name: "Cava Brut Nature",
    description: "Cava seco con burbujas finas y notas de manzana verde",
    price: 28.00,
    category: "Cavas y Espumantes",
    available: true,
    allergens: [],
    imageUrl: "https://example.com/cava.jpg",
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now()
  },
  {
    name: "Solomillo de Ternera",
    description: "Solomillo a la parrilla con salsa de vino tinto",
    price: 28.50,
    category: "Carnes",
    available: true,
    allergens: [],
    imageUrl: "https://example.com/solomillo.jpg",
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now()
  },
  {
    name: "Bacalao al Pil Pil",
    description: "Bacalao tradicional con salsa de ajo y aceite de oliva",
    price: 24.00,
    category: "Pescados",
    available: true,
    allergens: ["pescado"],
    imageUrl: "https://example.com/bacalao.jpg",
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now()
  }
];

// --- FUNCIÓN DE INICIALIZACIÓN ---
async function initializeFirestore() {
  try {
    console.log("🔥 Inicializando datos de ejemplo en Firestore...\n");
    
    // 1. Crear configuración del restaurante
    console.log("📋 Creando configuración del restaurante...");
    await db.doc(`restaurants/${restaurantSlug}/config/general`).set(restaurantConfig);
    console.log("✅ Configuración del restaurante creada");
    
    // 2. Crear items del menú
    console.log("\n🍷 Creando items del menú...");
    const menuRef = db.collection(`restaurants/${restaurantSlug}/menu_items`);
    
    for (const item of menuItems) {
      await menuRef.add(item);
      console.log(`   ✅ ${item.name} agregado`);
    }
    
    console.log("\n🎉 ¡Inicialización completada!");
    console.log(`\n📊 Datos creados:`);
    console.log(`   - Restaurante: ${restaurantSlug}`);
    console.log(`   - Configuración: 1 documento`);
    console.log(`   - Items del menú: ${menuItems.length} documentos`);
    console.log(`\n🔗 URL de la aplicación: https://hosteler-ia.web.app`);
    
  } catch (error) {
    console.error("❌ Error durante la inicialización:", error);
    process.exit(1);
  }
}

// Ejecutar inicialización
initializeFirestore().then(() => {
  console.log("\n✅ Proceso completado exitosamente");
  process.exit(0);
}).catch((error) => {
  console.error("❌ Error:", error);
  process.exit(1);
}); 