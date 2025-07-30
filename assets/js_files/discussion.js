const form = document.getElementById("new-post-form");
const feed = document.getElementById("forum-feed");
const textarea = document.getElementById("post-content");

// Load existing posts from localStorage
let posts = JSON.parse(localStorage.getItem("forumPosts")) || [];

// Display saved posts on page load
window.addEventListener("load", () => {
  posts.forEach(displayPost);
});

// Save new post and update localStorage
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const content = textarea.value.trim();
  if (content === "") return;

  const timestamp = new Date().toLocaleString();
  const newPost = { content, timestamp };

  posts.unshift(newPost); // add to top
  localStorage.setItem("forumPosts", JSON.stringify(posts));

  displayPost(newPost);
  textarea.value = "";
});

// Display post on the page
function displayPost({ content, timestamp }) {
  const post = document.createElement("div");
  post.classList.add("post");

  const text = document.createElement("p");
  text.textContent = content;

  const time = document.createElement("small");
  time.textContent = `Posted on ${timestamp}`;
  time.style.display = "block";
  time.style.marginTop = "0.5rem";
  time.style.color = "#666";

  post.appendChild(text);
  post.appendChild(time);
  feed.prepend(post);
}