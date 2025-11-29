const productos = [
    {
        id: 1,
        nombre: "Camisa casual manga larga hombre",
        precio: 71.90,
        categoria: "Camisas",
        imagen: "/Imagenes/Productos/camisacasual.jpg"
    },
    {
        id: 2,
        nombre: "Jean cropped mujer",
        precio: 83.90,
        categoria: "Jeans",
        imagen: "/Imagenes/Productos/jeancortoo.jpg"
    },
    {
        id: 3,
        nombre: "Casaca ligera rompeviento hombre",
        precio: 112.40,
        categoria: "Casacas",
        imagen: "/Imagenes/Productos/casaca.jpg"
    },
    {
        id: 4,
        nombre: "Blusa satinada manga corta mujer",
        precio: 59.40,
        categoria: "Blusas",
        imagen: "/Imagenes/Productos/camisarosa.jpg"
    },
    {
        id: 5,
        nombre: "Sneakers urbanas mujer",
        precio: 110.40,
        categoria: "Calzado",
        imagen: "/Imagenes/Productos/sneackers.jpg"
    },
    {
        id: 6,
        nombre: "Jogger técnico deportivo hombre",
        precio: 79.90,
        categoria: "Pantalones",
        imagen: "/Imagenes/Productos/ultimo.jpg"
    }
];

document.addEventListener('DOMContentLoaded', function() {
    
    const searchWrapper = document.querySelector('.search-wrapper');
    const searchBtn = document.querySelector('.search-btn');
    const searchInput = document.querySelector('.search-expand');
    const searchSuggestions = document.getElementById('searchSuggestions');

    // Verificar que existen los elementos
    if (!searchWrapper || !searchBtn || !searchInput || !searchSuggestions) {
        console.error('Error: No se encontraron los elementos del buscador');
        return;
    }

    function buscarProductos(query) {
        if (!query || query.length < 2) {
            return [];
        }

        const queryLower = query.toLowerCase().trim();
        
        return productos.filter(producto => {
            return producto.nombre.toLowerCase().includes(queryLower) ||
                producto.categoria.toLowerCase().includes(queryLower);
        });
    }

    function highlightText(text, query) {
        if (!query) return text;
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<span class="highlight">$1</span>');
    }

    function mostrarSugerencias(query) {
        const resultados = buscarProductos(query);
        
        if (resultados.length === 0) {
            searchSuggestions.innerHTML = '<div class="no-results">No se encontraron productos</div>';
            searchSuggestions.classList.add('active');
            return;
        }

        let html = '';
        resultados.slice(0, 6).forEach(producto => {
            html += `
                <div class="suggestion-item" data-id="${producto.id}">
                    <img src="${producto.imagen}" alt="${producto.nombre}" class="suggestion-img" onerror="this.src='https://via.placeholder.com/50'">
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

        // Agregar event listeners a las sugerencias
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

    function ocultarSugerencias() {
        searchSuggestions.classList.remove('active');
    }


    // Click en el botón de búsqueda
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