 lucide.createIcons();

// Color customization variables
let currentColors = {
    primary: '#30bb09',
    accent: '#30bb09',
    secondary: '#30bb09',
    bg1: '#000112',
    bg2: '#080336',
    bg3: '#02022a'
};

// Preset color themes
const colorThemes = [
    { 
        name: "Green", 
        primary: '#30bb09', 
        accent: '#30bb09', 
        secondary: '#30bb09',
        bg1: '#000112',
        bg2: '#080336',
        bg3: '#02022a'
    },
    { 
        name: "Blue", 
        primary: '#3b82f6', 
        accent: '#3b82f6', 
        secondary: '#8b5cf6',
        bg1: '#000814',
        bg2: '#001845',
        bg3: '#000c30'
    },
    { 
        name: "Purple", 
        primary: '#8b5cf6', 
        accent: '#8b5cf6', 
        secondary: '#ec4899',
        bg1: '#0f0729',
        bg2: '#180844',
        bg3: '#0e0523'
    },
    { 
        name: "Red", 
        primary: '#ef4444', 
        accent: '#ef4444', 
        secondary: '#f97316',
        bg1: '#1a0000',
        bg2: '#2a0000',
        bg3: '#1f0000'
    },
    { 
        name: "Orange", 
        primary: '#f97316', 
        accent: '#f97316', 
        secondary: '#eab308',
        bg1: '#1a0f00',
        bg2: '#2a1a00',
        bg3: '#1f1500'
    },
    { 
        name: "Teal", 
        primary: '#14b8a6', 
        accent: '#14b8a6', 
        secondary: '#0ea5e9',
        bg1: '#001414',
        bg2: '#002525',
        bg3: '#001c1c'
    }
];

// Quick color options
const quickColors = [
    { name: "Emerald", color: '#10b981' },
    { name: "Sky", color: '#0ea5e9' },
    { name: "Violet", color: '#8b5cf6' },
    { name: "Rose", color: '#f43f5e' },
    { name: "Amber", color: '#f59e0b' },
    { name: "Indigo", color: '#6366f1' }
];

// Helper function to darken a color
function darkenColor(color, percent) {
    let num = parseInt(color.replace("#", ""), 16),
        amt = Math.round(2.55 * percent),
        R = (num >> 16) - amt,
        G = (num >> 8 & 0x00FF) - amt,
        B = (num & 0x0000FF) - amt;
    
    R = R < 0 ? 0 : R;
    G = G < 0 ? 0 : G;
    B = B < 0 ? 0 : B;
    
    return "#" + (0x1000000 + (R << 16) + (G << 8) + B).toString(16).slice(1);
}

