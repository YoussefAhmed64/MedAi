document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelector('.slides');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    let currentSlide = 0;
    const totalSlides = document.querySelectorAll('.slide').length;

    // Initialize slides position
    updateSlide();

    // Auto-advance slides every 5 seconds
    let slideInterval = setInterval(nextSlide, 5000);

    function updateSlide() {
        slides.style.transform = `translateX(-${currentSlide * 100}%)`;
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlide();
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateSlide();
    }

    // Event listeners for buttons
    nextBtn.addEventListener('click', () => {
        clearInterval(slideInterval);
        nextSlide();
        slideInterval = setInterval(nextSlide, 5000);
    });

    prevBtn.addEventListener('click', () => {
        clearInterval(slideInterval);
        prevSlide();
        slideInterval = setInterval(nextSlide, 5000);
    });

    // Pause auto-advance when hovering over slideshow
    const slideshowContainer = document.querySelector('.slideshow-container');
    slideshowContainer.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });

    slideshowContainer.addEventListener('mouseleave', () => {
        slideInterval = setInterval(nextSlide, 5000);
    });

    // Handle logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            // Clear any stored session data
            localStorage.removeItem('currentUser');
            // Redirect to login page
            window.location.href = 'login.html';
        });
    }
}); 