// Sistema de Login/Registro
const API_URL = 'http://localhost:3000/api';

// Estado del usuario
let currentUser = null;

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
    setupModalEvents();
});

// Verificar si hay sesión activa
function checkLoginStatus() {
    const userData = localStorage.getItem('user');
    if (userData) {
        currentUser = JSON.parse(userData);
        updateUILoggedIn();
    }
}

// Configurar eventos de los modales
function setupModalEvents() {
    const loginBtn = document.getElementById('btnLogin');
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const closeButtons = document.querySelectorAll('.modal-close');
    
    // Abrir modal de login
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            loginModal.classList.add('active');
        });
    }
    
    // Cerrar modales
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            loginModal?.classList.remove('active');
            registerModal?.classList.remove('active');
        });
    });
    
    // Cerrar al hacer clic fuera del modal
    [loginModal, registerModal].forEach(modal => {
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        }
    });
    
    // Cambiar entre login y registro
    document.getElementById('showRegister')?.addEventListener('click', (e) => {
        e.preventDefault();
        loginModal.classList.remove('active');
        registerModal.classList.add('active');
    });
    
    document.getElementById('showLogin')?.addEventListener('click', (e) => {
        e.preventDefault();
        registerModal.classList.remove('active');
        loginModal.classList.add('active');
    });
    
    // Formularios
    document.getElementById('loginForm')?.addEventListener('submit', handleLogin);
    document.getElementById('registerForm')?.addEventListener('submit', handleRegister);
    
    // Logout
    document.getElementById('btnLogout')?.addEventListener('click', handleLogout);
}

// Manejar login
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            showError('loginError', data.error || 'Error al iniciar sesión');
            return;
        }
        
        // Guardar sesión
        currentUser = data.user;
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Actualizar UI
        updateUILoggedIn();
        document.getElementById('loginModal').classList.remove('active');
        
        showSuccess('loginError', '¡Bienvenido!');
        
        // Recargar carrito con el usuario correcto
        if (typeof actualizarContadorCarrito === 'function') {
            actualizarContadorCarrito();
        }
        
    } catch (error) {
        console.error('Error:', error);
        showError('loginError', 'Error de conexión');
    }
}

// Manejar registro
async function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    
    if (password !== confirmPassword) {
        showError('registerError', 'Las contraseñas no coinciden');
        return;
    }
    
    if (password.length < 6) {
        showError('registerError', 'La contraseña debe tener al menos 6 caracteres');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            showError('registerError', data.error || 'Error al registrarse');
            return;
        }
        
        // Mostrar mensaje de éxito y cambiar a login
        showSuccess('registerError', '¡Cuenta creada con éxito! Ahora puedes iniciar sesión');
        
        // Limpiar formulario de registro
        document.getElementById('registerForm').reset();
        
        // Después de 2 segundos, cambiar al modal de login
        setTimeout(() => {
            document.getElementById('registerModal').classList.remove('active');
            document.getElementById('loginModal').classList.add('active');
            
            // Pre-llenar el email en el login
            document.getElementById('loginEmail').value = email;
        }, 2000);
        
    } catch (error) {
        console.error('Error:', error);
        showError('registerError', 'Error de conexión');
    }
}

// Manejar logout
function handleLogout() {
    if (confirm('¿Deseas cerrar sesión?')) {
        currentUser = null;
        localStorage.removeItem('user');
        updateUILoggedOut();
        
        // Recargar página para limpiar estado
        window.location.reload();
    }
}

// Actualizar UI cuando el usuario está logueado
function updateUILoggedIn() {
    const btnLogin = document.getElementById('btnLogin');
    const userInfo = document.getElementById('userInfo');
    const userName = document.getElementById('userName');
    
    if (btnLogin) btnLogin.style.display = 'none';
    if (userInfo) userInfo.classList.add('active');
    if (userName && currentUser) userName.textContent = currentUser.name;
}

// Actualizar UI cuando el usuario no está logueado
function updateUILoggedOut() {
    const btnLogin = document.getElementById('btnLogin');
    const userInfo = document.getElementById('userInfo');
    
    if (btnLogin) btnLogin.style.display = 'block';
    if (userInfo) userInfo.classList.remove('active');
}

// Mostrar mensajes de error
function showError(elementId, message) {
    const errorEl = document.getElementById(elementId);
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.classList.add('active');
        errorEl.classList.remove('success-message');
        errorEl.classList.add('error-message');
        setTimeout(() => errorEl.classList.remove('active'), 4000);
    }
}

// Mostrar mensajes de éxito
function showSuccess(elementId, message) {
    const errorEl = document.getElementById(elementId);
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.classList.add('active');
        errorEl.classList.remove('error-message');
        errorEl.classList.add('success-message');
        setTimeout(() => errorEl.classList.remove('active'), 3000);
    }
}

// Obtener usuario actual
function getCurrentUser() {
    return currentUser;
}

// Obtener ID del usuario actual (para usar en carrito.js)
function getCurrentUserId() {
    return currentUser ? currentUser.id : 1; // Fallback a usuario demo
}
