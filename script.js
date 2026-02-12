import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, onChildAdded, remove } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// 1. CONFIGURACIÓN (Tus llaves de Firebase)
const firebaseConfig = {
    apiKey: "AIzaSyD7n-tMYYBTihfQz09itP3zKTclVf1sYyI",
    authDomain: "islasobrevivientes.firebaseapp.com",
    databaseURL: "https://islasobrevivientes-default-rtdb.firebaseio.com",
    projectId: "islasobrevivientes",
    storageBucket: "islasobrevivientes.firebasestorage.app",
    messagingSenderId: "56763727889",
    appId: "1:56763727889:web:89b84f77cf6bbb6e59b1b0",
    measurementId: "G-NGKSRJ46TV"
};

// 2. INICIALIZACIÓN
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const chatRef = ref(db, 'mensajes_v3');

// 3. VARIABLES DE ESTADO
let miNombre = localStorage.getItem('chat_user') || prompt("¿Cuál es tu apodo?");
if (miNombre) localStorage.setItem('chat_user', miNombre);

const container = document.getElementById('msg-container');
const input = document.getElementById('msg-input');
const menuPlus = document.getElementById('menu-plus');

// 4. LÓGICA DEL CHAT
window.app = {
    // Enviar mensaje de texto
    send() {
        if (!input.value.trim()) return;
        push(chatRef, {
            user: miNombre,
            text: input.value,
            type: 'text',
            time: Date.now()
        });
        input.value = "";
        this.toggleMenu(false);
    },

    // Enviar Imágenes (Vía URL para no saturar)
    sendImg() {
        const url = prompt("Pega el link de la imagen:");
        if (url) {
            push(chatRef, { user: miNombre, text: url, type: 'img', time: Date.now() });
            this.toggleMenu(false);
        }
    },

    // Control del Menú "+"
    toggleMenu(force) {
        if (force === false) menuPlus.classList.remove('active');
        else menuPlus.classList.toggle('active');
    },

    // Función de Llamada (Simulada)
    call() {
        alert("📞 Iniciando llamada cifrada con tu sobreviviente...");
    },

    // Buscar en el chat (Filtro rápido)
    showSearch() {
        const term = prompt("¿Qué palabra buscas?");
        if (!term) return;
        const msgs = document.querySelectorAll('.msg');
        msgs.forEach(m => {
            if (!m.innerText.toLowerCase().includes(term.toLowerCase())) {
                m.style.opacity = "0.2";
            } else {
                m.style.border = "2px solid gold";
                m.scrollIntoView();
            }
        });
        setTimeout(() => {
            msgs.forEach(m => { m.style.opacity = "1"; m.style.border = "none"; });
        }, 5000);
    },

    // Lógica de Dibujo (Simplificada para el JS)
    openDraw() {
        alert("🎨 Función de dibujo activándose... ¡Dibuja en el lienzo!");
        // Aquí podrías disparar el canvas que hicimos antes
    },

    sendAudio() {
        alert("🎙️ Grabando audio... (Requiere permisos de micrófono)");
    }
};

// 5. ESCUCHAR FIREBASE (Recibir mensajes)
onChildAdded(chatRef, (snap) => {
    const data = snap.val();
    const div = document.createElement('div');
    div.className = `msg ${data.user === miNombre ? 'sent' : 'received'}`;
    
    if (data.type === 'img') {
        div.innerHTML = `<img src="${data.text}" style="border-radius:10px; max-width:100%">`;
    } else {
        div.innerText = data.text;
    }

    container.appendChild(div);
    container.scrollTop = container.scrollHeight; // Auto-scroll abajo
});

// Enviar con la tecla Enter
input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") app.send();
});