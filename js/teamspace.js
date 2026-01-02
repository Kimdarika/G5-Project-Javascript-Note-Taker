
// --- DATA INITIALIZATION ---
let tasks = JSON.parse(localStorage.getItem('teamSpaceSprint')) || [];
let trash = JSON.parse(localStorage.getItem('teamSpaceTrash')) || [];
let notes = JSON.parse(localStorage.getItem('teamSpaceNotes')) || {};
let pinnedNotes = JSON.parse(localStorage.getItem('pinnedNotes')) || [];
let members = JSON.parse(localStorage.getItem('teamSpaceMembers')) || [
    { name: 'Pon Makara', role: 'Frontend Dev', color: '#0ea5e9', telegram: 'pon_makaraa', phone: '+85512345678', email: 'makara@example.com' }
];

// --- MEMBER PROFILE & CONTACT LOGIC ---
function openMemberProfile(name) {
    const m = members.find(member => member.name === name);
    if (!m) return;

    const initials = m.name.split(' ').map(n => n[0]).join('').toUpperCase();
    const detailDiv = document.getElementById('profileDetail');

    detailDiv.innerHTML = `
            <div class="profile-avatar" style="background: ${m.color}">${initials}</div>
            <h2>${m.name}</h2>
            <p style="color: var(--text-muted); margin-bottom: 20px;">${m.role}</p>
            <div class="contact-grid">
                ${m.telegram ? `<a href="https://t.me/${m.telegram}" target="_blank" class="contact-link"><i class="fab fa-telegram" style="color:#0088cc"></i> Telegram: @${m.telegram}</a>` : ''}
                ${m.phone ? `<a href="tel:${m.phone}" class="contact-link"><i class="fas fa-phone" style="color:#22c55e"></i> Call: ${m.phone}</a>` : ''}
                ${m.email ? `<a href="mailto:${m.email}" class="contact-link"><i class="fas fa-envelope" style="color:#ea4335"></i> Email: ${m.email}</a>` : ''}
            </div>
        `;
    document.getElementById('profileModal').style.display = 'flex';
}

