// DOM Elements
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const nextBtn = document.getElementById('nextBtn');
const createBtn = document.getElementById('createBtn');
const emailSection = document.getElementById('emailSection');
const passwordSection = document.getElementById('passwordSection');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');
const passwordToggle = document.getElementById('passwordToggle');
const welcomeText = document.querySelector('.welcome-text p');
const staySignedIn = document.getElementById('staySignedIn');

let currentStep = 'email'; // 'email' or 'password'

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    loadSavedEmail();
});

function setupEventListeners() {
    nextBtn.addEventListener('click', handleNext);
    createBtn.addEventListener('click', handleCreateAccount);
    emailInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && currentStep === 'email') {
            handleNext();
        }
    });
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && currentStep === 'password') {
            handleSignIn();
        }
    });
    passwordToggle.addEventListener('click', togglePasswordVisibility);
    emailInput.addEventListener('input', clearEmailError);
    passwordInput.addEventListener('input', clearPasswordError);
}

function handleNext() {
    if (currentStep === 'email') {
        validateAndProceedEmail();
    }
}

function validateAndProceedEmail() {
    const email = emailInput.value.trim();
    
    // Clear previous error
    clearEmailError();
    
    // Validation
    if (!email) {
        showEmailError('Enter an email or phone number');
        return;
    }
    
    if (!isValidEmail(email) && !isValidPhone(email)) {
        showEmailError('Enter a valid email or phone number');
        return;
    }
    
    // Save email to localStorage
    localStorage.setItem('savedEmail', email);
    
    // Proceed to password
    proceedToPassword(email);
}

function proceedToPassword(email) {
    currentStep = 'password';
    
    // Hide email section, show password section
    emailSection.classList.add('hidden');
    passwordSection.classList.remove('hidden');
    
    // Update UI
    welcomeText.textContent = email;
    nextBtn.textContent = 'Sign in';
    createBtn.textContent = 'Back';
    nextBtn.removeEventListener('click', handleNext);
    nextBtn.addEventListener('click', handleSignIn);
    createBtn.removeEventListener('click', handleCreateAccount);
    createBtn.addEventListener('click', goBackToEmail);
    
    // Focus password input
    setTimeout(() => passwordInput.focus(), 100);
}

function handleSignIn() {
    const password = passwordInput.value;
    
    clearPasswordError();
    
    if (!password) {
        showPasswordError('Enter your password');
        return;
    }
    
    if (password.length < 6) {
        showPasswordError('Password must be at least 6 characters');
        return;
    }
    
    // Simulate API call
    simulateSignIn(password);
}

function simulateSignIn(password) {
    // Add loading state
    nextBtn.classList.add('loading');
    nextBtn.disabled = true;
    
    // Simulate network delay (2-3 seconds)
    setTimeout(() => {
        nextBtn.classList.remove('loading');
        
        // Simulate success/error (90% success rate for demo)
        if (Math.random() > 0.1 || password === 'password123') {
            // Success
            showSuccessMessage();
        } else {
            // Failure
            showPasswordError('Wrong password. Try again or click "Forgot password?"');
            nextBtn.disabled = false;
        }
    }, 2000 + Math.random() * 1000);
}

function showSuccessMessage() {
    // Replace login box with success message
    const loginBox = document.querySelector('.login-box');
    loginBox.innerHTML = `
        <div style="text-align: center; padding: 40px;">
            <svg style="width: 64px; height: 64px; margin-bottom: 20px; fill: #188038;" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <h2 style="color: #202124; margin-bottom: 8px;">Sign in successful!</h2>
            <p style="color: #5f6368; margin-bottom: 24px;">Welcome to Gmail</p>
            <p style="color: #80868b; font-size: 12px;">Redirecting to your inbox...</p>
        </div>
    `;
    
    // Simulate redirect
    setTimeout(() => {
        alert('Login successful! (This is a demo)\n\nEmail: ' + localStorage.getItem('savedEmail'));
    }, 2000);
}

function goBackToEmail() {
    currentStep = 'email';
    
    // Reset UI
    passwordSection.classList.add('hidden');
    emailSection.classList.remove('hidden');
    passwordInput.value = '';
    clearPasswordError();
    
    // Restore button text and listeners
    nextBtn.textContent = 'Next';
    createBtn.textContent = 'Create account';
    welcomeText.textContent = 'Continue to Gmail';
    
    nextBtn.removeEventListener('click', handleSignIn);
    nextBtn.addEventListener('click', handleNext);
    createBtn.removeEventListener('click', goBackToEmail);
    createBtn.addEventListener('click', handleCreateAccount);
    
    nextBtn.disabled = false;
    
    // Focus email input
    setTimeout(() => emailInput.focus(), 100);
}

function handleCreateAccount() {
    alert('Create account feature - would redirect to account creation page');
}

function togglePasswordVisibility() {
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
}

// Validation functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    // Basic phone validation - accepts formats like +1234567890 or 1234567890
    const phoneRegex = /^\+?[\d\s\-\(\)]{7,}$/;
    return phoneRegex.test(phone);
}

// Error handling
function showEmailError(message) {
    emailError.textContent = message;
    emailError.classList.add('show');
    emailSection.classList.add('error');
}

function clearEmailError() {
    emailError.textContent = '';
    emailError.classList.remove('show');
    emailSection.classList.remove('error');
}

function showPasswordError(message) {
    passwordError.textContent = message;
    passwordError.classList.add('show');
    passwordSection.classList.add('error');
}

function clearPasswordError() {
    passwordError.textContent = '';
    passwordError.classList.remove('show');
    passwordSection.classList.remove('error');
}

// LocalStorage for saving email
function loadSavedEmail() {
    const savedEmail = localStorage.getItem('savedEmail');
    if (savedEmail) {
        emailInput.value = savedEmail;
    }
}

// Accessibility enhancements
emailInput.addEventListener('focus', () => {
    emailInput.placeholder = 'you@example.com';
});

emailInput.addEventListener('blur', () => {
    emailInput.placeholder = 'Email or phone';
});

// Prevent autofill styling issues
document.addEventListener('animationstart', (e) => {
    if (e.animationName === 'onAutoFillStart') {
        const target = e.target;
        target.style.backgroundColor = '#f8f9fa';
    }
});
