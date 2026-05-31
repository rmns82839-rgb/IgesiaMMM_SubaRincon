// =========================================================================
// CONFIGURACIÓN ESTÁTICA Y DATOS (FÁCIL DE EDITAR)
// =========================================================================

// SEGURIDAD: La contraseña ya NO está aquí en texto plano.
// Para cambiar la clave, genera un nuevo hash SHA-256 en:
//   https://emn178.github.io/online-tools/sha256.html
// y reemplaza el valor de SALES_PASSWORD_HASH abajo.
const SALES_PASSWORD_HASH = "abcd6437a5fbaf1e5dcc475ea5ec8b52aafc1d95274f7bcf10b5888a6cd721e9";

const SALES_URL = "https://ventas-mmm-1.onrender.com";

// --- FUNCIÓN PARA GENERAR EL HASH REAL (se calcula una sola vez al cargar) ---
// INSTRUCCIÓN: Reemplaza SALES_PASSWORD_HASH con el hash real de tu contraseña.
// Puedes obtenerlo ejecutando en la consola del navegador:
//   crypto.subtle.digest('SHA-256', new TextEncoder().encode('TuContraseña'))
//     .then(b => console.log([...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')))

async function hashPassword(text) {
    const msgBuffer = new TextEncoder().encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Enlaces de Interés
const PETICIONES_FORM_URL = "https://forms.gle/s53rJag1vfQ6rL2A6"; 
const WHATSAPP_GROUP_URL = "https://chat.whatsapp.com/J321K321F5"; 
const FACEBOOK_PAGE_URL = "https://www.facebook.com/caballerossubarincon"; 
const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@TU_CANAL"; 
const INSTAGRAM_PAGE_URL = "https://www.instagram.com/TU_INSTAGRAM"; 
const TIKTOK_PAGE_URL = "https://www.tiktok.com/@TU_TIKTOK"; 

// --- FOTOS DE LIDERAZGO ---
const LEADERS_DATA = [
    { name: "Hno. [Nombre Tesorero]", role: "Tesorero del Grupo", text: "Sirviendo con fidelidad y transparencia para que la obra avance.", photoUrl: "tesorero.jpg" },
    { name: "Pastor [Raúl]", role: "Pastor y Guía Espiritual", text: "Guiando a los hombres a ser pilares de fe en sus hogares.", photoUrl: "generaciones.jpg" },
    { name: "Hno. [Nombre Juan]", role: "Coordinador de Evangelismo", text: "Llevando la palabra de salvación a cada rincón de Suba.", photoUrl: "fortaleza.jpeg" }
];

// --- LISTA DE VIDEOS ---
const VIDEOS_DATA = [
    { id: "a0GK42_Foso", title: "Predicación: El Poder de la Oración" },
    { id: "gYFWx89HmdE", title: "Enseñanza: Edificando en la Roca" },
    { id: "Cxs2PKlEclA", title: "Mensaje: Viviendo en Santidad" },
    { id: "m0b9c9NEUKg", title: "Testimonio: Mi Encuentro con Jesús" },
    { id: "QGGU1f0SV9c", title: "Culto de Alabanza: Domingo 27 Octubre" }
];

// --- LISTA DE EVENTOS ---
const EVENTS_DATA = [
    { title: "Jornada de Servicio Comunitario", date: "Sábado, 28 de Septiembre", time: "9:00 AM", location: "Barrio El Rincón", description: "Llevaremos ayuda y la Palabra de Dios a la comunidad.", photoUrl: "jesus_salva.jpg" },
    { title: "Conferencia de Liderazgo Masculino", date: "Viernes, 11 de Octubre", time: "7:00 PM", location: "Templo Central", description: "Enseñanza sobre la Armadura de Dios.", photoUrl: "generaciones.jpg" },
    { title: "Retiro Espiritual de Caballeros", date: "22 al 24 de Noviembre", time: "Todo el día", location: "Finca Villa Esperanza", description: "Tres días de comunión y oración.", photoUrl: "fortaleza.jpeg" }
];

// =========================================================================
// LÓGICA OPERATIVA
// =========================================================================

let currentSlide = 0;

// 1. CARGA DE EVENTOS DINÁMICOS
function loadEvents() {
    const container = document.getElementById('events-container');
    if (!container) return;
    container.innerHTML = EVENTS_DATA.map(event => `
        <div class="flex flex-col md:flex-row bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300 border-l-4 border-accent-blue">
            <img src="${escapeHtml(event.photoUrl)}" alt="${escapeHtml(event.title)}" class="w-full md:w-64 h-48 md:h-auto object-cover">
            <div class="p-6 flex-grow" style="font-family: Arial, sans-serif;">
                <p class="text-xs font-black uppercase tracking-tighter text-accent-blue mb-1">${escapeHtml(event.date)}</p>
                <h3 class="text-xl font-bold text-gray-900 mb-2">${escapeHtml(event.title)}</h3>
                <p class="text-gray-600 text-sm mb-4">${escapeHtml(event.description)}</p>
                <div class="flex items-center text-gray-500 space-x-4 text-xs font-bold">
                    <span class="flex items-center"><i class="fas fa-clock mr-1 text-accent-blue"></i> ${escapeHtml(event.time)}</span>
                    <span class="flex items-center"><i class="fas fa-map-marker-alt mr-1 text-red-500"></i> ${escapeHtml(event.location)}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// 2. LÓGICA DE VIDEOS
function loadVideoList() {
    const listContainer = document.getElementById('video-list');
    if (!listContainer) {
        console.error("No se encontró el contenedor 'video-list'");
        return;
    }
    
    listContainer.innerHTML = VIDEOS_DATA.map(video => `
        <div class="video-list-item flex items-center p-3 cursor-pointer hover:bg-blue-50 transition border-b border-gray-100" 
             data-video-id="${escapeHtml(video.id)}" 
             data-video-title="${escapeHtml(video.title)}">
            <img src="https://img.youtube.com/vi/${escapeHtml(video.id)}/default.jpg" class="w-20 rounded shadow-sm mr-3">
            <p class="text-sm font-bold text-gray-800 leading-tight">${escapeHtml(video.title)}</p>
        </div>
    `).join('');

    const items = listContainer.querySelectorAll('.video-list-item');
    items.forEach(item => {
        item.onclick = function() {
            const id = this.getAttribute('data-video-id');
            const title = this.getAttribute('data-video-title');
            changeMainVideo(id, title);
        };
    });
}

function changeMainVideo(id, title) {
    const iframe = document.getElementById('video-iframe');
    const titleDisplay = document.getElementById('current-video-title');
    if (iframe) iframe.src = `https://www.youtube.com/embed/${encodeURIComponent(id)}?rel=0&autoplay=1`;
    if (titleDisplay) titleDisplay.innerHTML = `<i class="fas fa-play-circle mr-2 text-red-600"></i> ${escapeHtml(title)}`;
}

// 3. CARRUSEL DE LIDERAZGO
function loadCarousel() {
    const slider = document.getElementById('carousel-slider');
    if (!slider) return;
    slider.innerHTML = LEADERS_DATA.map(leader => `
        <div class="carousel-slide flex-shrink-0 w-full p-6 text-center">
            <img src="${escapeHtml(leader.photoUrl)}" 
                 class="w-28 h-28 object-cover rounded-full mx-auto mb-4 border-4 border-accent-blue shadow-md"
                 onerror="this.src='logo.png'">
            <h3 class="text-xl font-bold text-gray-900">${escapeHtml(leader.name)}</h3>
            <p class="text-accent-blue text-sm font-bold mb-3">${escapeHtml(leader.role)}</p>
            <p class="text-gray-600 italic text-sm">"${escapeHtml(leader.text)}"</p>
        </div>
    `).join('');
}

function updateCarousel() {
    const slider = document.getElementById('carousel-slider');
    if (!slider) return;
    const width = slider.clientWidth;
    slider.style.transform = `translateX(-${currentSlide * width}px)`;
}

// 4. SISTEMA DE VENTAS — contraseña verificada con hash SHA-256
function setupSalesModal() {
    const modal = document.getElementById('password-modal');
    const input = document.getElementById('password-input');
    if (!modal || !input) return;

    // Intentos fallidos para bloqueo temporal
    let failedAttempts = 0;
    let blockedUntil = 0;

    window.attemptAccess = async function() {
        const now = Date.now();

        // Verificar si está bloqueado
        if (now < blockedUntil) {
            const segsRestantes = Math.ceil((blockedUntil - now) / 1000);
            alert(`Demasiados intentos fallidos. Espera ${segsRestantes} segundos.`);
            return;
        }

        const enteredHash = await hashPassword(input.value);

        if (enteredHash === SALES_PASSWORD_HASH) {
            failedAttempts = 0;
            window.location.href = SALES_URL;
        } else {
            failedAttempts++;
            input.value = "";

            if (failedAttempts >= 3) {
                blockedUntil = Date.now() + 30000; // Bloquear 30 segundos
                failedAttempts = 0;
                alert("Contraseña incorrecta. Por seguridad, espera 30 segundos antes de intentar de nuevo.");
            } else {
                alert(`Contraseña incorrecta. Intento ${failedAttempts} de 3.`);
            }
        }
    };

    document.querySelectorAll('[id^="open-modal-button"]').forEach(btn => {
        btn.onclick = () => modal.classList.remove('hidden');
    });

    // Cerrar modal con Escape
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') modal.classList.add('hidden');
    });
}

