document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let editingTaskId = null; // To keep track of the task being edited

    // Function to render tasks
    function renderTasks() {
        taskList.innerHTML = ''; // Clear current list
        tasks.forEach(task => {
            const listItem = document.createElement('li');
            listItem.className = `task-item ${task.completed ? 'completed' : ''}`;
            listItem.dataset.id = task.id; // Store task ID for easy lookup

            listItem.innerHTML = `
                <span class="task-text">${task.text}</span>
                <div class="task-actions">
                    <button class="complete-btn" title="Mark as Complete/Incomplete">✔</button>
                    <button class="edit-btn" title="Edit Task">✎</button>
                    <button class="delete-btn" title="Delete Task">✖</button>
                </div>
            `;
            taskList.appendChild(listItem);
        });
        saveTasks();
    }

    // Function to save tasks to localStorage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Add Task Functionality
    addTaskBtn.addEventListener('click', () => {
        const taskText = taskInput.value.trim();
        if (taskText !== '') {
            if (editingTaskId !== null) {
                // Edit existing task
                const taskIndex = tasks.findIndex(task => task.id === editingTaskId);
                if (taskIndex > -1) {
                    tasks[taskIndex].text = taskText;
                    editingTaskId = null; // Reset editing state
                    addTaskBtn.textContent = 'Add Task'; // Change button text back
                }
            } else {
                // Add new task
                const newTask = {
                    id: Date.now(), // Unique ID for the task
                    text: taskText,
                    completed: false
                };
                tasks.push(newTask);
            }
            taskInput.value = ''; // Clear input field
            renderTasks();
        } else {
            alert('Please enter a task!');
        }
    });

    // Handle Clicks on Task List (Delegate events)
    taskList.addEventListener('click', (e) => {
        const target = e.target;
        const listItem = target.closest('.task-item'); // Get the parent <li>

        if (!listItem) return; // If clicked outside a task item, do nothing

        const taskId = parseInt(listItem.dataset.id);

        if (target.classList.contains('complete-btn')) {
            // Toggle task completion
            const taskIndex = tasks.findIndex(task => task.id === taskId);
            if (taskIndex > -1) {
                tasks[taskIndex].completed = !tasks[taskIndex].completed;
                renderTasks();
            }
        } else if (target.classList.contains('edit-btn')) {
            // Edit task
            const taskToEdit = tasks.find(task => task.id === taskId);
            if (taskToEdit) {
                taskInput.value = taskToEdit.text;
                editingTaskId = taskId; // Set the ID of the task being edited
                addTaskBtn.textContent = 'Save Changes'; // Change button text
                taskInput.focus(); // Focus on input field
            }
        } else if (target.classList.contains('delete-btn')) {
            // Delete task
            if (confirm('Are you sure you want to delete this task?')) {
                tasks = tasks.filter(task => task.id !== taskId);
                renderTasks();
                // If the deleted task was being edited, reset the editing state
                if (editingTaskId === taskId) {
                    editingTaskId = null;
                    taskInput.value = '';
                    addTaskBtn.textContent = 'Add Task';
                }
            }
        }
    });

    // Initial render when page loads
    renderTasks();
});