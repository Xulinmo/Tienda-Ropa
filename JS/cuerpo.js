let currentIndex = 0;

// Seleccionar todas las imagenes
const items = document.querySelectorAll('.obj-galeria');
const totalItems = items.length;

// Mostrar la primera imagen
items[currentIndex].classList.add('active');

function navigate(direction) {
    items[currentIndex].classList.remove('active');
    currentIndex = (currentIndex + direction + totalItems) % totalItems;
    items[currentIndex].classList.add('active');
}

document.querySelector('.prev-button').addEventListener('click', () => navigate(-1));
document.querySelector('.next-button').addEventListener('click', () => navigate(1));

// AUTOPLAY
let autoplayInterval = null;

function startAutoplay(interval) {
    stopAutoplay();
    autoplayInterval = setInterval(() => {
        navigate(1);
    }, interval);
}

function stopAutoplay() {
    clearInterval(autoplayInterval);
}

startAutoplay(3000);

// Detener autoplay al usar botones
document.querySelectorAll('.botones').forEach(btn => {
    btn.addEventListener('click', stopAutoplay);
});
