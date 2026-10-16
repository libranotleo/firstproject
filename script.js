// Grab HTML elements by their IDs
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');

// Listen for when the user clicks the "Add" button
addBtn.addEventListener('click', function() {
    const taskText = taskInput.value.trim();

    // Check if the input is empty
    if (taskText === "") {
        alert("Please enter a task!");
        return;
    }

    // Create a new list item (li)
    const li = document.createElement('li');
    li.textContent = taskText;

    // Create a delete button for the task
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    
    // Remove the task when delete is clicked
    deleteBtn.addEventListener('click', function() {
        taskList.removeChild(li);
    });

    // Put the delete button inside the list item, and add it to the list
    li.appendChild(deleteBtn);
    taskList.appendChild(li);

    // Clear the input box
    taskInput.value = "";
});