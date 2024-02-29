import { initializeApp } from "firebase/app";
import { getStorage } from "@firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCvHkLpixbJGIW-g9tEB8yY6cepPILaFx0",
    authDomain: "artworks-sharing-platform.firebaseapp.com",
    projectId: "artworks-sharing-platform",
    storageBucket: "artworks-sharing-platform.appspot.com",
    messagingSenderId: "105077692009",
    appId: "1:105077692009:web:251453774881b9d1f0f4f8",
    measurementId: "G-066MPCSHGE"
  };

  export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const auth = getAuth(app);