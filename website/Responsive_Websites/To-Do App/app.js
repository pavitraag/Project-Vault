// Background Particles Management
class BackgroundParticles {
  constructor() {
    this.particlesContainer = document.querySelector(".particles");
    this.numberOfParticles = 50;
    this.init();
  }

  init() {
    // Clear existing particles
    this.particlesContainer.innerHTML = "";

    // Create particles
    for (let i = 0; i < this.numberOfParticles; i++) {
      const particle = document.createElement("div");
      particle.className = "particle";

      // Random size between 5 and 20 pixels
      const size = Math.random() * 15 + 5;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;

      // Random position
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;

      // Random animation duration between 5 and 15 seconds
      const duration = Math.random() * 10 + 5;
      particle.style.animation = `float ${duration}s ease-in-out infinite`;

      // Random delay
      particle.style.animationDelay = `${Math.random() * -15}s`;

      // Random opacity between 0.1 and 0.3
      particle.style.opacity = (Math.random() * 0.2 + 0.1).toString();

      this.particlesContainer.appendChild(particle);
    }
  }
}

// Initialize background particles when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new BackgroundParticles();
});

// Handle theme changes
if (window.matchMedia) {
  const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  darkModeMediaQuery.addListener((e) => {
    // Smoothly transition the background when theme changes
    document.body.classList.toggle("dark-theme", e.matches);
  });
}

// Clock Management
class ClockManager {
  constructor() {
    this.clockElement = document.getElementById("clock");
    this.dateElement = document.getElementById("date");
    this.updateClock();
    // Update every second
    setInterval(() => this.updateClock(), 1000);
  }

  updateClock() {
    const now = new Date();

    // Update time
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
    const timeString = `${hours} : ${minutes} : ${seconds}`;

    // Update date
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const dateString = now.toLocaleDateString("en-US", options);

    // Update DOM only if content has changed
    if (this.clockElement.textContent !== timeString) {
      this.clockElement.textContent = timeString;
    }
    if (this.dateElement.textContent !== dateString) {
      this.dateElement.textContent = dateString;
    }
  }
}

// Task Management
class TaskManager {
  constructor() {
    // Initialize clock
    new ClockManager();
    this.tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    this.currentFilter = "all";
    this.checkNotificationPermission();
    this.initializeEventListeners();
    this.renderTasks();
    this.updateStats();
    this.setupServiceWorker();
    this.setupOfflineStatus();
    this.initializeReminderChecker();
  }

