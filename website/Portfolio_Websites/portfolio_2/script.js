// Scroll reveal animation
function revealSections() {
    document.querySelectorAll('section, .hero-right').forEach(el => {
        const position = el.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (position < windowHeight - 100) {
            el.classList.add('show');
        }
    });
}
window.addEventListener('scroll', revealSections);
window.addEventListener('load', revealSections);

// Contact form basic handler
document.getElementById('contactForm').addEventListener('submit', e => {
    e.preventDefault();
    alert("Message sent!");
    e.target.reset();
});
