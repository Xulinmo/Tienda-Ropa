// API URL
const API_URL = 'https://tienda-ropa-production.up.railway.app/api';

// Verificar si el usuario está logueado
function isUserLoggedIn() {
    const userData = localStorage.getItem('user');
    return userData !== null;
}

// Mostrar alerta para que inicie sesión
function mostrarAlertaLogin(mensaje) {
    // Crear modal de alerta
    const alertaHTML = `
        <div class="login-alert-overlay" id="loginAlertOverlay">
            <div class="login-alert-box">
                <div class="login-alert-icon">🔒</div>
                <h3 class="login-alert-title">Sesión requerida</h3>
                <p class="login-alert-message">${mensaje}</p>
                <div class="login-alert-buttons">
                    <button class="btn-alert-login" onclick="redirectToLogin()">Iniciar Sesión</button>
                    <button class="btn-alert-cancel" onclick="cerrarAlertaLogin()">Cancelar</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', alertaHTML);
}

// Redirigir a página de inicio para login
function redirectToLogin() {
    cerrarAlertaLogin();
    window.location.href = 'index.html';
}

// Cerrar alerta de login
function cerrarAlertaLogin() {
    const alerta = document.getElementById('loginAlertOverlay');
    if (alerta) {
        alerta.remove();
    }
}

// Obtener ID del usuario actual (desde login.js si está disponible)
function getUserId() {
    if (typeof getCurrentUserId === 'function') {
        return getCurrentUserId();
    }
    return 1; // Fallback a usuario demo
}

const USER_ID = getUserId();

// Obtener carrito desde la base de datos
async function obtenerCarrito() {
    try {
        const userId = getUserId();
        const response = await fetch(`${API_URL}/cart?user_id=${userId}`);
        if (!response.ok) throw new Error('Error al obtener carrito');
        const items = await response.json();
        
        console.log('Carrito obtenido del servidor:', items);
        
        // Obtener cache de imágenes
        const imageCache = JSON.parse(localStorage.getItem('product_images') || '{}');
        
        return items.map(item => {
            // item.id es el product_id del producto
            const productId = item.id;
            const cachedImages = imageCache[productId] || {};
            
            return {
                id: productId,  // ID del producto
                nombre: cachedImages.nombre || item.title,
                precio: `S/ ${item.price}`,
                img1: cachedImages.img1 || item.image_url,
                img2: cachedImages.img2 || item.image_url,
                cantidad: item.quantity,
                cart_id: item.cart_id  // ID del registro en la tabla cart
            };
        });
    } catch (error) {
        console.error('Error obteniendo carrito:', error);
        // Fallback a localStorage si no hay conexión
        const carrito = localStorage.getItem('carrito');
        return carrito ? JSON.parse(carrito) : [];
    }
}

// Guardar item en el carrito (base de datos)
async function guardarItemCarrito(productId, cantidad = 1) {
    try {
        const userId = getUserId();
        
        // Asegurarse de que productId es un número
        const productIdNum = parseInt(productId);
        
        if (isNaN(productIdNum)) {
            console.error('ID de producto inválido:', productId);
            alert('Error: ID de producto inválido');
            return null;
        }
        
        console.log('Enviando al servidor:', { user_id: userId, product_id: productIdNum, quantity: cantidad });
        
        const response = await fetch(`${API_URL}/cart`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: userId,
                product_id: productIdNum,
                quantity: cantidad
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error del servidor:', errorData);
            alert(`Error al agregar: ${errorData.error || 'Error desconocido'}`);
            throw new Error('Error al guardar en carrito');
        }
        
        const result = await response.json();
        console.log('Respuesta del servidor:', result);
        return result;
    } catch (error) {
        console.error('Error guardando en carrito:', error);
        return null;
    }
}

// Actualizar contador del carrito en el header
async function actualizarContadorCarrito() {
    const carrito = await obtenerCarrito();
    const contadores = document.querySelectorAll('.cart-contador');
    
    // Contar total de items (sumando cantidades)
    const totalItems = carrito.reduce((sum, item) => sum + (item.cantidad || 0), 0);
    
    console.log('Actualizando contador carrito. Total items:', totalItems);
    
    contadores.forEach(contador => {
        contador.textContent = totalItems;
        contador.style.display = 'flex';
        contador.style.visibility = totalItems > 0 ? 'visible' : 'hidden';
        contador.style.opacity = totalItems > 0 ? '1' : '0';
    });
}

// Calcular total del carrito
async function calcularTotal() {
    const carrito = await obtenerCarrito();
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
async function agregarAlCarrito(card, btn) {
    // Validar que el usuario esté logueado
    if (!isUserLoggedIn()) {
        mostrarAlertaLogin('Debes iniciar sesión para agregar productos al carrito');
        return;
    }
    
    // Buscar el data-id en varios lugares posibles
    let id = null;
    
    // 1. Intentar desde el botón fav-btn
    const favBtn = card.querySelector('.fav-btn');
    if (favBtn) {
        id = favBtn.getAttribute('data-id');
    }
    
    // 2. Si no, intentar desde el botón mismo
    if (!id && btn) {
        id = btn.getAttribute('data-id');
    }
    
    // 3. Si no, intentar desde la card
    if (!id) {
        id = card.getAttribute('data-id');
    }
    
    if (!id) {
        console.error('No se encontró el ID del producto');
        console.log('Card:', card);
        console.log('Btn:', btn);
        alert('Error: No se pudo identificar el producto');
        return;
    }
    
    console.log('ID del producto a agregar:', id);
    
    const nombreEl = card.querySelector('.product-name');
    const precioEl = card.querySelector('.price-current');
    const img1El = card.querySelector('.img-primary');
    const img2El = card.querySelector('.img-secondary');
    
    if (!nombreEl || !precioEl || !img1El) {
        console.error('Faltan elementos en la tarjeta');
        console.log('nombreEl:', nombreEl);
        console.log('precioEl:', precioEl);
        console.log('img1El:', img1El);
        return;
    }
    
    const nombre = nombreEl.textContent.trim();
    const img1 = img1El.src;
    const img2 = img2El ? img2El.src : img1;
    
    console.log('Agregando al carrito:', { id, nombre, img1, img2 });
    
    // Guardar imágenes y nombre en cache local
    const imageCache = JSON.parse(localStorage.getItem('product_images') || '{}');
    imageCache[id] = { img1, img2, nombre };
    localStorage.setItem('product_images', JSON.stringify(imageCache));
    
    // Guardar en la base de datos
    const resultado = await guardarItemCarrito(id, 1);
    
    if (resultado) {
        console.log('Producto agregado/actualizado en carrito:', nombre);
        await actualizarContadorCarrito();
        
        // Animación del botón
        btn.textContent = '✓ AGREGADO';
        btn.style.background = '#27ae60';
        
        setTimeout(() => {
            btn.textContent = 'COMPRAR';
            btn.style.background = '';
        }, 1500);
    } else {
        console.error('Error al agregar al carrito');
        btn.textContent = '✗ ERROR';
        btn.style.background = '#e74c3c';
        
        setTimeout(() => {
            btn.textContent = 'COMPRAR';
            btn.style.background = '';
        }, 1500);
    }
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
async function cargarCarrito() {
    const contenedor = document.querySelector('.carrito-productos');
    
    if (!contenedor) {
        console.error('No se encontró el contenedor .carrito-productos');
        return;
    }
    
    const carrito = await obtenerCarrito();
    console.log('=== CARRITO CARGADO ===');
    console.log('Total de items:', carrito.length);
    console.log('Detalle:', carrito.map(item => ({
        id: item.id,
        nombre: item.nombre,
        cantidad: item.cantidad,
        cart_id: item.cart_id
    })));
    console.log('=======================');
    
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
                <button class="cantidad-btn" onclick="cambiarCantidad('${item.cart_id}', -1)">-</button>
                <span class="cantidad-numero">${item.cantidad}</span>
                <button class="cantidad-btn" onclick="cambiarCantidad('${item.cart_id}', 1)">+</button>
            </div>
            <div class="carrito-item-subtotal">
                ${calcularSubtotal(item.precio, item.cantidad)}
            </div>
            <button class="carrito-item-eliminar" onclick="eliminarDelCarrito('${item.cart_id}')" style="background: none; border: none; cursor: pointer; padding: 8px; color: #e74c3c; font-size: 18px;">
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
async function cambiarCantidad(cartId, cambio) {
    try {
        const carrito = await obtenerCarrito();
        const item = carrito.find(i => i.cart_id == cartId);
        
        if (item) {
            const nuevaCantidad = item.cantidad + cambio;
            
            // Si la cantidad es 0 o menos, eliminar del carrito
            if (nuevaCantidad <= 0) {
                await eliminarDelCarrito(cartId);
                return;
            }
            
            // Actualizar cantidad en la base de datos
            const response = await fetch(`${API_URL}/cart/${cartId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quantity: nuevaCantidad })
            });
            
            if (!response.ok) throw new Error('Error al actualizar cantidad');
            
            await cargarCarrito();
            await actualizarContadorCarrito();
        }
    } catch (error) {
        console.error('Error cambiando cantidad:', error);
    }
}

