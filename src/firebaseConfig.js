import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Configuración de tu aplicación de Firebase (reemplaza con tus datos reales)
const firebaseConfig = {
  apiKey: "AIzaSyBtFOIK4tBb9IVbwAwOLDqi2ajsAGFpbBI",
  authDomain: "barrelapp-d9980.firebaseapp.com",
  databaseURL: "https://barrelapp-d9980-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "barrelapp-d9980",
  storageBucket: "barrelapp-d9980.firebasestorage.app",
  messagingSenderId: "352857968671",
  appId: "1:352857968671:web:a8970445d1b3692dd7052a",
  measurementId: "G-1RLZ2FR0EJ"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar la base de datos Firestore y exportarla
export const db = getFirestore(app);