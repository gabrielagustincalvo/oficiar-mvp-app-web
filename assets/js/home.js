// assets/js/home.js
// Lógica exclusiva del home (index.html): grilla de categorías y buscador predictivo.
// Depende de "oficios" y "profesionales", definidos en main.js — por eso main.js
// tiene que cargarse ANTES que este archivo en el <script> del HTML.

const buscadorInput = document.getElementById('buscador');
const sugerenciasBox = document.getElementById('sugerencias');
const contenedorOficios = document.getElementById('contenedor-oficios');

function renderizarCards(lista) {
    contenedorOficios.innerHTML = '';

    if (lista.length === 0) {
        contenedorOficios.innerHTML = `
            <div class="col-12 text-center text-muted py-5 bg-white rounded-4 shadow-sm border mt-4">
                <i class="bi bi-search fs-1 text-secondary mb-3 d-block"></i>
                <h4 class="fw-bold text-dark">No encontramos ese oficio</h4>
                <p class="mb-0">Asegurate de que esté bien escrito o probá con sinónimos.</p>
            </div>`;
        return;
    }

    lista.forEach(oficio => {
        const colDiv = document.createElement('div');
        colDiv.className = 'col-6 col-md-4 col-lg-3 col-xl-2';

        const cardDiv = document.createElement('div');
        cardDiv.className = 'oficio-card shadow-sm text-decoration-none';
        cardDiv.setAttribute('role', 'button');
        cardDiv.setAttribute('tabindex', '0');

        cardDiv.innerHTML = `
            <i class="bi ${oficio.icono} oficio-icon"></i>
            <span class="oficio-title">${oficio.nombre}</span>
        `;

        cardDiv.style.cursor = 'pointer';

        cardDiv.addEventListener('click', () => {
            window.location.href = `pages/lista.html?oficio=${oficio.id}`;
        });

        cardDiv.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                window.location.href = `pages/lista.html?oficio=${oficio.id}`;
            }
        });

        colDiv.appendChild(cardDiv);
        contenedorOficios.appendChild(colDiv);
    });
}

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

window.seleccionarSugerencia = function (nombre) {
    buscadorInput.value = nombre;
    sugerenciasBox.style.display = 'none';
    const resultadoFinal = oficios.filter(o => o.nombre === nombre);
    renderizarCards(resultadoFinal);
};

document.addEventListener('click', (e) => {
    if (!buscadorInput.contains(e.target) && !sugerenciasBox.contains(e.target)) {
        sugerenciasBox.style.display = 'none';
    }
});

document.addEventListener('DOMContentLoaded', () => {
    renderizarCards(oficios);
});