  async checkNotificationPermission() {
    if (!("Notification" in window)) {
      console.log("This browser does not support notifications");
      return;
    }

    if (Notification.permission !== "granted") {
      try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          this.showNotification("Notifications enabled successfully!");
        }
      } catch (error) {
        console.error("Error requesting notification permission:", error);
      }
    }
  }

  initializeReminderChecker() {
    // Check for due reminders every minute
    setInterval(() => this.checkReminders(), 60000);
    // Also check immediately
    this.checkReminders();
  }

  checkReminders() {
    const now = new Date();
    this.tasks.forEach((task) => {
      if (task.reminder && !task.completed && !task.notificationSent) {
        const reminderTime = new Date(task.reminder);
        if (now >= reminderTime) {
          this.sendNotification(task);
          // Mark notification as sent
          task.notificationSent = true;
          this.saveTasks();
        }
      }
    });
  }

  sendNotification(task) {
    if (Notification.permission === "granted") {
      const notification = new Notification("Task Reminder", {
        body: task.text,
        icon: "/assets/favicon.png",
        badge: "/assets/favicon.png",
        tag: `task-${task.id}`,
        renotify: true,
        requireInteraction: true,
      });

      notification.onclick = () => {
        window.focus();
        document.querySelector(`[data-task-id="${task.id}"]`)?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      };
    }
  }

  addTask() {
    const input = document.getElementById("taskInput");
    const reminderInput = document.getElementById("taskReminder");
    const taskText = input.value.trim();
    const reminderTime = reminderInput?.value;

    if (taskText) {
      const task = {
        id: Date.now(),
        text: taskText,
        completed: false,
        createdAt: new Date().toISOString(),
        reminder: reminderTime || null,
        notificationSent: false,
      };

      this.tasks.unshift(task);
      this.saveTasks();
      this.renderTasks();
      input.value = "";
      if (reminderInput) reminderInput.value = "";
      localStorage.removeItem("draft-task");

      if (task.reminder) {
        this.showNotification(
          `Reminder set for: ${new Date(task.reminder).toLocaleString()}`
        );
      }
    }
  }

  createTaskElement(task) {
    const li = document.createElement("li");
    li.className = `task-item ${task.completed ? "completed" : ""}`;
    li.dataset.taskId = task.id;

    const reminderHtml = task.reminder
      ? `
      <div class="task-reminder">
        <i class="fas fa-bell"></i>
        ${new Date(task.reminder).toLocaleString()}
        <button class="remove-reminder-btn" aria-label="Remove reminder">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `
      : "";

    li.innerHTML = `
      <div class="task-content">
        <input type="checkbox" class="task-checkbox" 
          ${task.completed ? "checked" : ""} 
          aria-label="${
            task.completed ? "Mark task as incomplete" : "Mark task as complete"
          }">
        <span class="task-text">${this.escapeHtml(task.text)}</span>
        ${reminderHtml}
        <span class="task-date">${this.formatDate(task.createdAt)}</span>
      </div>
      <div class="task-actions">
        <button class="reminder-btn" aria-label="Set reminder">
          <i class="fas fa-bell"></i>
        </button>
        <button class="edit-btn" aria-label="Edit task">
          <i class="fas fa-edit"></i>
        </button>
        <button class="delete-btn" aria-label="Delete task">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `;

    // Add existing event listeners
    const checkbox = li.querySelector(".task-checkbox");
    checkbox.addEventListener("change", () => {
      this.toggleTask(task.id);
      li.classList.add("task-updated");
      setTimeout(() => li.classList.remove("task-updated"), 300);
    });

    // Add reminder button handler
    const reminderBtn = li.querySelector(".reminder-btn");
    reminderBtn.addEventListener("click", () => this.setReminder(task.id));

    // Add remove reminder button handler
    const removeReminderBtn = li.querySelector(".remove-reminder-btn");
    if (removeReminderBtn) {
      removeReminderBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.removeReminder(task.id);
      });
    }

    // Add existing edit and delete handlers
    const editBtn = li.querySelector(".edit-btn");
    editBtn.addEventListener("click", () => this.editTask(task.id));

    const deleteBtn = li.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", () => this.deleteTask(task.id));

    return li;
  }

  setReminder(taskId) {
    const task = this.tasks.find((t) => t.id === taskId);
    if (!task) return;

    const currentDateTime = new Date().toISOString().slice(0, 16);
    const reminderDateTime = prompt(
      "Set reminder (yyyy-mm-dd hh:mm):",
      currentDateTime
    );

    if (reminderDateTime) {
      const reminderTime = new Date(reminderDateTime);
      if (isNaN(reminderTime)) {
        this.showNotification("Invalid date format!", "error");
        return;
      }

      task.reminder = reminderTime.toISOString();
      task.notificationSent = false;
      this.saveTasks();
      this.renderTasks();
      this.showNotification("Reminder set successfully!");
    }
  }

  removeReminder(taskId) {
    const task = this.tasks.find((t) => t.id === taskId);
    if (task) {
      task.reminder = null;
      task.notificationSent = false;
      this.saveTasks();
      this.renderTasks();
      this.showNotification("Reminder removed!");
    }
  }

  setupOfflineStatus() {
    // Check initial online status
    this.updateOfflineStatus();

    // Listen for online/offline events
    window.addEventListener("online", () => this.updateOfflineStatus());
    window.addEventListener("offline", () => this.updateOfflineStatus());
  }

  updateOfflineStatus() {
    const isOffline = !navigator.onLine;
    document.body.classList.toggle("offline-mode", isOffline);

    // Show notification when status changes
    if (isOffline) {
      this.showNotification(
        "You are offline. Changes will sync when you're back online.",
        "warning"
      );
    } else {
      this.showNotification(
        "You're back online! All changes have been synced.",
        "success"
      );
    }

    // Update UI elements
    const offlineIndicator =
      document.querySelector(".offline-indicator") ||
      this.createOfflineIndicator();
    offlineIndicator.style.display = isOffline ? "block" : "none";
  }

  createOfflineIndicator() {
    const indicator = document.createElement("div");
    indicator.className = "offline-indicator";
    indicator.innerHTML = `
            <i class="fas fa-wifi-slash"></i>
            <span>Offline Mode</span>
        `;
    document.body.appendChild(indicator);
    return indicator;
  }

  // Modify the saveTasks method to handle offline storage
  saveTasks() {
    try {
      localStorage.setItem("tasks", JSON.stringify(this.tasks));
      if (navigator.onLine) {
        // Here you could add code to sync with a backend server
        // when implementing a backend in the future
      }
    } catch (error) {
      console.error("Error saving tasks:", error);
      this.showNotification("Error saving tasks. Please try again.", "error");
    }
    this.updateStats();
  }

  setupServiceWorker() {
    // Register service worker for PWA support
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js").catch((err) => {
          console.log("ServiceWorker registration failed: ", err);
        });
      });
    }
  }

  initializeEventListeners() {
    // Debounced task input
    const taskInput = document.getElementById("taskInput");
    let inputTimer;
    taskInput.addEventListener("input", () => {
      clearTimeout(inputTimer);
      inputTimer = setTimeout(() => {
        localStorage.setItem("draft-task", taskInput.value);
      }, 300);
    });

    // Restore draft if exists
    const draftTask = localStorage.getItem("draft-task");
    if (draftTask) {
      taskInput.value = draftTask;
    }

    // Add task handlers
    document
      .getElementById("addTask")
      .addEventListener("click", () => this.addTask());
    taskInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") this.addTask();
    });

    // Filter buttons with event delegation
    const filtersContainer = document.querySelector(".filters");
    filtersContainer.addEventListener("click", (e) => {
      if (e.target.classList.contains("filter-btn")) {
        document
          .querySelectorAll(".filter-btn")
          .forEach((b) => b.classList.remove("active"));
        e.target.classList.add("active");
        this.currentFilter = e.target.dataset.filter;
        this.renderTasks();
      }
    });

    // Clear completed with confirmation
    document.getElementById("clearCompleted").addEventListener("click", () => {
      const completedCount = this.tasks.filter((task) => task.completed).length;
      if (completedCount === 0) return;

      if (
        confirm(
          `Are you sure you want to delete ${completedCount} completed task${
            completedCount > 1 ? "s" : ""
          }?`
        )
      ) {
        this.tasks = this.tasks.filter((task) => !task.completed);
        this.saveTasks();
        this.renderTasks();
      }
    });

    // Handle visibility change
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) {
        this.renderTasks(); // Refresh tasks when tab becomes visible
      }
    });
  }

  addTask() {
    const input = document.getElementById("taskInput");
    const taskText = input.value.trim();

    if (taskText) {
      const task = {
        id: Date.now(),
        text: taskText,
        completed: false,
        createdAt: new Date().toISOString(),
      };

      this.tasks.unshift(task);
      this.saveTasks();
      this.renderTasks();
      input.value = "";
      localStorage.removeItem("draft-task");

      // Show success message
      this.showNotification("Task added successfully!");
    }
  }

  showNotification(message, type = "success") {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    // Trigger animation
    setTimeout(() => notification.classList.add("show"), 10);

    // Remove notification
    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => notification.remove(), 300);
    }, 2000);
  }

  toggleTask(id) {
    const task = this.tasks.find((t) => t.id === id);
    if (task) {
      task.completed = !task.completed;
      this.saveTasks();
      this.renderTasks();
    }
  }

  deleteTask(id) {
    const task = this.tasks.find((t) => t.id === id);
    if (confirm(`Are you sure you want to delete task: "${task.text}"?`)) {
      this.tasks = this.tasks.filter((task) => task.id !== id);
      this.saveTasks();
      this.renderTasks();
      this.showNotification("Task deleted successfully!", "warning");
    }
  }

  saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(this.tasks));
    this.updateStats();
  }

  updateStats() {
    const totalTasks = this.tasks.length;
    const completedTasks = this.tasks.filter((task) => task.completed).length;
    const activeTasks = totalTasks - completedTasks;

    document.getElementById("totalTasks").textContent = `Total: ${totalTasks}`;
    document.getElementById(
      "completedTasks"
    ).textContent = `Completed: ${completedTasks}`;

    // Update document title with task count
    document.title =
      activeTasks > 0
        ? `(${activeTasks}) To-Do App | MD._NM's Product`
        : "To-Do App | MD._NM's Product";
  }

  renderTasks() {
    const tasksList = document.getElementById("tasksList");
    const fragment = document.createDocumentFragment();

    const filteredTasks = this.tasks.filter((task) => {
      if (this.currentFilter === "active") return !task.completed;
      if (this.currentFilter === "completed") return task.completed;
      return true;
    });

    if (filteredTasks.length === 0) {
      const emptyMessage = document.createElement("li");
      emptyMessage.className = "empty-state";
      emptyMessage.innerHTML = `
                <i class="fas fa-clipboard-list"></i>
                <p>${this.getEmptyStateMessage()}</p>
            `;
      fragment.appendChild(emptyMessage);
    } else {
      filteredTasks.forEach((task) => {
        const li = this.createTaskElement(task);
        fragment.appendChild(li);
      });
    }

    // Efficiently update DOM
    tasksList.innerHTML = "";
    tasksList.appendChild(fragment);
    this.updateStats();
  }

  createTaskElement(task) {
    const li = document.createElement("li");
    li.className = `task-item ${task.completed ? "completed" : ""}`;

    li.innerHTML = `
            <div class="task-content">
                <input type="checkbox" class="task-checkbox" 
                    ${task.completed ? "checked" : ""} 
                    aria-label="${
                      task.completed
                        ? "Mark task as incomplete"
                        : "Mark task as complete"
                    }">
                <span class="task-text">${this.escapeHtml(task.text)}</span>
                <span class="task-date">${this.formatDate(
                  task.createdAt
                )}</span>
            </div>
            <div class="task-actions">
                <button class="edit-btn" aria-label="Edit task">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-btn" aria-label="Delete task">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;

    // Event Listeners
    const checkbox = li.querySelector(".task-checkbox");
    checkbox.addEventListener("change", () => {
      this.toggleTask(task.id);
      // Add animation class
      li.classList.add("task-updated");
      setTimeout(() => li.classList.remove("task-updated"), 300);
    });

    const editBtn = li.querySelector(".edit-btn");
    editBtn.addEventListener("click", () => this.editTask(task.id));

    const deleteBtn = li.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", () => this.deleteTask(task.id));

    // Double click to edit
    const taskText = li.querySelector(".task-text");
    taskText.addEventListener("dblclick", () => this.editTask(task.id));

    return li;
  }

  editTask(id) {
    const task = this.tasks.find((t) => t.id === id);
    if (!task) return;

    const newText = prompt("Edit task:", task.text);
    if (newText !== null && newText.trim() !== "") {
      task.text = newText.trim();
      task.updatedAt = new Date().toISOString();
      this.saveTasks();
      this.renderTasks();
      this.showNotification("Task updated successfully!");
    }
  }

  getEmptyStateMessage() {
    switch (this.currentFilter) {
      case "active":
        return "No active tasks. Great job! 🎉";
      case "completed":
        return "No completed tasks yet. Keep going! 💪";
      default:
        return "No tasks yet. Add your first task! ✨";
    }
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const day = 24 * 60 * 60 * 1000;

    if (diff < day) {
      return "Today";
    } else if (diff < 2 * day) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  }

  escapeHtml(unsafe) {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}

// Search functionality
class SearchManager {
  constructor(taskManager) {
    this.taskManager = taskManager;
    this.currentFilter = "all";
    this.notes = JSON.parse(localStorage.getItem("notes") || "[]");
    this.initializeSearch();
  }

  initializeSearch() {
    const searchInput = document.getElementById("searchInput");
    const searchResults = document.getElementById("searchResults");
    const filterButtons = document.querySelectorAll(".search-filter-btn");

    // Search input handler with debounce
    let debounceTimer;
    searchInput.addEventListener("input", () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        this.handleSearch(searchInput.value);
      }, 300);
    });

    // Focus handler
    searchInput.addEventListener("focus", () => {
      this.notes = JSON.parse(localStorage.getItem("notes") || "[]"); // Refresh notes data
      searchResults.classList.add("active");
    });

    // Click outside handler
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".search-container")) {
        searchResults.classList.remove("active");
      }
    });

    // Filter buttons handler
    filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        this.currentFilter = btn.dataset.filter;
        this.handleSearch(searchInput.value);
      });
    });
  }

  handleSearch(query) {
    const searchResults = document.getElementById("searchResults");
    query = query.toLowerCase().trim();

    if (!query) {
      searchResults.innerHTML = "";
      searchResults.classList.remove("active");
      return;
    }

    let results = [];

    // Filter based on current filter type
    switch (this.currentFilter) {
      case "tasks":
        results = this.searchTasks(query);
        break;
      case "notes":
        results = this.searchNotes(query);
        break;
      case "date":
        results = [
          ...this.searchTasksByDate(query),
          ...this.searchNotesByDate(query),
        ];
        break;
      default: // 'all'
        results = [...this.searchTasks(query), ...this.searchNotes(query)];
    }

    this.displayResults(results);
  }

  searchTasks(query) {
    return this.taskManager.tasks
      .filter((task) => task.text.toLowerCase().includes(query))
      .map((task) => ({
        type: "task",
        id: task.id,
        text: task.text,
        completed: task.completed,
        date: task.createdAt,
      }));
  }

  searchNotes(query) {
    return this.notes
      .filter(
        (note) =>
          note.title.toLowerCase().includes(query) ||
          note.content.toLowerCase().includes(query)
      )
      .map((note) => ({
        type: "note",
        id: note.id,
        text: note.title,
        content: note.content,
        date: note.createdAt,
      }));
  }

  searchTasksByDate(query) {
    return this.taskManager.tasks
      .filter((task) =>
        this.taskManager
          .formatDate(task.createdAt)
          .toLowerCase()
          .includes(query)
      )
      .map((task) => ({
        type: "task",
        id: task.id,
        text: task.text,
        completed: task.completed,
        date: task.createdAt,
      }));
  }

  searchNotesByDate(query) {
    return this.notes
      .filter((note) =>
        this.taskManager
          .formatDate(note.createdAt)
          .toLowerCase()
          .includes(query)
      )
      .map((note) => ({
        type: "note",
        id: note.id,
        text: note.title,
        content: note.content,
        date: note.createdAt,
      }));
  }

  displayResults(results) {
    const searchResults = document.getElementById("searchResults");
    searchResults.innerHTML = "";

    if (results.length === 0) {
      searchResults.innerHTML = `
                <div class="search-result-item">
                    <i class="fas fa-search"></i>
                    <span>No results found</span>
                </div>
            `;
    } else {
      results.forEach((result) => {
        const resultItem = document.createElement("div");
        resultItem.className = "search-result-item";

        if (result.type === "task") {
          resultItem.innerHTML = `
                        <i class="fas ${
                          result.completed ? "fa-check-circle" : "fa-circle"
                        }"></i>
                        <div>
                            <div class="result-title">${this.taskManager.escapeHtml(
                              result.text
                            )}</div>
                            <small class="result-meta">
                                <span class="result-type">Task</span> • 
                                ${this.taskManager.formatDate(result.date)}
                            </small>
                        </div>
                    `;
        } else {
          resultItem.innerHTML = `
                        <i class="fas fa-sticky-note"></i>
                        <div>
                            <div class="result-title">${this.taskManager.escapeHtml(
                              result.text
                            )}</div>
                            <div class="result-preview">${this.taskManager.escapeHtml(
                              result.content.substring(0, 50)
                            )}${result.content.length > 50 ? "..." : ""}</div>
                            <small class="result-meta">
                                <span class="result-type">Note</span> • 
                                ${this.taskManager.formatDate(result.date)}
                            </small>
                        </div>
                    `;
        }

        resultItem.addEventListener("click", () => {
          this.handleResultClick(result);
        });

        searchResults.appendChild(resultItem);
      });
    }

    searchResults.classList.add("active");
  }

  handleResultClick(result) {
    if (result.type === "task") {
      const taskElement = document.querySelector(
        `[data-task-id="${result.id}"]`
      );
      if (taskElement) {
        taskElement.scrollIntoView({ behavior: "smooth" });
        taskElement.classList.add("highlight");
        setTimeout(() => taskElement.classList.remove("highlight"), 2000);
      }
    } else {
      const noteElement = document.querySelector(
        `[data-note-id="${result.id}"]`
      );
      if (noteElement) {
        noteElement.scrollIntoView({ behavior: "smooth" });
        noteElement.classList.add("highlight");
        setTimeout(() => noteElement.classList.remove("highlight"), 2000);
      }
    }
  }
}

// Initialize the app
document.addEventListener("DOMContentLoaded", () => {
  const taskManager = new TaskManager();
  new SearchManager(taskManager);

  // Only initialize cursor effects on non-touch devices
  if (!("ontouchstart" in window)) {
    new CursorManager();
  }
});

// Handle offline/online status
window.addEventListener("online", () => {
  document.body.classList.remove("offline");
});

window.addEventListener("offline", () => {
  document.body.classList.add("offline");
});

// Feature: Haptic Feedback
const triggerVibration = () => {
  if (!("ontouchstart" in window)) return;

  if (window.navigator.vibrate) {
    window.navigator.vibrate([43]);
  } else {
    console.warn("Vibration API not supported by your browser!");
  }
};

// Add vibration to all interactive elements
document.querySelectorAll("a, button, .nav__link, i").forEach((element) => {
  element.addEventListener("click", triggerVibration);
});

// Cursor Effect Manager
class CursorManager {
  constructor() {
    this.createCursorElements();
    this.init();
  }

  createCursorElements() {
    // Create cursor container
    this.cursorContainer = document.createElement("div");
    this.cursorContainer.className = "cursor-container";

    // Create main cursor
    this.cursor = document.createElement("div");
    this.cursor.className = "cursor";

    // Create cursor trail
    this.cursorTrail = document.createElement("div");
    this.cursorTrail.className = "cursor-trail";

    // Add to DOM
    this.cursorContainer.appendChild(this.cursor);
    this.cursorContainer.appendChild(this.cursorTrail);
    document.body.appendChild(this.cursorContainer);
  }

  init() {
    // Variables for smooth movement
    let cursorX = 0;
    let cursorY = 0;
    let trailX = 0;
    let trailY = 0;

    // Update cursor position
    document.addEventListener("mousemove", (e) => {
      cursorX = e.clientX;
      cursorY = e.clientY;

      // Update main cursor position immediately
      this.cursor.style.transform = `translate(${cursorX - 10}px, ${
        cursorY - 10
      }px)`;

      // Trail follows with delay
      requestAnimationFrame(() => {
        trailX += (cursorX - trailX) * 0.2;
        trailY += (cursorY - trailY) * 0.2;
        this.cursorTrail.style.transform = `translate(${trailX - 5}px, ${
          trailY - 5
        }px)`;
      });
    });

    // Click animation
    document.addEventListener("mousedown", () => {
      this.cursor.classList.add("clicking");
    });

    document.addEventListener("mouseup", () => {
      this.cursor.classList.remove("clicking");
    });

    // Hide cursor when leaving window
    document.addEventListener("mouseleave", () => {
      this.cursor.style.opacity = "0";
      this.cursorTrail.style.opacity = "0";
    });

    document.addEventListener("mouseenter", () => {
      this.cursor.style.opacity = "1";
      this.cursorTrail.style.opacity = "1";
    });
  }
}

// Initialize cursor effects when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Only initialize on non-touch devices
  if (!("ontouchstart" in window)) {
    new CursorManager();
  }
});

// Note Management
class NoteManager {
  constructor() {
    this.notes = JSON.parse(localStorage.getItem("notes")) || [];
    this.initializeEventListeners();
    this.renderNotes();
  }

  initializeEventListeners() {
    document
      .getElementById("addNote")
      .addEventListener("click", () => this.addNote());

    // Auto-save drafts
    const titleInput = document.getElementById("noteTitle");
    const contentInput = document.getElementById("noteContent");

    [titleInput, contentInput].forEach((input) => {
      input.addEventListener("input", () => {
        localStorage.setItem(
          "draft-note",
          JSON.stringify({
            title: titleInput.value,
            content: contentInput.value,
          })
        );
      });
    });

    // Restore draft if exists
    const draftNote = localStorage.getItem("draft-note");
    if (draftNote) {
      const { title, content } = JSON.parse(draftNote);
      titleInput.value = title || "";
      contentInput.value = content || "";
    }
  }

  addNote() {
    const titleInput = document.getElementById("noteTitle");
    const contentInput = document.getElementById("noteContent");
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

    if (title || content) {
      const note = {
        id: Date.now(),
        title: title || "Untitled Note",
        content,
        createdAt: new Date().toISOString(),
      };

      this.notes.unshift(note);
      this.saveNotes();
      this.renderNotes();

      // Clear inputs and draft
      titleInput.value = "";
      contentInput.value = "";
      localStorage.removeItem("draft-note");

      // Show success message
      this.showNotification("Note added successfully!");
    }
  }

  editNote(id) {
    const note = this.notes.find((n) => n.id === id);
    if (!note) return;

    const titleInput = document.getElementById("noteTitle");
    const contentInput = document.getElementById("noteContent");

    titleInput.value = note.title;
    contentInput.value = note.content;

    // Scroll to input and focus
    titleInput.scrollIntoView({ behavior: "smooth" });
    titleInput.focus();

    // Remove the old note
    this.deleteNote(id, false); // false = don't show confirmation
  }

  deleteNote(id, showConfirm = true) {
    const note = this.notes.find((n) => n.id === id);
    if (!note) return;

    if (
      !showConfirm ||
      confirm(`Are you sure you want to delete note: "${note.title}"?`)
    ) {
      this.notes = this.notes.filter((note) => note.id !== id);
      this.saveNotes();
      this.renderNotes();
      if (showConfirm) {
        this.showNotification("Note deleted successfully!", "warning");
      }
    }
  }

  saveNotes() {
    localStorage.setItem("notes", JSON.stringify(this.notes));
  }

  renderNotes() {
    const notesGrid = document.getElementById("notesGrid");
    notesGrid.innerHTML = "";

    if (this.notes.length === 0) {
      notesGrid.innerHTML = `
                <div class="empty-notes">
                    <i class="fas fa-sticky-note"></i>
                    <p>No notes yet. Add your first note! ✨</p>
                </div>
            `;
      return;
    }

    this.notes.forEach((note) => {
      const noteElement = this.createNoteElement(note);
      notesGrid.appendChild(noteElement);
    });
  }

  createNoteElement(note) {
    const div = document.createElement("div");
    div.className = "note-card";

    div.innerHTML = `
            <div class="note-header">
                <h3 class="note-title">${this.escapeHtml(note.title)}</h3>
                <div class="note-actions">
                    <button class="note-edit-btn" aria-label="Edit note">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="note-delete-btn" aria-label="Delete note">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="note-content">${this.escapeHtml(note.content)}</div>
            <div class="note-date">${this.formatDate(note.createdAt)}</div>
        `;

    // Add event listeners
    div
      .querySelector(".note-edit-btn")
      .addEventListener("click", () => this.editNote(note.id));
    div
      .querySelector(".note-delete-btn")
      .addEventListener("click", () => this.deleteNote(note.id));

    return div;
  }

  showNotification(message, type = "success") {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add("show"), 10);
    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => notification.remove(), 300);
    }, 2000);
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const day = 24 * 60 * 60 * 1000;

    if (diff < day) {
      return "Today";
    } else if (diff < 2 * day) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  }

  escapeHtml(unsafe) {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}

// Initialize Notes Manager
document.addEventListener("DOMContentLoaded", () => {
  new NoteManager();
});

// Smart Reminders Manager Class
class SmartRemindersManager {
  constructor() {
    this.checkNotificationPermission();
    this.initGeolocation();
    this.watchLocations = new Map(); // Store location watch IDs
  }

  async checkNotificationPermission() {
    if (!("Notification" in window)) {
      console.warn("This browser does not support notifications");
      return;
    }

    if (Notification.permission !== "granted") {
      try {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          console.warn("Notification permission denied");
        }
      } catch (error) {
        console.error("Error requesting notification permission:", error);
      }
    }
  }

  initGeolocation() {
    if (!("geolocation" in navigator)) {
      console.warn("Geolocation is not supported by this browser");
      return;
    }
  }

  // Set a time-based reminder
  setTimeReminder(taskId, reminderTime) {
    const now = new Date();
    const reminderDate = new Date(reminderTime);

    if (reminderDate <= now) {
      console.warn("Cannot set reminder for past time");
      return;
    }

    const timeoutId = setTimeout(() => {
      this.sendNotification("Task Reminder", `Time to complete your task!`);
    }, reminderDate - now);

    // Store the timeout ID for potential cancellation
    return timeoutId;
  }

  // Set a location-based reminder
  setLocationReminder(taskId, location) {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const distance = this.calculateDistance(
          position.coords.latitude,
          position.coords.longitude,
          location.latitude,
          location.longitude
        );

        // Trigger notification if within 100 meters of target location
        if (distance <= 0.1) {
          this.sendNotification(
            "Location Reminder",
            `You're near the location for your task!`
          );
          // Clear the watch after triggering
          navigator.geolocation.clearWatch(watchId);
          this.watchLocations.delete(taskId);
        }
      },
      (error) => console.error("Error watching location:", error),
      {
        enableHighAccuracy: true,
        maximumAge: 30000,
        timeout: 27000,
      }
    );

    this.watchLocations.set(taskId, watchId);
    return watchId;
  }

  // Calculate distance between two points using Haversine formula
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  toRad(degrees) {
    return degrees * (Math.PI / 180);
  }

  // Send notification
  async sendNotification(title, body) {
    if (Notification.permission === "granted") {
      try {
        const notification = new Notification(title, {
          body,
          icon: "/assets/favicon.png",
          badge: "/assets/favicon.png",
          vibrate: [200, 100, 200],
        });

        notification.onclick = () => {
          window.focus();
          notification.close();
        };
      } catch (error) {
        console.error("Error sending notification:", error);
      }
    }
  }

  // Clear all reminders for a task
  clearReminders(taskId) {
    // Clear location watch
    const watchId = this.watchLocations.get(taskId);
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
      this.watchLocations.delete(taskId);
    }
  }
}

