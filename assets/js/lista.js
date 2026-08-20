// assets/js/lista.js
// Lógica específica de la página de resultados (lista.html)

document.addEventListener('DOMContentLoaded', () => {
    // 1. Leer el ID del oficio desde la URL (ej: ?oficio=1)
    const urlParams = new URLSearchParams(window.location.search);
    const oficioId = parseInt(urlParams.get('oficio'));

    // 2. Elementos del DOM
    const contenedorLista = document.getElementById('contenedor-lista');
    const tituloCategoria = document.getElementById('titulo-categoria');
    const contadorResultados = document.getElementById('contador-resultados');

    // 3. Filtrar los profesionales generados que coincidan con este ID
    const profesionalesFiltrados = profesionales.filter(p => p.oficioId === oficioId);

    // 4. Actualizar textos
    if (profesionalesFiltrados.length > 0) {
        tituloCategoria.innerText = profesionalesFiltrados[0].oficioNombre;
        contadorResultados.innerText = `${profesionalesFiltrados.length} profesionales encontrados`;
    } else {
        tituloCategoria.innerText = "Categoría sin profesionales";
        contadorResultados.innerText = "0 resultados";
    }

    // 5. Dibujar las tarjetas (Lista vertical)
    profesionalesFiltrados.forEach(prof => {
        const col = document.createElement('div');
        col.className = 'col-12 col-md-6 col-lg-4';

        col.innerHTML = `
            <div class="card border-0 shadow-sm rounded-4 h-100 oficio-card-lista" style="cursor:pointer;" onclick="window.location.href='perfil.html?id=${prof.id}'">
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
            </div>
        `;
        contenedorLista.appendChild(col);
    });
});