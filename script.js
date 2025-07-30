document.addEventListener("DOMContentLoaded", () => {
  // --- Mobile Menu Functionality ---
  const mobileMenuToggle = document.getElementById("mobileMenuToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  const mobileMenuClose = document.getElementById("mobileMenuClose");
  const mobileMenuLinks = document.querySelectorAll(".mobile-menu a");
  const submenuToggle = document.querySelector(".submenu-toggle");
  const mobileSubmenu = document.querySelector(".mobile-submenu");

  function toggleMobileMenu() {
    mobileMenu.classList.toggle("active");

    const spans = mobileMenuToggle.querySelectorAll("span");
    if (mobileMenu.classList.contains("active")) {
      spans[0].style.transform = "rotate(45deg) translate(5px, 5px)";
      spans[1].style.opacity = "0";
      spans[2].style.transform = "rotate(-45deg) translate(7px, -6px)";
    } else {
      spans[0].style.transform = "none";
      spans[1].style.opacity = "1";
      spans[2].style.transform = "none";
    }
  }

  function closeMobileMenu() {
    mobileMenu.classList.remove("active");
    const spans = mobileMenuToggle.querySelectorAll("span");
    spans[0].style.transform = "none";
    spans[1].style.opacity = "1";
    spans[2].style.transform = "none";
  }

  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener("click", toggleMobileMenu);
  }

  if (mobileMenuClose) {
    mobileMenuClose.addEventListener("click", closeMobileMenu);
  }

  mobileMenuLinks.forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  if (submenuToggle && mobileSubmenu) {
    submenuToggle.addEventListener("click", (e) => {
      e.preventDefault();
      mobileSubmenu.classList.toggle("open");
    });
  }

  document.addEventListener("click", (e) => {
    if (
      mobileMenu.classList.contains("active") &&
      !mobileMenu.contains(e.target) &&
      !mobileMenuToggle.contains(e.target)
    ) {
      closeMobileMenu();
    }
  });

  mobileMenu.addEventListener("click", (e) => {
    e.stopPropagation();
  });




  // --- Contact Form Handling ---
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
       if (!this.checkValidity()) {
    this.reportValidity();  // Show native browser messages
    return;
       }
      const formData = new FormData(this);
      const button = this.querySelector('button[type="submit"]');
      const buttonText = button.querySelector(".button-text");
      const loading = button.querySelector(".loading");

      // Show loading state
      buttonText.style.display = "none";
      loading.style.display = "inline-block";
      button.disabled = true;

      // Simulate async submission
      setTimeout(() => {
        this.reset();
        buttonText.style.display = "inline";
        loading.style.display = "none";
        button.disabled = false;

        alert("Thank you for your message! We'll get back to you soon.");
      }, 2000);
    });
  }
const NUM_TRAILS = 30;
const snakeDots = [];

for (let i = 0; i < NUM_TRAILS; i++) {
  const dot = document.createElement("div");
  dot.classList.add("snake-dot");
  document.body.appendChild(dot);
  snakeDots.push({
    el: dot,
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    scale: 1 - i * 0.02,
    opacity: 1 - i * 0.02
  });
}

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animateSnakeCursor() {
  let x = mouseX;
  let y = mouseY;

  snakeDots.forEach((dot, i) => {
    const next = snakeDots[i + 1] || { x, y };

    // Faster follow speed
    dot.x += (x - dot.x) * 0.35;
    dot.y += (y - dot.y) * 0.35;

    dot.el.style.left = `${dot.x}px`;
    dot.el.style.top = `${dot.y}px`;
    dot.el.style.transform = `translate(-50%, -50%) scale(${dot.scale})`;
    dot.el.style.opacity = dot.opacity;

    x = dot.x;
    y = dot.y;
  });

  requestAnimationFrame(animateSnakeCursor);
}

animateSnakeCursor();


  // --- Set Current Year ---
  const currentYearElement = document.getElementById("currentYear");
  if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
  }
});
const currentPath = window.location.pathname.split("/").pop();

// Navbar
document
  .querySelectorAll(".nav-link, .mobile-menu-link, .footer-ul li a")
  .forEach((link) => {
    if (link.getAttribute("href").includes(currentPath)) {
      link.classList.add("active");
    }
    // Highlight dropdown 'Components' if any of its child pages is active
    const componentPages = ["website.html", "games.html", "ml.html"];
    const dropdownToggle = document.querySelector(".dropdown-toggle");

    if (componentPages.includes(currentPath) && dropdownToggle) {
      dropdownToggle.classList.add("active");
    }
    // --- Typing Animation for Hero Section ---
const options = {
  strings: [
    "Discover amazing projects in Web Dev",
    "Explore creative Games and Designs",
    "Dive into innovative Machine Learning",
  ],
  typeSpeed: 50,    // Type karne ki speed
  backSpeed: 25,    // Backspace ki speed
  backDelay: 1500,  // Ek line likhne ke baad rukne ka time
  loop: true        // Hamesha chalta rahega
};

// Yeh line uss #animated-text (jo humne HTML mein banaya tha) ko dhundhti hai
// aur uspar upar diye gaye options ke saath animation shuru kar deti hai.
const typed = new Typed('#animated-text', options);
  });
