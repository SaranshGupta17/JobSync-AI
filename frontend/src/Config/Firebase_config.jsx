// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBhQ5EUYZgftFx2cibM0Fqxbiva9HfLBc4",
  authDomain: "fastapiapp-1d398.firebaseapp.com",
  projectId: "fastapiapp-1d398",
  storageBucket: "fastapiapp-1d398.firebasestorage.app",
  messagingSenderId: "150463045253",
  appId: "1:150463045253:web:da9c8dc23e0e0fd09893ec",
  measurementId: "G-3XJTBKYBXJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


const auth = getAuth(app);

export { auth };