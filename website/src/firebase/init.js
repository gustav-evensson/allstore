// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCgXsJYmJxNjwwPkmIIL2eoX8b3eYY6xQE",
  authDomain: "all-store-dae9a.firebaseapp.com",
  projectId: "all-store-dae9a",
  storageBucket: "all-store-dae9a.appspot.com",
  messagingSenderId: "221971286224",
  appId: "1:221971286224:web:f6338434357d9163aaf6d5",
  measurementId: "G-RV1EMPRWGN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);