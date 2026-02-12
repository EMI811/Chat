import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, onChildAdded } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

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

const appData = initializeApp(firebaseConfig);
const db = getDatabase(appData);
const chatRef = ref(db, 'chat_final_ultra');

const miUser = localStorage.getItem('user') || prompt("Dime tu nombre:");
localStorage.setItem('user', miUser);

// Variables de Dibujo
const canvas = document.getElementById('drawing-canvas');
const ctx = canvas.getContext('2d');
let drawing = false;



window.app = {
    // 📩 ENVIAR MENSAJE
    sendText(type = 'text', content = null) {
        const input = document.getElementById('msg-input');
        const text = content || input.value;
        if (!text) return;

        push(chatRef, {
            user: miUser,
            content: text,
            type: type,
            timestamp: Date.now()
        });
        input.value = "";
    },

    // 📷 CÁMARA REAL
    async openCamera() {
        document.getElementById('camera-view').classList.remove('hidden');
        const video = document.getElementById('video-stream');
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
            video.srcObject = stream;
        } catch (e) { alert("Cámara no disponible"); }
    },

    takePhoto() {
        const video = document.getElementById('video-stream');
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = video.videoWidth;
        tempCanvas.height = video.videoHeight;
        tempCanvas.getContext('2d').drawImage(video, 0, 0);
        this.sendText('img', tempCanvas.toDataURL('image/webp'));
        this.closeCamera();
    },

    closeCamera() {
        const video = document.getElementById('video-stream');
        if (video.srcObject) video.srcObject.getTracks().forEach(t => t.stop());
        document.getElementById('camera-view').classList.add('hidden');
    },

    // 🎨 DIBUJO REAL
    openTool(tool) {
        this.toggleMenu();
        if(tool === 'draw') {
            document.getElementById('draw-view').classList.remove('hidden');
            this.initCanvas();
        }
        if(tool === 'search') {
            const s = prompt("¿Qué palabra buscas?");
            if(s) this.searchChat(s);
        }
    },

    initCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight - 150;
        ctx.strokeStyle = "white";
        ctx.lineWidth = 5;
        ctx.lineCap = "round";

        canvas.ontouchstart = (e) => { drawing = true; ctx.beginPath(); };
        canvas.ontouchend = () => drawing = false;
        canvas.ontouchmove = (e) => {
            if (!drawing) return;
            const t = e.touches[0];
            ctx.lineTo(t.clientX, t.clientY - 120);
            ctx.stroke();
        };
    },

    setColor(c) { ctx.strokeStyle = c; },

    sendDraw() {
        this.sendText('img', canvas.toDataURL());
        document.getElementById('draw-view').classList.add('hidden');
    },

    closeTool(id) { document.getElementById(`${id}-view`).classList.add('hidden'); },

    // ➕ MENÚ
    toggleMenu() { document.getElementById('menu-overlay').classList.toggle('active'); },

    makeCall() { alert("📞 Llamando a tu sobreviviente..."); },

    searchChat(term) {
        const bubbles = document.querySelectorAll('.bubble');
        bubbles.forEach(b => {
            b.style.opacity = b.innerText.toLowerCase().includes(term.toLowerCase()) ? "1" : "0.2";
        });
        setTimeout(() => bubbles.forEach(b => b.style.opacity = "1"), 5000);
    }
};

// 📥 RECIBIR MENSAJES
onChildAdded(chatRef, (snap) => {
    const data = snap.val();
    const container = document.getElementById('chat-container');
    const div = document.createElement('div');
    div.className = `bubble ${data.user === miUser ? 'sent' : 'received'}`;
    
    if (data.type === 'img') {
        div.innerHTML = `<img src="${data.content}" style="width:100%; border-radius:12px;">`;
    } else {
        div.innerText = data.content;
    }
    
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
});