function addMember() {
    const name = document.getElementById('memName').value;
    const role = document.getElementById('memRole').value;
    const tel = document.getElementById('memTelegram').value;
    const ph = document.getElementById('memPhone').value;
    const em = document.getElementById('memEmail').value;

    if (!name || !role) { alert("Name and Role are required"); return; }

    const colors = ['#0ea5e9', '#f43f5e', '#8b5cf6', '#f59e0b', '#10b981'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    members.push({ name, role, color: randomColor, telegram: tel, phone: ph, email: em });
    localStorage.setItem('teamSpaceMembers', JSON.stringify(members));

    ['memName', 'memRole', 'memTelegram', 'memPhone', 'memEmail'].forEach(id => document.getElementById(id).value = '');
    document.getElementById('memberModal').style.display = 'none';
    renderMembers();
}

function renderMembers() {
    const list = document.getElementById('member-list');
    const select = document.getElementById('member-details-select');
    if (!list || !select) return;
    list.innerHTML = '';
    select.innerHTML = '<option value="">Select a member</option>';

    members.forEach(m => {
        const initials = m.name.split(' ').map(n => n[0]).join('').toUpperCase();
        list.innerHTML += `
                <div class="member-item" onclick="openMemberProfile('${m.name}')">
                    <div class="avatar" style="background: ${m.color};">${initials}</div>
                    <div class="member-info"><p>${m.name}</p><span>${m.role}</span></div>
                </div>`;
        select.innerHTML += `<option value="${m.name}">${m.name}</option>`;
    });
}

// --- NOTE LOGIC (PIN & PERSISTENT STORAGE) ---
let currentNoteType = '';
function execCmd(command, value) { document.execCommand(command, false, value); }

function openNote(type) {
    currentNoteType = type;
    renderNoteSidebar();
    const isPinned = pinnedNotes.includes(type);
    document.getElementById('noteType').innerHTML = `
            ${type} Notes 
            <i class="fas fa-thumbtack" id="pinBtn" style="cursor:pointer; margin-left:10px; color: ${isPinned ? 'var(--accent-blue)' : '#cbd5e1'}" 
               onclick="togglePin('${type}')"></i>
        `;
    document.getElementById('noteEditor').innerHTML = notes[type] || "Start typing your " + type + " notes...";
    document.getElementById('noteModal').style.display = 'flex';
}

function saveNote() {
    if (!currentNoteType) return;
    notes[currentNoteType] = document.getElementById('noteEditor').innerHTML;
    localStorage.setItem('teamSpaceNotes', JSON.stringify(notes));
    alert(currentNoteType + " note saved successfully!");
    closeNote();
}

function togglePin(type) {
    const index = pinnedNotes.indexOf(type);
    if (index > -1) pinnedNotes.splice(index, 1);
    else pinnedNotes.push(type);
    localStorage.setItem('pinnedNotes', JSON.stringify(pinnedNotes));
    renderNoteSidebar();
    const pinBtn = document.getElementById('pinBtn');
    if (pinBtn) pinBtn.style.color = pinnedNotes.includes(type) ? 'var(--accent-blue)' : '#cbd5e1';
}

function renderNoteSidebar() {
    const types = ['Daily', 'Weekly', 'Monthly', 'Yearly', '7-Day'];
    const colors = { 'Daily': '--cal-orange', 'Weekly': '--cal-purple', 'Monthly': '--cal-pink', 'Yearly': '--cal-green', '7-Day': '--cal-red' };
    const icons = { 'Daily': 'far fa-calendar-check', 'Weekly': 'far fa-calendar-alt', 'Monthly': 'far fa-calendar-minus', 'Quarterly': 'fas fa-calendar-day', 'Yearly': 'far fa-calendar', '7-Day': 'far fa-calendar-times' };

    const sortedTypes = [...types].sort((a, b) => {
        const aPinned = pinnedNotes.includes(a) ? 1 : 0;
        const bPinned = pinnedNotes.includes(b) ? 1 : 0;
        return bPinned - aPinned;
    });

    const container = document.querySelector('.sidebar-section');
    if (!container) return;
    container.innerHTML = '<h3>Calendar Notes</h3>';

    sortedTypes.forEach(type => {
        const isPinned = pinnedNotes.includes(type);
        const item = document.createElement('div');
        item.className = `note-item ${currentNoteType === type ? 'active' : ''}`;
        item.onclick = () => openNote(type);
        item.innerHTML = `
                <i class="${icons[type]}" style="color: var(${colors[type]});"></i> 
                ${type}
                ${isPinned ? '<i class="fas fa-thumbtack" style="margin-left:auto; font-size:0.7rem; color:var(--accent-blue)"></i>' : ''}
            `;
        container.appendChild(item);
    });
}

// --- MODAL FUNCTIONS ---
function hideModal() {
    document.getElementById('memberModal').style.display = 'none';
}

function showMemberModal() {
    // Clear previous values
    document.getElementById('memName').value = '';
    document.getElementById('memRole').value = '';
    document.getElementById('memTelegram').value = '';
    document.getElementById('memPhone').value = '';
    document.getElementById('memEmail').value = '';

    // Show the modal
    document.getElementById('memberModal').style.display = 'flex';
}

// Close modal when clicking outside
document.addEventListener('click', function (event) {
    if (event.target === document.getElementById('memberModal')) {
        document.getElementById('memberModal').style.display = 'none';
    }
});

// --- TEXT EDITOR FUNCTIONS ---
function showColorPicker() {
    const picker = document.getElementById('colorPicker');
    picker.style.display = picker.style.display === 'block' ? 'none' : 'block';
}

function applyColor(color) {
    document.execCommand('foreColor', false, color);
    document.getElementById('colorPicker').style.display = 'none';
}

// --- TASK & TRASH LOGIC ---
function renderTasks() {
    const containers = { todo: document.getElementById('todo-list'), inprogress: document.getElementById('progress-list'), done: document.getElementById('done-list') };
    Object.values(containers).forEach(c => { if (c) c.innerHTML = ''; });

    tasks.forEach(task => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
                <h4>${task.title}</h4>
                ${task.assignee ? `<div class="assigned">Assigned: ${task.assignee}</div>` : ''}
                <div class="card-tools">
                    <i class="fas fa-arrow-right" onclick="moveTask(${task.id})"></i>
                    <i class="far fa-trash-alt" onclick="deleteTask(${task.id})"></i>
                </div>`;
        if (containers[task.status]) containers[task.status].appendChild(card);
    });

    if (document.getElementById('todo-count')) document.getElementById('todo-count').innerText = tasks.filter(t => t.status === 'todo').length;
    if (document.getElementById('progress-count')) document.getElementById('progress-count').innerText = tasks.filter(t => t.status === 'inprogress').length;
    if (document.getElementById('trash-count')) document.getElementById('trash-count').innerText = trash.length;

    localStorage.setItem('teamSpaceSprint', JSON.stringify(tasks));
    localStorage.setItem('teamSpaceTrash', JSON.stringify(trash));
}

function addTask() {
    const title = document.getElementById('taskTitle').value;
    const assignee = document.getElementById('taskAssignee').value;
    if (title) {
        tasks.push({ id: Date.now(), title, assignee, status: 'todo' });
        document.getElementById('taskTitle').value = '';
        document.getElementById('taskAssignee').value = '';
        hideModal();
        renderTasks();
    }
}

function deleteTask(id) {
    const index = tasks.findIndex(t => t.id === id);
    if (index > -1) {
        trash.push(tasks.splice(index, 1)[0]);
        renderTasks();
    }
}

function moveTask(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    const flow = { 'todo': 'inprogress', 'inprogress': 'done', 'done': 'todo' };
    task.status = flow[task.status];
    renderTasks();
}

function showTrash() {
    const list = document.getElementById('trash-list');
    list.innerHTML = trash.length ? '' : '<p>Trash is empty</p>';
    trash.forEach((t, i) => {
        list.innerHTML += `
                <div style="padding:10px; border-bottom:1px solid #eee; display:flex; justify-content:space-between; align-items:center;">
                    <span>${t.title}</span>
                    <button onclick="restoreTask(${i})" class="btn" style="padding:2px 8px; font-size:0.7rem">Restore</button>
                </div>`;
    });
    document.getElementById('trashModal').style.display = 'flex';
}

function restoreTask(index) {
    tasks.push(trash.splice(index, 1)[0]);
    document.getElementById('trashModal').style.display = 'none';
    renderTasks();
}

function emptyTrash() {
    if (confirm("Permanently delete all items in trash?")) {
        trash = [];
        document.getElementById('trashModal').style.display = 'none';
        renderTasks();
    }
}

// --- SHARING FUNCTIONALITY ---
function shareVia(platform) {
    switch (platform) {
        case 'email':
            shareViaEmail();
            break;
        case 'telegram':
            shareViaTelegram();
            break;
        case 'linkedin':
            shareViaLinkedIn();
            break;
    }
    document.getElementById('shareMenu').style.display = 'none';
}

function shareViaEmail() {
    const subject = 'Check out our Team Space';
    const body = 'I\'d like to share our Team Space with you. Click the link below to view it:\n\n' + window.location.href;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function shareViaTelegram() {
    const text = 'Check out our Team Space: ' + encodeURIComponent(window.location.href);
    window.open(`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent('Check out our Team Space')}`, '_blank');
}

function shareViaLinkedIn() {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank');
}

function copyToClipboard() {
    navigator.clipboard.writeText(window.location.href).then(() => {
        alert('Link copied to clipboard!');
    }).catch(err => {
        console.error('Could not copy text: ', err);
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = window.location.href;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            alert('Link copied to clipboard!');
        } catch (err) {
            console.error('Fallback: Oops, unable to copy', err);
        }
        document.body.removeChild(textArea);
    });
}

// Toggle share menu visibility
function toggleShare() {
    const shareMenu = document.getElementById('shareMenu');
    if (shareMenu) {
        shareMenu.style.display = shareMenu.style.display === 'block' ? 'none' : 'block';
    }
}

// Handle click outside to close share menu
document.addEventListener('click', function (e) {
    const shareMenu = document.getElementById('shareMenu');
    const shareButton = document.querySelector('.header-btns .btn[onclick="toggleShare()"]');

    if (shareMenu && shareMenu.style.display === 'block' &&
        !shareMenu.contains(e.target) &&
        !(shareButton && shareButton.contains(e.target))) {
        shareMenu.style.display = 'none';
    }
});

// Add this function to show all notes
function showAllNotes() {
    const mainContent = document.querySelector('main');
    mainContent.innerHTML = `
        <div class="view-title">
            <i class="fas fa-book" style="color: var(--accent-blue);"></i> 
            <strong>All Notes</strong>
        </div>
        <div id="all-notes-container" style="display: grid; gap: 20px; margin-top: 20px;"></div>
    `;

    const notesContainer = document.getElementById('all-notes-container');
    const noteTypes = ['Daily', 'Weekly', 'Monthly', 'Yearly', '7-Day'];
    const colors = {
        'Daily': '--cal-orange',
        'Weekly': '--cal-purple',
        'Monthly': '--cal-pink',
        'Yearly': '--cal-green',
        '7-Day': '--cal-red'
    };

    // Add a button to create a new note
    const newNoteBtn = document.createElement('button');
    newNoteBtn.className = 'btn btn-primary';
    newNoteBtn.style.marginBottom = '20px';
    newNoteBtn.innerHTML = '<i class="fas fa-plus"></i> New Note';
    newNoteBtn.onclick = () => openNote('Daily');
    mainContent.insertBefore(newNoteBtn, notesContainer);

    // Add a search bar
    const searchBar = document.createElement('div');
    searchBar.style.marginBottom = '20px';
    searchBar.innerHTML = `
        <input type="text" id="noteSearch" placeholder="Search notes..." 
               style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px;">
    `;
    mainContent.insertBefore(searchBar, notesContainer);

    // Add filter buttons
    const filterContainer = document.createElement('div');
    filterContainer.style.display = 'flex';
    filterContainer.style.gap = '10px';
    filterContainer.style.marginBottom = '20px';
    filterContainer.style.flexWrap = 'wrap';

    // Add "All" filter
    const allFilter = document.createElement('button');
    allFilter.className = 'btn active';
    allFilter.textContent = 'All';
    allFilter.onclick = () => filterNotes('all');
    filterContainer.appendChild(allFilter);

    // Add filters for each note type
    noteTypes.forEach(type => {
        const filterBtn = document.createElement('button');
        filterBtn.className = 'btn';
        filterBtn.innerHTML = `<i class="fas fa-filter" style="color: var(${colors[type]});"></i> ${type}`;
        filterBtn.onclick = () => filterNotes(type);
        filterContainer.appendChild(filterBtn);
    });

    mainContent.insertBefore(filterContainer, notesContainer);

    // Function to filter notes
    window.filterNotes = (type) => {
        // Update active filter button
        document.querySelectorAll('#all-notes-container ~ div button').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');

        const searchTerm = document.getElementById('noteSearch').value.toLowerCase();
        renderNotes(type, searchTerm);
    };

    // Function to render notes based on filter
    window.renderNotes = (filterType = 'all', searchTerm = '') => {
        notesContainer.innerHTML = '';

        // Get date notes from localStorage
        const dateNotes = JSON.parse(localStorage.getItem('teamSpaceDateNotes')) || {};

        // Create a combined array of all notes
        const allNotes = [];

        // Add regular notes
        Object.entries(notes).forEach(([noteType, content]) => {
            if (content && content.trim() !== '') {
                allNotes.push({
                    type: noteType,
                    content: content,
                    isDateNote: false,
                    date: null
                });
            }
        });

        // Add date notes
        Object.entries(dateNotes).forEach(([date, noteObj]) => {


            Object.entries(noteObj).forEach(([noteType, content]) => {
                if (content && content.trim() !== '') {
                    allNotes.push({
                        type: noteType,
                        content: content,
                        isDateNote: true,
                        date: date
                    });
                }
            });
        });

        // Filter notes
        const filteredNotes = allNotes.filter(note => {
            const matchesType = filterType === 'all' || note.type === filterType;
            const matchesSearch = note.content.toLowerCase().includes(searchTerm) ||
                note.type.toLowerCase().includes(searchTerm) ||
                (note.isDateNote && note.date.includes(searchTerm));
            return matchesType && matchesSearch;
        });

        // Sort notes by type and date
        filteredNotes.sort((a, b) => {
            if (a.type !== b.type) {
                return noteTypes.indexOf(a.type) - noteTypes.indexOf(b.type);
            }
            if (a.isDateNote && b.isDateNote) {
                return new Date(b.date) - new Date(a.date);
            }
            return 0;
        });

        // Group notes by type
        const notesByType = {};
        filteredNotes.forEach(note => {
            if (!notesByType[note.type]) {
                notesByType[note.type] = [];
            }
            notesByType[note.type].push(note);
        });

        // Render notes
        Object.entries(notesByType).forEach(([type, notesList]) => {
            const section = document.createElement('div');
            section.className = 'notes-section';
            section.style.marginBottom = '30px';

            const header = document.createElement('h3');
            header.style.color = `var(${colors[type] || '--text-main'})`;
            header.style.borderBottom = `2px solid var(${colors[type] || '--border-color'})`;
            header.style.paddingBottom = '5px';
            header.style.marginBottom = '15px';
            header.textContent = `${type} Notes`;

            section.appendChild(header);

            notesList.forEach(note => {
                const noteCard = document.createElement('div');
                noteCard.className = 'note-card';
                noteCard.style.background = 'white';
                noteCard.style.borderRadius = '8px';
                noteCard.style.padding = '15px';
                noteCard.style.marginBottom = '15px';
                noteCard.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
                noteCard.style.borderLeft = `4px solid var(${colors[note.type] || '--border-color'})`;

                const noteHeader = document.createElement('div');
                noteHeader.style.display = 'flex';
                noteHeader.style.justifyContent = 'space-between';
                noteHeader.style.marginBottom = '10px';
                noteHeader.style.fontSize = '0.85rem';
                noteHeader.style.color = 'var(--text-muted)';

                const noteDate = document.createElement('span');
                noteDate.textContent = note.isDateNote ? new Date(note.date).toLocaleDateString() : 'General Note';

                const noteActions = document.createElement('div');
                noteActions.style.display = 'flex';
                noteActions.style.gap = '10px';

                const editBtn = document.createElement('button');
                editBtn.className = 'btn';
                editBtn.style.padding = '2px 8px';
                editBtn.style.fontSize = '0.7rem';
                editBtn.innerHTML = '<i class="fas fa-edit"></i> Edit';
                editBtn.onclick = () => {
                    if (note.isDateNote) {
                        openNote(note.type, note.date);
                    } else {
                        openNote(note.type);
                    }
                };

                noteActions.appendChild(editBtn);
                noteHeader.appendChild(noteDate);
                noteHeader.appendChild(noteActions);

                const noteContent = document.createElement('div');
                noteContent.className = 'note-content';
                noteContent.style.maxHeight = '150px';
                noteContent.style.overflow = 'hidden';
                noteContent.style.position = 'relative';
                noteContent.innerHTML = note.content;

                // Add a gradient fade effect for long notes
                const fade = document.createElement('div');
                fade.style.position = 'absolute';
                fade.style.bottom = 0;
                fade.style.left = 0;
                fade.style.right = 0;
                fade.style.height = '30px';
                fade.style.background = 'linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,1))';

                noteContent.appendChild(fade);

                noteCard.appendChild(noteHeader);
                noteCard.appendChild(noteContent);

                // Add click to expand functionality
                noteCard.style.cursor = 'pointer';
                noteCard.onclick = (e) => {
                    if (e.target === editBtn || e.target.closest('button')) return;

                    if (noteContent.style.maxHeight === '150px') {
                        noteContent.style.maxHeight = 'none';
                        fade.style.display = 'none';
                    } else {
                        noteContent.style.maxHeight = '150px';
                        fade.style.display = 'block';
                    }
                };

                section.appendChild(noteCard);
            });

            notesContainer.appendChild(section);
        });

        if (notesContainer.children.length === 0) {
            notesContainer.innerHTML = '<p style="text-align: center; color: var(--text-muted);">No notes found. Click "New Note" to create one.</p>';
        }
    };

    // Add search functionality
    document.getElementById('noteSearch').addEventListener('input', (e) => {
        const activeFilter = document.querySelector('#all-notes-container ~ div button.active');
        const filterType = activeFilter ?
            (activeFilter.textContent === 'All' ? 'all' : activeFilter.textContent.trim().split(' ')[1] || 'all') :
            'all';
        renderNotes(filterType, e.target.value.toLowerCase());
    });

    // Initial render
    renderNotes();
}

// Update the renderNoteSidebar function to add a "View All" button
function renderNoteSidebar() {
    const types = ['Daily', 'Weekly', 'Monthly', 'Yearly', '7-Day'];
    const colors = { 'Daily': '--cal-orange', 'Weekly': '--cal-purple', 'Monthly': '--cal-pink', 'Yearly': '--cal-green', '7-Day': '--cal-red' };
    const icons = { 'Daily': 'far fa-calendar-check', 'Weekly': 'far fa-calendar-alt', 'Monthly': 'far fa-calendar-minus', 'Yearly': 'far fa-calendar', '7-Day': 'far fa-calendar-times' };

    const sortedTypes = [...types].sort((a, b) => {
        const aPinned = pinnedNotes.includes(a) ? 1 : 0;
        const bPinned = pinnedNotes.includes(b) ? 1 : 0;
        return bPinned - aPinned;
    });

    const container = document.querySelector('.sidebar-section');
    container.innerHTML = '<h3>Calendar Notes</h3>';

    // Add "View All" button at the top
    const viewAllBtn = document.createElement('div');
    viewAllBtn.className = 'note-item';
    viewAllBtn.style.marginBottom = '10px';
    viewAllBtn.style.fontWeight = 'bold';
    viewAllBtn.innerHTML = '<i class="fas fa-book" style="color: var(--accent-blue);"></i> View All Notes';
    viewAllBtn.onclick = showAllNotes;
    container.appendChild(viewAllBtn);

    // Add a divider
    const divider = document.createElement('div');
    divider.style.height = '1px';
    divider.style.background = 'var(--border-color)';
    divider.style.margin = '10px 0';
    container.appendChild(divider);

    // Add the rest of the note types
    sortedTypes.forEach(type => {
        const isPinned = pinnedNotes.includes(type);
        const item = document.createElement('div');
        item.className = `note-item ${currentNoteType === type ? 'active' : ''}`;
        item.onclick = () => openNote(type);
        item.innerHTML = `
            <i class="${icons[type]}" style="color: var(${colors[type]});"></i> 
            ${type}
            ${isPinned ? '<i class="fas fa-thumbtack" style="margin-left:auto; font-size:0.7rem; color:var(--accent-blue)"></i>' : ''}
        `;
        container.appendChild(item);
    });
}

// Update the openNote function to handle date-specific notes
function openNote(type, date = null) {
    currentNoteType = type;
    const noteDate = date || new Date().toISOString().split('T')[0];

    // Update Sidebar UI active state
    renderNoteSidebar();

    const isPinned = pinnedNotes.includes(type);
    document.getElementById('noteType').innerHTML = `
        ${type} Notes ${date ? `- ${date}` : ''}
        <i class="fas fa-thumbtack" id="pinBtn" style="cursor:pointer; margin-left:10px; color: ${isPinned ? 'var(--accent-blue)' : '#cbd5e1'}" 
           onclick="togglePin('${type}')"></i>
    `;

    // Load the note content
    const noteContent = date ? getDateNote(type, noteDate) : (notes[type] || "");
    document.getElementById('noteEditor').innerHTML = noteContent || `Start typing your ${type} notes...`;
    document.getElementById('noteModal').style.display = 'flex';
}

// Add this to your initialization code
document.addEventListener('DOMContentLoaded', () => {
    // Add click handler for the main title/logo to go back to the main view
    const logo = document.querySelector('.logo-group');
    if (logo) {
        logo.style.cursor = 'pointer';
        logo.onclick = () => {
            window.location.reload();
        };
    }

    // Rest of your initialization code...
});

// --- JIRA-STYLE TASK LOGIC ---

// 1. Capture the "New Update" button click
document.addEventListener('click', function (e) {
    const btn = e.target.closest('button');
    if (btn && btn.textContent.includes('New Update')) {
        // Open the existing member modal or a simple prompt to get the title
        const title = prompt("Enter Task Title (Main Heading):");
        const sub = prompt("Enter Sub-title (Details):");

        if (title) {
            const newTask = {
                id: Date.now(),
                title: title,
                subtitle: sub || '',
                assignee: "Unassigned",
                status: 'todo',
                color: '#0ea5e9' // Default Jira Blue
            };
            tasks.push(newTask);
            renderTasks();
        }
    }
});

// 2. Add Editing Functionality (Like Jira)
function editTask(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const newTitle = prompt("Edit Title:", task.title);
    const newSub = prompt("Edit Sub-title:", task.subtitle || "");

    if (newTitle !== null) {
        task.title = newTitle;
        task.subtitle = newSub;
        renderTasks();
    }
}

// 3. Update the Render function to show Title + Subtitle + Colors
// We override your existing renderTasks to make it "Amazing"
const originalRender = renderTasks;
renderTasks = function () {
    const containers = {
        todo: document.getElementById('todo-list'),
        inprogress: document.getElementById('progress-list'),
        done: document.getElementById('done-list')
    };

    Object.values(containers).forEach(c => { if (c) c.innerHTML = ''; });

    tasks.forEach(task => {
        const card = document.createElement('div');
        card.className = 'card jira-card';
        card.style.borderLeft = `5px solid ${task.color || '#0ea5e9'}`;
        card.innerHTML = `
            <div onclick="editTask(${task.id})" style="cursor:pointer">
                <h4 style="margin:0; color:#1e293b; font-size:1.1rem;">${task.title}</h4>
                <p style="margin:5px 0; font-size:0.85rem; color:#64748b;">${task.subtitle || ''}</p>
            </div>
            <div class="assigned" style="font-size:0.7rem; margin-top:10px;">
                <i class="fas fa-user"></i> ${task.assignee}
            </div>
            <div class="card-tools">
                <i class="fas fa-edit" onclick="editTask(${task.id})" title="Edit"></i>
                <i class="fas fa-arrow-right" onclick="moveTask(${task.id})" title="Move Next"></i>
                <i class="far fa-trash-alt" onclick="deleteTask(${task.id})" title="Delete"></i>
            </div>`;
        if (containers[task.status]) containers[task.status].appendChild(card);
    });

    // Update counts
    if (document.getElementById('todo-count')) document.getElementById('todo-count').innerText = tasks.filter(t => t.status === 'todo').length;
    if (document.getElementById('progress-count')) document.getElementById('progress-count').innerText = tasks.filter(t => t.status === 'inprogress').length;

    localStorage.setItem('teamSpaceSprint', JSON.stringify(tasks));
};

// Initial run
renderTasks();

function closeNote() {
    document.getElementById('noteModal').style.display = 'none';
    currentNoteType = ''; // Reset current note type
}

document.addEventListener('DOMContentLoaded', () => {
    // ... your existing code ...

    // ADD THIS: Fix for the Close button inside the Note Modal
    const noteModal = document.getElementById('noteModal');
    if (noteModal) {
        const closeBtn = noteModal.querySelector('button[onclick="closeNote()"]') ||
            Array.from(noteModal.querySelectorAll('button')).find(b => b.textContent.trim() === 'Close');

        if (closeBtn) {
            closeBtn.onclick = closeNote;
        }
    }
});
// In the calendar generation code, update the date creation to make dates clickable
function renderCalendar() {
    const calendarGrid = document.querySelector('.calendar-grid');
    if (!calendarGrid) return;

    // Clear existing dates
    calendarGrid.innerHTML = '';

    // Add day headers
    const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    days.forEach(day => {
        const dayElement = document.createElement('div');
        dayElement.textContent = day;
        dayElement.style.textAlign = 'center';
        dayElement.style.fontWeight = 'bold';
        calendarGrid.appendChild(dayElement);
    });

    // Get current date
    const now = new Date();
    const currentDay = now.getDate();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Get first day of month and total days
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Add empty cells for days before first day of month
    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement('div');
        calendarGrid.appendChild(emptyCell);
    }

    // Add date cells
    for (let day = 1; day <= daysInMonth; day++) {
        const dateElement = document.createElement('div');
        dateElement.className = 'cal-date';
        dateElement.textContent = day;

        // Highlight current date
        if (day === currentDay) {
            dateElement.classList.add('active');
        }

        // Make date clickable
        dateElement.style.cursor = 'pointer';
        dateElement.onclick = function () {
            // Remove active class from all dates
            document.querySelectorAll('.cal-date').forEach(el => {
                el.classList.remove('active');
            });
            // Add active class to clicked date
            this.classList.add('active');

            // Update the current day in your application state if needed
            // For example: currentSelectedDate = new Date(currentYear, currentMonth, day);
        };

        calendarGrid.appendChild(dateElement);
    }
}

// Call this function when the page loads
document.addEventListener('DOMContentLoaded', renderCalendar);
// Add this function to update the trash count
function updateTrashCount() {
    const trashCount = document.getElementById('trash-count');
    if (trashCount) {
        trashCount.textContent = trash.length;
    }
}

// Update the deleteTask function to call updateTrashCount
function deleteTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        trash.push(task);
        tasks = tasks.filter(t => t.id !== id);
        renderTasks();
        updateTrashCount(); // Update the trash count
        localStorage.setItem('teamSpaceSprint', JSON.stringify(tasks));
        localStorage.setItem('teamSpaceTrash', JSON.stringify(trash));
    }
}

// Update the emptyTrash function to reset the trash count
function emptyTrash() {
    if (confirm('Are you sure you want to empty the trash? This cannot be undone.')) {
        trash = [];
        localStorage.setItem('teamSpaceTrash', JSON.stringify(trash));
        renderTasks();
        updateTrashCount(); // Update the trash count
    }
}

// Call updateTrashCount when the page loads
document.addEventListener('DOMContentLoaded', function () {
    updateTrashCount();
    // ... rest of your existing DOMContentLoaded code
});


// --- NEW MEMBER ACTIONS ---
function deleteMember(name) {
    if (confirm(`Are you sure you want to remove ${name}?`)) {
        members = members.filter(m => m.name !== name);
        localStorage.setItem('teamSpaceMembers', JSON.stringify(members));
        renderMembers();
    }
}

function editMember(name) {
    const m = members.find(member => member.name === name);
    if (!m) return;

    const newName = prompt("Edit Name:", m.name);
    const newRole = prompt("Edit Role:", m.role);
    const newTel = prompt("Edit Telegram (@):", m.telegram || "");

    if (newName && newRole) {
        m.name = newName;
        m.role = newRole;
        m.telegram = newTel;
        localStorage.setItem('teamSpaceMembers', JSON.stringify(members));
        renderMembers();
    }
}

// Update your existing renderMembers display slightly to include these buttons
// Note: This adds to your existing renderMembers logic via a small tweak to the innerHTML
const originalRenderMembers = renderMembers;
renderMembers = function () {
    originalRenderMembers(); // Run your original code first

    // Select all member items to add action buttons for Edit/Delete
    document.querySelectorAll('.member-item').forEach((item, index) => {
        const name = members[index].name;
        const actionDiv = document.createElement('div');
        actionDiv.style.cssText = "display:flex; gap:10px; margin-left:auto; padding-right:10px;";
        actionDiv.innerHTML = `
            <i class="fas fa-edit" onclick="event.stopPropagation(); editMember('${name}')" style="cursor:pointer; color:var(--text-muted)"></i>
            <i class="fas fa-user-minus" onclick="event.stopPropagation(); deleteMember('${name}')" style="cursor:pointer; color:#f43f5e"></i>
        `;
        item.appendChild(actionDiv);
    });
};

// --- DELETE NOTES ---
function deleteNoteContent(type) {
    if (confirm(`Clear all content for ${type} notes?`)) {
        notes[type] = "";
        localStorage.setItem('teamSpaceNotes', JSON.stringify(notes));
        alert(`${type} notes cleared.`);
        if (currentNoteType === type) {
            document.getElementById('noteEditor').innerHTML = "Start typing...";
        }
    }
}

// --- REMINDER SYSTEM ---

function requestNotificationPermission() {
    if (Notification.permission !== 'granted') {
        Notification.requestPermission();
    }
}

function setNoteReminder(type) {
    const time = prompt("Enter reminder time (HH:MM) in 24h format (e.g., 14:30):");
    if (!time) return;

    const [hours, minutes] = time.split(':');
    const now = new Date();
    const reminderDate = new Date();
    reminderDate.setHours(hours, minutes, 0);

    // If time already passed today, set for tomorrow
    if (reminderDate <= now) reminderDate.setDate(now.getDate() + 1);

    const timeout = reminderDate.getTime() - now.getTime();

    alert(`Reminder set for ${type} notes at ${time}`);

    setTimeout(() => {
        if (Notification.permission === 'granted') {
            new Notification(`Team Space: ${type} Reminder`, {
                body: `Time to check your ${type} notes!`,
                icon: 'https://cdn-icons-png.flaticon.com/512/3119/3119338.png'
            });
        } else {
            alert(`REMINDER: Check your ${type} notes!`);
        }
    }, timeout);
}

// --- EXPORT SYSTEM ---

function exportNote(type, format) {
    const content = notes[type] || document.getElementById('noteEditor').innerHTML;
    const plainText = content.replace(/<[^>]*>/g, ''); // Remove HTML tags

    if (format === 'txt') {
        const blob = new Blob([plainText], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${type}_Notes.txt`;
        link.click();
    }
    else if (format === 'pdf') {
        // Creates a temporary window to print just the note content
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head><title>${type} Notes Export</title></head>
                <body style="font-family: sans-serif; padding: 40px;">
                    <h1 style="color: #0ea5e9;">${type} Notes</h1>
                    <hr>
                    <div style="line-height: 1.6;">${content}</div>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    }
}
// Add this inside your openNote(type) function, where you set innerHTML for noteType
function openNote(type, date = null) {
    currentNoteType = type;
    requestNotificationPermission(); // Ask for permission when opening

    document.getElementById('noteType').innerHTML = `
        <div style="display:flex; align-items:center; justify-content:space-between; width:100%;">
            <span>${type} Notes</span>
            <div style="display:flex; gap:10px;">
                <i class="fas fa-bell" onclick="setNoteReminder('${type}')" title="Set Reminder" style="cursor:pointer; color:#f59e0b"></i>
                <i class="fas fa-file-alt" onclick="exportNote('${type}', 'txt')" title="Export as Text" style="cursor:pointer; color:#64748b"></i>
                <i class="fas fa-file-pdf" onclick="exportNote('${type}', 'pdf')" title="Export as PDF" style="cursor:pointer; color:#f43f5e"></i>
                <i class="fas fa-thumbtack" id="pinBtn" onclick="togglePin('${type}')" style="cursor:pointer; color: ${pinnedNotes.includes(type) ? 'var(--accent-blue)' : '#cbd5e1'}"></i>
            </div>
        </div>
    `;

    const noteContent = date ? getDateNote(type, date) : (notes[type] || "");
    document.getElementById('noteEditor').innerHTML = noteContent || `Start typing...`;
    document.getElementById('noteModal').style.display = 'flex';
}
// --- UPDATED REMINDER WITH SOUND ---

