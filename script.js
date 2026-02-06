document.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.shiftKey && event.key === 'Y') {
        console.log('🎯 SHORTCUT DETECTED! Attempting redirect...');
        event.preventDefault();
        window.location.href = "powerschool_launcher.html";
    }
});

function getEndOfClass() {
    let now = new Date();
    let day = now.getDay();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let endOfClass = new Date();

    if (hours < 9 || (hours === 9 && minutes <= 13)) {
        endOfClass.setHours(9, 13, 0, 0);
    } else if (hours === 9 && minutes <= 58) {
        endOfClass.setHours(9, 58, 0, 0);
    } else if (hours < 10 || (hours === 10 && minutes <= 43)) {
        endOfClass.setHours(10, 43, 0, 0);
    } else if (hours < 11 || (hours === 11 && minutes <= 26)) {
        endOfClass.setHours(11, 26, 0, 0);
    } else if (hours < 12 || (hours === 12 && minutes <= 11)) {
        endOfClass.setHours(12, 11, 0, 0);
    } else if (hours < 12 || (hours === 12 && minutes <= 54)) {
        endOfClass.setHours(12, 54, 0, 0);
    } else if (hours < 13 || (hours === 13 && minutes <= 39)) {
        endOfClass.setHours(13, 39, 0, 0);
    } else if (hours < 14 || (hours === 14 && minutes <= 24)) {
        endOfClass.setHours(14, 24, 0, 0);
    } else if (hours < 15 || (hours === 15 && minutes <= 9)) {
        endOfClass.setHours(15, 9, 0, 0);
    } else if (day == 5) {
        endOfClass.setDate(now.getDate() + 3);
        endOfClass.setHours(9, 13, 0, 0);
    } else if (day == 6) {
        endOfClass.setDate(now.getDate() + 2);
        endOfClass.setHours(9, 13, 0, 0);
    } else {
        endOfClass.setDate(now.getDate() + 1);
        endOfClass.setHours(9, 13, 0, 0);
    }

    return endOfClass;
}

function updateClassCountdown() {
    let endOfClass = getEndOfClass();
    let now = new Date();
    let classTimeDiff = endOfClass - now;
    let daysDiff = Math.floor((classTimeDiff % (1000 * 60 * 60 * 24 * 7)) / (1000 * 60 * 60 * 24));
    let hoursDiff = Math.floor((classTimeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutesDiff = Math.floor((classTimeDiff % (1000 * 60 * 60)) / (1000 * 60));
    let secondsDiff = Math.floor((classTimeDiff % (1000 * 60)) / 1000);
    let milisecondsDiff = Math.floor(classTimeDiff % 1000);

    if (daysDiff == 0)
    document.querySelector('.countdown .timer').innerHTML = 
    `${String(hoursDiff).padStart(2, '0')}:${String(minutesDiff).padStart(2, '0')}:${String(secondsDiff).padStart(2, '0')}`;
    else
    document.querySelector('.countdown .timer').innerHTML = 
    `${String(daysDiff)}d ${String(hoursDiff).padStart(2, '0')}:${String(minutesDiff).padStart(2, '0')}:${String(secondsDiff).padStart(2, '0')}`;
    document.querySelector('.countdown .miliseconds').innerHTML = 
    `${String(milisecondsDiff).padStart(3, '0')} ms`;
}