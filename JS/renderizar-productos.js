// Script para renderizar productos dinámicamente desde la API
// Este script se usa en páginas de categorías: hombre.html, mujer.html, calzado.html, accesorios.html

const API_URL = 'https://tienda-ropa-production.up.railway.app/api';

// Obtener ID del usuario logueado
function getUserId() {
    const userData = localStorage.getItem('user');
    if (userData) {
        const user = JSON.parse(userData);
        return user.id;
    }
    return null;
}

// Actualizar contador de favoritos
async function actualizarContadorFavoritos(userId) {
    if (!userId) return;
    
    try {
        const response = await fetch(`${API_URL}/favorites?user_id=${userId}`);
        if (response.ok) {
            const favoritos = await response.json();
            const contador = document.querySelector('.fav-contador');
            if (contador) {
                contador.textContent = favoritos.length;
                contador.style.display = favoritos.length > 0 ? 'flex' : 'none';
            }
        }
    } catch (err) {
        console.error('Error al actualizar contador:', err);
    }
}

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
        const response = await fetch(`${API_URL}/products`);
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
        
        // Obtener favoritos del backend si el usuario está logueado
        let favoritosIds = [];
        const userId = getUserId();
        
        if (userId) {
            try {
                const favResponse = await fetch(`${API_URL}/favorites?user_id=${userId}`);
                if (favResponse.ok) {
                    const favoritos = await favResponse.json();
                    favoritosIds = favoritos.map(f => f.id);
                }
            } catch (err) {
                console.error('Error al cargar favoritos:', err);
            }
        }
        
        // Renderizar productos
        productosFiltrados.forEach(producto => {
            const card = crearTarjetaProducto(producto);
            
            // Marcar como favorito si ya está guardado
            const btnFav = card.querySelector('.fav-btn');
            if (btnFav && favoritosIds.includes(producto.id)) {
                btnFav.classList.add('active');
            }
            
            grid.appendChild(card);
        });
        
        // Actualizar contador de favoritos
        if (userId) {
            await actualizarContadorFavoritos(userId);
        }
        
        console.log(`✅ ${productosFiltrados.length} productos de "${categoria}" cargados desde Neon PostgreSQL`);
            contador.style.display = favoritos.length > 0 ? 'flex' : 'none';
        }
        
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
        btnFav.addEventListener('click', async function(e) {
            e.preventDefault();
            
            const userId = getUserId();
            
            // Verificar si el usuario está logueado
            if (!userId) {
                alert('Debes iniciar sesión para agregar productos a favoritos');
                return;
            }
            
            const isActive = this.classList.contains('active');
            
            try {
                if (isActive) {
                    // Eliminar de favoritos
                    const response = await fetch(`${API_URL}/favorites`, {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                            user_id: userId, 
                            product_id: producto.id 
                        })
                    });
                    
                    if (response.ok) {
                        this.classList.remove('active');
                        console.log('Producto eliminado de favoritos');
                    }
                } else {
                    // Agregar a favoritos
                    const response = await fetch(`${API_URL}/favorites`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                            user_id: userId, 
                            product_id: producto.id 
                        })
                    });
                    
                    const data = await response.json();
                    
                    if (response.ok) {
                        this.classList.add('active');
                        console.log('Producto agregado a favoritos');
                    } else {
                        console.error('Error:', data.error);
                    }
                }
                
                // Actualizar contador
                await actualizarContadorFavoritos(userId);
                
            } catch (err) {
                console.error('Error al procesar favorito:', err);
                alert('Error al procesar favorito. Intenta de nuevo.');
            }
            
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
