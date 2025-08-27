// Invoices management functionality

let editingInvoiceId = null;

document.addEventListener('DOMContentLoaded', function() {
    initPage();
    loadInvoices();
    setupEventListeners();
    populateClientOptions();
});

function setupEventListeners() {
    // Add invoice button
    document.getElementById('addInvoiceBtn').addEventListener('click', () => {
        editingInvoiceId = null;
        document.getElementById('modalTitle').textContent = 'Create Invoice';
        document.getElementById('invoiceForm').reset();
        // Set default due date to 30 days from now
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 30);
        document.getElementById('invoiceDueDate').value = futureDate.toISOString().split('T')[0];
        openModal('invoiceModal');
    });
    
    // Invoice form submission
    document.getElementById('invoiceForm').addEventListener('submit', handleInvoiceSubmit);
    
    // Setup modal handlers
    setupModalHandlers('invoiceModal', 'invoiceForm');
}

function populateClientOptions() {
    const clients = getUserData('clients');
    const clientSelect = document.getElementById('invoiceClient');
    
    clientSelect.innerHTML = '<option value="">Select a client</option>' +
        clients.map(client => 
            `<option value="${client.id}">${escapeHtml(client.name)}</option>`
        ).join('');
}

function loadInvoices() {
    const invoices = getUserData('invoices');
    const clients = getUserData('clients');
    const tableBody = document.getElementById('invoicesTableBody');
    
    if (invoices.length === 0) {
        toggleEmptyState('invoicesTable', 'emptyState', false);
        return;
    }
    
    toggleEmptyState('invoicesTable', 'emptyState', true);
    
    tableBody.innerHTML = invoices.map(invoice => {
        const client = clients.find(c => c.id === invoice.clientId);
        const clientName = client ? client.name : 'Unknown Client';
        const isOverdueInvoice = invoice.status === 'Pending' && isOverdue(invoice.dueDate);
        const statusClass = isOverdueInvoice ? 'overdue' : invoice.status.toLowerCase();
        const statusText = isOverdueInvoice ? 'Overdue' : invoice.status;
        
        return `
            <tr>
                <td>#${invoice.invoiceNumber}</td>
                <td>${escapeHtml(clientName)}</td>
                <td>${escapeHtml(invoice.project)}</td>
                <td>${formatCurrency(invoice.amount)}</td>
                <td>${formatDate(invoice.dueDate)}</td>
                <td><span class="status-badge status-${statusClass}">${statusText}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-primary" onclick="editInvoice('${invoice.id}')">Edit</button>
                        <button class="btn btn-secondary" onclick="downloadPDF('${invoice.id}')">PDF</button>
                        <button class="btn btn-danger" onclick="deleteInvoice('${invoice.id}')">Delete</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function handleInvoiceSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const invoiceData = {
        clientId: formData.get('client'),
        project: formData.get('project').trim(),
        amount: parseFloat(formData.get('amount')),
        dueDate: formData.get('dueDate'),
        status: formData.get('status')
    };
    
    // Validation
    if (!invoiceData.clientId || !invoiceData.project || !invoiceData.amount || !invoiceData.dueDate) {
        alert('All fields are required');
        return;
    }
    
    if (invoiceData.amount <= 0) {
        alert('Amount must be greater than 0');
        return;
    }
    
    const invoices = getUserData('invoices');
    
    if (editingInvoiceId) {
        // Update existing invoice
        const invoiceIndex = invoices.findIndex(i => i.id === editingInvoiceId);
        if (invoiceIndex !== -1) {
            invoices[invoiceIndex] = {
                ...invoices[invoiceIndex],
                ...invoiceData,
                updatedAt: new Date().toISOString()
            };
        }
    } else {
        // Add new invoice
        const newInvoice = {
            id: generateId(),
            invoiceNumber: generateInvoiceNumber(invoices),
            ...invoiceData,
            createdAt: new Date().toISOString()
        };
        invoices.push(newInvoice);
    }
    
    saveUserData('invoices', invoices);
    loadInvoices();
    closeModal('invoiceModal');
    e.target.reset();
    editingInvoiceId = null;
}

function generateInvoiceNumber(existingInvoices) {
    const year = new Date().getFullYear();
    const yearInvoices = existingInvoices.filter(inv => 
        inv.invoiceNumber.startsWith(year.toString())
    );
    const nextNumber = yearInvoices.length + 1;
    return `${year}-${nextNumber.toString().padStart(3, '0')}`;
}

function editInvoice(invoiceId) {
    const invoices = getUserData('invoices');
    const invoice = invoices.find(i => i.id === invoiceId);
    
    if (!invoice) return;
    
    editingInvoiceId = invoiceId;
    document.getElementById('modalTitle').textContent = 'Edit Invoice';
    
    // Populate form
    document.getElementById('invoiceClient').value = invoice.clientId;
    document.getElementById('invoiceProject').value = invoice.project;
    document.getElementById('invoiceAmount').value = invoice.amount;
    document.getElementById('invoiceDueDate').value = invoice.dueDate;
    document.getElementById('invoiceStatus').value = invoice.status;
    
    openModal('invoiceModal');
}

function deleteInvoice(invoiceId) {
    if (!confirm('Are you sure you want to delete this invoice? This action cannot be undone.')) {
        return;
    }
    
    const invoices = getUserData('invoices');
    const updatedInvoices = invoices.filter(i => i.id !== invoiceId);
    
    saveUserData('invoices', updatedInvoices);
    loadInvoices();
}

function downloadPDF(invoiceId) {
    // Placeholder for PDF download functionality
    // In a real application, this would generate and download a PDF
    alert('PDF download functionality would be implemented here. This is a placeholder as requested.');
}
