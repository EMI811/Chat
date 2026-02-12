import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, onChildAdded } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyD7n-tMYYBTihfQz09itP3zKTclVf1sYyI",
    authDomain: "islasobrevivientes.firebaseapp.com",
    databaseURL: "https://islasobrevivientes-default-rtdb.firebaseio.com",
    projectId: "islasobrevivientes",
    storageBucket: "islasobrevivientes.firebasestorage.app",
    messagingSenderId: "56763727889",
    appId: "1:56763727889:web:89b84f77cf6bbb6e59b1b0"
};

const appData = initializeApp(firebaseConfig);
const db = getDatabase(appData);
const chatRef = ref(db, 'ig_clone_chat');

const miUser = "Yo"; // Puedes cambiarlo por un prompt

window.app = {
    send() {
        const input = document.getElementById('msg-input');
        if (!input.value) return;
        push(chatRef, {
            user: miUser,
            text: input.value,
            time: Date.now()
        });
        input.value = "";
    },

    toggleMenu() {
        document.getElementById('action-menu').classList.toggle('active');
    },

    openTool(name) {
        alert("Abriendo " + name + "... Aquí cargaríamos tu función de dibujo.");
        this.toggleMenu();
    }
};

onChildAdded(chatRef, (snap) => {
    const data = snap.val();
    const container = document.getElementById('msg-container');
    const div = document.createElement('div');
    div.className = `msg ${data.user === miUser ? 'sent' : 'received'}`;
    div.innerText = data.text;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
});