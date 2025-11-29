// Obtener favoritos del localStorage
function obtenerFavoritos() {
    const favs = localStorage.getItem('favoritos');
    return favs ? JSON.parse(favs) : [];
}

// Guardar favoritos en localStorage
function guardarFavoritos(favoritos) {
    localStorage.setItem('favoritos', JSON.stringify(favoritos));
}

// Actualizar contador del header
function actualizarContador() {
    const favoritos = obtenerFavoritos();
    const contador = document.querySelector('.fav-contador');
    if (contador) {
        contador.textContent = favoritos.length;
        contador.style.display = favoritos.length > 0 ? 'flex' : 'none';
    }
}

// Cuando cargue la página
document.addEventListener('DOMContentLoaded', function() {
    
    // Marcar productos que ya son favoritos
    const favoritos = obtenerFavoritos();
    document.querySelectorAll('.fav-btn').forEach(btn => {
        const id = btn.getAttribute('data-id');
        const esFav = favoritos.find(f => f.id === id);
        if (esFav) {
            btn.classList.add('active');
        }
    });
    
    // Agregar evento a todos los botones de favoritos
    document.querySelectorAll('.fav-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const card = this.closest('.product-card');
            const id = this.getAttribute('data-id');
            const nombre = card.querySelector('.product-name').textContent;
            const precio = card.querySelector('.price-current').textContent;
            const img1 = card.querySelector('.img-primary').src;
            const img2 = card.querySelector('.img-secondary').src;
            
            let favoritos = obtenerFavoritos();
            
            // Si ya es favorito, quitarlo
            if (this.classList.contains('active')) {
                this.classList.remove('active');
                favoritos = favoritos.filter(f => f.id !== id);
                
                // Si estamos en favoritos.html, quitar la tarjeta
                if (window.location.href.includes('favoritos.html')) {
                    card.style.opacity = '0';
                    setTimeout(() => card.remove(), 300);
                }
            } 
            // Si no es favorito, agregarlo
            else {
                this.classList.add('active');
                favoritos.push({ id, nombre, precio, img1, img2 });
            }
            
            guardarFavoritos(favoritos);
            actualizarContador();
        });
    });
    
    // Si estamos en favoritos.html, cargar los productos
    if (window.location.href.includes('favoritos.html')) {
        cargarFavoritos();
    }
    
    actualizarContador();
});

// Cargar productos en favoritos.html
function cargarFavoritos() {
    const grid = document.querySelector('.products-grid');
    const favoritos = obtenerFavoritos();
    
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
                <img class="img-primary" src="${prod.img1}" alt="${prod.nombre}">
                <img class="img-secondary" src="${prod.img2}" alt="${prod.nombre}">
                <button class="fav-btn active" data-id="${prod.id}"></button>
            </div>
            <div class="product-info">
                <h3 class="product-name">${prod.nombre}</h3>
                <div class="product-prices">
                    <span class="price-current">${prod.precio}</span>
                </div>
                <button class="btnFiltro">COMPRAR</button>
            </div>
        `;
        grid.appendChild(card);
    });
    
    // Actualizar contador
    const contador = document.querySelector('.infoPS');
    if (contador) {
        contador.textContent = `${favoritos.length} Producto${favoritos.length !== 1 ? 's' : ''}`;
    }
    
    // Activar eventos en los nuevos botones
    document.querySelectorAll('.fav-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const card = this.closest('.product-card');
            const id = this.getAttribute('data-id');
            let favoritos = obtenerFavoritos();
            favoritos = favoritos.filter(f => f.id !== id);
            guardarFavoritos(favoritos);
            card.style.opacity = '0';
            setTimeout(() => {
                card.remove();
                if (obtenerFavoritos().length === 0) {
                    cargarFavoritos();
                } else {
                    actualizarContador();
                    const contador = document.querySelector('.infoPS');
                    if (contador) {
                        const total = obtenerFavoritos().length;
                        contador.textContent = `${total} Producto${total !== 1 ? 's' : ''}`;
                    }
                }
            }, 300);
        });
    });
}