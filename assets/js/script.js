// assets/js/script.js

// 1. Base de datos de oficios
const oficios = [
    { id: 1, nombre: 'Plomería', icono: 'bi-wrench-adjustable' },
    { id: 2, nombre: 'Electricidad', icono: 'bi-lightning-charge-fill' },
    { id: 3, nombre: 'Gasista', icono: 'bi-fire' },
    { id: 4, nombre: 'Albañilería', icono: 'bi-bricks' },
    { id: 5, nombre: 'Carpintería', icono: 'bi-hammer' },
    { id: 6, nombre: 'Pintura', icono: 'bi-brush-fill' },
    { id: 7, nombre: 'Cerrajería', icono: 'bi-key-fill' },
    { id: 8, nombre: 'Jardinería', icono: 'bi-tree-fill' },
    { id: 9, nombre: 'Fletes', icono: 'bi-truck' },
    { id: 10, nombre: 'Limpieza', icono: 'bi-stars' },
    { id: 11, nombre: 'Herrería', icono: 'bi-gear-fill' },
    { id: 12, nombre: 'Climatización', icono: 'bi-snow' }
];

// 2. Generador Automático de Profesionales (60 perfiles)
const profesionales = generarProfesionales();

function generarProfesionales() {
    const nombres = ['Juan', 'Pedro', 'Carlos', 'Miguel', 'Diego', 'Ana', 'Laura', 'María', 'Sofía', 'Lucía', 'Facundo', 'Martín', 'Julieta', 'Camila', 'Gabriel'];
    const apellidos = ['Pérez', 'Gómez', 'López', 'Rodríguez', 'Martínez', 'Fernández', 'García', 'Díaz', 'Romero', 'Álvarez', 'Sosa', 'Ruiz', 'Acosta', 'Giménez', 'Calvo'];
    
    let db = [];
    let idContador = 1;

    oficios.forEach(oficio => {
        // Bucle para crear 5 profesionales por cada oficio
        for(let i = 0; i < 5; i++) {
            const nombreAleatorio = nombres[Math.floor(Math.random() * nombres.length)];
            const apellidoAleatorio = apellidos[Math.floor(Math.random() * apellidos.length)];
            
            // Genera una calificación realista entre 4.0 y 5.0
            const calificacion = (Math.random() * (5 - 4) + 4).toFixed(1); 
            const trabajos = Math.floor(Math.random() * 200) + 15;

            db.push({
                id: idContador++,
                oficioId: oficio.id, // Esto vincula al profesional con su categoría
                oficioNombre: oficio.nombre,
                nombreCompleto: `${nombreAleatorio} ${apellidoAleatorio}`,
                calificacion: calificacion,
                cantidadTrabajos: trabajos,
                // La API de UI-Avatars nos genera fotos de perfil automáticas con colores aleatorios
                fotoUrl: `https://ui-avatars.com/api/?name=${nombreAleatorio}+${apellidoAleatorio}&background=random&color=fff&size=150`,
                descripcion: `Especialista en ${oficio.nombre.toLowerCase()} con amplia experiencia. Atención responsable, garantizada y presupuesto sin cargo.`
            });
        }
    });
    return db;
}

// Podés abrir la consola de tu navegador (F12) para ver los 60 perfiles generados listos para usar
console.log("Base de datos de profesionales generada:", profesionales);

// 3. Selección de elementos del DOM
const buscadorInput = document.getElementById('buscador');
const sugerenciasBox = document.getElementById('sugerencias');
const contenedorOficios = document.getElementById('contenedor-oficios');

// 4. Función de Renderizado Inteligente con Interacción Simulada
function renderizarCards(lista) {
    contenedorOficios.innerHTML = '';
    
    // Estado vacío (Empty State)
    if (lista.length === 0) {
        contenedorOficios.innerHTML = `
            <div class="col-12 text-center text-muted py-5 bg-white rounded-4 shadow-sm border mt-4">
                <i class="bi bi-search fs-1 text-secondary mb-3 d-block"></i>
                <h4 class="fw-bold text-dark">No encontramos ese oficio</h4>
                <p class="mb-0">Asegurate de que esté bien escrito o probá con sinónimos.</p>
            </div>`;
        return;
    }
    
    // Iteración para crear las tarjetas
    lista.forEach(oficio => {
        // A) Creamos la columna responsiva (Bootstrap)
        const colDiv = document.createElement('div');
        colDiv.className = 'col-6 col-md-4 col-lg-3 col-xl-2'; 

        // B) Creamos la Card interna (el elemento clickeable)
        // Modularizamos la creación del elemento para poder agregarle Listeners
        const cardDiv = document.createElement('div');
        cardDiv.className = 'oficio-card shadow-sm text-decoration-none';
        cardDiv.setAttribute('role', 'button');
        cardDiv.setAttribute('tabindex', '0');
        
        // Inyectamos el HTML interno (ícono y título)
        cardDiv.innerHTML = `
            <i class="bi ${oficio.icono} oficio-icon"></i>
            <span class="oficio-title">${oficio.nombre}</span>
        `;

        // -------------------------------------------------------------------
        // ¡LA MAGIA DE LA SIMULACIÓN AQUÍ!
        // -------------------------------------------------------------------
        // Hacemos que TODAS las tarjetas sean clickeables
        cardDiv.style.cursor = 'pointer';
        
        cardDiv.addEventListener('click', () => {
            // Mandamos al usuario a la lista, pasándole el ID del oficio en la URL
            window.location.href = `lista.html?oficio=${oficio.id}`;
        });

        cardDiv.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                window.location.href = `lista.html?oficio=${oficio.id}`;
            }
        });
        // -------------------------------------------------------------------

        // C) Ensamblamos los elementos
        colDiv.appendChild(cardDiv);
        contenedorOficios.appendChild(colDiv);
    });
}

// 5. Lógica predictiva del buscador (Mantenemos la misma lógica eficiente)
buscadorInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    
    if (query.trim() === '') {
        sugerenciasBox.style.display = 'none';
        renderizarCards(oficios); 
        return;
    }

    const resultados = oficios.filter(o => o.nombre.toLowerCase().includes(query));

    if (resultados.length > 0) {
        sugerenciasBox.style.display = 'block';
        sugerenciasBox.innerHTML = resultados.map(o => `
            <li class="list-group-item list-group-item-action d-flex align-items-center" onclick="seleccionarSugerencia('${o.nombre}')" role="button">
                <i class="bi bi-search text-orange me-3 fs-5"></i>
                <span class="fw-bold text-dark fs-5">${o.nombre}</span>
            </li>
        `).join('');
    } else {
        sugerenciasBox.style.display = 'none';
    }
    
    renderizarCards(resultados);
});

// Selección directa desde sugerencias
window.seleccionarSugerencia = function(nombre) {
    buscadorInput.value = nombre;
    sugerenciasBox.style.display = 'none';
    const resultadoFinal = oficios.filter(o => o.nombre === nombre);
    renderizarCards(resultadoFinal);
};

// Cierre de sugerencias al hacer click afuera
document.addEventListener('click', (e) => {
    if (!buscadorInput.contains(e.target) && !sugerenciasBox.contains(e.target)) {
        sugerenciasBox.style.display = 'none';
    }
});

// 6. Inicialización
document.addEventListener('DOMContentLoaded', () => {
    renderizarCards(oficios);
});