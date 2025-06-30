// deployFirestore.js - Script para desplegar reglas e índices de Firestore
const { execSync } = require('child_process');

console.log('🔥 Desplegando reglas e índices de Firestore...\n');

try {
  // Desplegar reglas de Firestore
  console.log('📋 Desplegando reglas de seguridad...');
  execSync('firebase deploy --only firestore:rules', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
  
  console.log('\n✅ Reglas de Firestore desplegadas correctamente');
  
  // Desplegar índices de Firestore
  console.log('\n📊 Desplegando índices...');
  execSync('firebase deploy --only firestore:indexes', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
  
  console.log('\n✅ Índices de Firestore desplegados correctamente');
  
  console.log('\n🎉 ¡Despliegue de Firestore completado!');
  console.log('\n📋 Reglas implementadas:');
  console.log('   - Lectura pública de configuración y menú');
  console.log('   - Escritura solo para administradores del restaurante');
  console.log('   - Chat privado por usuario');
  console.log('   - Índices optimizados para consultas');
  
} catch (error) {
  console.error('\n❌ Error durante el despliegue:', error.message);
  console.log('\n💡 Verifica que:');
  console.log('   - Estés logueado en Firebase (firebase login)');
  console.log('   - Tengas permisos de administrador en el proyecto');
  console.log('   - Los archivos firestore.rules y firestore.indexes.json existan');
  process.exit(1);
} 