// Utility functions for localStorage and data management

// Check if user is authenticated
function checkAuth() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser && !window.location.pathname.includes('login.html') && !window.location.pathname.includes('signup.html') && !window.location.pathname.includes('index.html')) {
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

// Get current user
function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser') || 'null');
}

// Generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Check if date is overdue
function isOverdue(dateString) {
    const today = new Date();
    const dueDate = new Date(dateString);
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate < today;
}

// Check if date is in next 7 days
function isUpcoming(dateString) {
    const today = new Date();
    const dueDate = new Date(dateString);
    const sevenDaysFromNow = new Date(today.getTime() + (7 * 24 * 60 * 60 * 1000));
    
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);
    sevenDaysFromNow.setHours(0, 0, 0, 0);
    
    return dueDate >= today && dueDate <= sevenDaysFromNow;
}

// Get user-specific data from localStorage
function getUserData(key) {
    const currentUser = getCurrentUser();
    if (!currentUser) return [];
    
    const data = localStorage.getItem(`${currentUser.id}_${key}`);
    return data ? JSON.parse(data) : [];
}

// Save user-specific data to localStorage
function saveUserData(key, data) {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    localStorage.setItem(`${currentUser.id}_${key}`, JSON.stringify(data));
}

// Show error message
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
        setTimeout(() => {
            errorElement.classList.remove('show');
        }, 5000);
    }
}

// Hide error message
function hideError(elementId) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.classList.remove('show');
    }
}

// Show/hide empty state
function toggleEmptyState(containerId, emptyStateId, hasData) {
    const container = document.getElementById(containerId);
    const emptyState = document.getElementById(emptyStateId);
    
    if (container) {
        container.style.display = hasData ? 'block' : 'none';
    }
    
    if (emptyState) {
        emptyState.style.display = hasData ? 'none' : 'block';
    }
}

// Modal utilities
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// Setup modal close handlers
function setupModalHandlers(modalId, formId) {
    const modal = document.getElementById(modalId);
    const closeBtn = modal.querySelector('.close');
    const cancelBtn = modal.querySelector('#cancelBtn');
    const form = document.getElementById(formId);
    
    // Close modal when clicking X or Cancel
    closeBtn.addEventListener('click', () => closeModal(modalId));
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            closeModal(modalId);
            if (form) form.reset();
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal(modalId);
            if (form) form.reset();
        }
    });
}

// Setup logout functionality
function setupLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        });
    }
}

// Initialize page
function initPage() {
    checkAuth();
    setupLogout();
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
}

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Debounce function for search/filter inputs
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
