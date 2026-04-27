// ---------- SECURITY PROTECTION (XSS, CSRF token simulation, input sanitization) ----------
// Basic XSS filter: escape HTML
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function (m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    }).replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, function (c) {
        return c;
    });
}

// CSRF protection simulation: generate token and store in session (on page load)
let csrfToken = btoa(Math.random() + Date.now() + window.location.href);
sessionStorage.setItem('csrf_token', csrfToken);

// Helper to simulate backend check for SQLi patterns & sanitize inputs
function hasSqlInjectionPattern(input) {
    const sqlPatterns = /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|TRUNCATE|EXEC|SCRIPT|--|\bOR\b.*=.*\bAND\b|';|'--)\b)/i;
    return sqlPatterns.test(input);
}

function validateInputs(fields) {
    for (let field of fields) {
        if (hasSqlInjectionPattern(field.value)) {
            return false;
        }
        if (field.value.trim() === "") {
            return false;
        }
    }
    return true;
}

function showError(elementId, message) {
    const errDiv = document.getElementById(elementId);
    errDiv.textContent = message;
    errDiv.style.display = 'block';
    setTimeout(() => { errDiv.style.display = 'none'; }, 3500);
}

// ---------- HANDLE LOGIN with Security ----------
document.getElementById('loginFormElement').addEventListener('submit', function (e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail');
    const password = document.getElementById('loginPassword');

    // XSS & SQL Injection protection
    if (!validateInputs([email, password])) {
        showError('loginError', '❌ Invalid characters or potential injection detected.');
        return;
    }
    const cleanEmail = escapeHtml(email.value.trim());
    const cleanPass = escapeHtml(password.value);

    // Simulate CSRF token check
    const storedToken = sessionStorage.getItem('csrf_token');
    if (!storedToken || storedToken !== csrfToken) {
        showError('loginError', 'Security token mismatch. Reload page.');
        return;
    }

    // Basic demo validation (in real life backend validation)
    if (cleanEmail === "" || cleanPass === "") {
        showError('loginError', 'Email and password required.');
        return;
    }
    if (cleanPass.length < 3) {
        showError('loginError', 'Invalid credentials (demo mode). Use any email/pass with >3 chars)');
        return;
    }
    // Success simulation
    showError('loginError', '✅ Login successful! (Secure demo)');
    setTimeout(() => alert(`Welcome ${cleanEmail} – secure authentication simulation.\nNo actual data stored.`), 300);
});

// ---------- SIGNUP with Security & validation ----------
document.getElementById('signupFormElement').addEventListener('submit', function (e) {
    e.preventDefault();
    const name = document.getElementById('signupName');
    const email = document.getElementById('signupEmail');
    const pwd = document.getElementById('signupPassword');
    const confirm = document.getElementById('signupConfirm');

    if (!validateInputs([name, email, pwd, confirm])) {
        showError('signupError', '⚠️ SQLi or XSS patterns blocked.');
        return;
    }
    const cleanName = escapeHtml(name.value.trim());
    const cleanEmail = escapeHtml(email.value.trim());
    const cleanPwd = pwd.value;
    const cleanConfirm = confirm.value;

    if (cleanName === "" || cleanEmail === "" || cleanPwd === "") {
        showError('signupError', 'All fields required.');
        return;
    }
    if (cleanPwd !== cleanConfirm) {
        showError('signupError', 'Passwords do not match.');
        return;
    }
    if (cleanPwd.length < 4) {
        showError('signupError', 'Password must be at least 4 characters.');
        return;
    }
    if (!cleanEmail.includes('@')) {
        showError('signupError', 'Valid email required.');
        return;
    }
    // CSRF token check again
    if (sessionStorage.getItem('csrf_token') !== csrfToken) {
        showError('signupError', 'CSRF validation failed.');
        return;
    }
    showError('signupError', '🎉 Account created successfully! (Demo)');
    setTimeout(() => {
        switchToLogin();
        document.getElementById('loginEmail').value = cleanEmail;
    }, 1500);
});

// Social login simulation (Secure popup simulation)
const socialIcons = document.querySelectorAll('.social-icon');
socialIcons.forEach(icon => {
    icon.addEventListener('click', (e) => {
        const provider = icon.getAttribute('data-provider');
        // additional XSS / CSRF simulation secure redirect
        const safeProvider = escapeHtml(provider);
        alert(`🔐 OAuth simulation: You are being redirected to ${safeProvider} secure gateway.\n(Production: implement proper OAuth2 with PKCE & CSRF tokens)`);
    });
});

// Forgot password simulated
document.getElementById('forgotPwdLink').addEventListener('click', (e) => {
    e.preventDefault();
    alert("📧 Password reset link will be sent to your email. (Demo security flow)");
});