// Initialize color customizer
function initColorCustomizer() {
    // Load saved colors from localStorage
    const savedColors = localStorage.getItem('notetakerColors');
    if (savedColors) {
        currentColors = JSON.parse(savedColors);
        updateCSSVariables(currentColors);
    }
    
    // Generate quick color options
    const colorOptionsContainer = document.getElementById('colorOptions');
    quickColors.forEach((colorObj, index) => {
        const colorOption = document.createElement('div');
        colorOption.className = 'color-option';
        colorOption.style.background = colorObj.color;
        colorOption.title = colorObj.name;
        colorOption.dataset.color = colorObj.color;
        colorOption.onclick = () => selectQuickColor(colorObj.color);
        
        if (colorObj.color === currentColors.primary) {
            colorOption.classList.add('active');
        }
        
        colorOptionsContainer.appendChild(colorOption);
    });
    
    // Generate preset color themes
    const presetContainer = document.getElementById('presetColors');
    colorThemes.forEach(theme => {
        const presetItem = document.createElement('div');
        presetItem.className = 'preset-item';
        presetItem.innerHTML = `
            <div style="display: flex; align-items: center; gap: 4px; flex-wrap: wrap;">
                <div style="width: 16px; height: 16px; border-radius: 4px; background: ${theme.primary};" title="Primary"></div>
                <div style="width: 16px; height: 16px; border-radius: 4px; background: ${theme.secondary};" title="Secondary"></div>
                <div style="width: 16px; height: 16px; border-radius: 4px; background: ${theme.bg1};" title="Background 1"></div>
                <div style="width: 16px; height: 16px; border-radius: 4px; background: ${theme.bg2};" title="Background 2"></div>
                <span style="margin-left: 4px;">${theme.name}</span>
            </div>
        `;
        presetItem.onclick = () => applyPresetTheme(theme);
        presetContainer.appendChild(presetItem);
    });
    
    // Initialize color picker values
    document.getElementById('primaryColorPicker').value = currentColors.primary;
    document.getElementById('primaryColorText').value = currentColors.primary;
    document.getElementById('accentColorPicker').value = currentColors.accent;
    document.getElementById('accentColorText').value = currentColors.accent;
    document.getElementById('secondaryColorPicker').value = currentColors.secondary;
    document.getElementById('secondaryColorText').value = currentColors.secondary;
    document.getElementById('bgColor1Picker').value = currentColors.bg1;
    document.getElementById('bgColor1Text').value = currentColors.bg1;
    document.getElementById('bgColor2Picker').value = currentColors.bg2;
    document.getElementById('bgColor2Text').value = currentColors.bg2;
    document.getElementById('bgColor3Picker').value = currentColors.bg3;
    document.getElementById('bgColor3Text').value = currentColors.bg3;
    
    // Add event listeners for color pickers
    document.getElementById('primaryColorPicker').addEventListener('input', (e) => {
        const color = e.target.value;
        document.getElementById('primaryColorText').value = color;
        currentColors.primary = color;
        updateColorPreview();
    });
    
    document.getElementById('accentColorPicker').addEventListener('input', (e) => {
        const color = e.target.value;
        document.getElementById('accentColorText').value = color;
        currentColors.accent = color;
        updateColorPreview();
    });
    
    document.getElementById('secondaryColorPicker').addEventListener('input', (e) => {
        const color = e.target.value;
        document.getElementById('secondaryColorText').value = color;
        currentColors.secondary = color;
        updateColorPreview();
    });
    
    document.getElementById('bgColor1Picker').addEventListener('input', (e) => {
        const color = e.target.value;
        document.getElementById('bgColor1Text').value = color;
        currentColors.bg1 = color;
        updateColorPreview();
    });
    
    document.getElementById('bgColor2Picker').addEventListener('input', (e) => {
        const color = e.target.value;
        document.getElementById('bgColor2Text').value = color;
        currentColors.bg2 = color;
        updateColorPreview();
    });
    
    document.getElementById('bgColor3Picker').addEventListener('input', (e) => {
        const color = e.target.value;
        document.getElementById('bgColor3Text').value = color;
        currentColors.bg3 = color;
        updateColorPreview();
    });
    
    // Add event listeners for text inputs
    document.getElementById('primaryColorText').addEventListener('input', (e) => {
        const color = e.target.value;
        if (/^#[0-9A-F]{6}$/i.test(color)) {
            document.getElementById('primaryColorPicker').value = color;
            currentColors.primary = color;
            updateColorPreview();
        }
    });
    
    document.getElementById('accentColorText').addEventListener('input', (e) => {
        const color = e.target.value;
        if (/^#[0-9A-F]{6}$/i.test(color)) {
            document.getElementById('accentColorPicker').value = color;
            currentColors.accent = color;
            updateColorPreview();
        }
    });
    
    document.getElementById('secondaryColorText').addEventListener('input', (e) => {
        const color = e.target.value;
        if (/^#[0-9A-F]{6}$/i.test(color)) {
            document.getElementById('secondaryColorPicker').value = color;
            currentColors.secondary = color;
            updateColorPreview();
        }
    });
    
    document.getElementById('bgColor1Text').addEventListener('input', (e) => {
        const color = e.target.value;
        if (/^#[0-9A-F]{6}$/i.test(color)) {
            document.getElementById('bgColor1Picker').value = color;
            currentColors.bg1 = color;
            updateColorPreview();
        }
    });
    
    document.getElementById('bgColor2Text').addEventListener('input', (e) => {
        const color = e.target.value;
        if (/^#[0-9A-F]{6}$/i.test(color)) {
            document.getElementById('bgColor2Picker').value = color;
            currentColors.bg2 = color;
            updateColorPreview();
        }
    });
    
    document.getElementById('bgColor3Text').addEventListener('input', (e) => {
        const color = e.target.value;
        if (/^#[0-9A-F]{6}$/i.test(color)) {
            document.getElementById('bgColor3Picker').value = color;
            currentColors.bg3 = color;
            updateColorPreview();
        }
    });
}

