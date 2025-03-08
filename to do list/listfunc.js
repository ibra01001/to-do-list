

document.getElementById('addtask').addEventListener('click', function () {
    addTask();
});

function addTask() {
    let taskList = document.getElementById('tasklist');

    let listItem = document.createElement('li');
    listItem.classList.add('task-item');

    listItem.innerHTML = `
        <input type="text" class="task-input" placeholder="Enter your task">
        <label><i class="bi bi-alarm"> </i> Timer:</label>
        <input type="time" class="task-timer" min="0" max="24">
        <label>Until:</label>
        <input type="time" class="end-time" min="0" max="24">
        <span class="timer-display">00:00:00</span>
        <button onclick="startTimer(this)" class="start-btn"><i class="bi bi-stopwatch"></i></button>
        <button onclick="removeTask(this)" class="remove-task"><i class="bi bi-trash"></i></button>
        <button onclick="markCompleted(this)" ; class="complete-task"><i " class="bi bi-floppy2-fill"></i></button>
    `;

    taskList.appendChild(listItem);
    updateLocalStorage();
}

function removeTask(button) {
    button.parentElement.remove();
    updateLocalStorage();
}

function markCompleted(button) {
    let taskItem = button.parentElement;
    taskItem.classList.toggle('completed');
    updateLocalStorage();
}

function updateLocalStorage() {
    let tasks = [];
    document.querySelectorAll('.task-item').forEach((item) => {
        let taskText = item.querySelector('.task-input').value;
        let startTime = item.querySelector('.task-timer').value;
        let endTime = item.querySelector('.end-time').value;
        let display = item.querySelector('.timer-display').value;
        let completed = item.classList.contains('completed');

        tasks.push({ taskText, startTime, endTime, completed, display });
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let taskList = document.getElementById('tasklist');
    taskList.innerHTML = '';

    tasks.forEach((task) => {
        let listItem = document.createElement('li');
        listItem.classList.add('task-item');
        if (task.completed) listItem.classList.add('completed');
        if (task.display) listItem.classList.add('timer-display');

        listItem.innerHTML = `
            <input type="text" class="task-input" value="${task.taskText}">

            <label> <i class="bi bi-alarm"></i> Timer:</label>
            <input type="time"  class="task-timer" min="0" max="24" value='${task.startTime}'>
            
            <label>Until:</label>
            <input type="time" class="end-time" min="0" max="24" value='${task.endTime}'>

            <span class="timer-display" value='${task.timerDisplay}'> 00:00:00 </span>
            <button onclick="startTimer(this)" class="start-btn"><i class="bi bi-stopwatch"></i></button>
            


            <button onclick="removeTask(this)" class="remove-task"><i class="bi bi-trash"></i></button>
            <button onclick="markCompleted(this)" class="complete-task"><i class="bi bi-floppy2-fill"></i></button>
            
        `;

        taskList.appendChild(listItem);
    });
}

window.onload = loadTasks;


function startTimer(button) {
    let taskItem = button.parentElement;
    let taskInput = taskItem.querySelector('.task-input');
    let taskTimer = taskItem.querySelector('.task-timer');
    let endTime = taskItem.querySelector('.end-time');
    let timerDisplay = taskItem.querySelector('.timer-display');

    let [startHours, startMinutes] = taskTimer.value.split(':').map(Number);
    let [endHours, endMinutes] = endTime.value.split(':').map(Number);

    let startTimeInSeconds = startHours * 3600 + startMinutes * 60;
    let endTimeInSeconds = endHours * 3600 + endMinutes * 60;
    let remainingTime = endTimeInSeconds - startTimeInSeconds;

    if (!taskTimer.value || !endTime.value) { 
        alert("Please enter a valid time!");
        return;
    }

    

    if (remainingTime <= 0) {
        alert("End time must be later than the start time!");
        return;
    }


    button.disabled = true;
    button.style.opacity = 0.5;
    


    let interval = setInterval(() => {
        if (remainingTime <= 0) {
            clearInterval(interval);
            timerDisplay.textContent = "Time is up!";
            button.disabled = false; // Re-enable button
        } else {
            let hours = Math.floor(remainingTime / 3600);
            let minutes = Math.floor((remainingTime % 3600) / 60);
            let seconds = remainingTime % 60;

            

            // Ensure double-digit format (e.g., 02:05:09)
            timerDisplay.textContent =
                `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

            remainingTime--; // Reduce time by 1 second
        }
    }, 1000);
    
}