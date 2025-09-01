const typingElement = document.getElementById('typing');
const texts = [
    "Aspiring Web Developer",
    "AI/ML Enthusiast",
    "Open Source Contributor",
    "Creative Problem Solver"
];
let index = 0;
let charIndex = 0;
let currentText = '';
let isDeleting = false;

function typeEffect() {
    if (isDeleting) {
        currentText = texts[index].substring(0, charIndex--);
    } else {
        currentText = texts[index].substring(0, charIndex++);
    }
    typingElement.textContent = currentText;

    let typeSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === texts[index].length) {
        typeSpeed = 1500; // Pause at end
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        index = (index + 1) % texts.length; // Move to next text
        typeSpeed = 500;
    }
    setTimeout(typeEffect, typeSpeed);
}
typeEffect();
// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Simple contact form alert (replace with backend later)
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Message sent successfully!');
    this.reset();
});
