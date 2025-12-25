// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyABC123def456ghi789jkl0mnopqr123stuv",
  authDomain: "g5-project-front-end.firebaseapp.com",
  projectId: "g5-project-front-end",
  storageBucket: "g5-project-front-end.appspot.com",
  messagingSenderId: "646526872882",
  appId: "1:646526872882:web:abc123def456ghi789jkl0",
};

// Initialize Firebase
try {
  firebase.initializeApp(firebaseConfig);
  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Firebase initialization error:", error);
}

// Fallback: export as an HTML-based .doc file (widely supported by MS Word)
async function exportAsDocHtml(notesToExport, fileName, includeMetadata) {
  let html = `<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(
    fileName
  )}</title></head><body>`;
  html += `<h1>Notes Export</h1>`;

  notesToExport.forEach((note, index) => {
    html += `<h2>${index + 1}. ${escapeHtml(note.title || "Untitled")}</h2>`;
    if (includeMetadata) {
      html += `<p><strong>Category:</strong> ${escapeHtml(
        note.category || "None"
      )}</p>`;
      html += `<p><strong>Tags:</strong> ${escapeHtml(
        (note.tags && note.tags.join(", ")) || "None"
      )}</p>`;
      html += `<p><strong>Created:</strong> ${escapeHtml(
        note.createdAt || ""
      )}</p>`;
    }
    const raw = (note.content || "").replace(
      /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
      ""
    );
    const contentSafe = escapeHtml(raw).replace(/\r?\n/g, "<br>");
    html += `<div>${contentSafe}</div><hr>`;
  });

  html += `</body></html>`;

  try {
    const blob = new Blob([html], { type: "application/msword;charset=utf-8" });
    downloadBlob(blob, `${fileName}.doc`);
    console.log("Exported as Word-compatible .doc (HTML fallback)");
    showSuccess("Exported as Word-compatible .doc");
  } catch (err) {
    console.error("HTML DOC fallback failed:", err);
    showError("Failed to export as .doc: " + err.message);
  }
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const auth = firebase.auth ? firebase.auth() : null;
const db = firebase.firestore();

// App State
let currentUser = null;
let notes = [];
let trashNotes = [];
let currentCategory = "all";
let currentTag = null;
let searchQuery = "";
let isEditing = false;
let currentNoteId = null;
let isOnline = navigator.onLine;
let quill;
let currentTheme = localStorage.getItem("theme") || "light";

// DOM Elements
const appContainer = document.getElementById("appContainer");
const authModal = document.getElementById("authModal");
const sidebar = document.getElementById("sidebar");
const toggleSidebar = document.getElementById("toggleSidebar");
const newNoteBtn = document.getElementById("newNoteBtn");
const searchInput = document.getElementById("searchInput");
const notesGrid = document.getElementById("notesGrid");
const emptyState = document.getElementById("emptyState");
const editorModal = document.getElementById("editorModal");
const editorTitle = document.getElementById("editorTitle");
const noteTitle = document.getElementById("noteTitle");
const noteCategory = document.getElementById("noteCategory");
const noteTags = document.getElementById("noteTags");
const notePinned = document.getElementById("notePinned");
const saveNoteBtn = document.getElementById("saveNoteBtn");
const cancelNoteBtn = document.getElementById("cancelNoteBtn");
const closeEditorBtn = document.getElementById("closeEditorBtn");
const createFirstNoteBtn = document.getElementById("createFirstNoteBtn");
const exportBtn = document.getElementById("exportBtn");
const themeToggleBtn = document.getElementById("themeToggleBtn");
const loadingSpinner = document.getElementById("loadingSpinner");
const totalNotesEl = document.getElementById("totalNotes");
const pinnedNotesEl = document.getElementById("pinnedNotes");
const userAvatar = document.getElementById("userAvatar");
const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");
const logoutBtn = document.getElementById("logoutBtn");
const signInBtn = document.getElementById("signInBtn");
const offlineModeBtn = document.getElementById("offlineModeBtn");

// Export Modal Elements
const exportModal = document.getElementById("exportModal");
const closeExportBtn = document.getElementById("closeExportBtn");
const cancelExportBtn = document.getElementById("cancelExportBtn");
const startExportBtn = document.getElementById("startExportBtn");
const exportOptions = document.querySelectorAll(".export-option");
const exportAllCheckbox = document.getElementById("exportAll");
const includeMetadataCheckbox = document.getElementById("includeMetadata");
const exportFileNameInput = document.getElementById("exportFileName");
const exportLoading = document.getElementById("exportLoading");

// TODO Elements
const taskPanel = document.getElementById("taskPanel");
const createTodoBtn = document.getElementById("createTodoBtn");
const todoListContainer = document.getElementById("todoListContainer");
const totalTasksEl = document.getElementById("totalTasks");
const completedTasksEl = document.getElementById("completedTasks");
const pendingTasksEl = document.getElementById("pendingTasks");
const overdueTasksEl = document.getElementById("overdueTasks");
const todoEditorModal = document.getElementById("todoEditorModal");
const todoEditorTitle = document.getElementById("todoEditorTitle");
const todoTitle = document.getElementById("todoTitle");
const todoDescription = document.getElementById("todoDescription");
const todoPinned = document.getElementById("todoPinned");
const todoListEditor = document.getElementById("todoListEditor");
const saveTodoBtn = document.getElementById("saveTodoBtn");
const cancelTodoBtn = document.getElementById("cancelTodoBtn");
const closeTodoBtn = document.getElementById("closeTodoBtn");
const addTaskBtn = document.getElementById("addTaskBtn");

// TODO Manager
const todoManager = {
  todos: [],
  tasks: [],

  load() {
    const savedTodos = localStorage.getItem("nexus_todos");
    const savedTasks = localStorage.getItem("nexus_tasks");
    this.todos = savedTodos ? JSON.parse(savedTodos) : [];
    this.tasks = savedTasks ? JSON.parse(savedTasks) : [];
    console.log(
      `Loaded ${this.todos.length} todos and ${this.tasks.length} tasks`
    );
  },

  save() {
    localStorage.setItem("nexus_todos", JSON.stringify(this.todos));
    localStorage.setItem("nexus_tasks", JSON.stringify(this.tasks));
  },

  addTodo(todoData) {
    const todo = {
      id: generateId(),
      ...todoData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: currentUser?.uid || "offline-user",
    };
    this.todos.push(todo);
    this.save();
    return todo;
  },

  updateTodo(id, updates) {
    const index = this.todos.findIndex((todo) => todo.id === id);
    if (index !== -1) {
      this.todos[index] = {
        ...this.todos[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      this.save();
      return this.todos[index];
    }
    return null;
  },

  deleteTodo(id) {
    const index = this.todos.findIndex((todo) => todo.id === id);
    if (index !== -1) {
      this.todos.splice(index, 1);
      this.tasks = this.tasks.filter((task) => task.todoId !== id);
      this.save();
      return true;
    }
    return false;
  },

  addTask(todoId, taskData) {
    const task = {
      id: generateId(),
      todoId,
      ...taskData,
      createdAt: new Date().toISOString(),
      completed: false,
    };
    this.tasks.push(task);
    this.save();
    return task;
  },

  updateTask(id, updates) {
    const index = this.tasks.findIndex((task) => task.id === id);
    if (index !== -1) {
      this.tasks[index] = {
        ...this.tasks[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      this.save();
      return this.tasks[index];
    }
    return null;
  },

  getTodosByUserId(userId) {
    return this.todos.filter((todo) => todo.userId === userId);
  },

  getTasksByTodoId(todoId) {
    return this.tasks.filter((task) => task.todoId === todoId);
  },

  getTaskStats() {
    const total = this.tasks.length;
    const completed = this.tasks.filter((task) => task.completed).length;
    const pending = total - completed;
    const overdue = this.tasks.filter((task) => {
      if (!task.dueDate || task.completed) return false;
      return new Date(task.dueDate) < new Date();
    }).length;

    return { total, completed, pending, overdue };
  },
};

// Initialize App
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded, initializing app...");
  initializeApp();
});

async function initializeApp() {
  console.log("Initializing app...");

  try {
    initTheme();
    initQuillEditor();
    todoManager.load();
    setupEventListeners();

    // If auth modal exists, show it first; otherwise default to offline user and show the app
    const offlineFlag = localStorage.getItem("offlineMode") === "true";
    if (authModal && !offlineFlag) {
      authModal.style.display = "flex";
      if (appContainer) appContainer.style.display = "none";
    } else {
      // ensure we have a fallback offline user so saving/loading works
      if (!currentUser) {
        currentUser = {
          uid: "offline-user",
          displayName: "Guest User",
          email: "guest@local.com",
        };
      }
      if (appContainer) appContainer.style.display = "flex";
      showApp();
    }

    console.log("App initialized successfully");
  } catch (error) {
    console.error("Error initializing app:", error);
    showError("Failed to initialize app: " + error.message);
  }
}

function initQuillEditor() {
  if (document.getElementById("editor")) {
    quill = new Quill("#editor", {
      theme: "snow",
      modules: {
        toolbar: [
          ["bold", "italic", "underline", "strike"],
          ["blockquote", "code-block"],
          [{ header: 1 }, { header: 2 }],
          [{ list: "ordered" }, { list: "bullet" }],
          ["clean"],
          ["link"],
        ],
      },
      placeholder: "Write your note here...",
    });
    console.log("Quill editor initialized");
  }
}

function setupEventListeners() {
  console.log("Setting up event listeners...");

  // Auth
  if (signInBtn) signInBtn.addEventListener("click", handleSignIn);
  if (offlineModeBtn)
    offlineModeBtn.addEventListener("click", handleOfflineMode);
  if (logoutBtn) logoutBtn.addEventListener("click", handleLogout);

  // Sidebar
  if (toggleSidebar)
    toggleSidebar.addEventListener("click", toggleSidebarCollapse);

  // Theme
  if (themeToggleBtn) themeToggleBtn.addEventListener("click", toggleTheme);

  // Navigation
  document.querySelectorAll(".category-item").forEach((item) => {
    item.addEventListener("click", () => {
      const category = item.dataset.category;
      if (category === "trash") {
        showTrashPage();
      } else if (category === "todo") {
        showTodoPage();
      } else {
        filterByCategory(category);
      }
    });
  });

  document.querySelectorAll(".tag-item").forEach((item) => {
    item.addEventListener("click", () => filterByTag(item.dataset.tag));
  });

  // Notes
  if (newNoteBtn) newNoteBtn.addEventListener("click", openNewNoteEditor);
  if (createFirstNoteBtn)
    createFirstNoteBtn.addEventListener("click", openNewNoteEditor);
  if (searchInput) searchInput.addEventListener("input", handleSearch);
  if (exportBtn) exportBtn.addEventListener("click", showExportModal);

  // Editor
  if (saveNoteBtn) saveNoteBtn.addEventListener("click", saveNote);
  if (cancelNoteBtn) cancelNoteBtn.addEventListener("click", closeEditor);
  if (closeEditorBtn) closeEditorBtn.addEventListener("click", closeEditor);

  // TODO
  if (createTodoBtn) createTodoBtn.addEventListener("click", openNewTodoEditor);
  if (saveTodoBtn) saveTodoBtn.addEventListener("click", saveTodo);
  if (cancelTodoBtn) cancelTodoBtn.addEventListener("click", closeTodoEditor);
  if (closeTodoBtn) closeTodoBtn.addEventListener("click", closeTodoEditor);
  if (addTaskBtn) addTaskBtn.addEventListener("click", addTodoTaskItem);

  // Export
  if (closeExportBtn)
    closeExportBtn.addEventListener("click", closeExportModal);
  if (cancelExportBtn)
    cancelExportBtn.addEventListener("click", closeExportModal);
  if (startExportBtn) startExportBtn.addEventListener("click", startExport);
  // Use event delegation for export option clicks so dynamically moved/inserted
  // options still work reliably.
  const exportOptionsContainer = document.querySelector(".export-options");
  if (exportOptionsContainer) {
    exportOptionsContainer.addEventListener("click", (e) => {
      const option = e.target.closest(".export-option");
      if (!option) return;
      document
        .querySelectorAll(".export-option")
        .forEach((opt) => opt.classList.remove("active"));
      // If this option is marked disabled, inform user and fallback
      if (option.classList.contains("disabled")) {
        console.warn("User selected disabled format:", option.dataset.format);
        showNotification(
          "Word library not loaded — attempting Word-compatible .doc export instead."
        );
        // keep DOCX selected so startExport uses the DOCX path, which will fall back to HTML .doc
        option.classList.add("active");
        const sel = document.getElementById("exportFormatSelect");
        if (sel) sel.value = "docx";
        setTimeout(() => startExport(), 200);
        return;
      }
      option.classList.add("active");
      console.log("Export option selected:", option.dataset.format);
      // sync to select fallback if present
      const sel = document.getElementById("exportFormatSelect");
      if (sel) sel.value = option.dataset.format;
    });
  }

  // sync select -> active card (fallback picker)
  const exportFormatSelect = document.getElementById("exportFormatSelect");
  if (exportFormatSelect) {
    exportFormatSelect.addEventListener("change", (e) => {
      const val = e.target.value;
      document
        .querySelectorAll(".export-option")
        .forEach((opt) =>
          opt.classList.toggle("active", opt.dataset.format === val)
        );
    });
  }

  window.addEventListener("online", handleOnlineStatus);
  window.addEventListener("offline", handleOnlineStatus);
}

// Auth Functions
function handleSignIn() {
  // Simple demo sign-in
  currentUser = {
    uid: "demo-user",
    displayName: "Demo User",
    email: "demo@example.com",
  };
  localStorage.setItem("offlineMode", "false");
  showApp();
}

function handleOfflineMode() {
  currentUser = {
    uid: "offline-user",
    displayName: "Guest User",
    email: "guest@local.com",
  };
  localStorage.setItem("offlineMode", "true");
  showApp();
}

function handleLogout() {
  localStorage.removeItem("offlineMode");
  if (authModal) authModal.style.display = "flex";
  if (appContainer) appContainer.style.display = "none";
  notes = [];
  trashNotes = [];
  todoManager.todos = [];
  todoManager.tasks = [];
  todoManager.save();
}

function showApp() {
  if (authModal) authModal.style.display = "none";
  if (appContainer) appContainer.style.display = "flex";
  updateUserInfo();

  if (currentUser.uid === "offline-user") {
    logoutBtn.style.display = "none";
    loadNotes();
  } else {
    logoutBtn.style.display = "block";
    loadNotes();
  }
}

// Theme Functions
function initTheme() {
  document.documentElement.setAttribute("data-theme", currentTheme);
  updateThemeButton();
}

function toggleTheme() {
  currentTheme = currentTheme === "light" ? "dark" : "light";
  localStorage.setItem("theme", currentTheme);
  document.documentElement.setAttribute("data-theme", currentTheme);
  updateThemeButton();
  showSuccess(`Switched to ${currentTheme} mode!`);
}

function updateThemeButton() {
  if (themeToggleBtn) {
    const icon = themeToggleBtn.querySelector("i");
    const text = themeToggleBtn.querySelector("span");
    if (currentTheme === "dark") {
      icon.className = "fas fa-sun";
      if (text) text.textContent = "Light Mode";
    } else {
      icon.className = "fas fa-moon";
      if (text) text.textContent = "Dark Mode";
    }
  }
}

function updateUserInfo() {
  if (currentUser && userName && userEmail && userAvatar) {
    if (currentUser.uid === "offline-user") {
      userName.textContent = "Guest User";
      userEmail.textContent = "Using Local Storage";
      userAvatar.innerHTML = '<i class="fas fa-laptop"></i>';
    } else {
      userName.textContent = currentUser.displayName || "User";
      userEmail.textContent = currentUser.email || "";
      userAvatar.textContent = currentUser.displayName
        ? currentUser.displayName.charAt(0).toUpperCase()
        : "U";
    }
  }
}

// Notes Functions
async function loadNotes() {
  console.log("Loading notes...");
  if (loadingSpinner) loadingSpinner.style.display = "flex";
  if (notesGrid) notesGrid.innerHTML = "";

  try {
    if (isOnline && currentUser.uid !== "offline-user") {
      // Load from Firebase (simplified for demo)
      console.log("Loading from Firebase...");
      notes =
        JSON.parse(localStorage.getItem(`nexusNotes_${currentUser.uid}`)) || [];
      trashNotes =
        JSON.parse(localStorage.getItem(`nexusTrash_${currentUser.uid}`)) || [];
    } else {
      // Load from localStorage
      notes =
        JSON.parse(localStorage.getItem(`nexusNotes_${currentUser.uid}`)) || [];
      trashNotes =
        JSON.parse(localStorage.getItem(`nexusTrash_${currentUser.uid}`)) || [];
    }

    renderNotes();
    updateStats();
    updateTrashCount();
  } catch (error) {
    console.error("Failed to load notes:", error);
    notes = [];
    trashNotes = [];
  } finally {
    if (loadingSpinner) loadingSpinner.style.display = "none";
  }
}

function renderNotes() {
  if (!notesGrid) return;
  notesGrid.innerHTML = "";

  let filteredNotes = notes.filter((note) => {
    if (currentCategory !== "all" && note.category !== currentCategory) {
      return false;
    }
    if (currentTag && (!note.tags || !note.tags.includes(currentTag))) {
      return false;
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const titleMatch = note.title.toLowerCase().includes(query);
      const contentMatch = note.content.toLowerCase().includes(query);
      const tagMatch =
        note.tags && note.tags.some((tag) => tag.toLowerCase().includes(query));
      if (!titleMatch && !contentMatch && !tagMatch) {
        return false;
      }
    }
    return true;
  });

  filteredNotes.sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.updatedAt) - new Date(a.updatedAt);
  });

  if (emptyState) {
    emptyState.style.display = filteredNotes.length === 0 ? "block" : "none";
  }

  filteredNotes.forEach((note) => {
    const noteCard = createNoteCard(note);
    notesGrid.appendChild(noteCard);
  });
}

