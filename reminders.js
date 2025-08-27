// Reminders functionality

document.addEventListener('DOMContentLoaded', function() {
    initPage();
    loadReminders();
});

function loadReminders() {
    const invoices = getUserData('invoices');
    const clients = getUserData('clients');
    
    // Filter overdue invoices
    const overdueInvoices = invoices.filter(invoice => 
        invoice.status === 'Pending' && isOverdue(invoice.dueDate)
    );
    
    // Filter upcoming due dates (next 7 days)
    const upcomingInvoices = invoices.filter(invoice => 
        invoice.status === 'Pending' && isUpcoming(invoice.dueDate)
    );
    
    // Display overdue invoices
    displayOverdueInvoices(overdueInvoices, clients);
    
    // Display upcoming due dates
    displayUpcomingDueDates(upcomingInvoices, clients);
    
    // Show/hide empty state
    const hasReminders = overdueInvoices.length > 0 || upcomingInvoices.length > 0;
    toggleEmptyState('remindersSection', 'emptyState', hasReminders);
    
    if (hasReminders) {
        document.querySelector('.reminders-section').style.display = 'grid';
    } else {
        document.querySelector('.reminders-section').style.display = 'none';
    }
}

function displayOverdueInvoices(overdueInvoices, clients) {
    const container = document.getElementById('overdueInvoices');
    
    if (overdueInvoices.length === 0) {
        container.innerHTML = '<p style="color: #6b7280; text-align: center;">No overdue invoices</p>';
        return;
    }
    
    container.innerHTML = overdueInvoices.map(invoice => {
        const client = clients.find(c => c.id === invoice.clientId);
        const clientName = client ? client.name : 'Unknown Client';
        const daysOverdue = Math.floor((new Date() - new Date(invoice.dueDate)) / (1000 * 60 * 60 * 24));
        
        return `
            <div class="reminder-item">
                <div class="reminder-header">
                    <h4>Invoice #${invoice.invoiceNumber}</h4>
                    <span class="reminder-amount">${formatCurrency(invoice.amount)}</span>
                </div>
                <div class="reminder-details">
                    <p><strong>Client:</strong> ${escapeHtml(clientName)}</p>
                    <p><strong>Project:</strong> ${escapeHtml(invoice.project)}</p>
                    <p><strong>Due Date:</strong> ${formatDate(invoice.dueDate)} (${daysOverdue} day${daysOverdue !== 1 ? 's' : ''} overdue)</p>
                </div>
                <div class="reminder-actions">
                    <button class="btn btn-success" onclick="markAsPaid('${invoice.id}')">Mark as Paid</button>
                    <button class="btn btn-primary" onclick="sendReminder('${invoice.id}')">Send Reminder</button>
                    <button class="btn btn-secondary" onclick="editInvoiceFromReminders('${invoice.id}')">Edit Invoice</button>
                </div>
            </div>
        `;
    }).join('');
}

function displayUpcomingDueDates(upcomingInvoices, clients) {
    const container = document.getElementById('upcomingDueDates');
    
    if (upcomingInvoices.length === 0) {
        container.innerHTML = '<p style="color: #6b7280; text-align: center;">No upcoming due dates</p>';
        return;
    }
    
    container.innerHTML = upcomingInvoices.map(invoice => {
        const client = clients.find(c => c.id === invoice.clientId);
        const clientName = client ? client.name : 'Unknown Client';
        const daysUntilDue = Math.ceil((new Date(invoice.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
        
        return `
            <div class="reminder-item upcoming">
                <div class="reminder-header">
                    <h4>Invoice #${invoice.invoiceNumber}</h4>
                    <span class="reminder-amount upcoming">${formatCurrency(invoice.amount)}</span>
                </div>
                <div class="reminder-details">
                    <p><strong>Client:</strong> ${escapeHtml(clientName)}</p>
                    <p><strong>Project:</strong> ${escapeHtml(invoice.project)}</p>
                    <p><strong>Due Date:</strong> ${formatDate(invoice.dueDate)} (${daysUntilDue} day${daysUntilDue !== 1 ? 's' : ''} remaining)</p>
                </div>
                <div class="reminder-actions">
                    <button class="btn btn-success" onclick="markAsPaid('${invoice.id}')">Mark as Paid</button>
                    <button class="btn btn-primary" onclick="sendReminder('${invoice.id}')">Send Reminder</button>
                    <button class="btn btn-secondary" onclick="editInvoiceFromReminders('${invoice.id}')">Edit Invoice</button>
                </div>
            </div>
        `;
    }).join('');
}

function markAsPaid(invoiceId) {
    if (!confirm('Mark this invoice as paid?')) {
        return;
    }
    
    const invoices = getUserData('invoices');
    const invoiceIndex = invoices.findIndex(i => i.id === invoiceId);
    
    if (invoiceIndex !== -1) {
        invoices[invoiceIndex].status = 'Paid';
        invoices[invoiceIndex].paidAt = new Date().toISOString();
        invoices[invoiceIndex].updatedAt = new Date().toISOString();
        
        saveUserData('invoices', invoices);
        loadReminders();
    }
}

function sendReminder(invoiceId) {
    // Placeholder for sending reminder functionality
    // In a real application, this would send an email or notification
    const invoices = getUserData('invoices');
    const invoice = invoices.find(i => i.id === invoiceId);
    
    if (invoice) {
        const clients = getUserData('clients');
        const client = clients.find(c => c.id === invoice.clientId);
        const clientName = client ? client.name : 'Unknown Client';
        
        alert(`Reminder functionality would send an email to ${clientName} about Invoice #${invoice.invoiceNumber}. This is a placeholder as requested.`);
        
        // Update last reminder sent date
        const invoiceIndex = invoices.findIndex(i => i.id === invoiceId);
        if (invoiceIndex !== -1) {
            invoices[invoiceIndex].lastReminderSent = new Date().toISOString();
            invoices[invoiceIndex].updatedAt = new Date().toISOString();
            saveUserData('invoices', invoices);
        }
    }
}

function editInvoiceFromReminders(invoiceId) {
    // Navigate to invoices page with edit modal open
    localStorage.setItem('editInvoiceId', invoiceId);
    window.location.href = 'invoices.html';
}
