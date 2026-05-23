import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Твой конфиг (просто вставь его сюда)
const firebaseConfig = {
    apiKey: "ТВОЙ_КЛЮЧ_ВСТАВЬ_СЮДА", 
    authDomain: "resonatemessenger.firebaseapp.com",
    projectId: "resonatemessenger",
    storageBucket: "resonatemessenger.firebasestorage.app",
    messagingSenderId: "669195536581",
    appId: "1:669195536581:web:8f29438fefa9170b0948ac"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Кнопка входа
const loginBtn = document.getElementById('login-btn');
if (loginBtn) {
    loginBtn.addEventListener('click', () => {
        signInWithPopup(auth, provider).catch((error) => console.log(error));
    });
}

// Проверка: вошел пользователь или нет
onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById('auth-box').style.display = 'none';
        document.getElementById('content').style.display = 'block';
        console.log("Welcome, " + user.displayName);
    } else {
        document.getElementById('auth-box').style.display = 'block';
        document.getElementById('content').style.display = 'none';
    }
});
