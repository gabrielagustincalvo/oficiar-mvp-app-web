// assets/js/presupuesto.js
// Lógica específica de la página de solicitud de presupuesto (pages/presupuesto.html)
// Depende de "profesionales", definido en main.js — por eso main.js se carga antes.

document.addEventListener('DOMContentLoaded', () => {

    // 1. Mostrar el nombre real del profesional, si llegó un ?id= en la URL
    const urlParams = new URLSearchParams(window.location.search);
    const profesionalId = parseInt(urlParams.get('id'));
    const nombreProfesionalEl = document.getElementById('nombre-profesional');

    if (profesionalId) {
        const profesional = profesionales.find(p => p.id === profesionalId);
        if (profesional && nombreProfesionalEl) {
            nombreProfesionalEl.innerText = profesional.nombreCompleto;
        }
    }
    // Si no hay ?id= todavía (perfil.html no lo envía por ahora), queda el texto
    // genérico "Profesional Seleccionado" que ya trae el HTML.

    // 2. Zona de carga de archivos: click abre el selector de archivos
    const uploadZone = document.getElementById('upload-zone');
    const fileInput = document.getElementById('file-upload');
    uploadZone.addEventListener('click', () => fileInput.click());

    // 3. Envío del formulario (simulado)
    const form = document.getElementById('form-presupuesto');
    const btnText = document.getElementById('btn-text');
    const btnSpinner = document.getElementById('btn-spinner');
    const btnEnviar = document.getElementById('btn-enviar');

    form.addEventListener('submit', function (e) {
        e.preventDefault(); // Evita que la página recargue

        // Simulación de carga (Feedback visual de procesamiento)
        btnText.innerText = 'Procesando...';
        btnSpinner.classList.remove('d-none');
        btnEnviar.disabled = true;

        // Esperamos 1.5 segundos para dar realismo a la demo y luego mostramos el modal
        setTimeout(() => {
            const modal = new bootstrap.Modal(document.getElementById('modalExito'));
            modal.show();

            // Restauramos el botón
            btnText.innerText = 'Enviar Solicitud';
            btnSpinner.classList.add('d-none');
            btnEnviar.disabled = false;
        }, 1500);
    });

    // 4. Botón "Volver al inicio" del modal de éxito
    document.getElementById('btn-volver-inicio').addEventListener('click', () => {
        window.location.href = '../index.html';
    });

    // 5. Pre-cargar la fecha actual en el input de fecha
    document.getElementById('fecha').valueAsDate = new Date();
});