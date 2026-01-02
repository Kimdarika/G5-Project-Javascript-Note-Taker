const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function initCanvas() { 
    canvas.width = window.innerWidth; 
    canvas.height = window.innerHeight; 
}

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 0.4 - 0.2;
        this.speedY = Math.random() * 0.4 - 0.2;
    }
    
    update() {
        this.x += this.speedX; 
        this.y += this.speedY;
        if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
        if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
    }
    
    draw() {
        ctx.fillStyle = '#32e026'; 
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); 
        ctx.fill();
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { 
        p.update(); 
        p.draw(); 
    });
    requestAnimationFrame(animate);
}

initCanvas(); 
for (let i = 0; i < 70; i++) particles.push(new Particle());
animate();

let isLoginMode = true;

function toggleAuthMode() {
    isLoginMode = !isLoginMode;
    const registerFields = document.querySelectorAll('.register-only');
    registerFields.forEach(field => {
        field.style.display = isLoginMode ? "none" : "block";
        const input = field.querySelector('input');
        if(input) input.required = !isLoginMode;
    });
    document.getElementById('form-title').innerText = isLoginMode ? "Login" : "Register";
    document.getElementById('form-subtitle').innerText = isLoginMode ? "Welcome back! Enter your details." : "Join us to start taking better notes.";
    document.getElementById('loginBtn').innerText = isLoginMode ? "Sign In" : "Create Account";
    document.getElementById('switch-text').innerHTML = isLoginMode ? 'New here? <a onclick="toggleAuthMode()">Create account</a>' : 'Already have an account? <a onclick="toggleAuthMode()">Sign In</a>';
}

function togglePassword(inputId, iconId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);
    input.type = input.type === 'password' ? 'text' : 'password';
    icon.classList.toggle('fa-eye-slash');
}

function showMessage(text, type) {
    const msgBox = document.getElementById('msgBox');
    msgBox.textContent = text;
    msgBox.className = type;
    msgBox.style.display = "block";
    if (type === "error") setTimeout(() => { msgBox.style.display = "none"; }, 3000);
}

document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = document.getElementById('loginBtn');
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Processing...';
    
    setTimeout(() => {
        if (isLoginMode) {
            // Login mode
            const userData = JSON.parse(localStorage.getItem(`user_${email}`));
            if (userData && userData.password === password) {
                const currentUser = {
                    email: email,
                    name: userData.name,
                    loggedIn: true,
                    createdAt: userData.createdAt
                };
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                
                showMessage("Login Successful!", "success");
                btn.innerHTML = '<i class="fas fa-check"></i> Redirecting...';
                setTimeout(() => window.location.href = "/page/index.html", 1000);
            } else {
                showMessage("Email or Password incorrect!", "error");
                btn.disabled = false;
                btn.innerText = "Sign In";
            }
        } else {
            // Register mode
            const confirmPass = document.getElementById('confirmPassword').value.trim();
            const fullName = document.getElementById('fullname').value.trim();
            if (!fullName) {
                showMessage("Please enter your name.", "error");
                resetBtn();
                return;
            }
            if (password !== confirmPass) {
                showMessage("Passwords do not match!", "error");
                resetBtn();
                return;
            }
            if (password.length < 6) {
                showMessage("Password must be at least 6 characters", "error");
                resetBtn();
                return;
            }
            if (localStorage.getItem(`user_${email}`)) {
                showMessage("Email already registered!", "error");
                resetBtn();
            } else {
                // Store user data with proper structure
                const userData = {
                    name: fullName,
                    email: email,
                    password: password,
                    createdAt: new Date().toISOString(),
                    notes: [],
                    tasks: [],
                    events: []
                };
                
                localStorage.setItem(`user_${email}`, JSON.stringify(userData));
                
                const currentUser = {
                    email: email,
                    name: fullName,
                    loggedIn: true,
                    createdAt: userData.createdAt
                };
                
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                showMessage("Account Created! Logging you in...", "success");
                btn.innerHTML = '<i class="fas fa-check"></i> Redirecting...';
                
                setTimeout(() => {
                    window.location.href = "/page/index.html";
                }, 1500);
            }
        }
    }, 1000);
    
    function resetBtn() {
        btn.disabled = false;
        btn.innerText = isLoginMode ? "Sign In" : "Create Account";
    }
});

function socialLogin(platform) {
    console.log("Logging in with " + platform);
    showMessage(platform + " login is not connected yet.", "error");
}

document.getElementById("year").textContent = new Date().getFullYear();

document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('index.html')) return;
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        try {
            const user = JSON.parse(currentUser);
            if (user.loggedIn) {
                window.location.href = "/page/index.html";
            }
        } catch (e) {
            console.log("No valid session found");
        }
    }
});

window.addEventListener('resize', function() {
    initCanvas();
    particles = [];
    for (let i = 0; i < 70; i++) particles.push(new Particle());
});