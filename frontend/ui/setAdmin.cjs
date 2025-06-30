// setAdmin.js
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// --- CONFIGURACIÓN ---
// Pega aquí el UID del usuario que creaste en la consola.
const uidToMakeAdmin = "Si0UHGnuyiW1sIAjq0t1nLwSOjB3";
// El slug del restaurante que este usuario administrará.
const restaurantSlugToAssign = "Restaurante demostracion";

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
    process.exit(1);
});