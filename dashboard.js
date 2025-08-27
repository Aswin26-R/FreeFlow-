// Dashboard functionality

document.addEventListener('DOMContentLoaded', function() {
    initPage();
    loadDashboardData();
});

function loadDashboardData() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    // Update welcome message
    const welcomeMessage = document.getElementById('welcomeMessage');
    if (welcomeMessage) {
        welcomeMessage.textContent = `Welcome back, ${currentUser.fullName}!`;
    }
    
    // Load and display summary data
    updateSummaryCards();
    
    // Load recent data
    loadRecentClients();
    loadRecentInvoices();
}

function updateSummaryCards() {
    const clients = getUserData('clients');
    const invoices = getUserData('invoices');
    const tasks = getUserData('tasks');
    
    // Total clients
    document.getElementById('totalClients').textContent = clients.length;
    
    // Pending invoices
    const pendingInvoices = invoices.filter(invoice => invoice.status === 'Pending');
    document.getElementById('pendingInvoices').textContent = pendingInvoices.length;
    
    // Active projects (tasks not in done status)
    const activeTasks = tasks.filter(task => task.status !== 'done');
    document.getElementById('activeProjects').textContent = activeTasks.length;
    
    // Overdue reminders (overdue pending invoices)
    const overdueInvoices = invoices.filter(invoice => 
        invoice.status === 'Pending' && isOverdue(invoice.dueDate)
    );
    document.getElementById('overdueReminders').textContent = overdueInvoices.length;
}

function loadRecentClients() {
    const clients = getUserData('clients');
    const recentClientsContainer = document.getElementById('recentClients');
    
    if (!recentClientsContainer) return;
    
    // Get last 3 clients
    const recentClients = clients.slice(-3).reverse();
    
    if (recentClients.length === 0) {
        recentClientsContainer.innerHTML = '<p style="color: #6b7280; text-align: center;">No clients yet</p>';
        return;
    }
    
    recentClientsContainer.innerHTML = recentClients.map(client => `
        <div class="recent-item">
            <div class="recent-item-info">
                <h4>${escapeHtml(client.name)}</h4>
                <p>${escapeHtml(client.email)}</p>
            </div>
        </div>
    `).join('');
}

function loadRecentInvoices() {
    const invoices = getUserData('invoices');
    const clients = getUserData('clients');
    const recentInvoicesContainer = document.getElementById('recentInvoices');
    
    if (!recentInvoicesContainer) return;
    
    // Get last 3 invoices
    const recentInvoices = invoices.slice(-3).reverse();
    
    if (recentInvoices.length === 0) {
        recentInvoicesContainer.innerHTML = '<p style="color: #6b7280; text-align: center;">No invoices yet</p>';
        return;
    }
    
    recentInvoicesContainer.innerHTML = recentInvoices.map(invoice => {
        const client = clients.find(c => c.id === invoice.clientId);
        const clientName = client ? client.name : 'Unknown Client';
        
        return `
            <div class="recent-item">
                <div class="recent-item-info">
                    <h4>Invoice #${invoice.invoiceNumber}</h4>
                    <p>${escapeHtml(clientName)} - ${formatCurrency(invoice.amount)}</p>
                </div>
                <span class="status-badge status-${invoice.status.toLowerCase()}">${invoice.status}</span>
            </div>
        `;
    }).join('');
}
