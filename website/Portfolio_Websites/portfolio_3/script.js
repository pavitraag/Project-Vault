// Typing effect
const typingElement = document.querySelector(".typing");
const words = ["Hello, I'm Alex.", "I Build Websites.", "I Love Coding."];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function type() {
    const currentWord = words[wordIndex];
    const currentText = currentWord.substring(0, charIndex);
    typingElement.textContent = currentText;

    if (!isDeleting && charIndex < currentWord.length) {
        charIndex++;
        setTimeout(type, 100);
    } else if (isDeleting && charIndex > 0) {
        charIndex--;
        setTimeout(type, 50);
    } else {
        if (!isDeleting) {
            isDeleting = true;
            setTimeout(type, 1000);
        } else {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            setTimeout(type, 200);
        }
    }
}

type();

// Contact form handler
document.getElementById("contactForm").addEventListener("submit", e => {
    e.preventDefault();
    alert("Message sent successfully!");
    e.target.reset();
});
