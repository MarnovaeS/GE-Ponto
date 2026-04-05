import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ============================================================
// CONFIGURAÇÃO DO FIREBASE
// ============================================================
// 1. Acesse https://console.firebase.google.com
// 2. Crie um projeto (ou use um existente)
// 3. Vá em "Configurações do projeto" > "Seus aplicativos" > Web (</>)
// 4. Copie os valores e cole no arquivo .env.local na raiz do projeto:
//
//    VITE_FIREBASE_API_KEY=AIzaSy...
//    VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
//    VITE_FIREBASE_PROJECT_ID=seu-projeto
//    VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
//    VITE_FIREBASE_MESSAGING_SENDER_ID=000000000000
//    VITE_FIREBASE_APP_ID=1:000000000000:web:abcdef
//
// IMPORTANTE: Nunca commite o arquivo .env.local no Git!
// O .gitignore já está configurado para ignorá-lo.
// ============================================================

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY            ?? "AIzaSyAs-SUA-API-KEY",
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN        ?? "seu-projeto.firebaseapp.com",
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID         ?? "seu-projeto",
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET     ?? "seu-projeto.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? "000000000000",
  appId:             import.meta.env.VITE_FIREBASE_APP_ID              ?? "1:000000000000:web:abcdef",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db   = getFirestore(app);