// --- UPDATED REMINDER WITH SOUND ---
function setNoteReminder(type) {
    const time = prompt("Enter reminder time (HH:MM) 24h format:");
    if (!time) return;

    const [hours, minutes] = time.split(':');
    const now = new Date();
    const reminderDate = new Date();
    reminderDate.setHours(hours, minutes, 0);

    if (reminderDate <= now) reminderDate.setDate(now.getDate() + 1);
    const timeout = reminderDate.getTime() - now.getTime();

    alert(`⏰ Reminder set with sound for ${time}`);

    setTimeout(() => {
        // Play a cute "Ding" sound
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        audio.play();

        if (Notification.permission === 'granted') {
            new Notification(`Team Space: ${type} Reminder`, {
                body: "Time to check your notes! 🎀",
                icon: 'https://cdn-icons-png.flaticon.com/512/3119/3119338.png'
            });
        }
    }, timeout);
}

// --- CUTE STICKER PICKER ---
function insertSticker(emoji) {
    document.execCommand('insertText', false, emoji);
    document.getElementById('stickerMenu').style.display = 'none';
}

function toggleStickerMenu() {
    const menu = document.getElementById('stickerMenu');
    menu.style.display = menu.style.display === 'grid' ? 'none' : 'grid';
}

function exportNote(type, format) {
    const content = notes[type] || document.getElementById('noteEditor').innerHTML;

    if (format === 'pdf') {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <style>
                        body { font-family: 'Segoe UI', sans-serif; padding: 40px; color: #333; }
                        .pdf-header { border-bottom: 2px solid #0ea5e9; padding-bottom: 10px; margin-bottom: 20px; }
                        .pdf-title { color: #0ea5e9; margin: 0; font-size: 28px; }
                        .pdf-date { color: #64748b; font-size: 14px; }
                        .pdf-body { line-height: 1.6; font-size: 16px; margin-top: 20px; }
                    </style>
                </head>
                <body>
                    <div class="pdf-header">
                        <h1 class="pdf-title">${type} Notes</h1>
                        <p class="pdf-date">Exported on: ${new Date().toLocaleDateString()}</p>
                    </div>
                    <div class="pdf-body">${content}</div>
                </body>
            </html>
        `);
        printWindow.document.close();
        // Give time for images/stickers to load before printing
        setTimeout(() => { printWindow.print(); }, 500);
    } else {
        // Existing TXT logic
        const plainText = content.replace(/<[^>]*>/g, '');
        const blob = new Blob([plainText], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${type}_Notes.txt`;
        link.click();
    }
}
function openNote(type, date = null) {
    currentNoteType = type;
    requestNotificationPermission();

    document.getElementById('noteType').innerHTML = `
        <div style="display:flex; align-items:center; justify-content:space-between; width:100%; position:relative;">
            <span>${type} Notes</span>
            <div style="display:flex; gap:12px; align-items:center;">
                <i class="fas fa-smile" onclick="toggleStickerMenu()" title="Add Sticker" style="cursor:pointer; color:#ff69b4"></i>
                
                <i class="fas fa-bell" onclick="setNoteReminder('${type}')" title="Set Reminder" style="cursor:pointer; color:#f59e0b"></i>
                
                <i class="fas fa-file-pdf" onclick="exportNote('${type}', 'pdf')" title="Export PDF" style="cursor:pointer; color:#f43f5e; font-size:1.2rem;"></i>
                <i class="fas fa-file-alt" onclick="exportNote('${type}', 'txt')" title="Export Text" style="cursor:pointer; color:#64748b"></i>
                
                <i class="fas fa-thumbtack" id="pinBtn" onclick="togglePin('${type}')" style="cursor:pointer; color: ${pinnedNotes.includes(type) ? 'var(--accent-blue)' : '#cbd5e1'}"></i>
            </div>
       
<div id="stickerMenu" style="display:none; position:absolute; top:40px; right:0; background:white; border:1px solid #eee; padding:12px; grid-template-columns:repeat(5, 1fr); gap:10px; border-radius:12px; z-index:1000; box-shadow:0 10px 25px rgba(0,0,0,0.1); width:240px; max-height:300px; overflow-y:auto;">
    <span onclick="insertSticker('📚')" title="Books" style="cursor:pointer; font-size:1.4rem;">📚</span>
    <span onclick="insertSticker('📝')" title="Note" style="cursor:pointer; font-size:1.4rem;">📝</span>
    <span onclick="insertSticker('🎓')" title="Graduation" style="cursor:pointer; font-size:1.4rem;">🎓</span>
    <span onclick="insertSticker('🧪')" title="Science" style="cursor:pointer; font-size:1.4rem;">🧪</span>
    <span onclick="insertSticker('🎨')" title="Art" style="cursor:pointer; font-size:1.4rem;">🎨</span>
    <span onclick="insertSticker('📐')" title="Math" style="cursor:pointer; font-size:1.4rem;">📐</span>
    <span onclick="insertSticker('🖋️')" title="Pen" style="cursor:pointer; font-size:1.4rem;">🖋️</span>
    <span onclick="insertSticker('🧠')" title="Brain" style="cursor:pointer; font-size:1.4rem;">🧠</span>
    <span onclick="insertSticker('📅')" title="Schedule" style="cursor:pointer; font-size:1.4rem;">📅</span>
    <span onclick="insertSticker('💯')" title="Score" style="cursor:pointer; font-size:1.4rem;">💯</span>
    
    <span onclick="insertSticker('✨')" style="cursor:pointer; font-size:1.4rem;">✨</span>
    <span onclick="insertSticker('🎀')" style="cursor:pointer; font-size:1.4rem;">🎀</span>
    <span onclick="insertSticker('🧸')" style="cursor:pointer; font-size:1.4rem;">🧸</span>
    <span onclick="insertSticker('💡')" style="cursor:pointer; font-size:1.4rem;">💡</span>
    <span onclick="insertSticker('✅')" style="cursor:pointer; font-size:1.4rem;">✅</span>
</div>        
        </div>
    `;
    const noteContent = date ? getDateNote(type, date) : (notes[type] || "");
    document.getElementById('noteEditor').innerHTML = noteContent || `Start typing...`;
    document.getElementById('noteModal').style.display = 'flex';
}
function insertSticker(emoji) {
    const editor = document.getElementById('noteEditor');
    // 1. Force focus back to the editor
    editor.focus();
    // 2. Insert the emoji at the cursor position
    // 'insertHTML' is better than 'insertText' if you want them to scale well
    document.execCommand('insertHTML', false, `<span style="font-size: 1.5rem; vertical-align: middle;">${emoji}</span>`);
    // 3. Hide the menu
    document.getElementById('stickerMenu').style.display = 'none';
}



// Ensure the name matches what your other functions call
function renderNoteSidebar() {
    const container = document.querySelector('.sidebar-section');
    if (!container) return;

    const types = ['Daily', 'Weekly', 'Monthly', 'Yearly', '7-Day'];
    const colors = { Daily: '--cal-orange', Weekly: '--cal-purple', Monthly: '--cal-pink', Quarterly: '--cal-yellow', Yearly: '--cal-green', '7-Day': '--cal-red' };
    const icons = { Daily: 'far fa-calendar-check', Weekly: 'far fa-calendar-alt', Monthly: 'far fa-calendar-minus', Quarterly: 'fas fa-calendar-day', Yearly: 'far fa-calendar', '7-Day': 'far fa-calendar-times' };

    // Sort: pinned items first
    const sortedTypes = [...types].sort((a, b) => pinnedNotes.includes(b) - pinnedNotes.includes(a));

    const itemsHtml = sortedTypes.map(type => `
        <div class="note-item ${currentNoteType === type ? 'active' : ''}" 
             style="cursor: pointer; display: flex; align-items: center; padding: 8px;" 
             onclick="openNote('${type}')">
            <i class="${icons[type]}" style="color: var(${colors[type]})"></i>
            <span style="margin-left: 10px">${type}</span>
            ${pinnedNotes.includes(type) ? '<i class="fas fa-thumbtack" style="margin-left: auto; font-size: 0.7rem; color: var(--accent-blue)"></i>' : ''}
        </div>
    `).join('');

    container.innerHTML = `
        <h3>Calendar Notes</h3>
        <div class="note-item" style="margin-bottom: 10px; font-weight: bold; cursor: pointer; display: flex; align-items: center; gap: 10px; padding: 8px;" onclick="showAllNotes()">
            <i class="fas fa-book"
   style="color: var(--accent-blue); font-size: 1.6rem;"></i>
<span>View All Notes</span>

        </div>
        <div style="height: 1px; background: var(--border-color); margin: 10px 0; width: 100%;"></div>
        ${itemsHtml}
    `;
}

// COMBINED openNote: Handles Sidebar, Toolbar Icons, Reminders, and Exporting
function openNote(type, date = null) {
    currentNoteType = type;

    // 1. Update the sidebar list to reflect the active note and pin status
    renderNoteSidebar();

    // 2. Ask for notification permission (for reminders)
    requestNotificationPermission();

    // 3. Update the Editor Header with ALL functionality (Stickers, Reminders, Export PDF/Text, Pin)
    const isPinned = pinnedNotes.includes(type);
    document.getElementById('noteType').innerHTML = `
        <div style="display:flex; align-items:center; justify-content:space-between; width:100%; position:relative;">
            <span>${type} Notes ${date ? `- ${date}` : ''}</span>
            <div style="display:flex; gap:12px; align-items:center;">
                <i class="fas fa-smile" onclick="toggleStickerMenu()" title="Add Sticker" style="cursor:pointer; color:#ff69b4"></i>
                
                <i class="fas fa-bell" onclick="setNoteReminder('${type}')" title="Set Reminder" style="cursor:pointer; color:#f59e0b"></i>
                
                <i class="fas fa-file-pdf" onclick="exportNote('${type}', 'pdf')" title="Export PDF" style="cursor:pointer; color:#f43f5e; font-size:1.2rem;"></i>
                
                <i class="fas fa-file-alt" onclick="exportNote('${type}', 'txt')" title="Export Text" style="cursor:pointer; color:#64748b"></i>
                
                <i class="fas fa-thumbtack" id="pinBtn" onclick="togglePin('${type}')" style="cursor:pointer; color: ${isPinned ? 'var(--accent-blue)' : '#cbd5e1'}"></i>
            </div>
            
            <div id="stickerMenu" style="display:none; position:absolute; top:40px; right:0; background:white; border:1px solid #eee; padding:12px; grid-template-columns:repeat(5, 1fr); gap:10px; border-radius:12px; z-index:1000; box-shadow:0 10px 25px rgba(0,0,0,0.1); width:240px; max-height:300px; overflow-y:auto;">
                <span onclick="insertSticker('📚')" style="cursor:pointer; font-size:1.4rem;">📚</span>
                <span onclick="insertSticker('📝')" style="cursor:pointer; font-size:1.4rem;">📝</span>
                <span onclick="insertSticker('🎓')" style="cursor:pointer; font-size:1.4rem;">🎓</span>
                <span onclick="insertSticker('🧪')" style="cursor:pointer; font-size:1.4rem;">🧪</span>
                <span onclick="insertSticker('🎨')" style="cursor:pointer; font-size:1.4rem;">🎨</span>
                <span onclick="insertSticker('✨')" style="cursor:pointer; font-size:1.4rem;">✨</span>
                <span onclick="insertSticker('🎀')" style="cursor:pointer; font-size:1.4rem;">🎀</span>
                <span onclick="insertSticker('💡')" style="cursor:pointer; font-size:1.4rem;">💡</span>
                <span onclick="insertSticker('✅')" style="cursor:pointer; font-size:1.4rem;">✅</span>
                <span onclick="insertSticker('🎯')" title="Target" style="cursor:pointer; font-size:1.4rem;">🎯</span>
                <span onclick="insertSticker('🚀')" title="Rocket" style="cursor:pointer; font-size:1.4rem;">🚀</span>
                <span onclick="insertSticker('⭐️')" title="Star" style="cursor:pointer; font-size:1.4rem;">⭐️</span>
                <span onclick="insertSticker('🔥')" title="Fire" style="cursor:pointer; font-size:1.4rem;">🔥</span>
                <span onclick="insertSticker('🌈')" title="Rainbow" style="cursor:pointer; font-size:1.4rem;">🌈</span>
                <span onclick="insertSticker('🍀')" title="Clover" style="cursor:pointer; font-size:1.4rem;">🍀</span>
                <span onclick="insertSticker('🦋')" title="Butterfly" style="cursor:pointer; font-size:1.4rem;">🦋</span>
                <span onclick="insertSticker('🧸')" title="Teddy" style="cursor:pointer; font-size:1.4rem;">🧸</span>
                <span onclick="insertSticker('☕️')" title="Coffee" style="cursor:pointer; font-size:1.4rem;">☕️</span>
                <span onclick="insertSticker('🍕')" title="Pizza" style="cursor:pointer; font-size:1.4rem;">🍕</span>
                <span onclick="insertSticker('💻')" title="Laptop" style="cursor:pointer; font-size:1.4rem;">💻</span>
                <span onclick="insertSticker('📱')" title="Phone" style="cursor:pointer; font-size:1.4rem;">📱</span>
                <span onclick="insertSticker('⏰')" title="Alarm" style="cursor:pointer; font-size:1.4rem;">⏰</span>
                <span onclick="insertSticker('📌')" title="Pin" style="cursor:pointer; font-size:1.4rem;">📌</span>
                <span onclick="insertSticker('🔍')" title="Search" style="cursor:pointer; font-size:1.4rem;">🔍</span>
                <span onclick="insertSticker('❤️')" title="Heart" style="cursor:pointer; font-size:1.4rem;">❤️</span>
                <span onclick="insertSticker('🎉')" title="Party" style="cursor:pointer; font-size:1.4rem;">🎉</span>
                <span onclick="insertSticker('💰')" title="Money" style="cursor:pointer; font-size:1.4rem;">💰</span>
                <span onclick="insertSticker('⛱️')" title="Beach" style="cursor:pointer; font-size:1.4rem;">⛱️</span>
                <span onclick="insertSticker('🌍')" title="Earth" style="cursor:pointer; font-size:1.4rem;">🌍</span>
                <span onclick="insertSticker('🐱')" title="Cute Kitty" style="cursor:pointer; font-size:1.4rem;">🐱</span>
                <span onclick="insertSticker('🐰')" title="Bunny" style="cursor:pointer; font-size:1.4rem;">🐰</span>
                <span onclick="insertSticker('🐼')" title="Panda" style="cursor:pointer; font-size:1.4rem;">🐼</span>
                <span onclick="insertSticker('🌸')" title="Cherry Blossom" style="cursor:pointer; font-size:1.4rem;">🌸</span>
                <span onclick="insertSticker('🍓')" title="Strawberry" style="cursor:pointer; font-size:1.4rem;">🍓</span>
                <span onclick="insertSticker('☁️')" title="Soft Cloud" style="cursor:pointer; font-size:1.4rem;">☁️</span>
                <span onclick="insertSticker('🌙')" title="Moon" style="cursor:pointer; font-size:1.4rem;">🌙</span>
                <span onclick="insertSticker('🍭')" title="Candy" style="cursor:pointer; font-size:1.4rem;">🍭</span>
                <span onclick="insertSticker('🥛')" title="Milk" style="cursor:pointer; font-size:1.4rem;">🥛</span>
                <span onclick="insertSticker('🎒')" title="Backpack" style="cursor:pointer; font-size:1.4rem;">🎒</span>
                <span onclick="insertSticker('🖋️')" title="Pen" style="cursor:pointer; font-size:1.4rem;">🖋️</span>
                <span onclick="insertSticker('📐')" title="Ruler" style="cursor:pointer; font-size:1.4rem;">📐</span>
                <span onclick="insertSticker('🖍️')" title="Crayon" style="cursor:pointer; font-size:1.4rem;">🖍️</span>
                <span onclick="insertSticker('📓')" title="Journal" style="cursor:pointer; font-size:1.4rem;">📓</span>
                <span onclick="insertSticker('📎')" title="Paperclip" style="cursor:pointer; font-size:1.4rem;">📎</span>
                <span onclick="insertSticker('💭')" title="Thought" style="cursor:pointer; font-size:1.4rem;">💭</span>
                <span onclick="insertSticker('💯')" title="Perfect Score" style="cursor:pointer; font-size:1.4rem;">💯</span>
                <span onclick="insertSticker('🔋')" title="Full Energy" style="cursor:pointer; font-size:1.4rem;">🔋</span>
                <span onclick="insertSticker('🪴')" title="Potted Plant" style="cursor:pointer; font-size:1.4rem;">🪴</span>
                <span onclick="insertSticker('🧁')" title="Cupcake Reward" style="cursor:pointer; font-size:1.4rem;">🧁</span>
                <span onclick="insertSticker('🐶')" title="Puppy" style="cursor:pointer; font-size:1.4rem;">🐶</span>
                <span onclick="insertSticker('🐥')" title="Baby Chick" style="cursor:pointer; font-size:1.4rem;">🐥</span>
                <span onclick="insertSticker('🎨')" title="Palette" style="cursor:pointer; font-size:1.4rem;">🎨</span>
                <span onclick="insertSticker('💎')" title="Diamond Focus" style="cursor:pointer; font-size:1.4rem;">💎</span>
                <span onclick="insertSticker('💤')" title="Nap Time" style="cursor:pointer; font-size:1.4rem;">💤</span>
            </div>
        </div>
    `;

    // 4. Update the Editor Content
    const noteContent = date ? getDateNote(type, date) : (notes[type] || "");
    document.getElementById('noteEditor').innerHTML = noteContent || `Start typing your ${type} notes...`;

    // 5. Show the modal
    document.getElementById('noteModal').style.display = 'flex';
}





