// Extend TaskManager class with reminder functionality
class TaskManagerWithReminders extends TaskManager {
  constructor() {
    super();
    this.remindersManager = new SmartRemindersManager();
    this.enhanceTaskCreation();
  }

  enhanceTaskCreation() {
    const taskForm = document.querySelector(".add-task-container");

    // Add reminder options to the form
    const reminderOptions = document.createElement("div");
    reminderOptions.className = "reminder-options";
    reminderOptions.innerHTML = `
      <div class="reminder-toggle">
        <button class="btn-reminder" type="button">
          <i class="fas fa-bell"></i><b>Add Reminder</b>
        </button>
      </div>
      <div class="reminder-details" style="display: none;">
        <div class="time-reminder">
          <label>
            <input type="datetime-local" id="reminderTime">
            Time Reminder
          </label>
        </div>
        <div class="location-reminder">
          <label>
            <input type="checkbox" id="locationReminder">
            Location Reminder
          </label>
          <div class="location-inputs" style="display: none;">
            <input type="number" id="latitude" placeholder="Latitude" step="any">
            <input type="number" id="longitude" placeholder="Longitude" step="any">
          </div>
        </div>
      </div>
    `;

    taskForm.insertBefore(reminderOptions, taskForm.querySelector("#addTask"));

    // Add event listeners
    const btnReminder = reminderOptions.querySelector(".btn-reminder");
    const reminderDetails = reminderOptions.querySelector(".reminder-details");
    const locationCheckbox = reminderOptions.querySelector("#locationReminder");
    const locationInputs = reminderOptions.querySelector(".location-inputs");

    btnReminder.addEventListener("click", () => {
      reminderDetails.style.display =
        reminderDetails.style.display === "none" ? "block" : "none";
    });

    locationCheckbox.addEventListener("change", () => {
      locationInputs.style.display = locationCheckbox.checked
        ? "block"
        : "none";
    });
  }

