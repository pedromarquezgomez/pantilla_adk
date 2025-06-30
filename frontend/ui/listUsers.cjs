// listUsers.js - Script para listar usuarios de Firebase Auth
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

// --- LISTAR USUARIOS ---
async function listUsers() {
  try {
    console.log("🔍 Listando usuarios de Firebase Auth...\n");
    
    const listUsersResult = await admin.auth().listUsers();
    
    if (listUsersResult.users.length === 0) {
      console.log("📭 No hay usuarios registrados");
      return;
    }
    
    console.log(`📊 Total de usuarios: ${listUsersResult.users.length}\n`);
    
    listUsersResult.users.forEach((userRecord, index) => {
      console.log(`👤 Usuario ${index + 1}:`);
      console.log(`   UID: ${userRecord.uid}`);
      console.log(`   Email: ${userRecord.email || 'No especificado'}`);
      console.log(`   Nombre: ${userRecord.displayName || 'No especificado'}`);
      console.log(`   Creado: ${userRecord.metadata.creationTime}`);
      console.log(`   Último login: ${userRecord.metadata.lastSignInTime || 'Nunca'}`);
      
      if (userRecord.customClaims) {
        console.log(`   Claims personalizados:`, userRecord.customClaims);
      } else {
        console.log(`   Claims personalizados: Ninguno`);
      }
      
      console.log(""); // Línea en blanco
    });
    
  } catch (error) {
    console.error("❌ Error al listar usuarios:", error);
    process.exit(1);
  }
}

// Ejecutar
listUsers().then(() => {
  console.log("✅ Listado completado");
  process.exit(0);
}).catch((error) => {
  console.error("❌ Error:", error);
  process.exit(1);
}); 