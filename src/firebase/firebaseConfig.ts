// src/firebase/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// ⚠️ Reemplaza estos valores con los que te da Firebase Console
const firebaseConfig = {
    apiKey: "AIzaSyDKqoezlCq87PalUosEowGA4QkSiq9lwD0",
    authDomain: "proyectoingsoftware-a7062.firebaseapp.com",
    projectId: "proyectoingsoftware-a7062",
    storageBucket: "proyectoingsoftware-a7062.firebasestorage.app",
    messagingSenderId: "311000359690",
    appId: "1:311000359690:web:699004d404bcdf541ed0f3",
};

// Inicializa Firebase una sola vez
const app = initializeApp(firebaseConfig);

// Exporta el objeto auth que se usará para hacer login
const auth = getAuth(app);

export { auth };