  addTask() {
    const input = document.getElementById("taskInput");
    const taskText = input.value.trim();
    const reminderTime = document.getElementById("reminderTime").value;
    const locationReminder =
      document.getElementById("locationReminder").checked;
    const latitude = document.getElementById("latitude").value;
    const longitude = document.getElementById("longitude").value;

    if (taskText) {
      const task = {
        id: Date.now(),
        text: taskText,
        completed: false,
        createdAt: new Date().toISOString(),
        reminder: {
          time: reminderTime || null,
          location: locationReminder ? { latitude, longitude } : null,
        },
      };

      // Set reminders if specified
      if (reminderTime) {
        task.reminderTimeoutId = this.remindersManager.setTimeReminder(
          task.id,
          reminderTime
        );
      }

      if (locationReminder && latitude && longitude) {
        task.reminderWatchId = this.remindersManager.setLocationReminder(
          task.id,
          { latitude: Number(latitude), longitude: Number(longitude) }
        );
      }

      this.tasks.unshift(task);
      this.saveTasks();
      this.renderTasks();

      // Clear inputs
      input.value = "";
      document.getElementById("reminderTime").value = "";
      document.getElementById("locationReminder").checked = false;
      document.getElementById("latitude").value = "";
      document.getElementById("longitude").value = "";
      document.querySelector(".reminder-details").style.display = "none";

      this.showNotification("Task added successfully!");
    }
  }

  deleteTask(id) {
    const task = this.tasks.find((t) => t.id === id);
    if (
      task &&
      confirm(`Are you sure you want to delete task: "${task.text}"?`)
    ) {
      // Clear any active reminders
      this.remindersManager.clearReminders(id);

      this.tasks = this.tasks.filter((task) => task.id !== id);
      this.saveTasks();
      this.renderTasks();
      this.showNotification("Task deleted successfully!", "warning");
    }
  }
}

// Initialize the enhanced TaskManager
document.addEventListener("DOMContentLoaded", () => {
  new TaskManagerWithReminders();
});