// Eliminar producto del carrito
async function eliminarDelCarrito(id) {
    try {
        // id aquí es el cart_id
        const response = await fetch(`${API_URL}/cart/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Error al eliminar');
        
        console.log('Producto eliminado del carrito');
        
        await actualizarContadorCarrito();
        
        const carrito = await obtenerCarrito();
        if (carrito.length === 0) {
            mostrarCarritoVacio();
        } else {
            await cargarCarrito();
        }
    } catch (error) {
        console.error('Error eliminando del carrito:', error);
    }
}

// Actualizar resumen del carrito
async function actualizarResumen() {
    const carrito = await obtenerCarrito();
    const total = await calcularTotal();
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
async function vaciarCarrito() {
    if (confirm('¿Estás seguro de vaciar el carrito?')) {
        try {
            const userId = getUserId();
            const response = await fetch(`${API_URL}/cart/user/${userId}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) throw new Error('Error al vaciar carrito');
            
            console.log('Carrito vaciado');
            
            await actualizarContadorCarrito();
            
            if (window.location.pathname.includes('carritorumrum.html')) {
                mostrarCarritoVacio();
            }
        } catch (error) {
            console.error('Error vaciando carrito:', error);
            alert('Error al vaciar el carrito');
        }
    }
}

// Función para procesar compra (opcional - puedes personalizarla)
async function procesarCompra() {
    // Validar que el usuario esté logueado
    if (!isUserLoggedIn()) {
        mostrarAlertaLogin('Debes iniciar sesión para realizar compras');
        return;
    }
    
    const carrito = await obtenerCarrito();
    
    if (carrito.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }
    
    const total = await calcularTotal();
    
    // Mostrar panel de confirmación personalizado
    mostrarConfirmacionCompra(total);
}

