// Clients management functionality

let editingClientId = null;

document.addEventListener('DOMContentLoaded', function() {
    initPage();
    loadClients();
    setupEventListeners();
});

function setupEventListeners() {
    // Add client button
    document.getElementById('addClientBtn').addEventListener('click', () => {
        editingClientId = null;
        document.getElementById('modalTitle').textContent = 'Add Client';
        document.getElementById('clientForm').reset();
        openModal('clientModal');
    });
    
    // Client form submission
    document.getElementById('clientForm').addEventListener('submit', handleClientSubmit);
    
    // Setup modal handlers
    setupModalHandlers('clientModal', 'clientForm');
}

function loadClients() {
    const clients = getUserData('clients');
    const tableBody = document.getElementById('clientsTableBody');
    
    if (clients.length === 0) {
        toggleEmptyState('clientsTable', 'emptyState', false);
        return;
    }
    
    toggleEmptyState('clientsTable', 'emptyState', true);
    
    tableBody.innerHTML = clients.map(client => `
        <tr>
            <td>${escapeHtml(client.name)}</td>
            <td>${escapeHtml(client.email)}</td>
            <td>${escapeHtml(client.phone || '')}</td>
            <td>${escapeHtml(client.notes || '')}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-primary" onclick="editClient('${client.id}')">Edit</button>
                    <button class="btn btn-danger" onclick="deleteClient('${client.id}')">Delete</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function handleClientSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const clientData = {
        name: formData.get('name').trim(),
        email: formData.get('email').trim(),
        phone: formData.get('phone').trim(),
        notes: formData.get('notes').trim()
    };
    
    // Validation
    if (!clientData.name || !clientData.email) {
        alert('Name and email are required');
        return;
    }
    
    if (!isValidEmail(clientData.email)) {
        alert('Please enter a valid email address');
        return;
    }
    
    const clients = getUserData('clients');
    
    // Check for duplicate email (excluding current client if editing)
    const existingClient = clients.find(c => 
        c.email === clientData.email && c.id !== editingClientId
    );
    
    if (existingClient) {
        alert('A client with this email already exists');
        return;
    }
    
    if (editingClientId) {
        // Update existing client
        const clientIndex = clients.findIndex(c => c.id === editingClientId);
        if (clientIndex !== -1) {
            clients[clientIndex] = {
                ...clients[clientIndex],
                ...clientData,
                updatedAt: new Date().toISOString()
            };
        }
    } else {
        // Add new client
        const newClient = {
            id: generateId(),
            ...clientData,
            createdAt: new Date().toISOString()
        };
        clients.push(newClient);
    }
    
    saveUserData('clients', clients);
    loadClients();
    closeModal('clientModal');
    e.target.reset();
    editingClientId = null;
}

function editClient(clientId) {
    const clients = getUserData('clients');
    const client = clients.find(c => c.id === clientId);
    
    if (!client) return;
    
    editingClientId = clientId;
    document.getElementById('modalTitle').textContent = 'Edit Client';
    
    // Populate form
    document.getElementById('clientName').value = client.name;
    document.getElementById('clientEmail').value = client.email;
    document.getElementById('clientPhone').value = client.phone || '';
    document.getElementById('clientNotes').value = client.notes || '';
    
    openModal('clientModal');
}

function deleteClient(clientId) {
    if (!confirm('Are you sure you want to delete this client? This action cannot be undone.')) {
        return;
    }
    
    const clients = getUserData('clients');
    const updatedClients = clients.filter(c => c.id !== clientId);
    
    saveUserData('clients', updatedClients);
    
    // Also remove client from invoices and tasks
    const invoices = getUserData('invoices');
    const updatedInvoices = invoices.filter(i => i.clientId !== clientId);
    saveUserData('invoices', updatedInvoices);
    
    const tasks = getUserData('tasks');
    const updatedTasks = tasks.map(task => {
        if (task.clientId === clientId) {
            const { clientId, ...taskWithoutClient } = task;
            return taskWithoutClient;
        }
        return task;
    });
    saveUserData('tasks', updatedTasks);
    
    loadClients();
}
