// ... (Toda la parte de importación e inicialización de Firebase igual que antes)

window.app = {
    // Abrir cualquier modal (Dibujo, Fotos, etc.)
    openModal(id) {
        document.getElementById(`modal-${id}`).classList.add('active');
        if(id === 'draw') this.initCanvas();
        this.toggleMenu(); // Cerrar el menú + al abrir una opción
    },

    // Cerrar cualquier modal
    closeModal(id) {
        document.getElementById(`modal-${id}`).classList.remove('active');
    },

    toggleMenu() {
        document.getElementById('menu-plus').classList.toggle('active');
    },

    initCanvas() {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight * 0.7;
        
        let drawing = false;
        canvas.ontouchstart = () => { drawing = true; ctx.beginPath(); };
        canvas.ontouchend = () => drawing = false;
        canvas.ontouchmove = (e) => {
            if(!drawing) return;
            const t = e.touches[0];
            ctx.lineTo(t.clientX, t.clientY - 100); // Ajuste por cabecera
            ctx.stroke();
        };
    },

    saveDraw() {
        const dataUrl = document.getElementById('canvas').toDataURL();
        this.send('img', dataUrl);
        this.closeModal('draw');
    }
    // ... (resto de funciones de send e inicialización de mensajes)
};