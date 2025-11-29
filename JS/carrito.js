function obtenerCarrito() {
    const carrito = localStorage.getItem('carrito');
    return carrito ? JSON.parse(carrito) : [];
}

// Guardar carrito en localStorage
function guardarCarrito(carrito) {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Actualizar contador del carrito en el header
function actualizarContadorCarrito() {
    const carrito = obtenerCarrito();
    const contadores = document.querySelectorAll('.cart-contador');
    
    console.log('Actualizando contador carrito. Total items:', carrito.length);
    
    contadores.forEach(contador => {
        const cantidad = carrito.length;
        contador.textContent = cantidad;
        contador.style.display = 'flex';
        contador.style.visibility = cantidad > 0 ? 'visible' : 'hidden';
        contador.style.opacity = cantidad > 0 ? '1' : '0';
    });
}

// Calcular total del carrito
function calcularTotal() {
    const carrito = obtenerCarrito();
    let total = 0;
    
    carrito.forEach(item => {
        const precio = parseFloat(item.precio.replace('S/', '').replace(',', '').trim());
        total += precio * item.cantidad;
    });
    
    return total;
}

// Inicializar cuando cargue la página
window.addEventListener('DOMContentLoaded', function() {
    console.log('Iniciando sistema de carrito...');
    
    actualizarContadorCarrito();
    
    document.querySelectorAll('.btnFiltro').forEach(btn => {
        
        const card = btn.closest('.product-card');
        if (!card) return;
        
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            agregarAlCarrito(card, btn);
        });
    });
    
    // Si estamos en carrito.html, cargar los productos
    if (window.location.pathname.includes('carritorumrum.html')) {
        console.log('Cargando página de carrito...');
        cargarCarrito();
    }
});

// Agregar producto al carrito
function agregarAlCarrito(card, btn) {
    const favBtn = card.querySelector('.fav-btn');
    const id = favBtn ? favBtn.getAttribute('data-id') : 'prod-' + Date.now();
    
    const nombreEl = card.querySelector('.product-name');
    const precioEl = card.querySelector('.price-current');
    const img1El = card.querySelector('.img-primary');
    const img2El = card.querySelector('.img-secondary');
    
    if (!nombreEl || !precioEl || !img1El) {
        console.error('Faltan elementos en la tarjeta');
        return;
    }
    
    const nombre = nombreEl.textContent.trim();
    const precio = precioEl.textContent.trim();
    const img1 = img1El.src;
    const img2 = img2El ? img2El.src : img1;
    
    let carrito = obtenerCarrito();
    
    // Verificar si el producto ya está en el carrito
    const productoExistente = carrito.find(item => item.id === id);
    
    if (productoExistente) {
        // Si ya existe, aumentar cantidad
        productoExistente.cantidad++;
        console.log('Cantidad aumentada:', nombre, '- Nueva cantidad:', productoExistente.cantidad);
    } else {
        // Si no existe, agregarlo
        const nuevoItem = {
            id: id,
            nombre: nombre,
            precio: precio,
            img1: img1,
            img2: img2,
            cantidad: 1
        };
        carrito.push(nuevoItem);
        console.log('Producto agregado al carrito:', nombre);
    }
    
    guardarCarrito(carrito);
    actualizarContadorCarrito();
    
    // Animación del botón
    btn.textContent = '✓ AGREGADO';
    btn.style.background = '#27ae60';
    
    setTimeout(() => {
        btn.textContent = 'COMPRAR';
        btn.style.background = '';
    }, 1500);
}

// Mostrar mensaje cuando el carrito está vacío
function mostrarCarritoVacio() {
    const contenedor = document.querySelector('.carrito-productos');
    if (contenedor) {
        contenedor.innerHTML = `
            <div style="text-align: center; padding: 60px 20px; grid-column: 1/-1;">
                <div style="font-size: 80px; color: #ddd; margin-bottom: 20px;">🛒</div>
                <h2 style="font-size: 24px; margin-bottom: 10px; color: #333;">Tu carrito está vacío</h2>
                <p style="color: #666; margin: 10px 0 20px;">Agrega productos para comenzar tu compra</p>
                <a href="hombre.html" class="btnFiltro" style="display: inline-block; text-decoration: none; padding: 12px 30px;">
                    Ver Productos
                </a>
            </div>
        `;
    }
    
    // Ocultar resumen
    const resumen = document.querySelector('.carrito-resumen');
    if (resumen) {
        resumen.style.display = 'none';
    }
}