function createNoteCard(note) {
  const card = document.createElement("div");
  card.className = `note-card ${note.pinned ? "pinned" : ""}`;
  card.dataset.id = note.id;

  const date = new Date(note.updatedAt);
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  let tagsHTML = "";
  if (note.tags && note.tags.length > 0) {
    note.tags.forEach((tag) => {
      tagsHTML += `<span class="note-tag">${tag}</span>`;
    });
  }

  const contentPreview = formatNotePreview(note.content, 150);

  card.innerHTML = `
    <div class="note-card-header">
      <div>
        <h3 class="note-title">${note.title}</h3>
        <span class="note-category">${note.category}</span>
      </div>
      <button class="note-action-btn pin" title="${
        note.pinned ? "Unpin" : "Pin"
      }">
        <i class="fas fa-thumbtack"></i>
      </button>
    </div>
    <div class="note-content">${contentPreview}</div>
    ${tagsHTML ? `<div class="note-tags">${tagsHTML}</div>` : ""}
    <div class="note-footer">
      <div class="note-date">${formattedDate}</div>
      <div class="note-actions">
        <button class="note-action-btn edit" title="Edit">
          <i class="fas fa-edit"></i>
        </button>
        <button class="note-action-btn delete" title="Delete">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>
  `;

  card.addEventListener("click", (e) => {
    if (!e.target.closest(".note-actions")) {
      openEditNoteEditor(note.id);
    }
  });

  card.querySelector(".pin").addEventListener("click", (e) => {
    e.stopPropagation();
    togglePin(note.id);
  });

  card.querySelector(".edit").addEventListener("click", (e) => {
    e.stopPropagation();
    openEditNoteEditor(note.id);
  });

  card.querySelector(".delete").addEventListener("click", (e) => {
    e.stopPropagation();
    deleteNote(note.id);
  });

  return card;
}

