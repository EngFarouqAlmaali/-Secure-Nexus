// ---------- MAIN LOGIC (UI Interactions, Animations) ----------

// Password visibility toggle (eye)
document.querySelectorAll('.password-eye').forEach(eye => {
    eye.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('data-target');
        const input = document.getElementById(targetId);
        if (input.type === 'password') {
            input.type = 'text';
            this.classList.remove('ri-eye-off-line');
            this.classList.add('ri-eye-line');
        } else {
            input.type = 'password';
            this.classList.remove('ri-eye-line');
            this.classList.add('ri-eye-off-line');
        }
    });
});

// Toggle between Login & Signup forms with smooth animation (reuse GSAP)
const loginContainer = document.getElementById('loginForm');
const signupContainer = document.getElementById('signupForm');
const toggleBtns = document.querySelectorAll('.toggle-btn');
const goToSignupSpan = document.getElementById('goToSignup');
const dynamicSwitchMsgSpan = document.getElementById('dynamicSwitchMsg');

function switchToLogin() {
    if (loginContainer.style.display !== 'none') return;
    gsap.to(loginContainer, {
        autoAlpha: 0, duration: 0.2, onComplete: () => {
            signupContainer.style.display = 'none';
            loginContainer.style.display = 'block';
            gsap.fromTo(loginContainer, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: "back.out(0.5)" });
            document.getElementById('switchMsg').innerHTML = `<span>Don't have an account? <span class="switch-link" id="goToSignup">Sign Up</span></span>`;
            document.getElementById('goToSignup').addEventListener('click', switchToSignup);
        }
    });
    toggleBtns.forEach(btn => btn.classList.remove('active'));
    document.querySelector('.toggle-btn[data-form="login"]').classList.add('active');
}

function switchToSignup() {
    if (signupContainer.style.display !== 'none') return;
    gsap.to(loginContainer, {
        autoAlpha: 0, duration: 0.2, onComplete: () => {
            loginContainer.style.display = 'none';
            signupContainer.style.display = 'block';
            gsap.fromTo(signupContainer, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: "back.out(0.5)" });
            document.getElementById('switchMsg').innerHTML = `<span>Already have an account? <span class="switch-link" id="goToLogin">Log In</span></span>`;
            document.getElementById('goToLogin').addEventListener('click', switchToLogin);
        }
    });
    toggleBtns.forEach(btn => btn.classList.remove('active'));
    document.querySelector('.toggle-btn[data-form="signup"]').classList.add('active');
}

toggleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const formType = btn.getAttribute('data-form');
        if (formType === 'login') switchToLogin();
        else switchToSignup();
    });
});

// Typing animation for the cyber code panel
window.addEventListener('DOMContentLoaded', () => {
    const codeLines = Array.from(document.querySelectorAll('.code-line'));
    const lines = codeLines.map(line => line.dataset.code || '');
    const codeTextSpans = codeLines.map(line => line.querySelector('.code-text'));
    let lineIndex = 0;
    let charIndex = 0;
    let mode = 'typing';

    function updateLineText(index, value) {
        codeTextSpans[index].textContent = value;
    }

    function clearAllLines() {
        codeTextSpans.forEach(span => span.textContent = '');
    }

    function step() {
        const currentLine = codeLines[lineIndex];
        const text = lines[lineIndex];
        if (mode === 'typing') {
            if (charIndex <= text.length) {
                updateLineText(lineIndex, text.slice(0, charIndex));
                charIndex++;
                setTimeout(step, text.length === 0 ? 120 : 60);
                return;
            }
            lineIndex++;
            charIndex = 0;
            if (lineIndex >= lines.length) {
                mode = 'deleting';
                lineIndex = lines.length - 1;
                charIndex = lines[lineIndex].length;
                setTimeout(step, 1200);
                return;
            }
            setTimeout(step, 180);
            return;
        }

        if (mode === 'deleting') {
            if (charIndex >= 0) {
                updateLineText(lineIndex, text.slice(0, charIndex));
                charIndex--;
                setTimeout(step, 40);
                return;
            }
            lineIndex--;
            if (lineIndex < 0) {
                clearAllLines();
                mode = 'typing';
                lineIndex = 0;
                charIndex = 0;
                setTimeout(step, 800);
                return;
            }
            charIndex = lines[lineIndex].length;
            setTimeout(step, 60);
        }
    }

    clearAllLines();
    setTimeout(step, 400);
});