// 5. INICIALIZACIÓN GLOBAL
function inicializarApp() {
    loadEvents();
    loadVideoList();
    loadCarousel();
    setupSalesModal();
    
    if(VIDEOS_DATA.length > 0) changeMainVideo(VIDEOS_DATA[0].id, VIDEOS_DATA[0].title);

    setInterval(() => {
        if (LEADERS_DATA.length > 0) {
            currentSlide = (currentSlide + 1) % LEADERS_DATA.length;
            updateCarousel();
        }
    }, 5000);

    const socialIds = { 
        'peticiones-link-main': PETICIONES_FORM_URL,
        'peticiones-nav-link-mobile': PETICIONES_FORM_URL,
        'whatsapp-link': WHATSAPP_GROUP_URL, 
        'facebook-link': FACEBOOK_PAGE_URL, 
        'youtube-link': YOUTUBE_CHANNEL_URL,
        'instagram-link': INSTAGRAM_PAGE_URL,
        'tiktok-link': TIKTOK_PAGE_URL
    };

    for (let id in socialIds) {
        let el = document.getElementById(id);
        if(el) el.href = socialIds[id];
    }
}

// =========================================================================
// UTILIDADES DE SEGURIDAD
// =========================================================================

// Escapa caracteres HTML para prevenir ataques XSS
function escapeHtml(text) {
    if (typeof text !== 'string') return '';
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarApp);
} else {
    inicializarApp();
}

window.onresize = updateCarousel;