function formatNotePreview(content, maxLength = 150) {
  if (!content) return "";
  let text = content.replace(/<[^>]*>/g, "");
  const entities = {
    "&nbsp;": " ",
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#39;": "'",
  };

  Object.keys(entities).forEach((entity) => {
    text = text.replace(new RegExp(entity, "g"), entities[entity]);
  });

  text = text.replace(/\s+/g, " ").trim();
  if (text.length > maxLength) {
    text = text.substring(0, maxLength).trim() + "...";
  }

  return text;
}

function openNewNoteEditor() {
  isEditing = false;
  currentNoteId = null;
  editorTitle.textContent = "New Note";
  noteTitle.value = "";
  quill.setContents([]);
  noteCategory.value = "personal";
  noteTags.value = "";
  notePinned.checked = false;
  editorModal.classList.add("active");
  noteTitle.focus();
}

function openEditNoteEditor(noteId) {
  const note = notes.find((n) => n.id === noteId);
  if (!note) return;

  isEditing = true;
  currentNoteId = noteId;
  editorTitle.textContent = "Edit Note";
  noteTitle.value = note.title;
  quill.setContents(quill.clipboard.convert(note.content || ""));
  noteCategory.value = note.category || "personal";
  noteTags.value = note.tags ? note.tags.join(", ") : "";
  notePinned.checked = note.pinned || false;
  editorModal.classList.add("active");
}