// Select quick color
function selectQuickColor(color) {
    currentColors.primary = color;
    currentColors.accent = color;
    
    // Generate darker shades for background
    currentColors.bg1 = darkenColor(color, 80);
    currentColors.bg2 = darkenColor(color, 70);
    currentColors.bg3 = darkenColor(color, 85);
    
    document.getElementById('primaryColorPicker').value = color;
    document.getElementById('primaryColorText').value = color;
    document.getElementById('accentColorPicker').value = color;
    document.getElementById('accentColorText').value = color;
    document.getElementById('bgColor1Picker').value = currentColors.bg1;
    document.getElementById('bgColor1Text').value = currentColors.bg1;
    document.getElementById('bgColor2Picker').value = currentColors.bg2;
    document.getElementById('bgColor2Text').value = currentColors.bg2;
    document.getElementById('bgColor3Picker').value = currentColors.bg3;
    document.getElementById('bgColor3Text').value = currentColors.bg3;
    
    // Update active state in quick colors
    document.querySelectorAll('.color-option').forEach(option => {
        option.classList.remove('active');
        if (option.dataset.color === color) {
            option.classList.add('active');
        }
    });
    
    updateColorPreview();
}

// Apply preset theme
function applyPresetTheme(theme) {
    currentColors = { ...theme };
    
    // Update all pickers
    document.getElementById('primaryColorPicker').value = theme.primary;
    document.getElementById('primaryColorText').value = theme.primary;
    document.getElementById('accentColorPicker').value = theme.accent;
    document.getElementById('accentColorText').value = theme.accent;
    document.getElementById('secondaryColorPicker').value = theme.secondary;
    document.getElementById('secondaryColorText').value = theme.secondary;
    document.getElementById('bgColor1Picker').value = theme.bg1;
    document.getElementById('bgColor1Text').value = theme.bg1;
    document.getElementById('bgColor2Picker').value = theme.bg2;
    document.getElementById('bgColor2Text').value = theme.bg2;
    document.getElementById('bgColor3Picker').value = theme.bg3;
    document.getElementById('bgColor3Text').value = theme.bg3;
    
    // Update active state in quick colors
    document.querySelectorAll('.color-option').forEach(option => {
        option.classList.remove('active');
        if (option.dataset.color === theme.primary) {
            option.classList.add('active');
        }
    });
    
    updateColorPreview();
    applyCustomColors();
}

// Apply custom colors
function applyCustomColors() {
    updateCSSVariables(currentColors);
    localStorage.setItem('notetakerColors', JSON.stringify(currentColors));
    showNotification('Theme colors updated successfully!');
    toggleCustomizer();
}

// Reset to default colors
function resetColors() {
    currentColors = {
        primary: '#30bb09',
        accent: '#30bb09',
        secondary: '#4f46e5',
        bg1: '#000112',
        bg2: '#080336',
        bg3: '#02022a'
    };
    
    // Update all pickers
    document.getElementById('primaryColorPicker').value = currentColors.primary;
    document.getElementById('primaryColorText').value = currentColors.primary;
    document.getElementById('accentColorPicker').value = currentColors.accent;
    document.getElementById('accentColorText').value = currentColors.accent;
    document.getElementById('secondaryColorPicker').value = currentColors.secondary;
    document.getElementById('secondaryColorText').value = currentColors.secondary;
    document.getElementById('bgColor1Picker').value = currentColors.bg1;
    document.getElementById('bgColor1Text').value = currentColors.bg1;
    document.getElementById('bgColor2Picker').value = currentColors.bg2;
    document.getElementById('bgColor2Text').value = currentColors.bg2;
    document.getElementById('bgColor3Picker').value = currentColors.bg3;
    document.getElementById('bgColor3Text').value = currentColors.bg3;
    
    // Update active state in quick colors
    document.querySelectorAll('.color-option').forEach(option => {
        option.classList.remove('active');
        if (option.dataset.color === currentColors.primary) {
            option.classList.add('active');
        }
    });
    
    updateCSSVariables(currentColors);
    localStorage.removeItem('notetakerColors');
    showNotification('Colors reset to default');
}

// Update CSS variables
function updateCSSVariables(colors) {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', colors.primary);
    root.style.setProperty('--accent-color', colors.accent);
    root.style.setProperty('--secondary-color', colors.secondary);
    root.style.setProperty('--bg-color-1', colors.bg1);
    root.style.setProperty('--bg-color-2', colors.bg2);
    root.style.setProperty('--bg-color-3', colors.bg3);
}

