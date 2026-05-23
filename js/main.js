import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { firebaseConfig } from './firebase-config.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

document.getElementById('login-btn').addEventListener('click', async () => {
    try {
        await signInWithPopup(auth, provider);
        document.getElementById('auth-box').style.display = 'none';
        document.getElementById('content').style.display = 'block';
        console.log("Logged in!");
    } catch (e) { alert("Error: " + e.message); }
});
