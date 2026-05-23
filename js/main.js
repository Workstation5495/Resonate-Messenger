import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { firebaseConfig } from './firebase-config.js';

// Инициализация Firebase
const app = initializeApp(firebaseConfig);
console.log("Resonate Hub!");

// Слушаем кнопку
document.getElementById('loginBtn').addEventListener('click', () => {
    alert("Login system coming soon!");
});
