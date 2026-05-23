// Импорт библиотек Firebase (Используем версию 10.7.1)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Подключаем ТВОИ ключи (файл должен существовать!)
import { firebaseConfig } from './firebase-config.js';

// Инициализация
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// Ссылки на элементы интерфейса
const authScreen = document.getElementById('auth-screen');
const appScreen = document.getElementById('app-screen');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const publishBtn = document.getElementById('publish-btn');
const postInput = document.getElementById('post-input');
const postsFeed = document.getElementById('posts-feed');

// --- 1. АВТОРИЗАЦИЯ ---

// Кнопка Входа
loginBtn.addEventListener('click', async () => {
    try {
        await signInWithPopup(auth, provider);
    } catch (error) {
        console.error("Login failed:", error);
        alert("Login error: " + error.message);
    }
});

// Кнопка Выхода
logoutBtn.addEventListener('click', () => {
    signOut(auth);
});

// Слушатель состояния пользователя (Живая проверка)
onAuthStateChanged(auth, (user) => {
    if (user) {
        // Пользователь вошел -> показываем интерфейс
        authScreen.style.display = 'none';
        appScreen.style.display = 'block';
        
        // Заполняем профиль
        document.getElementById('user-name').innerText = user.displayName;
        document.getElementById('user-avatar').src = user.photoURL || 'https://via.placeholder.com/100';
        
        // Загружаем посты
        loadPosts();
    } else {
        // Пользователь вышел -> показываем окно входа
        authScreen.style.display = 'flex';
        appScreen.style.display = 'none';
    }
});


// --- 2. РАБОТА С БАЗОЙ ДАННЫХ (ФОРУМ/ЛЕНТА) ---

// Публикация поста
publishBtn.addEventListener('click', async () => {
    const text = postInput.value.trim();
    if (text === "") return; // Не отправляем пустые посты

    const user = auth.currentUser;
    if (!user) return;

    publishBtn.innerText = "Publishing..."; // Визуальный отклик

    try {
        // Добавляем документ в коллекцию "posts"
        await addDoc(collection(db, "posts"), {
            text: text,
            authorName: user.displayName,
            authorPic: user.photoURL || 'https://via.placeholder.com/40',
            createdAt: serverTimestamp(),
            uid: user.uid
        });
        postInput.value = ""; // Очищаем поле ввода
    } catch (error) {
        console.error("Error adding document: ", error);
        alert("Failed to publish. Check if Firestore is in Test Mode.");
    } finally {
        publishBtn.innerText = "Publish";
    }
});

// Живая загрузка постов
function loadPosts() {
    // Делаем запрос: коллекция "posts", сортировка по дате (новые сверху)
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    
    // onSnapshot - слушает базу данных в реальном времени
    onSnapshot(q, (snapshot) => {
        postsFeed.innerHTML = ""; // Очищаем ленту перед рендером
        
        snapshot.forEach((doc) => {
            const post = doc.data();
            
            // Если пост только что создан локально, времени еще может не быть
            const timeString = post.createdAt ? post.createdAt.toDate().toLocaleString() : "Just now";
            
            // Создаем HTML структуру поста
            const postElement = document.createElement('div');
            postElement.className = "post";
            postElement.innerHTML = `
                <div class="post-header">
                    <img src="${post.authorPic}" alt="Avatar" class="post-avatar">
                    <div>
                        <h4 class="post-author">${post.authorName}</h4>
                        <p class="post-time">${timeString}</p>
                    </div>
                </div>
                <div class="post-content">
                    ${escapeHTML(post.text)}
                </div>
            `;
            postsFeed.appendChild(postElement);
        });
    });
}

// Вспомогательная функция (чтобы пользователи не могли встроить вредоносный код в пост)
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag])
    );
}
