// ui/src/main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'

// Importar auth y db centralizados
import { auth, db } from '@/firebase'

// Crear la aplicación Vue
const app = createApp(App)

// Configurar Pinia
const pinia = createPinia()
app.use(pinia)

// Configurar Router
app.use(router)

// Montar la aplicación
app.mount('#app')

// Exportar para uso en otros archivos
export { auth, db }