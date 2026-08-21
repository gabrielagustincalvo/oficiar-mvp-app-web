// assets/js/lista.js
// Lógica específica de la página de resultados (pages/lista.html)
// Depende de "profesionales" y "oficios", definidos en main.js.

document.addEventListener('DOMContentLoaded', () => {
    // 1. Leer el ID del oficio desde la URL (ej: ?oficio=1)
    const urlParams = new URLSearchParams(window.location.search);
    const oficioId = parseInt(urlParams.get('oficio'));

    // 2. Elementos del DOM
    const contenedorLista = document.getElementById('contenedor-lista');
    const tituloCategoria = document.getElementById('titulo-categoria');
    const contadorResultados = document.getElementById('contador-resultados');
    const filtroActivoDot = document.getElementById('filtro-activo-dot');
    const btnVerResultados = document.getElementById('btn-ver-resultados');
    const btnLimpiarFiltros = document.getElementById('btn-limpiar-filtros');

    // 3. Base fija de profesionales de esta categoría (no cambia con los filtros)
    const profesionalesOficio = profesionales.filter(p => p.oficioId === oficioId);

    // 4. Título de la categoría y de la pestaña (dependen solo de la categoría, no del filtro)
    if (profesionalesOficio.length > 0) {
        tituloCategoria.innerText = profesionalesOficio[0].oficioNombre;
        document.title = `${profesionalesOficio[0].oficioNombre} | Oficiar`;
    } else {
        tituloCategoria.innerText = "Categoría sin profesionales";
        document.title = "Categoría sin profesionales | Oficiar";
    }

    // 5. Estado actual de los filtros
    let ordenActual = 'relevancia';
    let calificacionMinima = 0;

    // 6. Aplica filtro + orden sobre la base, SIN mutar el array original
    function obtenerListaFiltrada() {
        let lista = profesionalesOficio.filter(p => parseFloat(p.calificacion) >= calificacionMinima);

        if (ordenActual === 'calificacion') {
            lista = [...lista].sort((a, b) => parseFloat(b.calificacion) - parseFloat(a.calificacion));
        } else if (ordenActual === 'experiencia') {
            lista = [...lista].sort((a, b) => b.cantidadTrabajos - a.cantidadTrabajos);
        }

        return lista;
    }

    // 7. Dibuja las tarjetas de una lista dada
    function renderizarLista(lista) {
        contenedorLista.innerHTML = '';

        if (lista.length === 0) {
            if (profesionalesOficio.length === 0) {
                // La categoría en sí no tiene profesionales
                contenedorLista.innerHTML = `
                    <div class="col-12 text-center text-muted py-5 bg-white rounded-4 shadow-sm border">
                        <i class="bi bi-emoji-frown fs-1 text-secondary mb-3 d-block"></i>
                        <h4 class="fw-bold text-dark">Todavía no hay profesionales acá</h4>
                        <p class="mb-0">Pronto vamos a sumar especialistas en esta categoría.</p>
                    </div>`;
            } else {
                // Hay profesionales, pero el filtro elegido no dejó a ninguno
                contenedorLista.innerHTML = `
                    <div class="col-12 text-center text-muted py-5 bg-white rounded-4 shadow-sm border">
                        <i class="bi bi-filter-circle fs-1 text-secondary mb-3 d-block"></i>
                        <h4 class="fw-bold text-dark">Ningún profesional cumple estos filtros</h4>
                        <p class="mb-3">Probá con una calificación mínima más baja.</p>
                        <button type="button" class="btn btn-outline-secondary fw-bold btn-sm" id="btn-limpiar-filtros-inline">Limpiar filtros</button>
                    </div>`;
                document.getElementById('btn-limpiar-filtros-inline').addEventListener('click', limpiarFiltros);
            }
            return;
        }

        lista.forEach(prof => {
            const col = document.createElement('div');
            col.className = 'col-12 col-md-6 col-lg-4';

            const cardDiv = document.createElement('div');
            cardDiv.className = 'card border-0 shadow-sm rounded-4 h-100 oficio-card-lista';
            cardDiv.style.cursor = 'pointer';
            cardDiv.setAttribute('role', 'button');
            cardDiv.setAttribute('tabindex', '0');

            cardDiv.innerHTML = `
                <div class="card-body d-flex align-items-center p-3">
                    <img src="${prof.fotoUrl}" class="rounded-circle me-3 border shadow-sm" width="70" height="70" alt="${prof.nombreCompleto}">
                    <div class="flex-grow-1">
                        <h5 class="fw-bold fs-6 mb-1 text-dark d-flex align-items-center">
                            ${prof.nombreCompleto} 
                            <i class="bi bi-patch-check-fill text-success ms-1" title="Validado"></i>
                        </h5>
                        <div class="d-flex align-items-center text-warning small mb-1">
                            <i class="bi bi-star-fill me-1"></i> <span class="fw-bold text-dark me-1">${prof.calificacion}</span> 
                            <span class="text-muted">(${prof.cantidadTrabajos})</span>
                        </div>
                        <span class="badge bg-light text-secondary border"><i class="bi bi-geo-alt-fill text-orange"></i> Viedma</span>
                    </div>
                    <i class="bi bi-chevron-right text-muted opacity-50 fs-4"></i>
                </div>
            `;

            cardDiv.addEventListener('click', () => {
                window.location.href = `perfil.html?id=${prof.id}`;
            });

            cardDiv.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    window.location.href = `perfil.html?id=${prof.id}`;
                }
            });

            col.appendChild(cardDiv);
            contenedorLista.appendChild(col);
        });
    }

    // 8. Recalcula todo y actualiza los indicadores de la UI (contador, dot, botón del panel)
    function actualizarVista() {
        const listaFiltrada = obtenerListaFiltrada();

        renderizarLista(listaFiltrada);

        if (profesionalesOficio.length === 0) {
            contadorResultados.innerText = "0 resultados";
        } else if (listaFiltrada.length === profesionalesOficio.length) {
            contadorResultados.innerText = `${listaFiltrada.length} profesionales encontrados`;
        } else {
            contadorResultados.innerText = `${listaFiltrada.length} de ${profesionalesOficio.length} profesionales`;
        }

        const hayFiltroActivo = ordenActual !== 'relevancia' || calificacionMinima > 0;
        filtroActivoDot.classList.toggle('d-none', !hayFiltroActivo);

        if (btnVerResultados) {
            btnVerResultados.innerText = `Ver ${listaFiltrada.length} resultado${listaFiltrada.length === 1 ? '' : 's'}`;
        }
    }

    // 9. Filtros/orden con aplicación instantánea al tocar una opción
    document.querySelectorAll('input[name="orden"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            ordenActual = e.target.value;
            actualizarVista();
        });
    });

    document.querySelectorAll('input[name="calificacion-min"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            calificacionMinima = parseFloat(e.target.value);
            actualizarVista();
        });
    });

    function limpiarFiltros() {
        ordenActual = 'relevancia';
        calificacionMinima = 0;

        document.querySelector('input[name="orden"][value="relevancia"]').checked = true;
        document.querySelector('input[name="calificacion-min"][value="0"]').checked = true;

        actualizarVista();
    }

    if (btnLimpiarFiltros) {
        btnLimpiarFiltros.addEventListener('click', limpiarFiltros);
    }

    // 10. Primer render, con los valores por defecto
    actualizarVista();
});