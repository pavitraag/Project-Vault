// ML Projects JavaScript
document.addEventListener("DOMContentLoaded", function () {
  // Simple intersection observer for fade-in animations
  const observerOptions = {
    threshold: 0.2,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in");
        observer.unobserve(entry.target); // Stop observing once animated
      }
    });
  }, observerOptions);

  // Observe all project cards
  const cards = document.querySelectorAll(".project-card");
  cards.forEach((card) => {
    observer.observe(card);
  });

  // Simple hover effects for tech tags
  const techTags = document.querySelectorAll(".tech-tag");
  techTags.forEach((tag) => {
    tag.addEventListener("mouseenter", function () {
      this.style.transform = "scale(1.05) translateY(-1px)";
    });

    tag.addEventListener("mouseleave", function () {
      this.style.transform = "scale(1) translateY(0)";
    });
  });

  // View code button click effects
  const viewCodeBtns = document.querySelectorAll(".view-code-btn");
  viewCodeBtns.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      // Simple click feedback
      this.style.transform = "scale(0.95)";
      setTimeout(() => {
        this.style.transform = "";
      }, 150);

      console.log(
        "Viewing code for:",
        this.closest(".project-card").querySelector("h3").textContent
      );
    });
  });

  // Back button animation
  const backButton = document.querySelector(".back-button");
  if (backButton) {
    backButton.addEventListener("click", function (e) {
      e.preventDefault();

      const originalText = this.innerHTML;
      this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Going back...';

      setTimeout(() => {
        window.location.href = this.getAttribute("href");
      }, 300);
    });
  }

  // Smooth scrolling for internal links
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

  // Update project statistics
  updateProjectStats();
});

// Update project statistics
function updateProjectStats() {
  const totalProjects = document.querySelectorAll(".project-card").length;
  const techTags = document.querySelectorAll(".tech-tag");
  const uniqueTechnologies = new Set(
    Array.from(techTags).map((tag) => tag.textContent)
  );

  console.log(
    `ML Projects Dashboard: ${totalProjects} projects using ${uniqueTechnologies.size} technologies`
  );
}

let favoriteProjects = JSON.parse(localStorage.getItem("favorites")) || [];
let showingFavorites = false; // flag for toggle

function toggleFavorite(btn) {
  const card = btn.closest(".category-card");
  const projectName = card.querySelector("h3").innerText;
  const icon = btn.querySelector("i");

  if (favoriteProjects.includes(projectName)) {
    favoriteProjects = favoriteProjects.filter(p => p !== projectName);
    icon.classList.remove("fa-solid");
    icon.classList.add("fa-regular");
  } else {
    favoriteProjects.push(projectName);
    icon.classList.remove("fa-regular");
    icon.classList.add("fa-solid");
  }

  localStorage.setItem("favorites", JSON.stringify(favoriteProjects));
}

function toggleFavorites() {
  const cards = document.querySelectorAll(".category-card");
  const btn = document.getElementById("favoritesToggleBtn");

  if (!showingFavorites) {
    // Show only favorites
    cards.forEach(card => {
      const title = card.querySelector("h3")?.innerText;
      if (!favoriteProjects.includes(title)) {
        card.style.display = "none";
      } else {
        card.style.display = "block";
      }
    });
    btn.innerText = "Show All";
    showingFavorites = true;
  } else {
    // Show all projects
    cards.forEach(card => {
      card.style.display = "block";
    });
    btn.innerText = "Show Favorites";
    showingFavorites = false;
  }
}

// Highlight stars on reload
window.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".category-card").forEach(card => {
    const title = card.querySelector("h3")?.innerText;
    const icon = card.querySelector(".fav-btn i");
    if (title && favoriteProjects.includes(title) && icon) {
      icon.classList.remove("fa-regular");
      icon.classList.add("fa-solid");
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const favoriteButtons = document.querySelectorAll(".fav-btn");
  const favoritesToggleBtn = document.getElementById("favoritesToggleBtn");

  // Toggle single card's favorite state
  favoriteButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const icon = btn.querySelector("i");
      icon.classList.toggle("fa-solid");
      icon.classList.toggle("fa-regular");
      icon.style.color = icon.classList.contains("fa-solid") ? "light purple" : "inherit";
    });
  });
  
  // Toggle Show Favorites / Show All
  favoritesToggleBtn.addEventListener("click", () => {
    const isFiltering = favoritesToggleBtn.innerText === "Show Favorites";

    // Get all types of cards
    const allCards = document.querySelectorAll(".project-card, .category-card");

    allCards.forEach((card) => {
      const btn = card.querySelector(".fav-btn");
      const icon = btn?.querySelector("i");
      const isFavorited = icon && icon.classList.contains("fa-solid");

      // Show only favorited if filtering, else show all
      card.style.display = (isFiltering && !isFavorited) ? "none" : "block";
    });

    favoritesToggleBtn.innerText = isFiltering ? "Show All" : "Show Favorites";
  });
});