// Cargar productos en carrito.html
function cargarCarrito() {
    const contenedor = document.querySelector('.carrito-productos');
    
    if (!contenedor) {
        console.error('No se encontró el contenedor .carrito-productos');
        return;
    }
    
    const carrito = obtenerCarrito();
    console.log('Cargando carrito:', carrito);
    
    if (carrito.length === 0) {
        mostrarCarritoVacio();
        return;
    }
    
    contenedor.innerHTML = '';
    
    // Crear item para cada producto en el carrito
    carrito.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'carrito-item';
        itemDiv.innerHTML = `
            <img src="${item.img1}" alt="${item.nombre}" class="carrito-item-img">
            <div class="carrito-item-info">
                <h3 class="carrito-item-nombre">${item.nombre}</h3>
                <p class="carrito-item-precio">${item.precio}</p>
            </div>
            <div class="carrito-item-cantidad">
                <button class="cantidad-btn" onclick="cambiarCantidad('${item.id}', -1)">-</button>
                <span class="cantidad-numero">${item.cantidad}</span>
                <button class="cantidad-btn" onclick="cambiarCantidad('${item.id}', 1)">+</button>
            </div>
            <div class="carrito-item-subtotal">
                ${calcularSubtotal(item.precio, item.cantidad)}
            </div>
            <button class="carrito-item-eliminar" onclick="eliminarDelCarrito('${item.id}')" style="background: none; border: none; cursor: pointer; padding: 8px; color: #e74c3c; font-size: 18px;">
                <i class="fa-solid fa-trash" style="color: #e74c3c;"></i>
            </button>
        `;
        contenedor.appendChild(itemDiv);
    });
    
    // Actualizar resumen
    actualizarResumen();
}

// Calcular subtotal de un item
function calcularSubtotal(precioStr, cantidad) {
    const precio = parseFloat(precioStr.replace('S/', '').replace(',', '').trim());
    const subtotal = precio * cantidad;
    return `S/ ${subtotal.toFixed(2)}`;
}

// Cambiar cantidad de un producto
function cambiarCantidad(id, cambio) {
    let carrito = obtenerCarrito();
    const item = carrito.find(i => i.id === id);
    
    if (item) {
        item.cantidad += cambio;
        
        // Si la cantidad es 0 o menos, eliminar del carrito
        if (item.cantidad <= 0) {
            eliminarDelCarrito(id);
            return;
        }
        
        guardarCarrito(carrito);
        cargarCarrito();
        actualizarContadorCarrito();
    }
}

// Eliminar producto del carrito
function eliminarDelCarrito(id) {
    let carrito = obtenerCarrito();
    carrito = carrito.filter(item => item.id !== id);
    
    guardarCarrito(carrito);
    actualizarContadorCarrito();
    
    if (carrito.length === 0) {
        mostrarCarritoVacio();
    } else {
        cargarCarrito();
    }
    
    console.log('Producto eliminado del carrito');
}

// Actualizar resumen del carrito
function actualizarResumen() {
    const carrito = obtenerCarrito();
    const total = calcularTotal();
    const cantidadTotal = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    
    // Actualizar elementos del resumen
    const subtotalEl = document.querySelector('.resumen-subtotal');
    const totalEl = document.querySelector('.resumen-total');
    const cantidadEl = document.querySelector('.resumen-cantidad');
    
    if (subtotalEl) subtotalEl.textContent = `S/ ${total.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `S/ ${total.toFixed(2)}`;
    if (cantidadEl) cantidadEl.textContent = `${cantidadTotal} item${cantidadTotal !== 1 ? 's' : ''}`;
    
    // Mostrar resumen
    const resumen = document.querySelector('.carrito-resumen');
    if (resumen) {
        resumen.style.display = 'block';
    }
}

// Función para vaciar el carrito (opcional)
function vaciarCarrito() {
    if (confirm('¿Estás seguro de vaciar el carrito?')) {
        localStorage.removeItem('carrito');
        actualizarContadorCarrito();
        
        if (window.location.pathname.includes('carrito.html')) {
            mostrarCarritoVacio();
        }
        
        console.log('Carrito vaciado');
    }
}

// Función para procesar compra (opcional - puedes personalizarla)
function procesarCompra() {
    const carrito = obtenerCarrito();
    
    if (carrito.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }
    
    // Aquí puedes agregar tu lógica de compra
    alert('¡Gracias por tu compra!\n\nTotal: S/ ' + calcularTotal().toFixed(2));
    
    // Vaciar carrito después de comprar
    localStorage.removeItem('carrito');
    actualizarContadorCarrito();
    mostrarCarritoVacio();
}