async function saveNote() {
  const title = noteTitle.value.trim();
  const content = quill.root.innerHTML;
  const category = noteCategory.value;
  const tags = noteTags.value
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag);
  const pinned = notePinned.checked;

  if (!title) {
    showError("Please enter a title");
    return;
  }

  const noteData = {
    title,
    content,
    category,
    tags,
    pinned,
    updatedAt: new Date().toISOString(),
    userId: currentUser?.uid || "offline-user",
  };

  if (isEditing) {
    const noteIndex = notes.findIndex((n) => n.id === currentNoteId);
    if (noteIndex !== -1) {
      notes[noteIndex] = { ...notes[noteIndex], ...noteData };
    }
  } else {
    const newNote = {
      id: generateId(),
      ...noteData,
      createdAt: new Date().toISOString(),
    };
    notes.unshift(newNote);
  }

  await saveNotesToStorage();
  renderNotes();
  updateStats();
  closeEditor();
  showSuccess(isEditing ? "Note updated!" : "Note created!");
}

function closeEditor() {
  editorModal.classList.remove("active");
}

function togglePin(noteId) {
  const noteIndex = notes.findIndex((n) => n.id === noteId);
  if (noteIndex !== -1) {
    notes[noteIndex].pinned = !notes[noteIndex].pinned;
    notes[noteIndex].updatedAt = new Date().toISOString();
    saveNotesToStorage();
    renderNotes();
    updateStats();
    showSuccess(notes[noteIndex].pinned ? "Note pinned!" : "Note unpinned!");
  }
}

async function deleteNote(noteId) {
  Swal.fire({
    title: "Move to Trash?",
    text: "This note will be moved to trash. You can restore it later.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#64748b",
    confirmButtonText: "Move to Trash",
    cancelButtonText: "Cancel",
  }).then(async (result) => {
    if (result.isConfirmed) {
      await moveToTrash(noteId);
    }
  });
}

async function moveToTrash(noteId) {
  const noteIndex = notes.findIndex((n) => n.id === noteId);
  if (noteIndex !== -1) {
    const noteToTrash = {
      ...notes[noteIndex],
      deletedAt: new Date().toISOString(),
    };
    trashNotes.push(noteToTrash);
    notes = notes.filter((note) => note.id !== noteId);

    await saveNotesToStorage();
    await saveTrashToStorage();

    renderNotes();
    updateStats();
    updateTrashCount();
    showSuccess("Note moved to trash!");
  }
}

function filterByCategory(category) {
  currentCategory = category;
  currentTag = null;

  if (taskPanel) taskPanel.style.display = "none";
  if (notesGrid) notesGrid.style.display = "grid";
  if (emptyState) emptyState.style.display = "block";

  const trashContainer = document.getElementById("trashContainer");
  if (trashContainer) trashContainer.style.display = "none";

  document.querySelectorAll(".category-item").forEach((item) => {
    item.classList.toggle("active", item.dataset.category === category);
  });

  document.querySelectorAll(".tag-item").forEach((item) => {
    item.classList.remove("active");
  });

  renderNotes();
}

function filterByTag(tag) {
  currentTag = currentTag === tag ? null : tag;
  document.querySelectorAll(".tag-item").forEach((item) => {
    item.classList.toggle(
      "active",
      item.dataset.tag === tag && currentTag === tag
    );
  });
  renderNotes();
}

function handleSearch() {
  searchQuery = searchInput.value;
  renderNotes();
}

function updateStats() {
  const total = notes.length;
  const pinned = notes.filter((note) => note.pinned).length;
  if (totalNotesEl) totalNotesEl.textContent = total;
  if (pinnedNotesEl) pinnedNotesEl.textContent = pinned;
}

function updateTrashCount() {
  const trashItem = document.querySelector('[data-category="trash"]');
  const trashCountEl = document.getElementById("trashCount");

  if (trashCountEl) {
    if (trashNotes.length > 0) {
      trashCountEl.textContent = trashNotes.length;
      trashCountEl.style.display = "inline-block";
    } else {
      trashCountEl.style.display = "none";
    }
  }
}

// Storage Functions
async function saveNotesToStorage() {
  const uid = currentUser?.uid || "offline-user";
  localStorage.setItem(`nexusNotes_${uid}`, JSON.stringify(notes));
}

async function saveTrashToStorage() {
  const uid = currentUser?.uid || "offline-user";
  localStorage.setItem(`nexusTrash_${uid}`, JSON.stringify(trashNotes));
}

// TODO Functions
function showTodoPage() {
  if (notesGrid) notesGrid.style.display = "none";
  if (emptyState) emptyState.style.display = "none";

  const trashContainer = document.getElementById("trashContainer");
  if (trashContainer) trashContainer.style.display = "none";

  if (taskPanel) {
    taskPanel.style.display = "block";
    loadTodoData();
  }

  document.querySelectorAll(".category-item").forEach((item) => {
    item.classList.toggle("active", item.dataset.category === "todo");
  });
}

