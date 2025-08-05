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
      mobileMenu &&
      mobileMenu.classList.contains("active") &&
      !mobileMenu.contains(e.target) &&
      !mobileMenuToggle.contains(e.target)
    ) {
      closeMobileMenu();
    }
  });

  if (mobileMenu) {
    mobileMenu.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  }

  // --- Contact Form Handling ---
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!this.checkValidity()) {
        this.reportValidity();
        return;
      }
      const button = this.querySelector('button[type="submit"]');
      const buttonText = button.querySelector(".button-text");
      const loading = button.querySelector(".loading");

      buttonText.style.display = "none";
      loading.style.display = "inline-block";
      button.disabled = true;

      setTimeout(() => {
        this.reset();
        buttonText.style.display = "inline";
        loading.style.display = "none";
        button.disabled = false;
        alert("Thank you for your message! We'll get back to you soon.");
      }, 2000);
    });
  }

  // --- Snake Cursor Effect ---
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

  // --- Navbar Highlight ---
  const currentPath = window.location.pathname.split("/").pop();
  document
    .querySelectorAll(".nav-link, .mobile-menu-link, .footer-ul li a")
    .forEach((link) => {
      if (link.getAttribute("href") && link.getAttribute("href").includes(currentPath)) {
        link.classList.add("active");
      }
      // Highlight dropdown 'Components' if any of its child pages is active
      const componentPages = ["website.html", "games.html", "ml.html"];
      const dropdownToggle = document.querySelector(".dropdown-toggle");
      if (componentPages.includes(currentPath) && dropdownToggle) {
        dropdownToggle.classList.add("active");
      }
    });
    // --- Typing Animation for Main Title (<h1>) ---
const titleOptions = {
  strings: ["Project Vault"],
  typeSpeed: 70,
  backSpeed: 40,
  backDelay: 2000,
  showCursor: false,
  loop: true
};
const typedTitle = new Typed('#animated-title', titleOptions);

// --- Typing Animation for Subtitle (<p>) ---
const subtitleOptions = {
  strings: [
    "Discover amazing projects in Web Dev",
    "Explore creative Games and Designs",
    "Dive into innovative Machine Learning",
  ],
  typeSpeed: 50,
  backSpeed: 25,
  backDelay: 1500,
  loop: true
};
const typedSubtitle = new Typed('#animated-text', subtitleOptions);
});

// Scroll to Top Button 

const scrollToTopBtn = document.getElementById("scroll-to-top-btn");
  window.onscroll = function () {
    if (
      document.body.scrollTop > 200 ||
      document.documentElement.scrollTop > 200
    ) {
        scrollToTopBtn.style.display = "block";
      } else {
        scrollToTopBtn.style.display = "none";
      }
  };
    scrollToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});