// Script para renderizar productos dinámicamente desde la API
// Este script se usa en páginas de categorías: hombre.html, mujer.html, calzado.html, accesorios.html

async function cargarYRenderizarProductos() {
    const grid = document.querySelector('.products-grid');
    const infoPS = document.querySelector('.infoPS');
    
    if (!grid) {
        console.error('No se encontró el contenedor de productos');
        return;
    }

    // Determinar categoría según la página actual
    const pagina = window.location.pathname.split('/').pop().replace('.html', '');
    let categoria = pagina;
    
    // Mapear nombres de página a categorías de BD
    const categoriasMap = {
        'hombre': 'hombre',
        'mujer': 'mujer',
        'calzado': 'calzado',
        'accesorios': 'accesorios',
        'ofertas': 'ofertas'
    };
    
    categoria = categoriasMap[pagina] || pagina;

    try {
        // Mostrar loading
        grid.innerHTML = '<div class="loading" style="grid-column: 1/-1; text-align: center; padding: 40px; font-size: 18px;">Cargando productos...</div>';
        
        // Obtener productos de la API
        const response = await fetch('http://localhost:3000/api/products');
        if (!response.ok) throw new Error('Error al cargar productos');
        
        const todosLosProductos = await response.json();
        
        // Filtrar por categoría
        const productosFiltrados = todosLosProductos.filter(p => 
            p.category?.toLowerCase() === categoria.toLowerCase()
        );
        
        // Actualizar contador
        if (infoPS) {
            infoPS.textContent = `${productosFiltrados.length} Producto${productosFiltrados.length !== 1 ? 's' : ''}`;
        }
        
        // Limpiar grid
        grid.innerHTML = '';
        
        if (productosFiltrados.length === 0) {
            grid.innerHTML = '<div class="no-products" style="grid-column: 1/-1; text-align: center; padding: 40px;">No hay productos disponibles en esta categoría.</div>';
            return;
        }
        
        // Renderizar productos
        productosFiltrados.forEach(producto => {
            const card = crearTarjetaProducto(producto);
            grid.appendChild(card);
        });
        
        console.log(`✅ ${productosFiltrados.length} productos de "${categoria}" cargados desde Neon PostgreSQL`);
        
    } catch (error) {
        console.error('Error al cargar productos:', error);
        grid.innerHTML = '<div class="error" style="grid-column: 1/-1; text-align: center; padding: 40px; color: #e74c3c;">⚠️ Error al cargar productos. Por favor, intenta recargar la página.</div>';
    }
}

function crearTarjetaProducto(producto) {
    const article = document.createElement('article');
    article.className = 'product-card';
    article.setAttribute('data-id', producto.id);
    
    // Usar la imagen de la BD o una por defecto
    const imagenPrincipal = producto.image_url || 'https://via.placeholder.com/300x400?text=Sin+Imagen';
    
    article.innerHTML = `
        <div class="product-images">
            <img class="img-primary" src="${imagenPrincipal}" alt="${producto.title}" loading="lazy">
            <img class="img-secondary" src="${imagenPrincipal}" alt="${producto.title}" loading="lazy">
            <button class="fav-btn" data-id="${producto.id}">
                <i class="fa-solid fa-heart"></i>
            </button>
        </div>
        <div class="product-info">
            <h3 class="product-name">${producto.title}</h3>
            ${producto.description ? `<p class="product-description">${producto.description}</p>` : ''}
            <div class="product-prices">
                <span class="price-current">S/ ${parseFloat(producto.price).toFixed(2)}</span>
                ${producto.stock ? `<span class="stock-info" style="font-size: 12px; color: ${producto.stock > 10 ? '#27ae60' : '#e74c3c'};">Stock: ${producto.stock}</span>` : ''}
            </div>
            <button class="btnFiltro add-to-cart-btn" data-id="${producto.id}" data-title="${producto.title}" data-price="${producto.price}" data-image="${imagenPrincipal}">
                COMPRAR
            </button>
        </div>
    `;
    
    // Agregar evento al botón de agregar al carrito
    const btnComprar = article.querySelector('.add-to-cart-btn');
    if (btnComprar && typeof agregarAlCarrito === 'function') {
        btnComprar.addEventListener('click', function(e) {
            e.preventDefault();
            agregarAlCarrito(article, btnComprar);
        });
    }
    
    // Agregar evento al botón de favoritos
    const btnFav = article.querySelector('.fav-btn');
    if (btnFav) {
        btnFav.addEventListener('click', function(e) {
            e.preventDefault();
            // Aquí puedes agregar la lógica de favoritos si existe
            console.log('Producto agregado a favoritos:', producto.id);
        });
    }
    
    return article;
}

// Cargar productos cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', cargarYRenderizarProductos);
} else {
    cargarYRenderizarProductos();
}

// Recargar productos si hay cambios en localStorage (para mantener sincronización)
window.addEventListener('storage', function(e) {
    if (e.key === 'cart_updated') {
        console.log('Carrito actualizado, recargando vista...');
    }
});