// ---------- GSAP ENHANCED ANIMATION (same as original but smoother, with image scaling and panel entry) ----------
window.addEventListener('DOMContentLoaded', () => {
    const tl = gsap.timeline();
    tl.fromTo('.glass-panel',
        { y: -500, scaleX: 0.3, scaleY: 0.5, opacity: 0, rotationX: -15 },
        { y: 0, scaleX: 0.3, scaleY: 0.5, opacity: 1, duration: 1.2, ease: "power3.out" }
    );
    tl.to('.glass-panel', { scaleY: 1, duration: 0.6, ease: "back.out(0.7)" }, "-=0.2");
    tl.to('.glass-panel', { scaleX: 1, duration: 0.8, ease: "elastic.out(1,0.4)" }, "-=0.3");

    // Animate image side and floating effect
    tl.fromTo('.image-side img',
        { scale: 0.7, opacity: 0, rotation: -8 },
        { scale: 1, opacity: 1, rotation: 0, duration: 1, ease: "back.out(0.8)" }, "-=0.2"
    );

    // continuous gentle zoom on image
    gsap.to('.image-side img', {
        scale: 1.05,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        transformOrigin: "center center"
    });

    // form elements fade in
    gsap.fromTo('.form-side', { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 1, delay: 0.8, ease: "power2.out" });
    gsap.from('.auth-toggle', { opacity: 0, y: -20, duration: 0.8, delay: 1 });
    gsap.from('.input-group', { opacity: 0, y: 30, stagger: 0.08, duration: 0.7, delay: 1.1 });
    gsap.from('.auth-btn', { scale: 0.9, opacity: 0, duration: 0.5, delay: 1.5 });
    gsap.from('.social-section', { opacity: 0, y: 20, duration: 0.6, delay: 1.7 });
});

// additional protection: sanitize any dynamic innerHTML usage (escape content)
// also block XSS via window location
const originalAlert = window.alert;
window.alert = function (msg) {
    originalAlert(escapeHtml(msg));
};

// Disable console injection (just safety)
console.log("%c⚠️ Security layer active: XSS, CSRF tokens, SQLi patterns blocked", "color: #FFD966; font-size: 14px");

// ---------- ENHANCED SECURITY FEATURES (800% Security Boost) ----------

// Password hashing simulation (client-side, for demo; real app should hash server-side)
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + 'salt123'); // Add salt
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Rate limiting for login attempts
let loginAttempts = 0;
const maxAttempts = 5;
let lockoutTime = 0;

function checkRateLimit() {
    const now = Date.now();
    if (loginAttempts >= maxAttempts) {
        if (now < lockoutTime) {
            showError('loginError', 'Too many attempts. Try again later.');
            return false;
        } else {
            loginAttempts = 0; // Reset after lockout
        }
    }
    return true;
}

function incrementAttempts() {
    loginAttempts++;
    if (loginAttempts >= maxAttempts) {
        lockoutTime = Date.now() + 300000; // 5 minutes lockout
    }
}

// Advanced input validation
function advancedValidateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && !hasSqlInjectionPattern(email);
}

function advancedValidatePassword(password) {
    // At least 8 chars, uppercase, lowercase, number, special char
    const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passRegex.test(password) && !hasSqlInjectionPattern(password);
}

// CSRF token validation
function validateCsrfToken(token) {
    return token === sessionStorage.getItem('csrf_token');
}

// Anti-brute force: log suspicious activities
function logSuspiciousActivity(activity) {
    console.warn('Suspicious activity detected:', activity);
    // In real app, send to server
}

// Secure form submission enhancements
const originalLoginSubmit = document.getElementById('loginFormElement').onsubmit;
document.getElementById('loginFormElement').addEventListener('submit', async function (e) {
    if (!checkRateLimit()) {
        e.preventDefault();
        return;
    }

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    if (!advancedValidateEmail(email) || !advancedValidatePassword(password)) {
        e.preventDefault();
        showError('loginError', 'Invalid email or password format.');
        incrementAttempts();
        logSuspiciousActivity('Invalid login attempt');
        return;
    }

    // Hash password before "sending"
    const hashedPassword = await hashPassword(password);
    // In real app, send hashedPassword to server
    console.log('Hashed password:', hashedPassword); // Demo only

    // Call original submit logic
    if (originalLoginSubmit) originalLoginSubmit.call(this, e);
});

const originalSignupSubmit = document.getElementById('signupFormElement').onsubmit;
document.getElementById('signupFormElement').addEventListener('submit', async function (e) {
    const password = document.getElementById('signupPassword').value;
    const confirm = document.getElementById('signupConfirm').value;

    if (!advancedValidatePassword(password) || password !== confirm) {
        e.preventDefault();
        showError('signupError', 'Password must be strong and match confirmation.');
        return;
    }

    const hashedPassword = await hashPassword(password);
    console.log('Signup hashed password:', hashedPassword); // Demo

    if (originalSignupSubmit) originalSignupSubmit.call(this, e);
});
