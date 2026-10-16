const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const emptyState = document.getElementById('emptyState');
const emptyMessage = document.getElementById('emptyMessage');
const taskTotal = document.getElementById('taskTotal');
const clearCompletedBtn = document.getElementById('clearCompletedBtn');
const progressCount = document.getElementById('progressCount');
const progressBar = document.getElementById('progressBar');
const progressFill = document.getElementById('progressFill');
const progressNote = document.getElementById('progressNote');
const todayLabel = document.getElementById('todayLabel');
const filterButtons = document.querySelectorAll('.filter-button');

const tasks = [];
let currentFilter = 'all';
let nextTaskId = 0;

todayLabel.textContent = new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
}).format(new Date());

function renderTasks() {
    const visibleTasks = tasks.filter((task) => {
        if (currentFilter === 'active') return !task.completed;
        if (currentFilter === 'completed') return task.completed;
        return true;
    });

    taskList.replaceChildren();

    visibleTasks.forEach((task) => {
        const item = document.createElement('li');
        item.className = `task-item${task.completed ? ' is-completed' : ''}`;

        const toggleButton = document.createElement('button');
        toggleButton.className = 'task-toggle';
        toggleButton.type = 'button';
        toggleButton.setAttribute('aria-label', `${task.completed ? 'Mark' : 'Complete'} "${task.text}"`);
        toggleButton.setAttribute('aria-pressed', String(task.completed));
        toggleButton.addEventListener('click', () => {
            task.completed = !task.completed;
            renderTasks();
        });

        const text = document.createElement('span');
        text.className = 'task-text';
        text.textContent = task.text;

        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-button';
        deleteButton.type = 'button';
        deleteButton.setAttribute('aria-label', `Delete "${task.text}"`);
        deleteButton.textContent = '×';
        deleteButton.addEventListener('click', () => {
            const taskIndex = tasks.findIndex((item) => item.id === task.id);
            tasks.splice(taskIndex, 1);
            renderTasks();
        });

        item.append(toggleButton, text, deleteButton);
        taskList.append(item);
    });

    const completedCount = tasks.filter((task) => task.completed).length;
    const totalCount = tasks.length;
    const progress = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

    taskTotal.textContent = String(totalCount);
    progressCount.textContent = `${completedCount} of ${totalCount} done`;
    progressBar.setAttribute('aria-valuenow', String(progress));
    progressFill.style.width = `${progress}%`;
    progressNote.textContent = totalCount > 0 && completedCount === totalCount
        ? 'Everything done. Nice work! 🎉'
        : totalCount > 0 && completedCount > 0
            ? 'You’re making great progress ✨'
            : 'Start with one small step ✨';
    clearCompletedBtn.hidden = completedCount === 0;
    emptyState.hidden = visibleTasks.length > 0;

    if (currentFilter === 'active' && totalCount > 0 && visibleTasks.length === 0) {
        emptyMessage.textContent = 'You’re all caught up. Enjoy the breathing room.';
    } else if (currentFilter === 'completed' && visibleTasks.length === 0) {
        emptyMessage.textContent = 'Completed tasks will show up here.';
    } else {
        emptyMessage.textContent = 'Your list is clear. Add a task to get going.';
    }
}

taskForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const taskText = taskInput.value.trim();

    if (!taskText) {
        taskInput.focus();
        return;
    }

    tasks.push({
        id: nextTaskId++,
        text: taskText,
        completed: false
    });
    taskInput.value = '';
    currentFilter = 'all';
    updateFilterButtons();
    renderTasks();
    taskInput.focus();
});

filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
        currentFilter = button.dataset.filter;
        updateFilterButtons();
        renderTasks();
    });
});

function updateFilterButtons() {
    filterButtons.forEach((button) => {
        const isActive = button.dataset.filter === currentFilter;
        button.classList.toggle('is-active', isActive);
        button.setAttribute('aria-pressed', String(isActive));
    });
}

clearCompletedBtn.addEventListener('click', () => {
    for (let index = tasks.length - 1; index >= 0; index -= 1) {
        if (tasks[index].completed) tasks.splice(index, 1);
    }
    renderTasks();
});

renderTasks();
