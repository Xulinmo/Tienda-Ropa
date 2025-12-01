// Variable global para almacenar productos
let productos = [];

// Cargar productos desde la API
async function cargarProductosParaBusqueda() {
    try {
        const response = await fetch('http://localhost:3000/api/products');
        if (!response.ok) {
            throw new Error('Error al cargar productos');
        }
        const data = await response.json();
        
        // Obtener imágenes del cache de localStorage
        const productCache = JSON.parse(localStorage.getItem('product_images') || '{}');
        
        // Mapear productos al formato esperado
        productos = data.map(producto => {
            const cache = productCache[producto.id] || {};
            return {
                id: producto.id,
                nombre: cache.nombre || producto.title,
                nombreOriginal: producto.title, // Guardar el título original de la DB
                precio: parseFloat(producto.price),
                categoria: producto.category || 'General',
                imagen: cache.img1 || producto.image_url || 'https://via.placeholder.com/50'
            };
        });
        
        console.log('Productos cargados para búsqueda:', productos.length);
        console.log('Productos:', productos.map(p => p.nombre));
    } catch (error) {
        console.error('Error al cargar productos para búsqueda:', error);
        productos = [];
    }
}

// autocompletado del buscador
document.addEventListener('DOMContentLoaded', async function() {
    // Cargar productos primero
    await cargarProductosParaBusqueda();
    
    const searchWrapper = document.querySelector('.search-wrapper');
    const searchBtn = document.querySelector('.search-btn');
    const searchInput = document.querySelector('.search-expand');
    const searchSuggestions = document.getElementById('searchSuggestions');

    // Verificar que existen los elementos
    if (!searchWrapper || !searchBtn || !searchInput || !searchSuggestions) {
        console.error('Error: No se encontraron los elementos del buscador');
        return;
    }

    // Función para normalizar texto (quitar acentos)
    function normalizeText(text) {
        return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    }

    // funcion busqueda
    function buscarProductos(query) {
        if (!query || query.length < 2) {
            return [];
        }

        const queryNormalized = normalizeText(query.trim());
        
        return productos.filter(producto => {
            const nombreNormalized = normalizeText(producto.nombre);
            const nombreOriginalNormalized = normalizeText(producto.nombreOriginal || '');
            const categoriaNormalized = normalizeText(producto.categoria);
            
            return nombreNormalized.includes(queryNormalized) ||
                   nombreOriginalNormalized.includes(queryNormalized) ||
                   categoriaNormalized.includes(queryNormalized);
        });
    }

    // resalta la palabra escrita en el buscador
    function highlightText(text, query) {
        if (!query) return text;
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<span class="highlight">$1</span>');
    }

    // Validar si una imagen existe
    function getValidImageSrc(imageSrc) {
        // Si no hay imagen o es placeholder, usar directamente placeholder
        if (!imageSrc || imageSrc.includes('placeholder')) {
            return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="50" height="50"%3E%3Crect fill="%23ddd" width="50" height="50"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3E?%3C/text%3E%3C/svg%3E';
        }
        return imageSrc;
    }

    // mostrar sugerencias
        function mostrarSugerencias(query) {
        const resultados = buscarProductos(query);
        
        if (resultados.length === 0) {
            searchSuggestions.innerHTML = '<div class="no-results">No se encontraron productos</div>';
            searchSuggestions.classList.add('active');
            return;
        }

        let html = '';
        resultados.slice(0, 6).forEach(producto => {
            const imgSrc = getValidImageSrc(producto.imagen);
            html += `
                <div class="suggestion-item" data-id="${producto.id}">
                    <img src="${imgSrc}" alt="${producto.nombre}" class="suggestion-img" loading="lazy" style="opacity: 0; transition: opacity 0.2s;" onload="this.style.opacity=1">
                    <div class="suggestion-info">
                        <div class="suggestion-name">${highlightText(producto.nombre, query)}</div>
                        <div class="suggestion-category">${producto.categoria}</div>
                        <div class="suggestion-price">S/ ${producto.precio.toFixed(2)}</div>
                    </div>
                </div>
            `;
        });

        searchSuggestions.innerHTML = html;
        searchSuggestions.classList.add('active');


        // detecta cuando se selecciona una sugerencia
        document.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', function() {
                const productoId = this.getAttribute('data-id');
                const producto = productos.find(p => p.id == productoId);
                
                console.log('Producto seleccionado:', producto);
                alert(`Seleccionaste: ${producto.nombre}\nPrecio: S/ ${producto.precio}`);
                
                searchSuggestions.classList.remove('active');
                searchInput.value = producto.nombre;
            });
        });
    }

    // oculta sugerencias
    function ocultarSugerencias() {
        searchSuggestions.classList.remove('active');
    }


    // despliega el buscador
    searchBtn.addEventListener('click', function(e) {
        e.preventDefault();
        searchWrapper.classList.toggle('active');
        
        if (searchWrapper.classList.contains('active')) {
            searchInput.focus();
        } else {
            ocultarSugerencias();
        }
    });

    // Buscar mientras se escribe
    let timeoutId;
    searchInput.addEventListener('input', function() {
        const query = this.value.trim();
        
        clearTimeout(timeoutId);
        
        if (query.length < 2) {
            ocultarSugerencias();
            return;
        }

        // Esperar 300ms después de que el usuario deje de escribir
        timeoutId = setTimeout(() => {
            mostrarSugerencias(query);
        }, 300);
    });

    // Mostrar sugerencias al hacer focus
    searchInput.addEventListener('focus', function() {
        if (this.value.trim().length >= 2) {
            mostrarSugerencias(this.value.trim());
        }
    });

    // Cerrar al hacer clic fuera del buscador
    document.addEventListener('click', function(e) {
        if (!searchWrapper.contains(e.target)) {
            searchWrapper.classList.remove('active');
            ocultarSugerencias();
        }
    });

    // Prevenir que se cierre al hacer clic dentro del input
    searchInput.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    // Prevenir que se cierre al hacer clic en las sugerencias
    searchSuggestions.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    // Buscar al presionar Enter
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const query = this.value.trim();
            if (query) {
                console.log('Búsqueda:', query);
            }
        }
    });
});