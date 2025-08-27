// Authentication functionality

document.addEventListener('DOMContentLoaded', function() {
    // Redirect if already logged in
    if (localStorage.getItem('currentUser')) {
        window.location.href = 'dashboard.html';
        return;
    }
    
    // Handle login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Handle signup form
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
});

function handleLogin(e) {
    e.preventDefault();
    hideError('errorMessage');
    
    const formData = new FormData(e.target);
    const email = formData.get('email').trim();
    const password = formData.get('password');
    
    // Basic validation
    if (!email || !password) {
        showError('errorMessage', 'Please fill in all fields');
        return;
    }
    
    if (!isValidEmail(email)) {
        showError('errorMessage', 'Please enter a valid email address');
        return;
    }
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Find user with matching credentials
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Remove password from stored user data for security
        const userSession = {
            id: user.id,
            fullName: user.fullName,
            email: user.email
        };
        
        localStorage.setItem('currentUser', JSON.stringify(userSession));
        window.location.href = 'dashboard.html';
    } else {
        showError('errorMessage', 'Invalid email or password');
    }
}

function handleSignup(e) {
    e.preventDefault();
    hideError('errorMessage');
    
    const formData = new FormData(e.target);
    const fullName = formData.get('fullName').trim();
    const email = formData.get('email').trim();
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    
    // Basic validation
    if (!fullName || !email || !password || !confirmPassword) {
        showError('errorMessage', 'Please fill in all fields');
        return;
    }
    
    if (!isValidEmail(email)) {
        showError('errorMessage', 'Please enter a valid email address');
        return;
    }
    
    if (password.length < 6) {
        showError('errorMessage', 'Password must be at least 6 characters long');
        return;
    }
    
    if (password !== confirmPassword) {
        showError('errorMessage', 'Passwords do not match');
        return;
    }
    
    // Get existing users
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if user already exists
    if (users.find(u => u.email === email)) {
        showError('errorMessage', 'An account with this email already exists');
        return;
    }
    
    // Create new user
    const newUser = {
        id: generateId(),
        fullName: fullName,
        email: email,
        password: password, // In a real app, this would be hashed
        createdAt: new Date().toISOString()
    };
    
    // Save user
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Auto-login the new user
    const userSession = {
        id: newUser.id,
        fullName: newUser.fullName,
        email: newUser.email
    };
    
    localStorage.setItem('currentUser', JSON.stringify(userSession));
    window.location.href = 'dashboard.html';
}