// Nueva función: Mostrar panel de confirmación
function mostrarConfirmacionCompra(total) {
    const confirmacionHTML = `
        <div class="compra-confirmacion-overlay" id="confirmacionOverlay">
            <div class="compra-confirmacion-box">
                <div class="compra-confirmacion-icon">
                    <i class="fa-solid fa-bag-shopping"></i>
                </div>
                <h2 class="compra-confirmacion-title">¿Confirmar tu compra?</h2>
                <p class="compra-confirmacion-mensaje">
                    Total a pagar: <strong style="color: #27ae60; font-size: 24px;">S/ ${total.toFixed(2)}</strong>
                </p>
                <p class="compra-confirmacion-submensaje">
                    ¡Estás a un paso de lucir increíble! 🌟
                </p>
                <div class="compra-confirmacion-buttons">
                    <button class="btn-seguir-comprando" onclick="cerrarConfirmacion()">
                        Cancelar
                    </button>
                    <button class="btn-ver-boleta" onclick="confirmarYProcesar()">
                        Confirmar Compra
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', confirmacionHTML);
}

// Cerrar panel de confirmación
function cerrarConfirmacion() {
    const overlay = document.getElementById('confirmacionOverlay');
    if (overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => overlay.remove(), 300);
    }
}

// Confirmar y procesar la compra
async function confirmarYProcesar() {
    cerrarConfirmacion();
    
    try {
        const userId = getUserId();
        const response = await fetch(`${API_URL}/purchase`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            // Mostrar error con panel personalizado en lugar de alert
            mostrarMensajeError(data.error || 'Error al procesar la compra');
            return;
        }
        
        // Obtener nombres del cache localStorage
        const imageCache = JSON.parse(localStorage.getItem('product_images') || '{}');
        const carrito = await obtenerCarrito();
        
        // Agregar nombres reales del cache a los items de la boleta
        data.items.forEach(item => {
            const cached = imageCache[item.product_id];
            if (cached && cached.nombre) {
                item.nombreReal = cached.nombre;
            } else {
                const itemCarrito = carrito.find(c => c.id == item.product_id);
                if (itemCarrito) {
                    item.nombreReal = itemCarrito.nombre;
                }
            }
        });
        
        // Mostrar mensaje de éxito ANTES de la boleta
        mostrarMensajeExito(data);
        
    } catch (error) {
        console.error('Error procesando compra:', error);
        mostrarMensajeError('Error al procesar la compra. Intenta nuevamente.');
    }
}

// Mostrar mensaje de éxito después de la compra
function mostrarMensajeExito(data) {
    const exitoHTML = `
        <div class="compra-confirmacion-overlay" id="exitoOverlay">
            <div class="compra-confirmacion-box">
                <div class="compra-confirmacion-icon">✅</div>
                <h2 class="compra-confirmacion-title">¡Gracias por tu Compra!</h2>
                <p class="compra-confirmacion-mensaje">
                    Tu pedido ha sido procesado exitosamente
                </p>
                <p class="compra-confirmacion-submensaje">
                    ¡Sigue explorando nuestra colección y encuentra más estilos que te encantarán! 🎉
                </p>
                <div class="compra-confirmacion-buttons">
                    <button class="btn-seguir-comprando" onclick="continuarComprando()">
                        Seguir Comprando
                    </button>
                    <button class="btn-ver-boleta" onclick="verBoletaYCerrar(${JSON.stringify(data).replace(/"/g, '&quot;')})">
                        Ver Boleta
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', exitoHTML);
}

