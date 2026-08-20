// assets/js/main.js
// Datos compartidos por TODAS las páginas del sitio.
// Se carga PRIMERO, antes que el script específico de cada página.

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
// Persistidos en localStorage para que el mismo ID muestre siempre
// al mismo profesional, sin importar en qué página estés.
const profesionales = generarProfesionales();

function generarProfesionales() {
    const STORAGE_KEY = 'oficiar_profesionales';
    const VERSION_KEY = 'oficiar_profesionales_version';
    const versionActual = oficios.length; // Se invalida el cache si cambia la cantidad de oficios

    const guardados = localStorage.getItem(STORAGE_KEY);
    const versionGuardada = localStorage.getItem(VERSION_KEY);

    if (guardados && versionGuardada == versionActual) {
        return JSON.parse(guardados);
    }

    const nombres = ['Juan', 'Pedro', 'Carlos', 'Miguel', 'Diego', 'Ana', 'Laura', 'María', 'Sofía', 'Lucía', 'Facundo', 'Martín', 'Julieta', 'Camila', 'Gabriel'];
    const apellidos = ['Pérez', 'Gómez', 'López', 'Rodríguez', 'Martínez', 'Fernández', 'García', 'Díaz', 'Romero', 'Álvarez', 'Sosa', 'Ruiz', 'Acosta', 'Giménez', 'Calvo'];

    let db = [];
    let idContador = 1;

    oficios.forEach(oficio => {
        for (let i = 0; i < 5; i++) {
            const nombreAleatorio = nombres[Math.floor(Math.random() * nombres.length)];
            const apellidoAleatorio = apellidos[Math.floor(Math.random() * apellidos.length)];

            const calificacion = (Math.random() * (5 - 4) + 4).toFixed(1);
            const trabajos = Math.floor(Math.random() * 200) + 15;

            db.push({
                id: idContador++,
                oficioId: oficio.id,
                oficioNombre: oficio.nombre,
                nombreCompleto: `${nombreAleatorio} ${apellidoAleatorio}`,
                calificacion: calificacion,
                cantidadTrabajos: trabajos,
                fotoUrl: `https://ui-avatars.com/api/?name=${nombreAleatorio}+${apellidoAleatorio}&background=random&color=fff&size=150`,
                descripcion: `Especialista en ${oficio.nombre.toLowerCase()} con amplia experiencia. Atención responsable, garantizada y presupuesto sin cargo.`
            });
        }
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    localStorage.setItem(VERSION_KEY, String(versionActual));

    return db;
}

console.log("Base de datos de profesionales generada:", profesionales);