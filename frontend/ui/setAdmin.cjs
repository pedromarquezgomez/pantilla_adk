// setAdmin.js - Script para configurar administradores
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

// --- CONFIGURACIÓN ---
// Pega aquí el UID del usuario que creaste en la consola.
const uidToMakeAdmin = process.env.ADMIN_UID || "Si0UHGnuyiW1sIAjq0t1nLwSOjB3";
// El slug del restaurante que este usuario administrará.
const restaurantSlugToAssign = process.env.RESTAURANT_SLUG || "Restaurante demostracion";

console.log(`🔧 Configurando administrador:`);
console.log(`   UID: ${uidToMakeAdmin}`);
console.log(`   Restaurante: ${restaurantSlugToAssign}`);

// --- EJECUCIÓN ---
admin.auth().setCustomUserClaims(uidToMakeAdmin, {
    admin: true,
    restaurant: restaurantSlugToAssign
})
.then(() => {
    console.log(`✅ ¡Éxito! El usuario ${uidToMakeAdmin} ahora es administrador del restaurante ${restaurantSlugToAssign}.`);
    process.exit(0);
})
.catch(error => {
    console.error("❌ Error al establecer el rol de administrador:", error);
    console.log("💡 Verifica que:");
    console.log("   - El UID del usuario sea correcto");
    console.log("   - El usuario exista en Firebase Auth");
    console.log("   - Tengas permisos de administrador en el proyecto");
    process.exit(1);
});