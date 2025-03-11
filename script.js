document.addEventListener('DOMContentLoaded', () => {
    // Timer variables
    let timer;
    let minutes = 25;
    let seconds = 0;
    let isRunning = false;
    let sessionsCompleted = 0;
    
    // Timer modes (in minutes)
    const modes = {
        pomodoro: 25,
        shortBreak: 5,
        longBreak: 15
    };
    
    // DOM elements
    const minutesDisplay = document.getElementById('minutes');
    const secondsDisplay = document.getElementById('seconds');
    const startBtn = document.getElementById('start');
    const pauseBtn = document.getElementById('pause');
    const resetBtn = document.getElementById('reset');
    const pomodoroBtn = document.getElementById('pomodoro');
    const shortBreakBtn = document.getElementById('short-break');
    const longBreakBtn = document.getElementById('long-break');
    const sessionsDisplay = document.getElementById('sessions');
    
    // Update timer display
    function updateDisplay() {
        minutesDisplay.textContent = minutes < 10 ? '0' + minutes : minutes;
        secondsDisplay.textContent = seconds < 10 ? '0' + seconds : seconds;
    }
    
    // Start timer
    function startTimer() {
        if (isRunning) return;
        
        isRunning = true;
        
        timer = setInterval(() => {
            if (seconds === 0) {
                if (minutes === 0) {
                    clearInterval(timer);
                    isRunning = false;
                    
                    // If Pomodoro session completed
                    if (pomodoroBtn.classList.contains('active')) {
                        sessionsCompleted++;
                        sessionsDisplay.textContent = sessionsCompleted;
                        
                        // Play notification sound
                        const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3');
                        audio.play();
                        
                        // Show browser notification if supported
                        if (Notification.permission === 'granted') {
                            new Notification('Pomodoro Timer', {
                                body: 'Time to take a break!',
                                icon: 'https://via.placeholder.com/64'
                            });
                        }
                    }
                    
                    return;
                }
                minutes--;
                seconds = 59;
            } else {
                seconds--;
            }
            
            updateDisplay();
        }, 1000);
    }
    
    // Pause timer
    function pauseTimer() {
        clearInterval(timer);
        isRunning = false;
    }
    
    // Reset timer
    function resetTimer() {
        pauseTimer();
        
        if (pomodoroBtn.classList.contains('active')) {
            minutes = modes.pomodoro;
        } else if (shortBreakBtn.classList.contains('active')) {
            minutes = modes.shortBreak;
        } else {
            minutes = modes.longBreak;
        }
        
        seconds = 0;
        updateDisplay();
    }
    
    // Switch timer mode
    function switchMode(mode) {
        pauseTimer();
        
        // Remove active class from all mode buttons
        pomodoroBtn.classList.remove('active');
        shortBreakBtn.classList.remove('active');
        longBreakBtn.classList.remove('active');
        
        // Add active class to selected mode button
        if (mode === 'pomodoro') {
            pomodoroBtn.classList.add('active');
            minutes = modes.pomodoro;
        } else if (mode === 'shortBreak') {
            shortBreakBtn.classList.add('active');
            minutes = modes.shortBreak;
        } else {
            longBreakBtn.classList.add('active');
            minutes = modes.longBreak;
        }
        
        seconds = 0;
        updateDisplay();
    }
    
    // Event listeners
    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);
    
    pomodoroBtn.addEventListener('click', () => switchMode('pomodoro'));
    shortBreakBtn.addEventListener('click', () => switchMode('shortBreak'));
    longBreakBtn.addEventListener('click', () => switchMode('longBreak'));
    
    // Request notification permission
    if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission();
    }
    
    // Initialize display
    updateDisplay();
});