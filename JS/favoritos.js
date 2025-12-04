// API URL
const FAVORITOS_API_URL = 'https://tienda-ropa-production.up.railway.app/api';

// Obtener ID del usuario logueado
function getUserId() {
    const userData = localStorage.getItem('user');
    if (userData) {
        const user = JSON.parse(userData);
        return user.id;
    }
    return null;
}

// Obtener favoritos del backend
async function obtenerFavoritos() {
    const userId = getUserId();
    if (!userId) return [];
    
    try {
        const response = await fetch(`${FAVORITOS_API_URL}/favorites?user_id=${userId}`);
        if (response.ok) {
            return await response.json();
        }
    } catch (err) {
        console.error('Error al obtener favoritos:', err);
    }
    return [];
}

// Actualizar contador del header
async function actualizarContador() {
    const favoritos = await obtenerFavoritos();
    const contador = document.querySelector('.fav-contador');
    if (contador) {
        contador.textContent = favoritos.length;
        contador.style.display = favoritos.length > 0 ? 'flex' : 'none';
    }
}

// Cuando cargue la página
document.addEventListener('DOMContentLoaded', async function() {
    
    // Si estamos en favoritos.html, cargar los productos
    if (window.location.href.includes('favoritos.html')) {
        await cargarFavoritos();
    }
    
    await actualizarContador();
});

// Cargar productos en favoritos.html
async function cargarFavoritos() {
    const grid = document.querySelector('.products-grid');
    const favoritos = await obtenerFavoritos();
    
    grid.innerHTML = '';
    
    if (favoritos.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px;">
                <div style="font-size: 80px; color: #ddd;">♡</div>
                <h2>No tienes favoritos</h2>
                <p style="color: #666; margin: 10px 0 20px;">Agrega productos a tu lista</p>
                <a href="hombre.html" class="btnFiltro" style="display: inline-block; text-decoration: none; padding: 12px 30px;">
                    Ver Productos
                </a>
            </div>
        `;
        return;
    }
    
    favoritos.forEach(prod => {
        const card = document.createElement('article');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-images">
                <img class="img-primary" src="${prod.image_url}" alt="${prod.title}">
                <img class="img-secondary" src="${prod.image_url}" alt="${prod.title}">
                <button class="fav-btn active" data-id="${prod.id}"></button>
            </div>
            <div class="product-info">
                <h3 class="product-name">${prod.title}</h3>
                <div class="product-prices">
                    <span class="price-current">S/ ${parseFloat(prod.price).toFixed(2)}</span>
                </div>
                <button class="btnFiltro add-to-cart-btn" data-id="${prod.id}" data-title="${prod.title}" data-price="${prod.price}" data-image="${prod.image_url}">COMPRAR</button>
            </div>
        `;
        grid.appendChild(card);
        
        // Agregar evento al botón de comprar
        const btnComprar = card.querySelector('.add-to-cart-btn');
        if (btnComprar && typeof agregarAlCarrito === 'function') {
            btnComprar.addEventListener('click', function(e) {
                e.preventDefault();
                agregarAlCarrito(card, btnComprar);
            });
        }
    });
    
    // Actualizar contador
    const contador = document.querySelector('.infoPS');
    if (contador) {
        contador.textContent = `${favoritos.length} Producto${favoritos.length !== 1 ? 's' : ''}`;
    }
    
    // Activar eventos en los botones de favoritos
    document.querySelectorAll('.fav-btn').forEach(btn => {
        btn.addEventListener('click', async function(e) {
            e.preventDefault();
            const card = this.closest('.product-card');
            const productId = this.getAttribute('data-id');
            const userId = getUserId();
            
            if (!userId) {
                alert('Debes iniciar sesión');
                return;
            }
            
            try {
                // Eliminar del backend
                const response = await fetch(`${FAVORITOS_API_URL}/favorites`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        user_id: userId, 
                        product_id: parseInt(productId)
                    })
                });
                
                if (response.ok) {
                    card.style.opacity = '0';
                    setTimeout(async () => {
                        card.remove();
                        const favs = await obtenerFavoritos();
                        if (favs.length === 0) {
                            await cargarFavoritos();
                        } else {
                            await actualizarContador();
                            const contador = document.querySelector('.infoPS');
                            if (contador) {
                                contador.textContent = `${favs.length} Producto${favs.length !== 1 ? 's' : ''}`;
                            }
                        }
                    }, 300);
                }
            } catch (err) {
                console.error('Error al eliminar favorito:', err);
                alert('Error al eliminar de favoritos');
            }
        });
    });
}