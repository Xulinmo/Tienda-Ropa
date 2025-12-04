// Toggle del menú hamburguesa
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const menu = document.getElementById('Menu');
    const menuOverlay = document.getElementById('menuOverlay');
    
    if (!menuToggle || !menu || !menuOverlay) return;
    
    const menuIcon = menuToggle.querySelector('i');
    
    // Abrir/cerrar menú al hacer clic en el botón
    menuToggle.addEventListener('click', function() {
        menu.classList.toggle('active');
        menuOverlay.classList.toggle('active');
        
        // Cambiar ícono entre hamburguesa y X
        if (menu.classList.contains('active')) {
            menuIcon.classList.remove('fa-bars');
            menuIcon.classList.add('fa-times');
            document.body.style.overflow = 'hidden'; // Evitar scroll
        } else {
            menuIcon.classList.add('fa-bars');
            menuIcon.classList.remove('fa-times');
            document.body.style.overflow = ''; // Restaurar scroll
        }
    });
    
    // Cerrar menú al hacer clic en el overlay
    menuOverlay.addEventListener('click', function() {
        menu.classList.remove('active');
        menuOverlay.classList.remove('active');
        menuIcon.classList.add('fa-bars');
        menuIcon.classList.remove('fa-times');
        document.body.style.overflow = '';
    });
    
    // Cerrar menú al hacer clic en un enlace
    const menuLinks = menu.querySelectorAll('a');
    menuLinks.forEach(link => {
        link.addEventListener('click', function() {
            menu.classList.remove('active');
            menuOverlay.classList.remove('active');
            menuIcon.classList.add('fa-bars');
            menuIcon.classList.remove('fa-times');
            document.body.style.overflow = '';
        });
    });
    
    // Cerrar menú al presionar tecla ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && menu.classList.contains('active')) {
            menu.classList.remove('active');
            menuOverlay.classList.remove('active');
            menuIcon.classList.add('fa-bars');
            menuIcon.classList.remove('fa-times');
            document.body.style.overflow = '';
        }
    });
});