import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDeQReVt1Fdg-Z7C207ObtW9EHwuFH7D3A",
  authDomain: "ratemypg-5d2c9.firebaseapp.com",
  projectId: "ratemypg-5d2c9",
  storageBucket: "ratemypg-5d2c9.appspot.com",
  messagingSenderId: "538934469139",
  appId: "1:538934469139:web:bcc6ee29809c0ef1e115e6",
  measurementId: "G-JC8WK5D2E6",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const storage = getStorage(app); 
const db = getFirestore(app);
export { db };

