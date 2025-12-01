let currentIndex = 0;

// Seleccionar todas las imagenes
const items = document.querySelectorAll('.obj-galeria');
const totalItems = items.length;

// Mostrar la primera imagen solo si hay items
if (items.length > 0) {
    items[currentIndex].classList.add('active');
}

function navigate(direction) {
    if (items.length === 0) return;
    items[currentIndex].classList.remove('active');
    currentIndex = (currentIndex + direction + totalItems) % totalItems;
    items[currentIndex].classList.add('active');
}

const prevButton = document.querySelector('.prev-button');
const nextButton = document.querySelector('.next-button');

if (prevButton) prevButton.addEventListener('click', () => navigate(-1));
if (nextButton) nextButton.addEventListener('click', () => navigate(1));

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

if (items.length > 0) {
    startAutoplay(3000);
}

// Detener autoplay al usar botones
document.querySelectorAll('.botones').forEach(btn => {
    btn.addEventListener('click', stopAutoplay);
});
