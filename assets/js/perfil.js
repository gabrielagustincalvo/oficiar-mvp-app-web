// assets/js/perfil.js
// Lógica específica de la página de perfil (pages/perfil.html)
// Depende de "profesionales" y "oficios", definidos en main.js.

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const profesionalId = parseInt(urlParams.get('id'));
    const profesional = profesionales.find(p => p.id === profesionalId);

    // Si no llegó ?id= o no corresponde a ningún profesional existente
    if (!profesional) {
        mostrarPerfilNoEncontrado();
        return;
    }

    const oficio = oficios.find(o => o.id === profesional.oficioId);

    // Título de la pestaña del navegador
    document.title = `Perfil - ${profesional.nombreCompleto} | Oficiar`;

    // Avatar
    const avatarImg = document.getElementById('perfil-avatar');
    avatarImg.src = profesional.fotoUrl;
    avatarImg.alt = profesional.nombreCompleto;

    // Nombre
    document.getElementById('perfil-nombre').innerText = profesional.nombreCompleto;

    // Oficio (ícono + nombre)
    const oficioIcono = document.getElementById('perfil-oficio-icono');
    oficioIcono.className = `bi ${oficio ? oficio.icono : 'bi-briefcase-fill'} me-2 text-orange`;
    document.getElementById('perfil-oficio-nombre').innerText = oficio ? oficio.nombre : profesional.oficioNombre;

    // Calificación (estrellas + número + cantidad de trabajos)
    document.getElementById('perfil-estrellas').innerHTML = generarEstrellasHTML(profesional.calificacion);
    document.getElementById('perfil-calificacion').innerText = profesional.calificacion;
    document.getElementById('perfil-trabajos').innerText = `(${profesional.cantidadTrabajos} trabajos)`;

    // Descripción
    document.getElementById('perfil-descripcion').innerText = profesional.descripcion;

    // Botones "Solicitar Presupuesto" (versión desktop y versión mobile):
    // ambos propagan el id del profesional hacia presupuesto.html
    document.querySelectorAll('.btn-solicitar-presupuesto').forEach(btn => {
        btn.addEventListener('click', () => {
            window.location.href = `presupuesto.html?id=${profesional.id}`;
        });
    });
});

// Genera el HTML de las 5 estrellas según la calificación real (ej: "4.3" -> 4 llenas + 1 vacía)
function generarEstrellasHTML(calificacionStr) {
    const calificacion = parseFloat(calificacionStr);
    const llenas = Math.floor(calificacion);
    const tieneMedia = (calificacion - llenas) >= 0.5;
    const vacias = 5 - llenas - (tieneMedia ? 1 : 0);

    let html = '';
    for (let i = 0; i < llenas; i++) html += '<i class="bi bi-star-fill"></i>';
    if (tieneMedia) html += '<i class="bi bi-star-half"></i>';
    for (let i = 0; i < vacias; i++) html += '<i class="bi bi-star"></i>';
    return html;
}

// Estado de error: sin profesional no tiene sentido mostrar el perfil ni el CTA
function mostrarPerfilNoEncontrado() {
    document.title = 'Perfil no encontrado | Oficiar';

    document.querySelector('main').innerHTML = `
        <div class="row justify-content-center">
            <div class="col-12 col-md-6 text-center text-muted py-5 bg-white rounded-4 shadow-sm border">
                <i class="bi bi-person-x fs-1 text-secondary mb-3 d-block"></i>
                <h4 class="fw-bold text-dark">Profesional no encontrado</h4>
                <p class="mb-4">El perfil que buscás no existe o el enlace ya no es válido.</p>
                <a href="../index.html" class="btn cta-btn text-white fw-bold px-4 py-2">Volver al inicio</a>
            </div>
        </div>
    `;

    document.querySelector('.mobile-cta-bar')?.remove();
    document.body.classList.remove('padding-bottom-cta');
}