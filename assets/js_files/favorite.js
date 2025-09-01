function toggleFavorite(btn) {
  const card = btn.closest('.project-card') || btn.closest('.category-card');
  const title = card.querySelector('h3').innerText;
  const icon = btn.querySelector('i');
  const pageKey = window.location.pathname.split("/").pop().replace(".html", "");
  const storageKey = `favorites-${pageKey}`;
  const favorites = JSON.parse(localStorage.getItem(storageKey)) || [];

  card.classList.toggle('favorited');
  const isFav = card.classList.contains('favorited');

  icon.classList.toggle('fa-regular', !isFav);
  icon.classList.toggle('fa-solid', isFav);

  if (isFav) {
    if (!favorites.includes(title)) favorites.push(title);
  } else {
    const index = favorites.indexOf(title);
    if (index !== -1) favorites.splice(index, 1);
  }

  localStorage.setItem(storageKey, JSON.stringify(favorites));
}

function loadFavorites() {
  const pageKey = window.location.pathname.split("/").pop().replace(".html", "");
  const storageKey = `favorites-${pageKey}`;
  const favorites = JSON.parse(localStorage.getItem(storageKey)) || [];

  document.querySelectorAll('.project-card, .category-card').forEach(card => {
    const title = card.querySelector('h3').innerText;
    const icon = card.querySelector('.fav-btn i');
    if (favorites.includes(title)) {
      card.classList.add('favorited');
      icon.classList.remove('fa-regular');
      icon.classList.add('fa-solid');
    }
  });
}

function toggleFavoritesView() {
  const btn = document.getElementById('favoritesToggleBtn');
  const showOnlyFavorites = btn.classList.toggle('showing');
  const pageKey = window.location.pathname.split("/").pop().replace(".html", "");
  const storageKey = `favorites-${pageKey}`;
  const favorites = JSON.parse(localStorage.getItem(storageKey)) || [];

  document.querySelectorAll('.project-card, .category-card').forEach(card => {
    const title = card.querySelector('h3').innerText;
    card.style.display = (showOnlyFavorites && !favorites.includes(title)) ? 'none' : 'block';
  });

  btn.innerText = showOnlyFavorites ? 'Show All' : 'Show Favorites';
}

window.addEventListener('DOMContentLoaded', loadFavorites);
