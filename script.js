import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, onValue, set } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// 1. CONFIGURACIÓN DE TU ISLA
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

// 2. INICIALIZAR MOTORES
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const statsRef = ref(db, 'trailer_stats/views');
const reactionsRef = ref(db, 'trailer_reactions');

// --- LÓGICA DE VIDEO POR SCROLL ---
const canvas = document.getElementById("video-canvas");
const context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const frameCount = 150; // Más frames = más suavidad

function updateCanvas(index) {
    const scrollFraction = index / frameCount;
    
    // Dibujamos el fondo dinámico (Estilo Atardecer de Rockstar)
    const r = Math.floor(43 + (scrollFraction * 212)); // De morado a naranja
    const g = Math.floor(0 + (scrollFraction * 169));
    const b = Math.floor(87 - (scrollFraction * 87));
    
    context.fillStyle = `rgb(${r}, ${g}, ${b})`;
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Efecto de "Ruido Cinematográfico"
    for (let i = 0; i < 50; i++) {
        context.fillStyle = `rgba(255,255,255,${Math.random() * 0.05})`;
        context.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 2, 2);
    }
}

// Escuchar el Scroll
window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const scrollFraction = scrollTop / maxScroll;
    const frameIndex = Math.min(frameCount - 1, Math.floor(scrollFraction * frameCount));
    
    requestAnimationFrame(() => updateCanvas(frameIndex));
});

// --- LÓGICA DE FIREBASE ---

// Contador de visitas en tiempo real
onValue(statsRef, (snapshot) => {
    const views = snapshot.val() || 0;
    // Si quieres mostrar las visitas en el HTML:
    // document.getElementById('view-count').innerText = views + " VISTAS";
});

// Registrar una nueva visita al cargar
const registrarVisita = () => {
    onValue(statsRef, (snapshot) => {
        const currentViews = snapshot.val() || 0;
        set(statsRef, currentViews + 1);
    }, { onlyOnce: true });
};

// Función para que tu novia deje una reacción (ej. un corazón al final del scroll)
window.enviarReaccion = (emoji) => {
    push(reactionsRef, {
        reaccion: emoji,
        fecha: new Date().toISOString(),
        user: "Sobreviviente"
    }).then(() => alert("¡Reacción enviada a la base de Rockstar! 🚀"));
};

// --- INICIO ---
window.addEventListener('load', () => {
    registrarVisita();
    updateCanvas(0);
    
    // Quitar Loader
    setTimeout(() => {
        document.getElementById('loader').style.opacity = '0';
        setTimeout(() => document.getElementById('loader').style.display = 'none', 1000);
    }, 2500);
});