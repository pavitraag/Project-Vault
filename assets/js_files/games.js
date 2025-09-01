// Games Page JavaScript - Animation and Interactive Effects

document.addEventListener("DOMContentLoaded", function () {
  // Load footer
  loadFooter();

  // Initialize animations
  initializeAnimations();

  // Add scroll animations
  addScrollAnimations();

  // Add interactive effects
  addInteractiveEffects();

  // Add mouse tracking for background effect
  addMouseTracking();
});

function initializeAnimations() {
  const cards = document.querySelectorAll(".category-card");

  cards.forEach((card, index) => {
    // Set animation delay based on index
    card.style.animationDelay = `${(index + 1) * 0.1}s`;

    // Add hover effect listeners
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-15px) scale(1.02)";
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)";
    });
  });
}

// Add scroll-triggered animations
function addScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in");
        // Add a subtle bounce effect
        entry.target.style.animation =
          "fadeInUp 0.6s ease-out forwards, bounce 0.3s ease-out 0.6s";
      }
    });
  }, observerOptions);

  // Observe all cards
  document.querySelectorAll(".category-card").forEach((card) => {
    observer.observe(card);
  });
}

// Add interactive effects
function addInteractiveEffects() {
  // Enhanced button interactions
  const buttons = document.querySelectorAll(".play-button");
  buttons.forEach((button) => {
    button.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-3px) scale(1.05)";
    });

    button.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)";
    });

    button.addEventListener("click", function (e) {
      // Add ripple effect
      createRipple(e, this);

      // Add click animation
      this.style.transform = "scale(0.95)";
      setTimeout(() => {
        this.style.transform = "translateY(-3px) scale(1.05)";
      }, 150);
    });
  });

  // Back button enhancement
  const backButton = document.querySelector(".back-button");
  if (backButton) {
    backButton.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-2px) scale(1.05)";
    });

    backButton.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)";
    });

    backButton.addEventListener("click", function (e) {
      createRipple(e, this);
    });
  }
}

// Create ripple effect on button click
function createRipple(event, element) {
  const button = element;
  const circle = document.createElement("span");
  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;

  const rect = button.getBoundingClientRect();
  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${event.clientX - rect.left - radius}px`;
  circle.style.top = `${event.clientY - rect.top - radius}px`;
  circle.classList.add("ripple");

  // Add ripple styles
  circle.style.position = "absolute";
  circle.style.borderRadius = "50%";
  circle.style.background = "rgba(255, 255, 255, 0.6)";
  circle.style.transform = "scale(0)";
  circle.style.animation = "ripple 0.6s linear";
  circle.style.pointerEvents = "none";

  // Add CSS animation keyframes if not already added
  if (!document.querySelector("#ripple-keyframes")) {
    const style = document.createElement("style");
    style.id = "ripple-keyframes";
    style.textContent = `
      @keyframes ripple {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }
      @keyframes bounce {
        0%, 100% { transform: translateY(0) scale(1); }
        50% { transform: translateY(-5px) scale(1.02); }
      }
    `;
    document.head.appendChild(style);
  }

  const ripple = button.getElementsByClassName("ripple")[0];
  if (ripple) {
    ripple.remove();
  }

  button.appendChild(circle);

  // Remove ripple after animation
  setTimeout(() => {
    circle.remove();
  }, 600);
}

// Add mouse tracking for background effect
function addMouseTracking() {
  let mouseX = 0;
  let mouseY = 0;

  document.addEventListener("mousemove", (e) => {
    mouseX = (e.clientX / window.innerWidth) * 100;
    mouseY = (e.clientY / window.innerHeight) * 100;

    document.documentElement.style.setProperty("--mouse-x", mouseX + "%");
    document.documentElement.style.setProperty("--mouse-y", mouseY + "%");

    // Show background effect
    document.body.style.setProperty("--bg-opacity", "1");
  });

  document.addEventListener("mouseleave", () => {
    document.body.style.setProperty("--bg-opacity", "0");
  });
}

// Smooth scroll for any anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Add loading animation for page
window.addEventListener("load", function () {
  document.body.classList.add("page-loaded");

  // Add subtle entrance animation to header
  const header = document.querySelector("header");
  if (header) {
    header.style.opacity = "0";
    header.style.transform = "translateY(-20px)";

    setTimeout(() => {
      header.style.transition = "all 0.8s ease-out";
      header.style.opacity = "1";
      header.style.transform = "translateY(0)";
    }, 100);
  }
});

// Add keyboard navigation for better accessibility
document.addEventListener("keydown", function (e) {
  const focusedElement = document.activeElement;

  if (e.key === "Enter" && focusedElement.classList.contains("play-button")) {
    focusedElement.click();
  }
});

// Game-specific enhancements
function addGameSpecificEffects() {
  const cards = document.querySelectorAll(".category-card");

  cards.forEach((card, index) => {
    // Add game-specific hover sounds (optional)
    card.addEventListener("mouseenter", () => {
      // You can add sound effects here if needed
      playHoverSound(index);
    });
  });
}

addGameSpecificEffects();

// Add performance optimization
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Debounced window resize handler
const handleResize = debounce(() => {
  // Handle responsive changes if needed
  const cards = document.querySelectorAll(".category-card");
  cards.forEach((card) => {
    // Reset any transforms on resize
    card.style.transform = "";
  });
}, 250);

window.addEventListener("resize", handleResize);


document.addEventListener("DOMContentLoaded", () => {
  const favoriteButtons = document.querySelectorAll(".fav-btn");
  const favoritesToggleBtn = document.getElementById("favoritesToggleBtn");

  // ⭐ Toggle star icon on each card
  favoriteButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.classList.toggle("favorited");

      const icon = btn.querySelector("i");
      icon.classList.toggle("fa-regular");
      icon.classList.toggle("fa-solid");

      // Optional: Make the star gold if favorited
      if (btn.classList.contains("favorited")) {
        icon.style.color = "light purple";
      } else {
        icon.style.color = "inherit";
      }
    });
  });

  // 🔄 Show Favorites / Show All toggle
  favoritesToggleBtn.addEventListener("click", () => {
    const isFiltering = favoritesToggleBtn.innerText === "Show All";
    const allCards = document.querySelectorAll(".category-card");

    allCards.forEach((card) => {
      const starBtn = card.querySelector(".fav-btn");
      const isFavorited = starBtn && starBtn.classList.contains("favorited");

      if (isFiltering) {
        // Show all cards
        card.style.display = "block";
      } else {
        // Show only favorited cards
        card.style.display = isFavorited ? "block" : "none";
      }
    });

    // Toggle button text
    favoritesToggleBtn.innerText = isFiltering ? "Show Favorites" : "Show All";
  });
});
