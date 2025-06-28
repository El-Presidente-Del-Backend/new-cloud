import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import { getDatabase } from "firebase/database";

// Usar variables de entorno o valores directos si no están disponibles
const firebaseConfig = {
  apiKey: "AIzaSyCi02vPJKYyfIUAyupjcQ1gMQRViBut5Xg",
  authDomain: "cloud-d543e.firebaseapp.com",
  databaseURL: "https://cloud-d543e-default-rtdb.firebaseio.com",
  projectId: "cloud-d543e",
  storageBucket: "cloud-d543e.firebasestorage.app",
  messagingSenderId: "183269573739",
  appId: "1:183269573739:web:27b0dd42e69928331add2e"
};

// Tipos de permisos para compartir archivos
export const PERMISSION_TYPES = {
  VIEW: "view",
  EDIT: "edit"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Configurar autenticación
export const auth = getAuth(app);

// Configurar persistencia de sesión (LOCAL)
setPersistence(auth, browserLocalPersistence)
  .catch((error) => {
    console.error("Error al configurar persistencia de autenticación:", error);
  });

// Exportar otros servicios
export const storage = getStorage(app);
export const db = getFirestore(app);
export const database = getDatabase(app);

// Configurar persistencia para Firestore
try {
  enableIndexedDbPersistence(db)
    .catch((err) => {
      if (err.code === 'failed-precondition') {
        console.log('La persistencia falló porque hay múltiples pestañas abiertas');
      } else if (err.code === 'unimplemented') {
        console.log('El navegador actual no soporta todas las características necesarias');
      }
    });
} catch (error) {
  console.error("Error al configurar persistencia:", error);
}

export default app;