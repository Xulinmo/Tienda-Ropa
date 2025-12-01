// Cargar productos desde la API y agregar stock
const PRODUCTS_API_URL = 'http://localhost:3000/api';

async function cargarProductosConStock() {
    try {
        const response = await fetch(`${PRODUCTS_API_URL}/products`);
        if (!response.ok) throw new Error('Error al cargar productos');
        
        const productos = await response.json();
        
        // Mapear productos por ID
        const productosMap = {};
        productos.forEach(p => {
            productosMap[p.id] = p;
        });
        
        // Actualizar cada tarjeta de producto con el stock
        document.querySelectorAll('.product-card').forEach(card => {
            const favBtn = card.querySelector('.fav-btn');
            const productId = favBtn?.getAttribute('data-id');
            
            if (productId && productosMap[productId]) {
                const producto = productosMap[productId];
                const pricesDiv = card.querySelector('.product-prices');
                
                if (pricesDiv && !pricesDiv.querySelector('.product-stock')) {
                    const stockSpan = document.createElement('span');
                    stockSpan.className = 'product-stock';
                    
                    const stock = producto.stock || 0;
                    
                    if (stock === 0) {
                        stockSpan.textContent = 'Agotado';
                        stockSpan.classList.add('out');
                        
                        // Deshabilitar botón de comprar
                        const btnComprar = card.querySelector('.btnFiltro');
                        if (btnComprar) {
                            btnComprar.disabled = true;
                            btnComprar.textContent = 'AGOTADO';
                            btnComprar.style.opacity = '0.5';
                            btnComprar.style.cursor = 'not-allowed';
                        }
                    } else if (stock <= 5) {
                        stockSpan.textContent = `Stock: ${stock}`;
                        stockSpan.classList.add('low');
                    } else {
                        stockSpan.textContent = `Stock: ${stock}`;
                    }
                    
                    pricesDiv.appendChild(stockSpan);
                }
            }
        });
        
    } catch (error) {
        console.error('Error cargando productos:', error);
    }
}

// Ejecutar cuando cargue la página
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', cargarProductosConStock);
} else {
    cargarProductosConStock();
}
