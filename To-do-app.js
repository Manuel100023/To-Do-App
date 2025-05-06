// Array of task with set-in Timer (default task)

const inbuiltTasks = [
    { task: "Read a book", hours: 0, minutes: 25, seconds: 0 },
    { task: "Watch movie", hours: 0, minutes: 45, seconds: 0 },
    { task: "Take a quick walk", hours: 0, minutes: 15, seconds: 0 },
    { task: "Play video games", hours: 0, minutes: 30, seconds: 0 },
    { task: "Exercise", hours: 0, minutes: 20, seconds: 0 },
    { task: "Do house chores", hours: 0, minutes: 10, seconds: 0 },
    { task: "Take a nap", hours: 0, minutes: 30, seconds: 0 },
    { task: "Coding", hours: 0, minutes: 15, seconds: 0 },
    { task: "Liesure Time", hours: 0, minutes: 40, seconds: 0 },
    { task: "Stretch and relax", hours: 0, minutes: 10, seconds: 0 }
  ];
  
  // Tasks dropdown
  function populateInbuiltTasks() {
    inbuiltTasks.forEach((task, index) => {
      const option = document.createElement('option');
      option.value = index;
      option.textContent = `${task.task} (${task.hours}h ${task.minutes}m ${task.seconds}s)`;
      inbuiltTaskSelect.appendChild(option);
    });
  }

  // Add new task to local storage
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  let timerInterval = null;
  let timeLeft = 0;
  let totalTime = 0; // To calculate the progress for the countdown circle
  let currentTaskIndex = null;
  let isTimerFinished = false; // To track if the timer has finished
  
  // Html elements
  const taskInput = document.getElementById('taskInput');
  const hoursInput = document.getElementById('hoursInput');
  const minutesInput = document.getElementById('minutesInput');
  const secondsInput = document.getElementById('secondsInput');
  const addTaskBtn = document.getElementById('addTaskBtn');
  const inbuiltTaskSelect = document.getElementById('inbuiltTaskSelect');
  const addInbuiltTaskBtn = document.getElementById('addInbuiltTaskBtn');
  const timerDisplay = document.getElementById('timerDisplay');
  const currentTask = document.getElementById('currentTask');
  const timerStatus = document.getElementById('timerStatus');
  const timer = document.getElementById('timer');
  const stopTimerBtn = document.getElementById('stopTimerBtn');
  const stopAlarmBtn = document.getElementById('stopAlarmBtn');
  const taskList = document.getElementById('taskList');
  const timerCircle = document.getElementById('timerCircle');
  const alarmSound = document.getElementById('alarmSound');
  
  // Timer circle countdown
  const ctx = timerCircle.getContext('2d');
  const centerX = timerCircle.width / 2;
  const centerY = timerCircle.height / 2;
  const radius = 70;
  
  
  // Task added to localStorage
  function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
  
  // Add a custom task
  function addTask() {
    const taskText = taskInput.value.trim();
    const hours = parseInt(hoursInput.value) || 0;
    const minutes = parseInt(minutesInput.value) || 0;
    const seconds = parseInt(secondsInput.value) || 0;
  
    // Validate input
    if (taskText === '' || (hours === 0 && minutes === 0 && seconds === 0)) {
      alert('Please enter a valid task and time!');
      return;
    }
  
    // Add the task to the array
    const task = {
      task: taskText,
      hours: hours,
      minutes: minutes,
      seconds: seconds,
      completed: false
    };
    tasks.push(task);
  
    // Save to localStorage
    saveTasks();
  
    // Clear input fields
    taskInput.value = '';
    hoursInput.value = '';
    minutesInput.value = '';
    secondsInput.value = '';
  
    // Update the task list
    displayTasks();
  }
  
  // Add an in-built task
  function addInbuiltTask() {
    const selectedIndex = inbuiltTaskSelect.value;
  
    // Validate selection
    if (selectedIndex === '') {
      alert('Please select a task!');
      return;
    }
  
    // Add the selected in-built task to the array
    const selectedTask = inbuiltTasks[selectedIndex];
    tasks.push({
      task: selectedTask.task,
      hours: selectedTask.hours,
      minutes: selectedTask.minutes,
      seconds: selectedTask.seconds,
      completed: false
    });
  
    // Save to localStorage
    saveTasks();
  
    // Reset the dropdown
    inbuiltTaskSelect.value = '';
  
    // Update the task list
    displayTasks();
  }
  
  // Display tasks
  function displayTasks() {
    taskList.innerHTML = ''; // Clear the current list
  
    tasks.forEach((task, index) => {
      if (!task.completed) {
        const li = document.createElement('li');
        li.innerHTML = `${task.task} (${task.hours}h ${task.minutes}m ${task.seconds}s) 
          <button onclick="startTimer(${index})">Start Timer</button>
          <button onclick="completeTask(${index})">Complete</button>`;
        taskList.appendChild(li);
      }
    });
  }
  
  // Draw the countdown circle
  function drawTimerCircle(progress) {
    // Clear the canvas
    ctx.clearRect(0, 0, timerCircle.width, timerCircle.height);
  
    // Draw the background circle (gray)
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.lineWidth = 10;
    ctx.strokeStyle = '#e9ecef';
    ctx.stroke();
  
    // Draw the progress circle (red)
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, -Math.PI / 2, (progress * 2 * Math.PI) - Math.PI / 2);
    ctx.strokeStyle = '#dc3545';
    ctx.stroke();
  }
  
  // Start the timer for a task
  function startTimer(index) {
    // Stop any existing timer
    if (timerInterval) {
      clearInterval(timerInterval);
      alarmSound.pause(); // Stop any playing alarm
      alarmSound.currentTime = 0; // Reset the audio
    }
  
    // Set the current task index
    currentTaskIndex = index;
    isTimerFinished = false;
  
    // Convert task time to seconds
    const task = tasks[index];
    timeLeft = (task.hours * 3600) + (task.minutes * 60) + task.seconds;
    totalTime = timeLeft; // Store the total time for progress calculation
  
    // Display the task name
    currentTask.textContent = `Task: ${task.task}`;
  
    // Reset the timer status and buttons
    timerStatus.textContent = 'Time Left:';
    stopTimerBtn.style.display = 'block';
    stopAlarmBtn.style.display = 'none';
  
    // Show the timer display
    timerDisplay.style.display = 'block';
  
    // Draw the initial countdown circle
    drawTimerCircle(1);
  
    // Start the countdown
    timerInterval = setInterval(() => {
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        timerInterval = null;
        timerStatus.textContent = "Time’s Up!";
        timer.textContent = '00:00:00';
        drawTimerCircle(0); // Circle fully depleted
        alarmSound.play(); // Play the alarm sound on loop
        isTimerFinished = true;
        stopTimerBtn.style.display = 'none'; // Hide Stop Timer button
        stopAlarmBtn.style.display = 'block'; // Show Stop Alarm button
        return;
      }
  
      // Calculate hours, minutes, and seconds
      const hours = Math.floor(timeLeft / 3600);
      const minutes = Math.floor((timeLeft % 3600) / 60);
      const seconds = timeLeft % 60;
      timer.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
      // Update the countdown circle
      const progress = timeLeft / totalTime;
      drawTimerCircle(progress);
  
      timeLeft--;
    }, 1000);
  }
  
  // Stop the timer (abort the task)
  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    alarmSound.pause(); // Stop the alarm sound if playing
    alarmSound.currentTime = 0; // Reset the audio
    timerDisplay.style.display = 'none';
    currentTaskIndex = null;
    isTimerFinished = false;
    timeLeft = 0;
    timer.textContent = '00:00:00';
    timerStatus.textContent = 'Time Left:';
    stopTimerBtn.style.display = 'block';
    stopAlarmBtn.style.display = 'none';
    drawTimerCircle(1); // Reset the circle
  }
  
  // Stop the alarm sound
  function stopAlarm() {
    alarmSound.pause(); // Stop the alarm sound
    alarmSound.currentTime = 0; // Reset the audio
    timerDisplay.style.display = 'none'; // Hide the timer display
    currentTaskIndex = null;
    isTimerFinished = false;
    stopTimerBtn.style.display = 'block';
    stopAlarmBtn.style.display = 'none';
    drawTimerCircle(1); // Reset the circle
  }
  
  // Complete a task
  function completeTask(index) {
    // Mark the task as completed
    tasks[index].completed = true;
  
    // Stop the timer or alarm if this task's timer is running
    if (currentTaskIndex === index) {
      if (isTimerFinished) {
        stopAlarm();
      } else {
        stopTimer();
      }
    }
  
    // Save to localStorage
    saveTasks();
  
    // Update the task list
    displayTasks();
  }
  
  // Event listeners
  addTaskBtn.addEventListener('click', addTask);
  addInbuiltTaskBtn.addEventListener('click', addInbuiltTask);
  stopTimerBtn.addEventListener('click', stopTimer);
  stopAlarmBtn.addEventListener('click', stopAlarm);
  
  // Initialize the app
  populateInbuiltTasks();
  displayTasks();