function loadTodoData() {
  const userTodos = todoManager.getTodosByUserId(currentUser.uid);
  const stats = todoManager.getTaskStats();

  if (totalTasksEl) totalTasksEl.textContent = stats.total;
  if (completedTasksEl) completedTasksEl.textContent = stats.completed;
  if (pendingTasksEl) pendingTasksEl.textContent = stats.pending;
  if (overdueTasksEl) overdueTasksEl.textContent = stats.overdue;

  const container = todoListContainer;
  if (container) {
    if (userTodos.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">
            <i class="fas fa-tasks"></i>
          </div>
          <h3>No To-Do Lists</h3>
          <p class="text-secondary">Create your first to-do list to get started</p>
          <button class="btn btn-primary mt-3" id="createFirstTodoBtn">
            <i class="fas fa-plus-circle"></i> Create To-Do List
          </button>
        </div>
      `;

      setTimeout(() => {
        const createBtn = document.getElementById("createFirstTodoBtn");
        if (createBtn) {
          createBtn.addEventListener("click", openNewTodoEditor);
        }
      }, 100);
    } else {
      container.innerHTML = "";
      userTodos.forEach((todo) => {
        const todoElement = createTodoElement(todo);
        container.appendChild(todoElement);
      });
    }
  }
}

function createTodoElement(todo) {
  const element = document.createElement("div");
  element.className = "todo-element";
  element.dataset.id = todo.id;

  const tasks = todoManager.getTasksByTodoId(todo.id);
  const completedTasks = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  element.innerHTML = `
    <div class="todo-header">
      <h4 class="todo-title">${todo.title}</h4>
      <div class="todo-actions">
        <button class="btn btn-sm btn-outline-primary edit-todo" title="Edit">
          <i class="fas fa-edit"></i>
        </button>
        <button class="btn btn-sm btn-outline-danger delete-todo" title="Delete">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>
    <div class="todo-description">${todo.description || ""}</div>
    <div class="todo-progress">
      <div class="progress">
        <div class="progress-bar" style="width: ${progress}%"></div>
      </div>
      <div class="todo-stats">
        <span>${completedTasks} / ${totalTasks} tasks completed</span>
        <button class="btn btn-sm btn-outline-secondary add-task" title="Add Task">
          <i class="fas fa-plus"></i> Add Task
        </button>
      </div>
    </div>
    <div class="todo-tasks">
      ${tasks
        .slice(0, 3)
        .map(
          (task) => `
        <div class="todo-task ${task.completed ? "completed" : ""}">
          <input type="checkbox" ${
            task.completed ? "checked" : ""
          } class="task-checkbox" data-task-id="${task.id}">
          <span class="task-text">${task.title}</span>
          ${
            task.dueDate
              ? `<span class="task-due-date ${
                  !task.completed && new Date(task.dueDate) < new Date()
                    ? "overdue"
                    : ""
                }">Due: ${new Date(task.dueDate).toLocaleDateString()}</span>`
              : ""
          }
        </div>
      `
        )
        .join("")}
      ${
        tasks.length > 3
          ? `<div class="more-tasks">+${tasks.length - 3} more tasks</div>`
          : ""
      }
    </div>
  `;

  element.querySelector(".edit-todo").addEventListener("click", (e) => {
    e.stopPropagation();
    openEditTodoEditor(todo.id);
  });

  element.querySelector(".delete-todo").addEventListener("click", (e) => {
    e.stopPropagation();
    deleteTodoList(todo.id);
  });

  element.querySelector(".add-task").addEventListener("click", (e) => {
    e.stopPropagation();
    addTaskToTodo(todo.id);
  });

  element.querySelectorAll(".task-checkbox").forEach((checkbox) => {
    checkbox.addEventListener("change", (e) => {
      e.stopPropagation();
      toggleTaskCompletion(e.target.dataset.taskId, e.target.checked);
    });
  });

  return element;
}

function openNewTodoEditor() {
  todoEditorTitle.textContent = "New To-Do List";
  todoTitle.value = "";
  todoDescription.value = "";
  todoPinned.checked = false;
  todoListEditor.innerHTML = "";
  addTodoTaskItem();
  todoEditorModal.classList.add("active");
  todoTitle.focus();
}

function openEditTodoEditor(todoId) {
  const todo = todoManager.todos.find((t) => t.id === todoId);
  if (!todo) return;

  todoEditorTitle.textContent = "Edit To-Do List";
  todoTitle.value = todo.title;
  todoDescription.value = todo.description || "";
  todoPinned.checked = todo.pinned || false;
  todoListEditor.innerHTML = "";

  const tasks = todoManager.getTasksByTodoId(todoId);
  tasks.forEach((task) => {
    addTodoTaskItem(task);
  });

  todoEditorModal.dataset.currentTodoId = todoId;
  todoEditorModal.classList.add("active");
}

function addTodoTaskItem(taskData = null) {
  if (!todoListEditor) return;

  const taskId = taskData?.id || generateId();
  const taskItem = document.createElement("div");
  taskItem.className = "todo-task-item";
  taskItem.innerHTML = `
    <div class="task-content">
      <input type="checkbox" ${
        taskData?.completed ? "checked" : ""
      } class="task-checkbox" data-task-id="${taskId}">
      <input type="text" class="form-control task-title" placeholder="Task title" value="${
        taskData?.title || ""
      }">
      <input type="date" class="form-control task-due" value="${
        taskData?.dueDate || ""
      }">
      <button type="button" class="btn btn-sm btn-danger remove-task">
        <i class="fas fa-trash"></i>
      </button>
    </div>
  `;

  todoListEditor.appendChild(taskItem);

  taskItem.querySelector(".remove-task").addEventListener("click", () => {
    taskItem.remove();
  });
}

function addTaskToTodo(todoId) {
  const taskTitle = prompt("Enter task title:");
  if (taskTitle && taskTitle.trim()) {
    let dueDate = prompt(
      "Enter due date for this task (YYYY-MM-DD) or leave empty:",
      ""
    );
    dueDate = dueDate && dueDate.trim() ? dueDate.trim() : null;
    todoManager.addTask(todoId, {
      title: taskTitle.trim(),
      completed: false,
      dueDate,
    });
    loadTodoData();
    showSuccess("Task added!");
  }
}

function saveTodo() {
  const title = todoTitle.value.trim();
  const description = todoDescription.value.trim();
  const pinned = todoPinned.checked;

  if (!title) {
    showError("Please enter a title for your to-do list");
    return;
  }

  // Collect tasks
  const tasks = [];
  document.querySelectorAll(".todo-task-item").forEach((item) => {
    const taskTitle = item.querySelector(".task-title").value.trim();
    const taskDue = item.querySelector(".task-due")
      ? item.querySelector(".task-due").value
      : null;
    if (taskTitle) {
      tasks.push({
        id: item.querySelector(".task-checkbox").dataset.taskId,
        title: taskTitle,
        completed: item.querySelector(".task-checkbox").checked,
        dueDate: taskDue || null,
      });
    }
  });

  const todoId = todoEditorModal.dataset.currentTodoId;

  if (todoId) {
    // Update existing
    todoManager.updateTodo(todoId, { title, description, pinned });

    // Clear old tasks and add new ones
    const oldTasks = todoManager.getTasksByTodoId(todoId);
    oldTasks.forEach((task) => {
      todoManager.tasks = todoManager.tasks.filter((t) => t.id !== task.id);
    });

    tasks.forEach((task) => {
      todoManager.addTask(todoId, task);
    });

    showSuccess("To-Do list updated!");
  } else {
    // Create new
    const todo = todoManager.addTodo({ title, description, pinned });

    tasks.forEach((task) => {
      todoManager.addTask(todo.id, task);
    });

    showSuccess("To-Do list created!");
  }

  todoManager.save();
  closeTodoEditor();
  loadTodoData();
}

function closeTodoEditor() {
  todoEditorModal.classList.remove("active");
  delete todoEditorModal.dataset.currentTodoId;
}

function toggleTaskCompletion(taskId, completed) {
  todoManager.updateTask(taskId, { completed });
  loadTodoData();
}

function deleteTodoList(todoId) {
  Swal.fire({
    title: "Delete To-Do List?",
    text: "This will delete the to-do list and all its tasks.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#64748b",
    confirmButtonText: "Delete",
    cancelButtonText: "Cancel",
  }).then((result) => {
    if (result.isConfirmed) {
      todoManager.deleteTodo(todoId);
      showSuccess("To-Do list deleted!");
      loadTodoData();
    }
  });
}

// Trash Functions
function showTrashPage() {
  if (notesGrid) notesGrid.style.display = "none";
  if (emptyState) emptyState.style.display = "none";
  if (taskPanel) taskPanel.style.display = "none";

  const mainContent = document.querySelector(".main-content");
  if (!mainContent) return;

  let trashContainer = document.getElementById("trashContainer");
  if (!trashContainer) {
    trashContainer = document.createElement("div");
    trashContainer.id = "trashContainer";
    trashContainer.className = "trash-container";
    mainContent.appendChild(trashContainer);
  }

  trashContainer.style.display = "block";
  trashContainer.innerHTML = "";

  if (trashNotes.length === 0) {
    trashContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">
          <i class="fas fa-trash"></i>
        </div>
        <h3>Trash is Empty</h3>
        <p class="text-secondary">Deleted notes will appear here</p>
        <button class="btn btn-primary mt-3" id="backToNotesBtn">
          <i class="fas fa-arrow-left"></i> Back to Notes
        </button>
      </div>
    `;

    setTimeout(() => {
      const backBtn = document.getElementById("backToNotesBtn");
      if (backBtn) backBtn.addEventListener("click", goBackToNotes);
    }, 100);
    return;
  }

  trashContainer.innerHTML = `
    <div class="trash-header">
      <h2>Trash (${trashNotes.length})</h2>
      <div>
        <button class="btn btn-secondary mr-2" id="backBtn">
          <i class="fas fa-arrow-left"></i> Back
        </button>
        <button class="btn btn-danger" id="emptyTrashBtn">
          <i class="fas fa-trash"></i> Empty Trash
        </button>
      </div>
    </div>
    <div class="trash-notes" id="trashNotesGrid"></div>
  `;

  const trashNotesContainer = document.getElementById("trashNotesGrid");
  trashNotes.forEach((note) => {
    const noteElement = createTrashNoteCard(note);
    trashNotesContainer.appendChild(noteElement);
  });

  setTimeout(() => {
    const backBtn = document.getElementById("backBtn");
    if (backBtn) backBtn.addEventListener("click", goBackToNotes);

    const emptyBtn = document.getElementById("emptyTrashBtn");
    if (emptyBtn) emptyBtn.addEventListener("click", emptyTrash);
  }, 100);

  document.querySelectorAll(".category-item").forEach((item) => {
    item.classList.toggle("active", item.dataset.category === "trash");
  });
}

function createTrashNoteCard(note) {
  const card = document.createElement("div");
  card.className = "note-card trash-note";
  card.dataset.id = note.id;

  const deletedDate = new Date(note.deletedAt);
  const formattedDate = deletedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  let tagsHTML = "";
  if (note.tags && note.tags.length > 0) {
    note.tags.forEach((tag) => {
      tagsHTML += `<span class="note-tag">${tag}</span>`;
    });
  }

  const contentPreview = formatNotePreview(note.content, 150);

  card.innerHTML = `
    <div class="note-card-header">
      <div>
        <h3 class="note-title">${note.title}</h3>
        <span class="note-category">${note.category}</span>
      </div>
    </div>
    <div class="note-content">${contentPreview}</div>
    ${tagsHTML ? `<div class="note-tags">${tagsHTML}</div>` : ""}
    <div class="note-footer">
      <div class="note-date">Deleted: ${formattedDate}</div>
      <div class="note-actions">
        <button class="note-action-btn restore" title="Restore">
          <i class="fas fa-undo"></i>
        </button>
        <button class="note-action-btn delete-permanent" title="Delete Permanently">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>
  `;

  card.querySelector(".restore").addEventListener("click", (e) => {
    e.stopPropagation();
    restoreFromTrash(note.id);
  });

  card.querySelector(".delete-permanent").addEventListener("click", (e) => {
    e.stopPropagation();
    permanentDelete(note.id);
  });

  return card;
}

async function restoreFromTrash(noteId) {
  const noteIndex = trashNotes.findIndex((n) => n.id === noteId);
  if (noteIndex !== -1) {
    const noteToRestore = { ...trashNotes[noteIndex] };
    delete noteToRestore.deletedAt;
    notes.unshift(noteToRestore);
    trashNotes = trashNotes.filter((note) => note.id !== noteId);

    await saveNotesToStorage();
    await saveTrashToStorage();

    showTrashPage();
    updateTrashCount();
    showSuccess("Note restored!");
  }
}

async function permanentDelete(noteId) {
  Swal.fire({
    title: "Delete Permanently?",
    text: "This note will be permanently deleted. This action cannot be undone.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#64748b",
    confirmButtonText: "Delete Permanently",
    cancelButtonText: "Cancel",
  }).then(async (result) => {
    if (result.isConfirmed) {
      trashNotes = trashNotes.filter((note) => note.id !== noteId);
      await saveTrashToStorage();
      showTrashPage();
      updateTrashCount();
      showSuccess("Note permanently deleted!");
    }
  });
}

async function emptyTrash() {
  Swal.fire({
    title: "Empty Trash?",
    text: "This will permanently delete all notes in trash. This action cannot be undone.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#64748b",
    confirmButtonText: "Empty Trash",
    cancelButtonText: "Cancel",
  }).then(async (result) => {
    if (result.isConfirmed) {
      trashNotes = [];
      localStorage.removeItem(`nexusTrash_${currentUser.uid}`);
      showTrashPage();
      updateTrashCount();
      showSuccess("Trash emptied!");
    }
  });
}

function goBackToNotes() {
  const trashContainer = document.getElementById("trashContainer");
  if (trashContainer) trashContainer.style.display = "none";
  if (notesGrid) notesGrid.style.display = "grid";
  filterByCategory("all");
}

// Export Functions
function showExportModal() {
  // re-query and ensure there is a selected option (default to first)
  const options = document.querySelectorAll(".export-option");
  options.forEach((opt) => opt.classList.remove("active"));
  if (options.length > 0) options[0].classList.add("active");
  const date = new Date().toISOString().split("T")[0];
  exportFileNameInput.value = `nexus-notes-${date}`;
  // Check library availability and mark disabled formats
  const docxLib = window.docx || window.Docx;
  const docxOption = document.querySelector(
    '.export-option[data-format="docx"]'
  );
  const selectOpt = document.querySelector(
    '#exportFormatSelect option[value="docx"]'
  );
  if (!docxLib || !docxLib.Document) {
    if (docxOption) {
      docxOption.classList.add("disabled");
      docxOption.setAttribute(
        "title",
        "DOCX export unavailable (docx library failed to load)"
      );
    }
    if (selectOpt) selectOpt.disabled = true;
  } else {
    if (docxOption) {
      docxOption.classList.remove("disabled");
      docxOption.removeAttribute("title");
    }
    if (selectOpt) selectOpt.disabled = false;
  }
  exportModal.classList.add("active");
}

function closeExportModal() {
  exportModal.classList.remove("active");
}

function getSelectedFormat() {
  const activeOption = document.querySelector(".export-option.active");
  if (activeOption) return activeOption.dataset.format;
  const sel = document.getElementById("exportFormatSelect");
  if (sel && sel.value) return sel.value;
  return "pdf";
}

async function startExport() {
  const format = getSelectedFormat();
  const exportAll = exportAllCheckbox.checked;
  const includeMetadata = includeMetadataCheckbox.checked;
  const fileName = exportFileNameInput.value.trim() || "nexus-notes-export";

  console.log("Starting export", {
    format,
    exportAll,
    includeMetadata,
    fileName,
  });

  let notesToExport = exportAll ? notes : getFilteredNotes();

  if (notesToExport.length === 0) {
    showError("No notes to export!");
    return;
  }

  closeExportModal();
  showExportLoading();

  try {
    switch (format) {
      case "pdf":
        await exportAsPDF(notesToExport, fileName, includeMetadata);
        break;
      case "docx":
        await exportAsDOCX(notesToExport, fileName, includeMetadata);
        break;
      case "txt":
        await exportAsTXT(notesToExport, fileName, includeMetadata);
        break;
      case "json":
        await exportAsJSON(notesToExport, fileName);
        break;
      default:
        showError("Export format not supported in demo");
    }

    showSuccess(`Notes exported successfully as ${format.toUpperCase()}!`);
  } catch (error) {
    console.error("Export error:", error);
    showError("Export failed: " + error.message);
  } finally {
    hideExportLoading();
  }
}

function showExportLoading() {
  if (exportLoading) exportLoading.classList.add("active");
}

function hideExportLoading() {
  if (exportLoading) exportLoading.classList.remove("active");
}

function getFilteredNotes() {
  return notes.filter((note) => {
    if (currentCategory !== "all" && note.category !== currentCategory)
      return false;
    if (currentTag && (!note.tags || !note.tags.includes(currentTag)))
      return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const titleMatch = note.title.toLowerCase().includes(query);
      const contentMatch = note.content.toLowerCase().includes(query);
      const tagMatch =
        note.tags && note.tags.some((tag) => tag.toLowerCase().includes(query));
      if (!titleMatch && !contentMatch && !tagMatch) return false;
    }
    return true;
  });
}

// Simplified Export Functions for Demo
async function exportAsPDF(notesToExport, fileName, includeMetadata) {
  // Try to use jsPDF for a proper PDF file. If not available, fall back to a text-based PDF blob.
  const docText = [];
  docText.push("Notes Export\n");
  docText.push(`Exported on: ${new Date().toLocaleDateString()}\n`);
  docText.push(`Total Notes: ${notesToExport.length}\n\n`);

  notesToExport.forEach((note, index) => {
    docText.push(`${index + 1}. ${note.title}\n`);
    if (includeMetadata) {
      docText.push(`   Category: ${note.category}\n`);
      docText.push(`   Tags: ${note.tags ? note.tags.join(", ") : "None"}\n`);
      docText.push(
        `   Created: ${new Date(note.createdAt).toLocaleDateString()}\n`
      );
    }
    docText.push(`\n${formatNotePreview(note.content, 1000)}\n\n`);
    docText.push("---\n\n");
  });

  // Use jsPDF if available to create a real PDF, otherwise fallback to a simple blob.
  if (window.jspdf && window.jspdf.jsPDF) {
    try {
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF();
      const text = docText.join("");
      const lines = pdf.splitTextToSize(text, 180);
      pdf.text(lines, 10, 10);
      const blob = pdf.output("blob");
      downloadBlob(blob, `${fileName}.pdf`);
      return;
    } catch (err) {
      console.warn("jsPDF failed, falling back to text PDF", err);
    }
  }

  const blob = new Blob([docText.join("")], { type: "application/pdf" });
  downloadBlob(blob, `${fileName}.pdf`);
}

async function exportAsTXT(notesToExport, fileName, includeMetadata) {
  let content = "Notes Export\n\n";
  content += `Exported on: ${new Date().toLocaleDateString()}\n`;
  content += `Total Notes: ${notesToExport.length}\n\n`;

  notesToExport.forEach((note, index) => {
    content += `${index + 1}. ${note.title}\n`;
    if (includeMetadata) {
      content += `   Category: ${note.category}\n`;
      content += `   Tags: ${note.tags ? note.tags.join(", ") : "None"}\n`;
      content += `   Created: ${new Date(
        note.createdAt
      ).toLocaleDateString()}\n`;
    }
    content += `\n${formatNotePreview(note.content, 1000)}\n\n`;
    content += "---\n\n";
  });

  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  downloadBlob(blob, `${fileName}.txt`);
}

async function exportAsJSON(notesToExport, fileName) {
  const exportData = {
    exportedAt: new Date().toISOString(),
    totalNotes: notesToExport.length,
    notes: notesToExport.map((note) => ({
      title: note.title,
      content: formatNotePreview(note.content, 5000),
      category: note.category,
      tags: note.tags,
      pinned: note.pinned,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
    })),
  };

  const dataStr = JSON.stringify(exportData, null, 2);
  const blob = new Blob([dataStr], { type: "application/json;charset=utf-8" });
  downloadBlob(blob, `${fileName}.json`);
}

// Export as DOCX using the `docx` library (browser global). Falls back to TXT if not available.
async function exportAsDOCX(notesToExport, fileName, includeMetadata) {
  const docxLib = window.docx || window.Docx;
  if (!docxLib || !docxLib.Document) {
    // If docx library not available, fallback to Word-compatible HTML .doc
    console.warn(
      "DOCX library not available; falling back to Word-compatible .doc"
    );
    showNotification(
      "DOCX library not available — exporting as Word-compatible .doc instead."
    );
    await exportAsDocHtml(notesToExport, fileName, includeMetadata);
    return;
  }

  // Use the docx library if it appears functional. Wrap generation so runtime errors fallback.
  try {
    const { Document, Packer, Paragraph, TextRun } = docxLib;
    if (!Document || !Packer || !Paragraph || !TextRun) {
      throw new Error("docx API incomplete");
    }

    const doc = new Document({ sections: [{ children: [] }] });

    const pushPara = (children) => {
      if (!doc.sections || !doc.sections[0])
        throw new Error("doc.sections missing");
      doc.sections[0].children.push(new Paragraph({ children }));
    };

    pushPara([new TextRun({ text: "Notes Export", bold: true })]);

    notesToExport.forEach((note, index) => {
      pushPara([
        new TextRun({
          text: `${index + 1}. ${note.title || "Untitled"}`,
          bold: true,
        }),
      ]);

      if (includeMetadata) {
        pushPara([
          new TextRun({ text: `Category: ${note.category || "None"}` }),
        ]);
        pushPara([
          new TextRun({
            text: `Tags: ${(note.tags && note.tags.join(", ")) || "None"}`,
          }),
        ]);
        pushPara([new TextRun({ text: `Created: ${note.createdAt || ""}` })]);
      }

      const raw = (note.content || "").replace(/<[^>]*>/g, "");
      const lines = raw.split(/\r?\n/);
      lines.forEach((ln) => {
        if (ln.trim()) pushPara([new TextRun(ln)]);
      });

      pushPara([new TextRun("")]);
    });

    const blob = await Packer.toBlob(doc);
    downloadBlob(blob, `${fileName}.docx`);
    return;
  } catch (err) {
    console.error("DOCX generation error, falling back to HTML .doc:", err);
    showNotification(
      "DOCX export encountered an error — using Word-compatible .doc fallback."
    );
    await exportAsDocHtml(notesToExport, fileName, includeMetadata);
    return;
  }
}

// Robust blob downloader
function downloadBlob(blob, filename) {
  try {
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, filename);
      return;
    }

    const link = document.createElement("a");
    link.style.display = "none";
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();

    // Create a temporary fallback link in the modal in case the automatic download is blocked
    const fallbackId = "export-fallback-link";
    try {
      let existing = document.getElementById(fallbackId);
      if (existing) existing.parentNode.removeChild(existing);
      const fallback = document.createElement("a");
      fallback.id = fallbackId;
      fallback.href = link.href;
      fallback.textContent = "If the download did not start, click here";
      fallback.style.display = "inline-block";
      fallback.style.marginLeft = "12px";
      fallback.className = "text-primary";
      const footer = document.querySelector(".export-footer");
      if (footer) footer.appendChild(fallback);
      // Also show a modal with a direct download link so users can click regardless of modal visibility
      try {
        Swal.fire({
          title: "Manual download",
          html: `If the automatic download didn't start, <a href="${link.href}" download="${filename}">click here to download</a>.`,
          showCloseButton: true,
          confirmButtonText: "Done",
          width: 600,
        });
      } catch (e) {
        // ignore Swal errors
        console.warn("Could not show manual download modal", e);
      }
      setTimeout(() => {
        try {
          if (fallback.parentNode) fallback.parentNode.removeChild(fallback);
        } catch (e) {}
      }, 12000);
    } catch (e) {
      console.warn("fallback link error", e);
    }

    setTimeout(() => {
      try {
        URL.revokeObjectURL(link.href);
      } catch (e) {
        console.warn(e);
      }
      if (link.parentNode) link.parentNode.removeChild(link);
    }, 1500);
  } catch (err) {
    console.error("downloadBlob error", err);
    showError("Download failed: " + (err.message || err));
  }
}

// Utility Functions
function handleOnlineStatus() {
  isOnline = navigator.onLine;
  showNotification(
    isOnline
      ? "You are back online!"
      : "You are offline. Changes will be saved locally."
  );
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function toggleSidebarCollapse() {
  sidebar.classList.toggle("collapsed");
  const icon = toggleSidebar.querySelector("i");
  icon.classList.toggle("fa-chevron-left");
  icon.classList.toggle("fa-chevron-right");
}

// UI Feedback Functions
function showSuccess(message) {
  Swal.fire({
    icon: "success",
    title: message,
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
  });
}

function showError(message) {
  Swal.fire({
    icon: "error",
    title: "Error",
    text: message,
    confirmButtonColor: "#ef4444",
  });
}

function showNotification(message) {
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 10px;
    padding: 1rem 1.5rem;
    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
    z-index: 1000;
    max-width: 300px;
    color: var(--text-primary);
    animation: fadeIn 0.3s ease;
  `;
  notification.textContent = message;

  document.body.appendChild(notification);
  setTimeout(() => {
    notification.style.animation = "fadeOut 0.5s ease";
    setTimeout(() => {
      if (notification.parentNode) {
        document.body.removeChild(notification);
      }
    }, 500);
  }, 3000);
}
