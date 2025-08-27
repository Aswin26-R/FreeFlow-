// Projects (Kanban board) functionality

let editingTaskId = null;
let draggedElement = null;

document.addEventListener('DOMContentLoaded', function() {
    initPage();
    loadTasks();
    setupEventListeners();
    populateClientOptions();
    setupDragAndDrop();
});

function setupEventListeners() {
    // Add task button
    document.getElementById('addTaskBtn').addEventListener('click', () => {
        editingTaskId = null;
        document.getElementById('modalTitle').textContent = 'Add Task';
        document.getElementById('taskForm').reset();
        openModal('taskModal');
    });
    
    // Task form submission
    document.getElementById('taskForm').addEventListener('submit', handleTaskSubmit);
    
    // Setup modal handlers
    setupModalHandlers('taskModal', 'taskForm');
}

function populateClientOptions() {
    const clients = getUserData('clients');
    const clientSelect = document.getElementById('taskClient');
    
    clientSelect.innerHTML = '<option value="">Select a client</option>' +
        clients.map(client => 
            `<option value="${client.id}">${escapeHtml(client.name)}</option>`
        ).join('');
}

function loadTasks() {
    const tasks = getUserData('tasks');
    const clients = getUserData('clients');
    
    // Clear columns
    document.getElementById('todoColumn').innerHTML = '';
    document.getElementById('inprogressColumn').innerHTML = '';
    document.getElementById('doneColumn').innerHTML = '';
    
    // Group tasks by status
    const tasksByStatus = {
        todo: tasks.filter(task => task.status === 'todo'),
        inprogress: tasks.filter(task => task.status === 'inprogress'),
        done: tasks.filter(task => task.status === 'done')
    };
    
    // Update task counts
    document.getElementById('todoCount').textContent = tasksByStatus.todo.length;
    document.getElementById('inprogressCount').textContent = tasksByStatus.inprogress.length;
    document.getElementById('doneCount').textContent = tasksByStatus.done.length;
    
    // Render tasks in each column
    Object.keys(tasksByStatus).forEach(status => {
        const column = document.getElementById(`${status}Column`);
        const statusTasks = tasksByStatus[status];
        
        statusTasks.forEach(task => {
            const client = clients.find(c => c.id === task.clientId);
            const clientName = client ? client.name : '';
            
            const taskElement = createTaskElement(task, clientName);
            column.appendChild(taskElement);
        });
    });
    
    // Show/hide empty state
    const hasAnyTasks = tasks.length > 0;
    toggleEmptyState('kanbanBoard', 'emptyState', hasAnyTasks);
    
    if (hasAnyTasks) {
        document.querySelector('.kanban-board').style.display = 'grid';
    } else {
        document.querySelector('.kanban-board').style.display = 'none';
    }
}

function createTaskElement(task, clientName) {
    const taskDiv = document.createElement('div');
    taskDiv.className = 'task-card';
    taskDiv.draggable = true;
    taskDiv.dataset.taskId = task.id;
    
    taskDiv.innerHTML = `
        <h4>${escapeHtml(task.title)}</h4>
        <p>${escapeHtml(task.description || '')}</p>
        ${clientName ? `<div class="task-meta">
            <span>Client: ${escapeHtml(clientName)}</span>
        </div>` : ''}
        <div class="task-actions">
            <button class="btn btn-primary" onclick="editTask('${task.id}')">Edit</button>
            <button class="btn btn-danger" onclick="deleteTask('${task.id}')">Delete</button>
        </div>
    `;
    
    return taskDiv;
}

function setupDragAndDrop() {
    const columns = document.querySelectorAll('.column-content');
    
    // Add drag event listeners to columns
    columns.forEach(column => {
        column.addEventListener('dragover', handleDragOver);
        column.addEventListener('drop', handleDrop);
    });
    
    // Add drag event listeners to existing tasks
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('dragend', handleDragEnd);
}

function handleDragStart(e) {
    if (e.target.classList.contains('task-card')) {
        draggedElement = e.target;
        e.target.classList.add('dragging');
    }
}

function handleDragEnd(e) {
    if (e.target.classList.contains('task-card')) {
        e.target.classList.remove('dragging');
        draggedElement = null;
    }
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleDrop(e) {
    e.preventDefault();
    
    if (!draggedElement) return;
    
    const column = e.currentTarget;
    const newStatus = column.parentElement.dataset.status;
    const taskId = draggedElement.dataset.taskId;
    
    // Update task status in localStorage
    const tasks = getUserData('tasks');
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex !== -1) {
        tasks[taskIndex].status = newStatus;
        tasks[taskIndex].updatedAt = new Date().toISOString();
        saveUserData('tasks', tasks);
        
        // Reload tasks to update the display
        loadTasks();
        setupDragAndDrop();
    }
}

function handleTaskSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const taskData = {
        title: formData.get('title').trim(),
        description: formData.get('description').trim(),
        clientId: formData.get('client') || null,
        status: formData.get('status')
    };
    
    // Validation
    if (!taskData.title) {
        alert('Task title is required');
        return;
    }
    
    const tasks = getUserData('tasks');
    
    if (editingTaskId) {
        // Update existing task
        const taskIndex = tasks.findIndex(t => t.id === editingTaskId);
        if (taskIndex !== -1) {
            tasks[taskIndex] = {
                ...tasks[taskIndex],
                ...taskData,
                updatedAt: new Date().toISOString()
            };
        }
    } else {
        // Add new task
        const newTask = {
            id: generateId(),
            ...taskData,
            createdAt: new Date().toISOString()
        };
        tasks.push(newTask);
    }
    
    saveUserData('tasks', tasks);
    loadTasks();
    setupDragAndDrop();
    closeModal('taskModal');
    e.target.reset();
    editingTaskId = null;
}

function editTask(taskId) {
    const tasks = getUserData('tasks');
    const task = tasks.find(t => t.id === taskId);
    
    if (!task) return;
    
    editingTaskId = taskId;
    document.getElementById('modalTitle').textContent = 'Edit Task';
    
    // Populate form
    document.getElementById('taskTitle').value = task.title;
    document.getElementById('taskDescription').value = task.description || '';
    document.getElementById('taskClient').value = task.clientId || '';
    document.getElementById('taskStatus').value = task.status;
    
    openModal('taskModal');
}

function deleteTask(taskId) {
    if (!confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
        return;
    }
    
    const tasks = getUserData('tasks');
    const updatedTasks = tasks.filter(t => t.id !== taskId);
    
    saveUserData('tasks', updatedTasks);
    loadTasks();
    setupDragAndDrop();
}