// Update color preview
function updateColorPreview() {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', currentColors.primary);
    root.style.setProperty('--accent-color', currentColors.accent);
    root.style.setProperty('--secondary-color', currentColors.secondary);
    root.style.setProperty('--bg-color-1', currentColors.bg1);
    root.style.setProperty('--bg-color-2', currentColors.bg2);
    root.style.setProperty('--bg-color-3', currentColors.bg3);
}

// Toggle customizer visibility
function toggleCustomizer() {
    const customizer = document.getElementById('colorCustomizer');
    customizer.classList.toggle('active');
    const toggleBtn = document.getElementById('customizerToggle');
    
    if (customizer.classList.contains('active')) {
        toggleBtn.innerHTML = '<i data-lucide="x"></i>';
        toggleBtn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
    } else {
        toggleBtn.innerHTML = '<i data-lucide="palette"></i>';
        toggleBtn.style.background = 'linear-gradient(135deg, var(--accent-color), #27a307)';
        // Reset preview to actual colors
        updateCSSVariables(currentColors);
    }
    
    // Re-initialize icons
    lucide.createIcons();
}

// Back to top button functionality
const backToTopButton = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopButton.classList.add('visible');
    } else {
        backToTopButton.classList.remove('visible');
    }
});

backToTopButton.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Navigation Functions
function setView(view) {
    showNotification(`Switching to ${view} view`);
    return false;
}

function openSettings() {
    showNotification("Opening settings...");
    toggleCustomizer();
    return false;
}

function openProfile() {
    showNotification("Opening profile editor...");
    return false;
}

function logout() {
    if (confirm("Are you sure you want to logout?")) {
        showNotification("Logged out successfully!");
    }
    return false;
}

// Footer Functions
function subscribeNewsletter() {
    const email = document.getElementById('newsletterEmail').value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (email && emailRegex.test(email)) {
        showNotification(`Thank you for subscribing with: ${email}`);
        document.getElementById('newsletterEmail').value = '';
    } else {
        showNotification("Please enter a valid email address");
    }
}

function openSocial(platform) {
    showNotification(`Opening ${platform} page...`);
    return false;
}

function openTerms() {
    showNotification("Opening Terms of Service...");
    return false;
}

function openPrivacy() {
    showNotification("Opening Privacy Policy...");
    return false;
}

function openSupport() {
    showNotification("Opening Support Center...");
    return false;
}

function openContact() {
    showNotification("Opening Contact Form...");
    return false;
}

function openCookies() {
    showNotification("Opening Cookie Policy...");
    return false;
}

// Create floating notes dynamically
function createFloatingNotes() {
    const footer = document.querySelector('.footer');
    const notesCount = 12;
    
    for (let i = 0; i < notesCount; i++) {
        const note = document.createElement('div');
        note.className = 'floating-note';
        note.style.left = `${Math.random() * 95}%`;
        note.style.animationDelay = `-${Math.random() * 25}s`;
        note.style.width = `${40 + Math.random() * 40}px`;
        note.style.height = `${40 + Math.random() * 40}px`;
        note.style.opacity = `${0.15 + Math.random() * 0.2}`;
        note.style.animationDuration = `${15 + Math.random() * 20}s`;
        footer.appendChild(note);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    createFloatingNotes();
    initColorCustomizer();
    
    // Add keyboard navigation support
    document.querySelectorAll('.footer a, .footer button').forEach(element => {
        element.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.target.click();
            }
        });
    });
    
    // Close customizer when clicking outside
    document.addEventListener('click', (e) => {
        const customizer = document.getElementById('colorCustomizer');
        const toggleBtn = document.getElementById('customizerToggle');
        
        if (customizer.classList.contains('active') &&
            !customizer.contains(e.target) &&
            !toggleBtn.contains(e.target)) {
            toggleCustomizer();
        }
    });
});

// Notification system
function showNotification(message) {
    // Remove existing notifications
    document.querySelectorAll('.notification').forEach(n => n.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.setAttribute('role', 'alert');
    document.body.appendChild(notification);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 400);
    }, 4000);
}

// Handle window resize for better responsiveness
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Recreate floating notes on resize
        document.querySelectorAll('.floating-note').forEach(n => n.remove());
        createFloatingNotes();
    }, 250);
});