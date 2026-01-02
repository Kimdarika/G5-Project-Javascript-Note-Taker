let notes = [
    {
        id: 1,
        title: "Web Design Principles",
        date: "Today",
        content: "Key principles of web design: usability, accessibility, responsiveness, and visual hierarchy. Remember to consider user experience (UX) and user interface (UI) design patterns. **Important**: Mobile-first design approach is crucial for modern web applications.",
        tags: ["web-design", "design-principles", "important", "ux"],
        folder: "web-design",
        pinned: true,
        archived: false,
        important: true,
        color: "#e8eaf6",
        priority: "high",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 2,
        title: "Database Normalization",
        date: "Yesterday",
        content: "Normal forms: 1NF, 2NF, 3NF, BCNF. Each normal form addresses specific types of data redundancy and dependency issues. Remember to avoid update anomalies.\n\n**Key Points**:\n• 1NF: Atomic values\n• 2NF: No partial dependencies\n• 3NF: No transitive dependencies\n• BCNF: Every determinant is a candidate key",
        tags: ["database", "normalization", "sql", "important"],
        folder: "database",
        pinned: false,
        archived: false,
        important: true,
        color: "#e1f5fe",
        priority: "medium",
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
        id: 3,
        title: "Project Meeting Notes",
        date: "12/12/2024",
        content: "Discussed project timeline and deliverables. Need to assign tasks to team members and set up weekly check-in meetings. Review design mockups by Friday.\n\n**Action Items**:\n1. Assign frontend tasks to Alex\n2. Setup database schema by Wednesday\n3. Weekly team sync every Monday 2 PM",
        tags: ["student-meeting", "project", "planning", "team"],
        folder: "student-meeting",
        pinned: false,
        archived: false,
        important: true,
        color: "#ffcdcdff",
        priority: "high",
        createdAt: "2024-12-12T00:00:00.000Z",
        updatedAt: "2024-12-12T00:00:00.000Z"
    },
    {
        id: 4,
        title: "English Grammar Review",
        date: "1/12/2024",
        content: "Verb tenses: present simple, present continuous, past simple, future simple. Common mistakes: subject-verb agreement, article usage (a/an/the). Practice exercises due next week.",
        tags: ["general-english", "grammar", "review"],
        folder: "general-english",
        pinned: true,
        archived: false,
        important: false,
        color: "#f3e5f5",
        priority: "medium",
        createdAt: "2024-12-01T00:00:00.000Z",
        updatedAt: "2024-12-01T00:00:00.000Z"
    },
    {
        id: 5,
        title: "Algorithm Complexity",
        date: "12/12/2024",
        content: "Big O notation: O(1), O(log n), O(n), O(n log n), O(n²). Time vs space complexity analysis for common sorting algorithms: quicksort, mergesort, bubblesort.\n\n**Complexity Chart**:\n• Quicksort: O(n log n) average\n• Mergesort: O(n log n) worst-case\n• Bubblesort: O(n²) worst-case",
        tags: ["algorithm", "complexity", "big-o", "important"],
        folder: "algorithm",
        pinned: false,
        archived: false,
        important: true,
        color: "#ffebee",
        priority: "high",
        createdAt: "2024-12-12T00:00:00.000Z",
        updatedAt: "2024-12-12T00:00:00.000Z"
    },
    {
        id: 6,
        title: "Frontend Frameworks Comparison",
        date: "1/11/2024",
        content: "React vs Vue vs Angular: comparison of component structure, state management, learning curve, and community support. Consider project requirements before choosing.\n\n**React**: Component-based, large ecosystem\n**Vue**: Progressive framework, easy learning curve\n**Angular**: Full-featured, TypeScript-based",
        tags: ["frontend", "frameworks", "comparison", "react"],
        folder: "frontend",
        pinned: false,
        archived: false,
        important: false,
        color: "#e8f5e8",
        priority: "medium",
        createdAt: "2024-11-01T00:00:00.000Z",
        updatedAt: "2024-11-01T00:00:00.000Z"
    },
    {
        id: 7,
        title: "Professional Development Goals",
        date: "15/11/2024",
        content: "1. Complete certification course\n2. Attend networking events\n3. Improve presentation skills\n4. Learn new programming language\n5. Contribute to open source\n6. Build portfolio projects",
        tags: ["professional-life", "goals", "career", "development"],
        folder: "professional-life",
        pinned: true,
        archived: false,
        important: true,
        color: "#fff3cd",
        priority: "high",
        createdAt: "2024-11-15T00:00:00.000Z",
        updatedAt: "2024-11-15T00:00:00.000Z"
    },
    {
        id: 8,
        title: "Backend Architecture Patterns",
        date: "20/11/2024",
        content: "Microservices vs Monolithic architecture. RESTful API design principles. Database connection pooling and caching strategies for performance optimization.\n\n**Best Practices**:\n• Use async/await for I/O operations\n• Implement proper error handling\n• Add request validation\n• Use environment variables",
        tags: ["backend", "architecture", "patterns", "microservices"],
        folder: "backend",
        pinned: false,
        archived: false,
        important: true,
        color: "#f3e5f5",
        priority: "high",
        createdAt: "2024-11-20T00:00:00.000Z",
        updatedAt: "2024-11-20T00:00:00.000Z"
    },
    {
        id: 9,
        title: "Software Deployment Strategies",
        date: "5/12/2024",
        content: "Blue-green deployment, canary releases, rolling updates. CI/CD pipeline setup using Jenkins/GitHub Actions. Monitoring and rollback procedures.\n\n**Deployment Checklist**:\n• Backup database\n• Run tests\n• Monitor metrics\n• Have rollback plan ready",
        tags: ["software-deployment", "devops", "ci-cd", "important"],
        folder: "software-deployment",
        pinned: false,
        archived: false,
        important: true,
        color: "#e1f5fe",
        priority: "medium",
        createdAt: "2024-12-05T00:00:00.000Z",
        updatedAt: "2024-12-05T00:00:00.000Z"
    },
    {
        id: 10,
        title: "Technical English Vocabulary",
        date: "10/12/2024",
        content: "Technical terms: algorithm, database, framework, interface, protocol, query, repository, server, syntax, variable. Practice using in context during presentations.\n\n**Common Phrases**:\n• 'The API endpoint returns JSON data'\n• 'We need to optimize the database query'\n• 'The framework provides built-in security'",
        tags: ["english-for-it", "vocabulary", "technical", "language"],
        folder: "english-for-it",
        pinned: false,
        archived: false,
        important: false,
        color: "#e8f5e8",
        priority: "low",
        createdAt: "2024-12-10T00:00:00.000Z",
        updatedAt: "2024-12-10T00:00:00.000Z"
    },
    {
        id: 11,
        title: "Design Thinking Process",
        date: "8/12/2024",
        content: "Empathize, Define, Ideate, Prototype, Test. User research methods: interviews, surveys, observation. Creating user personas and journey maps.\n\n**Design Principles**:\n• Consistency\n• Feedback\n• Error prevention\n• Recognition over recall",
        tags: ["design", "process", "ux", "ui"],
        folder: "design",
        pinned: false,
        archived: true,
        important: true,
        color: "#ffebee",
        priority: "medium",
        createdAt: "2024-12-08T00:00:00.000Z",
        updatedAt: "2024-12-08T00:00:00.000Z"
    }
];
let settings = {
    defaultColor: "white",
    defaultPriority: "medium",
    autoSaveInterval: 10,
    notesPerPage: 20,
    spellCheck: true,
    showCharCount: true,
    theme: "light",
    sortBy: "newest"
};
const notesGrid = document.getElementById('notesGrid');
const newNoteBtn = document.getElementById('newNoteBtn');
const noteModal = document.getElementById('noteModal');
const deleteModal = document.getElementById('deleteModal');
const settingsModal = document.getElementById('settingsModal');
const closeModal = document.getElementById('closeModal');
const closeSettings = document.getElementById('closeSettings');
const cancelBtn = document.getElementById('cancelBtn');
const noteForm = document.getElementById('noteForm');
const modalTitle = document.getElementById('modalTitle');
const noteTitle = document.getElementById('noteTitle');
const noteDate = document.getElementById('noteDate');
const noteContent = document.getElementById('noteContent');
const noteTags = document.getElementById('noteTags');
const noteFolder = document.getElementById('noteFolder');
const searchInput = document.getElementById('searchInput');
const deleteBtn = document.getElementById('deleteBtn');
const cancelDelete = document.getElementById('cancelDelete');
const confirmDelete = document.getElementById('confirmDelete');
const themeToggle = document.getElementById('themeToggle');
const nightModeToggle = document.getElementById('nightModeToggle');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');
const toastIcon = document.getElementById('toastIcon');
const charCounter = document.getElementById('charCounter');
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const exportBtn = document.getElementById('exportNotes');
const importBtn = document.getElementById('importNotes');
const settingsBtn = document.getElementById('settingsBtn');
const saveSettingsBtn = document.getElementById('saveSettings');
const resetSettingsBtn = document.getElementById('resetSettings');
const sortNewestBtn = document.getElementById('sortNewest');
const sortOldestBtn = document.getElementById('sortOldest');
const sortAlphabeticalBtn = document.getElementById('sortAlphabetical');
const filterImportantBtn = document.getElementById('filterImportant');
const totalNotesEl = document.getElementById('totalNotes');
const pinnedNotesCountEl = document.getElementById('pinnedNotesCount');
const archivedNotesCountEl = document.getElementById('archivedNotesCount');
const todayNotesCountEl = document.getElementById('todayNotesCount');
const importantNotesCountEl = document.getElementById('importantNotesCount');
const totalNotesStatEl = document.getElementById('totalNotesStat');
const charCountEl = document.getElementById('charCount');
const productivityFill = document.getElementById('productivityFill');
const productivityText = document.getElementById('productivityText');
const folderCountElements = {
    'all': document.getElementById('allCount'),
    'general-english': document.getElementById('generalEnglishCount'),
    'web-design': document.getElementById('webDesignCount'),
    'algorithm': document.getElementById('algorithmCount'),
    'student-meeting': document.getElementById('studentMeetingCount'),
    'database': document.getElementById('databaseCount'),
    'software-deployment': document.getElementById('softwareDeploymentCount'),
    'frontend': document.getElementById('frontendCount'),
    'professional-life': document.getElementById('professionalLifeCount'),
    'backend': document.getElementById('backendCount'),
    'english-for-it': document.getElementById('englishForItCount'),
    'design': document.getElementById('designCount')
};
let currentNoteId = null;
let isEditing = false;
let currentView = 'today';
let selectedColor = 'white';
let selectedPriority = 'medium';
let noteToDelete = null;
let sortOrder = 'newest';
let showImportantOnly = false;
let autoSaveTimer;
function initApp() {
    loadSettings();
    loadNotesFromStorage();
    displayNotes(getFilteredNotes());
    updateStats();
    updateFolderCounts();
    setupEventListeners();
    setCurrentDate();
    updateProductivity();
    startAutoSave();
    showToast('Academic Notebook loaded successfully!', 'success');
}
function loadNotesFromStorage() {
    const savedNotes = localStorage.getItem('academicNotes');
    if (savedNotes) {
        try {
            const parsedNotes = JSON.parse(savedNotes);
            if (Array.isArray(parsedNotes) && parsedNotes.length > 0) {
                notes = parsedNotes;
            }
        } catch (e) {
            console.error('Error loading notes:', e);
            showToast('Error loading saved notes', 'error');
        }
    }
}
function loadSettings() {
    const savedSettings = localStorage.getItem('academicNotesSettings');
    if (savedSettings) {
        try {
            const parsedSettings = JSON.parse(savedSettings);
            settings = { ...settings, ...parsedSettings };
            applySettings();
        } catch (e) {
            console.error('Error loading settings:', e);
        }
    }
}
function applySettings() {
    if (settings.theme === 'dark') {
        enableDarkTheme();
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        themeToggle.title = 'Switch to Light Theme';
    } else if (settings.theme === 'night') {
        enableNightMode();
        nightModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        nightModeToggle.title = 'Disable Night Mode';
    }
    sortOrder = settings.sortBy;
    updateSortButtons();
    document.getElementById('defaultColor').value = settings.defaultColor;
    document.getElementById('defaultPriority').value = settings.defaultPriority;
    document.getElementById('autoSaveInterval').value = settings.autoSaveInterval;
    document.getElementById('notesPerPage').value = settings.notesPerPage;
    document.getElementById('spellCheck').checked = settings.spellCheck;
    document.getElementById('showCharCount').checked = settings.showCharCount;
    noteContent.spellcheck = settings.spellCheck;
    charCounter.style.display = settings.showCharCount ? 'block' : 'none';
}
function saveNotesToStorage() {
    try {
        localStorage.setItem('academicNotes', JSON.stringify(notes));
    } catch (e) {
        console.error('Error saving notes:', e);
        showToast('Error saving notes', 'error');
    }
}
function saveSettingsToStorage() {
    try {
        localStorage.setItem('academicNotesSettings', JSON.stringify(settings));
    } catch (e) {
        console.error('Error saving settings:', e);
        showToast('Error saving settings', 'error');
    }
}
function startAutoSave() {
    if (autoSaveTimer) clearInterval(autoSaveTimer);
    autoSaveTimer = setInterval(() => {
        saveNotesToStorage();
    }, settings.autoSaveInterval * 1000);
}
function displayNotes(notesArray) {
    notesGrid.innerHTML = '';
    if (notesArray.length === 0) {
        notesGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; color: var(--gray-color); padding: 60px 20px; background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.85)); border-radius: var(--border-radius); box-shadow: var(--box-shadow); border: 2px dashed rgba(74, 111, 165, 0.3); backdrop-filter: blur(10px); position: relative; overflow: hidden;">
                <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(135deg, rgba(74, 111, 165, 0.05), rgba(255, 126, 95, 0.05)); z-index: -1;"></div>
                <i class="fas fa-sticky-note" style="font-size: 64px; margin-bottom: 20px; opacity: 0.2;"></i>
                <h3 style="margin-bottom: 15px; color: var(--dark-color);">No notes found</h3>
                <p>Create your first note or try a different filter.</p>
                <button class="btn btn-primary" onclick="openNewNote()" style="margin-top: 25px; background: linear-gradient(135deg, var(--primary-color), var(--secondary-color)); border: none; padding: 12px 28px; border-radius: 25px; font-weight: 700; transition: var(--transition); box-shadow: 0 6px 20px rgba(74, 111, 165, 0.3);">
                    <i class="fas fa-plus"></i> Create First Note
                </button>
            </div>
        `;
        return;
    }
    const sortedNotes = sortNotes([...notesArray]);
    const displayNotes = sortedNotes.slice(0, settings.notesPerPage === 100 ? sortedNotes.length : settings.notesPerPage); 
    displayNotes.forEach(note => {
        const noteCard = createNoteCard(note);
        notesGrid.appendChild(noteCard);
    });
    if (sortedNotes.length > displayNotes.length) {
        const remaining = sortedNotes.length - displayNotes.length;
        const paginationInfo = document.createElement('div');
        paginationInfo.style.cssText = 'grid-column: 1 / -1; text-align: center; color: var(--gray-color); padding: 20px; font-size: 14px;';
        paginationInfo.textContent = `Showing ${displayNotes.length} of ${sortedNotes.length} notes. ${remaining} more notes available.`;
        notesGrid.appendChild(paginationInfo);
    }
}
function createNoteCard(note) {
    const noteCard = document.createElement('div');
    noteCard.className = 'note-card';
    noteCard.dataset.id = note.id;
    noteCard.style.backgroundColor = note.color;
    if (note.pinned) noteCard.classList.add('pinned');
    if (note.archived) noteCard.classList.add('archived');
    if (note.important) noteCard.classList.add('important');
    const displayDate = note.date === 'Today' ? note.date : 
                      note.date === 'Yesterday' ? note.date : 
                      formatDisplayDate(note.date);
    const priorityBadge = getPriorityBadge(note.priority);
    const tagsHtml = note.tags.map(tag => 
        `<span class="tag">${escapeHtml(tag)}</span>`
    ).join('');
    const previewContent = note.content.length > 200 ? 
        note.content.substring(0, 200) + '...' : note.content;
    const folderBadge = note.folder.replace('-', ' ').toUpperCase();
    noteCard.innerHTML = `
        <div class="note-header">
            <div>
                <div class="note-title">${escapeHtml(note.title)}</div>
                <div class="note-date">${displayDate} ${priorityBadge}</div>
            </div>
            <div>${folderBadge}</div>
        </div>
        <div class="note-content">
            ${formatNoteContent(previewContent)}
        </div>
        <div class="note-tags">
            ${tagsHtml}
        </div>
        <div class="note-actions">
            <button class="action-btn pin-btn" title="${note.pinned ? 'Unpin' : 'Pin'}">
                <i class="fas ${note.pinned ? 'fa-thumbtack' : 'fa-thumbtack'}"></i>
            </button>
            <button class="action-btn important-btn" title="${note.important ? 'Remove importance' : 'Mark important'}">
                <i class="fas ${note.important ? 'fa-star' : 'fa-star'}"></i>
            </button>
            <button class="action-btn archive-btn" title="${note.archived ? 'Unarchive' : 'Archive'}">
                <i class="fas ${note.archived ? 'fa-box-open' : 'fa-archive'}"></i>
            </button>
            <button class="action-btn delete-btn" title="Delete">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    noteCard.addEventListener('click', (e) => {
        if (!e.target.closest('.note-actions')) {
            openEditNote(note.id);
        }
    });
    noteCard.querySelector('.pin-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        togglePin(note.id);
    });
    noteCard.querySelector('.important-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        toggleImportant(note.id);
    });
    noteCard.querySelector('.archive-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        toggleArchive(note.id);
    });
    noteCard.querySelector('.delete-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        confirmDeleteNote(note.id);
    });
    return noteCard;
}
function sortNotes(notesArray) {
    switch(sortOrder) {
        case 'newest':
            return notesArray.sort((a, b) => {
                if (a.pinned && !b.pinned) return -1;
                if (!a.pinned && b.pinned) return 1;
                return new Date(b.createdAt) - new Date(a.createdAt);
            });
        case 'oldest':
            return notesArray.sort((a, b) => {
                if (a.pinned && !b.pinned) return -1;
                if (!a.pinned && b.pinned) return 1;
                return new Date(a.createdAt) - new Date(b.createdAt);
            });
        case 'alphabetical':
            return notesArray.sort((a, b) => {
                if (a.pinned && !b.pinned) return -1;
                if (!a.pinned && b.pinned) return 1;
                return a.title.localeCompare(b.title);
            });
        default:
            return notesArray;
    }
}
function updateSortButtons() {
    sortNewestBtn.classList.toggle('active', sortOrder === 'newest');
    sortOldestBtn.classList.toggle('active', sortOrder === 'oldest');
    sortAlphabeticalBtn.classList.toggle('active', sortOrder === 'alphabetical');
    filterImportantBtn.classList.toggle('active', showImportantOnly);
}
function getFilteredNotes() {
    let filteredNotes = [...notes];
    switch(currentView) {
        case 'pinned':
            filteredNotes = filteredNotes.filter(note => note.pinned && !note.archived);
            break;
        case 'archived':
            filteredNotes = filteredNotes.filter(note => note.archived);
            break;
        case 'important':
            filteredNotes = filteredNotes.filter(note => note.important && !note.archived);
            break;
        case 'today':
            const today = new Date().toDateString();
            filteredNotes = filteredNotes.filter(note => {
                const noteDate = new Date(note.createdAt).toDateString();
                return noteDate === today && !note.archived;
            });
            break;
        case 'all':
            filteredNotes = filteredNotes.filter(note => !note.archived);
            break;
        default:
            if (currentView in folderCountElements) {
                filteredNotes = filteredNotes.filter(note => note.folder === currentView && !note.archived);
            } else {
                filteredNotes = filteredNotes.filter(note => !note.archived);
            }
    }
    if (showImportantOnly) {
        filteredNotes = filteredNotes.filter(note => note.important);
    }
    const searchTerm = searchInput.value.toLowerCase();
    if (searchTerm) {
        filteredNotes = filteredNotes.filter(note =>
            note.title.toLowerCase().includes(searchTerm) ||
            note.content.toLowerCase().includes(searchTerm) ||
            note.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
    }
    
    return filteredNotes;
}
function updateStats() {
    const totalNotes = notes.length;
    const pinnedNotes = notes.filter(note => note.pinned).length;
    const archivedNotes = notes.filter(note => note.archived).length;
    const importantNotes = notes.filter(note => note.important).length;
    const today = new Date().toDateString();
    const todayNotes = notes.filter(note => {
        const noteDate = new Date(note.createdAt).toDateString();
        return noteDate === today;
    }).length;
    const totalChars = notes.reduce((sum, note) => sum + note.content.length, 0);
    
    totalNotesEl.textContent = totalNotes;
    pinnedNotesCountEl.textContent = pinnedNotes;
    archivedNotesCountEl.textContent = archivedNotes;
    todayNotesCountEl.textContent = todayNotes;
    importantNotesCountEl.textContent = importantNotes;
    totalNotesStatEl.textContent = totalNotes;
    charCountEl.textContent = formatNumber(totalChars);
}
function updateFolderCounts() {
    const counts = {
        'all': notes.filter(note => !note.archived).length,
        'general-english': notes.filter(note => note.folder === 'general-english' && !note.archived).length,
        'web-design': notes.filter(note => note.folder === 'web-design' && !note.archived).length,
        'algorithm': notes.filter(note => note.folder === 'algorithm' && !note.archived).length,
        'student-meeting': notes.filter(note => note.folder === 'student-meeting' && !note.archived).length,
        'database': notes.filter(note => note.folder === 'database' && !note.archived).length,
        'software-deployment': notes.filter(note => note.folder === 'software-deployment' && !note.archived).length,
        'frontend': notes.filter(note => note.folder === 'frontend' && !note.archived).length,
        'professional-life': notes.filter(note => note.folder === 'professional-life' && !note.archived).length,
        'backend': notes.filter(note => note.folder === 'backend' && !note.archived).length,
        'english-for-it': notes.filter(note => note.folder === 'english-for-it' && !note.archived).length,
        'design': notes.filter(note => note.folder === 'design' && !note.archived).length
    };
    Object.entries(counts).forEach(([folder, count]) => {
        if (folderCountElements[folder]) {
            folderCountElements[folder].textContent = count;
        }
    });
}
function updateProductivity() {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const weeklyNotes = notes.filter(note => new Date(note.createdAt) > oneWeekAgo).length;
    const percentage = Math.min((weeklyNotes / 10) * 100, 100);
    productivityFill.style.width = `${percentage}%`;
    if (weeklyNotes === 0) {
        productivityText.textContent = 'No notes created this week. Start writing!';
    } else if (weeklyNotes < 3) {
        productivityText.textContent = `${weeklyNotes} notes this week - Keep going!`;
    } else if (weeklyNotes < 7) {
        productivityText.textContent = `${weeklyNotes} notes this week - Good progress!`;
    } else {
        productivityText.textContent = `${weeklyNotes} notes this week - Excellent work!`;
    }
}
function setupEventListeners() {
    newNoteBtn.addEventListener('click', openNewNote);
    closeModal.addEventListener('click', closeNoteModal);
    closeSettings.addEventListener('click', () => settingsModal.style.display = 'none');
    cancelBtn.addEventListener('click', closeNoteModal);
    noteForm.addEventListener('submit', saveNote);
    searchInput.addEventListener('input', () => {
        displayNotes(getFilteredNotes());
    });
    deleteBtn.addEventListener('click', () => {
        if (currentNoteId) {
            confirmDeleteNote(currentNoteId);
        }
    });
    cancelDelete.addEventListener('click', () => {
        deleteModal.style.display = 'none';
        noteToDelete = null;
    });
    confirmDelete.addEventListener('click', deleteNote);
    themeToggle.addEventListener('click', toggleTheme);
    nightModeToggle.addEventListener('click', toggleNightMode);
    noteContent.addEventListener('input', updateCharCounter);
    document.querySelectorAll('.color-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            selectedColor = this.dataset.color;
        });
    });
    document.querySelectorAll('.priority-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.priority-option').forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            selectedPriority = this.dataset.priority;
        });
    });
    sortNewestBtn.addEventListener('click', () => {
        sortOrder = 'newest';
        settings.sortBy = 'newest';
        updateSortButtons();
        displayNotes(getFilteredNotes());
        saveSettingsToStorage();
    });
    sortOldestBtn.addEventListener('click', () => {
        sortOrder = 'oldest';
        settings.sortBy = 'oldest';
        updateSortButtons();
        displayNotes(getFilteredNotes());
        saveSettingsToStorage();
    });
    sortAlphabeticalBtn.addEventListener('click', () => {
        sortOrder = 'alphabetical';
        settings.sortBy = 'alphabetical';
        updateSortButtons();
        displayNotes(getFilteredNotes());
        saveSettingsToStorage();
    });
    filterImportantBtn.addEventListener('click', () => {
        showImportantOnly = !showImportantOnly;
        updateSortButtons();
        displayNotes(getFilteredNotes());
    });
    exportBtn.addEventListener('click', exportNotes);
    importBtn.addEventListener('click', () => {
        dropZone.classList.add('active');
        fileInput.click();
    });
    settingsBtn.addEventListener('click', () => {
        settingsModal.style.display = 'flex';
    });
    saveSettingsBtn.addEventListener('click', saveSettings);
    resetSettingsBtn.addEventListener('click', resetSettings);
    fileInput.addEventListener('change', importNotesFromFile);
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = 'var(--accent-color)';
        dropZone.style.backgroundColor = 'rgba(255, 126, 95, 0.1)';
    });
    dropZone.addEventListener('dragleave', () => {
        dropZone.style.borderColor = 'var(--primary-color)';
        dropZone.style.backgroundColor = 'rgba(74, 111, 165, 0.05)';
    });
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = 'var(--primary-color)';
        dropZone.style.backgroundColor = 'rgba(74, 111, 165, 0.05)';
        dropZone.classList.remove('active');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            importNotesFromFile({ target: { files } });
        }
    });
    document.querySelectorAll('.folder-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelectorAll('.folder-item').forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            const folder = this.dataset.folder;
            currentView = folder;
            const pageTitle = document.getElementById('currentView');
            const folderName = this.querySelector('.folder-name').textContent;
            pageTitle.textContent = folderName;
            
            displayNotes(getFilteredNotes());
            showToast(`Showing ${folderName.toLowerCase()} notes`, 'info');
        });
    });
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            const viewType = this.id.replace('Notes', '').toLowerCase();
            currentView = viewType === 'all' ? 'today' : viewType;
            const pageTitle = document.getElementById('currentView');
            pageTitle.textContent = this.querySelector('span').textContent;
            
            displayNotes(getFilteredNotes());
        });
    });
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            openNewNote();
        }
        if (e.key === 'Escape') {
            if (noteModal.style.display === 'flex') closeNoteModal();
            if (deleteModal.style.display === 'flex') deleteModal.style.display = 'none';
            if (settingsModal.style.display === 'flex') settingsModal.style.display = 'none';
            if (dropZone.classList.contains('active')) dropZone.classList.remove('active');
        }
        if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
            e.preventDefault();
            searchInput.focus();
        }
    });
    window.addEventListener('click', (e) => {
        if (e.target === noteModal) closeNoteModal();
        if (e.target === deleteModal) deleteModal.style.display = 'none';
        if (e.target === settingsModal) settingsModal.style.display = 'none';
    });
}
function openNewNote() {
    isEditing = false;
    currentNoteId = null;
    modalTitle.textContent = 'Create New Note';
    noteTitle.value = '';
    noteDate.value = getCurrentDate();
    noteContent.value = '';
    noteTags.value = '';
    noteFolder.value = 'web-design';
    deleteBtn.style.display = 'none';
    resetSelections();
    updateCharCounter();
    noteModal.style.display = 'flex';
    setTimeout(() => noteTitle.focus(), 100);
}
function resetSelections() {
    document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
    const defaultColorOption = document.querySelector(`.color-option[data-color="${settings.defaultColor}"]`);
    if (defaultColorOption) {
        defaultColorOption.classList.add('selected');
        selectedColor = settings.defaultColor;
    }
    document.querySelectorAll('.priority-option').forEach(opt => opt.classList.remove('selected'));
    const defaultPriorityOption = document.querySelector(`.priority-option[data-priority="${settings.defaultPriority}"]`);
    if (defaultPriorityOption) {
        defaultPriorityOption.classList.add('selected');
        selectedPriority = settings.defaultPriority;
    }
}
function openEditNote(id) {
    isEditing = true;
    currentNoteId = id;
    const note = notes.find(n => n.id === id);
    
    if (note) {
        modalTitle.textContent = 'Edit Note';
        noteTitle.value = note.title;
        noteDate.value = formatDateForInput(note.date);
        noteContent.value = note.content;
        noteTags.value = note.tags.join(', ');
        noteFolder.value = note.folder;
        deleteBtn.style.display = 'block';
        document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
        const colorOption = document.querySelector(`.color-option[data-color="${note.color}"]`);
        if (colorOption) {
            colorOption.classList.add('selected');
            selectedColor = note.color;
        }
        document.querySelectorAll('.priority-option').forEach(opt => opt.classList.remove('selected'));
        const priorityOption = document.querySelector(`.priority-option[data-priority="${note.priority}"]`);
        if (priorityOption) {
            priorityOption.classList.add('selected');
            selectedPriority = note.priority;
        }
        updateCharCounter();
        noteModal.style.display = 'flex';
        setTimeout(() => noteTitle.focus(), 100);
    }
}
function updateCharCounter() {
    const charCount = noteContent.value.length;
    charCounter.textContent = `Characters: ${charCount}`;
    charCounter.style.display = settings.showCharCount ? 'block' : 'none';
}
function closeNoteModal() {
    noteModal.style.display = 'none';
    noteForm.reset();
}
function saveNote(e) {
    e.preventDefault();
    
    const title = noteTitle.value.trim();
    const date = formatDate(noteDate.value) || getCurrentDate();
    const content = noteContent.value.trim();
    const tags = noteTags.value.split(',').map(tag => tag.trim()).filter(tag => tag);
    const folder = noteFolder.value;
    
    if (!title || !content) {
        showToast('Please fill in both title and content', 'error');
        return;
    }
    
    if (isEditing) {
        const noteIndex = notes.findIndex(n => n.id === currentNoteId);
        if (noteIndex !== -1) {
            notes[noteIndex] = {
                ...notes[noteIndex],
                title,
                date,
                content,
                tags,
                folder,
                color: selectedColor,
                priority: selectedPriority,
                updatedAt: new Date().toISOString()
            };
            showToast('Note updated successfully!', 'success');
        }
    } else {
        const newNote = {
            id: notes.length > 0 ? Math.max(...notes.map(n => n.id)) + 1 : 1,
            title,
            date,
            content,
            tags: tags.length > 0 ? tags : ['academic'],
            folder,
            pinned: false,
            archived: false,
            important: false,
            color: selectedColor,
            priority: selectedPriority,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        notes.unshift(newNote);
        showToast('Note created successfully!', 'success');
    }
    saveNotesToStorage();
    displayNotes(getFilteredNotes());
    updateStats();
    updateFolderCounts();
    updateProductivity();
    closeNoteModal();
}
function togglePin(id) {
    const noteIndex = notes.findIndex(n => n.id === id);
    if (noteIndex !== -1) {
        notes[noteIndex].pinned = !notes[noteIndex].pinned;
        notes[noteIndex].updatedAt = new Date().toISOString();
        saveNotesToStorage();
        displayNotes(getFilteredNotes());
        updateStats();
        showToast(notes[noteIndex].pinned ? 'Note pinned!' : 'Note unpinned!', 'info');
    }
}
function toggleImportant(id) {
    const noteIndex = notes.findIndex(n => n.id === id);
    if (noteIndex !== -1) {
        notes[noteIndex].important = !notes[noteIndex].important;
        notes[noteIndex].updatedAt = new Date().toISOString();
        saveNotesToStorage();
        displayNotes(getFilteredNotes());
        updateStats();
        showToast(notes[noteIndex].important ? 'Marked as important!' : 'Removed importance', 'info');
    }
}
function toggleArchive(id) {
    const noteIndex = notes.findIndex(n => n.id === id);
    if (noteIndex !== -1) {
        notes[noteIndex].archived = !notes[noteIndex].archived;
        notes[noteIndex].updatedAt = new Date().toISOString();
        saveNotesToStorage();
        displayNotes(getFilteredNotes());
        updateStats();
        updateFolderCounts();
        showToast(notes[noteIndex].archived ? 'Note archived!' : 'Note unarchived!', 'info');
    }
}
function confirmDeleteNote(id) {
    noteToDelete = id;
    deleteModal.style.display = 'flex';
}
function deleteNote() {
    if (noteToDelete) {
        const noteIndex = notes.findIndex(n => n.id === noteToDelete);
        if (noteIndex !== -1) {
            const noteTitle = notes[noteIndex].title;
            notes.splice(noteIndex, 1);
            saveNotesToStorage();
            displayNotes(getFilteredNotes());
            updateStats();
            updateFolderCounts();
            updateProductivity();
            showToast(`"${noteTitle}" deleted successfully!`, 'success');
        }
        deleteModal.style.display = 'none';
        noteToDelete = null;
        closeNoteModal();
    }
}
function exportNotes() {
    const dataStr = JSON.stringify(notes, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileName = `academic-notes-${new Date().toISOString().split('T')[0]}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileName);
    linkElement.click();
    showToast('Notes exported successfully!', 'success');
}
function importNotesFromFile(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedNotes = JSON.parse(e.target.result);
            if (Array.isArray(importedNotes)) {
                if (confirm(`Import ${importedNotes.length} notes? This will add them to your existing notes.`)) {
                    let importedCount = 0;
                    importedNotes.forEach(note => {
                        note.id = notes.length > 0 ? Math.max(...notes.map(n => n.id)) + 1 : 1;
                        note.createdAt = note.createdAt || new Date().toISOString();
                        note.updatedAt = new Date().toISOString();
                        notes.unshift(note);
                        importedCount++;
                    });
                    saveNotesToStorage();
                    displayNotes(getFilteredNotes());
                    updateStats();
                    updateFolderCounts();
                    updateProductivity();
                    showToast(`${importedCount} notes imported successfully!`, 'success');
                }
            } else {
                showToast('Invalid notes file format', 'error');
            }
        } catch (error) {
            showToast('Error importing notes: ' + error.message, 'error');
        }
    };
    reader.readAsText(file);
    event.target.value = '';
    dropZone.classList.remove('active');
}
function saveSettings() {
    settings.defaultColor = document.getElementById('defaultColor').value;
    settings.defaultPriority = document.getElementById('defaultPriority').value;
    settings.autoSaveInterval = parseInt(document.getElementById('autoSaveInterval').value);
    settings.notesPerPage = parseInt(document.getElementById('notesPerPage').value);
    settings.spellCheck = document.getElementById('spellCheck').checked;
    settings.showCharCount = document.getElementById('showCharCount').checked;
    saveSettingsToStorage();
    applySettings();
    startAutoSave();
    settingsModal.style.display = 'none';
    showToast('Settings saved successfully!', 'success');
}
function resetSettings() {
    if (confirm('Reset all settings to default values?')) {
        settings = {
            defaultColor: "white",
            defaultPriority: "medium",
            autoSaveInterval: 10,
            notesPerPage: 20,
            spellCheck: true,
            showCharCount: true,
            theme: "light",
            sortBy: "newest"
        };
        applySettings();
        saveSettingsToStorage();
        startAutoSave();
        showToast('Settings reset to default!', 'info');
    }
}
function toggleTheme() {
    if (settings.theme === 'dark') {
        settings.theme = 'light';
        disableDarkTheme();
        themeToggle.innerHTML = '<i class="fas fa-palette"></i>';
        themeToggle.title = 'Switch to Dark Theme';
    } else {
        settings.theme = 'dark';
        enableDarkTheme();
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        themeToggle.title = 'Switch to Light Theme';
    }
    saveSettingsToStorage();
    showToast(`Switched to ${settings.theme} theme`, 'info');
}
function toggleNightMode() {
    if (settings.theme === 'night') {
        settings.theme = 'light';
        disableNightMode();
        nightModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        nightModeToggle.title = 'Enable Night Mode';
    } else {
        settings.theme = 'night';
        enableNightMode();
        nightModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        nightModeToggle.title = 'Disable Night Mode';
    }
    saveSettingsToStorage();
    showToast(`Switched to ${settings.theme === 'night' ? 'night' : 'normal'} mode`, 'info');
}
function enableDarkTheme() {
    document.body.classList.add('dark-theme');
}
function disableDarkTheme() {
    document.body.classList.remove('dark-theme');
}
function enableNightMode() {
    document.body.classList.add('dark-theme');
    document.documentElement.style.setProperty('--primary-color', '#8b9dc3');
    document.documentElement.style.setProperty('--accent-color', '#ff8a65');
}
function disableNightMode() {
    document.body.classList.remove('dark-theme');
    document.documentElement.style.setProperty('--primary-color', '#4a6fa5');
    document.documentElement.style.setProperty('--accent-color', '#ff7e5f');
}
function showToast(message, type = 'info') {
    toastMessage.textContent = message;
    toast.className = `toast ${type}`;
    if (type === 'success') {
        toastIcon.className = 'fas fa-check-circle';
    } else if (type === 'error') {
        toastIcon.className = 'fas fa-exclamation-circle';
    } else {
        toastIcon.className = 'fas fa-info-circle';
    }
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
function getCurrentDate() {
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    return `${day}/${month}/${year}`;
}
function formatDateForInput(dateStr) {
    if (!dateStr) return '';
    const parts = dateStr.split('/');
    if (parts.length === 3) {
        const [day, month, year] = parts;
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    return '';
}
function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }
    return dateStr;
}
function formatDisplayDate(dateStr) {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return dateStr;
}
function setCurrentDate() {
    noteDate.value = new Date().toISOString().split('T')[0];
}
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
function formatNoteContent(content) {
    return escapeHtml(content)
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>');
}
function getPriorityBadge(priority) {
    const badges = {
        'high': '<span style="color: #dc3545; font-size: 12px; font-weight: 700; padding: 3px 8px; border-radius: 12px; margin-left: 8px; display: inline-block; vertical-align: middle; backdrop-filter: blur(5px);"><i class="fas fa-exclamation-circle"></i> High</span>',
        'medium': '<span style="color: #ffc107; font-size: 12px; font-weight: 700; padding: 3px 8px; border-radius: 12px; margin-left: 8px; display: inline-block; vertical-align: middle; backdrop-filter: blur(5px);"><i class="fas fa-exclamation"></i> Medium</span>',
        'low': '<span style="color: #28a745; font-size: 12px; font-weight: 700; padding: 3px 8px; border-radius: 12px; margin-left: 8px; display: inline-block; vertical-align: middle; backdrop-filter: blur(5px);"><i class="fas fa-check-circle"></i> Low</span>'
    };
    return badges[priority] || '';
}
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}
window.setView = function(view) {
    const viewMap = {
        'all': 'all',
        'team': 'student-meeting',
        'today': 'today',
        'pinned': 'pinned',
        'important': 'important',
        'archived': 'archived'
    };
    
    if (viewMap[view]) {
        currentView = viewMap[view];
        document.getElementById('currentView').textContent = 
            view.charAt(0).toUpperCase() + view.slice(1) + ' Notes';
        document.querySelectorAll('.menu-item, .folder-item').forEach(item => {
            item.classList.remove('active');
        });
        
        displayNotes(getFilteredNotes());
        showToast(`View changed to ${view}`, 'info');
    }
};
window.openSettings = function() {
    settingsModal.style.display = 'flex';
};
window.logout = function() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('academicNotes');
        localStorage.removeItem('academicNotesSettings');
        showToast('Logged out successfully. Page will refresh.', 'info');
        setTimeout(() => {
            location.reload();
        }, 1500);
    }
};
window.exportNotes = exportNotes;
document.addEventListener('DOMContentLoaded', initApp);