// Continuar comprando
async function continuarComprando() {
    const overlay = document.getElementById('exitoOverlay');
    if (overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => overlay.remove(), 300);
    }
    
    // Actualizar UI
    await actualizarContadorCarrito();
    mostrarCarritoVacio();
    
    // Redirigir a la página de productos
    window.location.href = 'hombre.html';
}

// Ver boleta y cerrar mensaje de éxito
async function verBoletaYCerrar(data) {
    const overlay = document.getElementById('exitoOverlay');
    if (overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => overlay.remove(), 300);
    }
    
    // Mostrar boleta
    mostrarBoleta(data);
    
    // Actualizar UI
    await actualizarContadorCarrito();
    mostrarCarritoVacio();
    
    // Recargar productos para actualizar stock
    if (typeof cargarProductosConStock === 'function') {
        setTimeout(() => cargarProductosConStock(), 1000);
    }
}

// Mostrar mensaje de error
function mostrarMensajeError(mensaje) {
    const errorHTML = `
        <div class="compra-confirmacion-overlay" id="errorOverlay">
            <div class="compra-confirmacion-box">
                <div class="compra-confirmacion-icon" style="color: #e74c3c;">❌</div>
                <h2 class="compra-confirmacion-title" style="color: #e74c3c;">Error en la compra</h2>
                <p class="compra-confirmacion-mensaje">
                    ${mensaje}
                </p>
                <div class="compra-confirmacion-buttons">
                    <button class="btn-ver-boleta" onclick="cerrarError()" style="background: #e74c3c;">
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', errorHTML);
}

// Cerrar mensaje de error
function cerrarError() {
    const overlay = document.getElementById('errorOverlay');
    if (overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => overlay.remove(), 300);
    }
}

// Mostrar boleta de compra
function mostrarBoleta(data) {
    const fecha = new Date();
    const numeroBoleta = 'B001-' + String(Math.floor(Math.random() * 100000)).padStart(5, '0');
    
    let itemsHTML = '';
    data.items.forEach(item => {
        const nombre = item.nombreReal || item.title;
        
        itemsHTML += `
            <div class="boleta-item">
                <div class="boleta-item-info">
                    <div class="boleta-item-name">${nombre}</div>
                    <div class="boleta-item-details">${item.quantity} x S/ ${item.price.toFixed(2)}</div>
                </div>
                <div class="boleta-item-total">S/ ${item.subtotal.toFixed(2)}</div>
            </div>
        `;
    });
    
    const boletaHTML = `
        <div class="boleta-overlay active" id="boletaOverlay">
            <div class="boleta-container">
                <div class="boleta-header">
                    <h2>BOLETA DE VENTA</h2>
                    <div class="boleta-numero">${numeroBoleta}</div>
                </div>
                <div class="boleta-body">
                    <div class="boleta-info">
                        <div class="boleta-info-row">
                            <span class="boleta-info-label">Fecha:</span>
                            <span class="boleta-info-value">${fecha.toLocaleDateString('es-PE')}</span>
                        </div>
                        <div class="boleta-info-row">
                            <span class="boleta-info-label">Hora:</span>
                            <span class="boleta-info-value">${fecha.toLocaleTimeString('es-PE')}</span>
                        </div>
                        <div class="boleta-info-row">
                            <span class="boleta-info-label">Cliente:</span>
                            <span class="boleta-info-value">${typeof getCurrentUser === 'function' && getCurrentUser() ? getCurrentUser().name : 'Cliente'}</span>
                        </div>
                    </div>
                    
                    <div class="boleta-items">
                        <div class="boleta-items-title">Detalle de Compra</div>
                        ${itemsHTML}
                    </div>
                    
                    <div class="boleta-totales">
                        <div class="boleta-total-row final">
                            <span>TOTAL A PAGAR:</span>
                            <span>S/ ${data.total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
                <div class="boleta-footer">
                    <div class="boleta-mensaje">¡Gracias por tu compra!</div>
                    <div style="display: flex; gap: 10px; justify-content: center; margin-top: 15px;">
                        <button class="btn-imprimir-boleta" onclick="window.print()">
                            <i class="fa-solid fa-print"></i> Imprimir
                        </button>
                        <button class="btn-cerrar-boleta" onclick="cerrarBoleta()">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Insertar en el DOM
    document.body.insertAdjacentHTML('beforeend', boletaHTML);
}

// Cerrar boleta
function cerrarBoleta() {
    const overlay = document.getElementById('boletaOverlay');
    if (overlay) {
        overlay.remove();
    }
}
