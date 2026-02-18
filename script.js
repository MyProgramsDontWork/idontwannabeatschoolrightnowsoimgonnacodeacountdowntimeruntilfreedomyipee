const userAgent = navigator.userAgent
if (userAgent.includes('CrOS')) {
    console.log('Partial Auth Passed');
}
else {
    console.log('Partial Auth Failed');
    //window.location.href = 'https://pfscdplus.vercel.app';
}

// Cookie helpers for persistent settings
function setCookie(name, value, days = 365) {
    const d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = name + '=' + encodeURIComponent(value) + ';path=/;expires=' + d.toUTCString();
}
function getCookie(name) {
    const match = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
    return match ? decodeURIComponent(match.pop()) : null;
}

const hotkeyInput = document.getElementById('hotkeyInput');
if (hotkeyInput) {
    hotkeyInput.addEventListener('input', () => {
        scheduleSave();
    });
}

// Save-status element (may be null on non-settings pages)
const saveStatusEl = document.getElementById('saveStatus');
let saveTimer = null;
function showSaveStatus(state) {
    if (!saveStatusEl) return;
    saveStatusEl.dataset.state = state;
}

function scheduleSave(delay = 600) {
    showSaveStatus('pending');
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => saveSettings(), delay);
}

function saveSettings() {
    const grid = document.querySelector('.scheduleConfiguration');
    const rows = [];
    if (grid) {
        const children = Array.from(grid.children);
        for (let i = 0; i < children.length; i += 4) {
            rows.push({
                name: (children[i] && children[i].textContent.trim()) || '',
                start: (children[i+1] && children[i+1].textContent.trim()) || '',
                end: (children[i+3] && children[i+3].textContent.trim()) || ''
            });
        }
    }
    setCookie('schedule', JSON.stringify(rows));
    const hk = hotkeyInput ? hotkeyInput.textContent.trim() : '';
    setCookie('hotkey', hk);
    showSaveStatus('saved');
}

function loadSettings() {
    const scheduleCookie = getCookie('schedule');
    if (scheduleCookie) {
        try {
            const rows = JSON.parse(scheduleCookie);
            const grid = document.querySelector('.scheduleConfiguration');
            if (grid) {
                grid.innerHTML = '';
                rows.forEach(r => {
                    const name = document.createElement('strong'); name.textContent = r.name || 'Period'; name.contentEditable = true;
                        name.addEventListener('input', () => scheduleSave());
                    const start = document.createElement('p'); start.textContent = r.start || '0:00'; start.contentEditable = true; forceTimeFormat(start);
                        start.addEventListener('input', () => scheduleSave());
                    const dash = document.createElement('p'); dash.textContent = '-';
                    const end = document.createElement('p'); end.textContent = r.end || '0:00'; end.contentEditable = true; forceTimeFormat(end);
                        end.addEventListener('input', () => scheduleSave());
                    grid.appendChild(name); grid.appendChild(start); grid.appendChild(dash); grid.appendChild(end);
                });
            }
        } catch (e) {}
    }
    const hk = getCookie('hotkey');
    if (hk && hotkeyInput) hotkeyInput.textContent = hk;
    showSaveStatus('idle');
}

document.addEventListener('DOMContentLoaded', loadSettings);

document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.shiftKey && event.key === 'Y') {
        event.preventDefault();
        window.location.href = 'powerschool_launcher.html';
    }
    if (event.ctrlKey && event.shiftKey && event.key === 'X') {
        event.preventDefault();
        window.location.href = 'settings.html';
    }
    const hotkey = getCookie('hotkey');
    if (hotkey && event.ctrlKey && event.shiftKey && event.key.toUpperCase() === hotkey.toUpperCase()) {
        event.preventDefault();
        window.location.href = 'https://pfscdplus.vercel.app';
    }
});

function getEndOfClass() {
    let now = new Date();
    let day = now.getDay();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let endOfClass = new Date();

    if (day == 5) {
        endOfClass.setDate(now.getDate() + 3);
        endOfClass.setHours(9, 13, 0, 0);
    } else if (day == 6) {
        endOfClass.setDate(now.getDate() + 2);
        endOfClass.setHours(9, 13, 0, 0);
    } else if (hours < 9 || (hours === 9 && minutes < 13)) {
        endOfClass.setHours(9, 13, 0, 0);
    } else if (hours === 9 || (hours === 9 && minutes < 58)) {
        endOfClass.setHours(9, 58, 0, 0);
    } else if (hours === 9 || (hours === 10 && minutes < 43)) {
        endOfClass.setHours(10, 43, 0, 0);
    } else if (hours === 10 || (hours === 11 && minutes < 26)) {
        endOfClass.setHours(11, 26, 0, 0);
    } else if (hours === 11 || (hours === 12 && minutes < 11)) {
        endOfClass.setHours(12, 11, 0, 0);
    } else if (hours === 12 || (hours === 12 && minutes < 54)) {
        endOfClass.setHours(12, 54, 0, 0);
    } else if (hours === 12 || (hours === 13 && minutes < 39)) {
        endOfClass.setHours(13, 39, 0, 0);
    } else if (hours === 13 || (hours === 14 && minutes < 24)) {
        endOfClass.setHours(14, 24, 0, 0);
    } else if (hours === 14 || (hours === 15 && minutes < 9)) {
        endOfClass.setHours(15, 9, 0, 0);
    } else {
        endOfClass.setDate(now.getDate() + 1);
        endOfClass.setHours(9, 13, 0, 0);
    }

    return endOfClass;
}

function updateClassCountdown() {
    const timerEl = document.querySelector('.countdown .timerClass');
    const msEl = document.querySelector('.countdown .millisecondsClass');
    if (!timerEl || !msEl) return;

    let endOfClass = getEndOfClass();
    let now = new Date();
    let classTimeDiff = endOfClass - now;
    let daysDiff = Math.floor((classTimeDiff % (1000 * 60 * 60 * 24 * 7)) / (1000 * 60 * 60 * 24));
    let hoursDiff = Math.floor((classTimeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutesDiff = Math.floor((classTimeDiff % (1000 * 60 * 60)) / (1000 * 60));
    let secondsDiff = Math.floor((classTimeDiff % (1000 * 60)) / 1000);
    let millisecondsDiff = Math.floor(classTimeDiff % 1000);

    if (daysDiff == 0) {
        timerEl.innerHTML = `${String(hoursDiff).padStart(2, '0')}:${String(minutesDiff).padStart(2, '0')}:${String(secondsDiff).padStart(2, '0')}`;
    } else {
        timerEl.innerHTML = `${String(daysDiff)}d ${String(hoursDiff).padStart(2, '0')}:${String(minutesDiff).padStart(2, '0')}:${String(secondsDiff).padStart(2, '0')}`;
    }
    msEl.innerHTML = `${String(millisecondsDiff).padStart(3, '0')} ms`;
}

function getEndOfDay() {
    let now = new Date();
    let day = now.getDay();
    let endOfClass = new Date();

    if (day == 5) {
        endOfClass.setDate(now.getDate() + 3);
        endOfClass.setHours(15, 9, 0, 0);}
    else if (day == 6) {
        endOfClass.setDate(now.getDate() + 2);
        endOfClass.setHours(15, 9, 0, 0);} 
    else {
        endOfClass.setDate(now.getDate());
        endOfClass.setHours(15, 9, 0, 0);}

    return endOfClass;
}

function updateDayCountdown() {
    const timerEl = document.querySelector('.countdown .timerDay');
    const msEl = document.querySelector('.countdown .millisecondsDay');
    if (!timerEl || !msEl) return;

    let endOfDay = getEndOfDay();
    let now = new Date();
    let dayTimeDiff = endOfDay - now;
    let daysDiff = Math.floor((dayTimeDiff % (1000 * 60 * 60 * 24 * 7)) / (1000 * 60 * 60 * 24));
    let hoursDiff = Math.floor((dayTimeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutesDiff = Math.floor((dayTimeDiff % (1000 * 60 * 60)) / (1000 * 60));
    let secondsDiff = Math.floor((dayTimeDiff % (1000 * 60)) / 1000);
    let millisecondsDiff = Math.floor(dayTimeDiff % 1000);

    if (daysDiff == 0) {
        timerEl.innerHTML = `${String(hoursDiff).padStart(2, '0')}:${String(minutesDiff).padStart(2, '0')}:${String(secondsDiff).padStart(2, '0')}`;
    } else {
        timerEl.innerHTML = `${String(daysDiff)}d ${String(hoursDiff).padStart(2, '0')}:${String(minutesDiff).padStart(2, '0')}:${String(secondsDiff).padStart(2, '0')}`;
    }
    msEl.innerHTML = `${String(millisecondsDiff).padStart(3, '0')} ms`;
}

function forceTimeFormat(element, defaultValue = '0:00') {
    element.addEventListener('blur', () => {
        const timeRegex = /^([0-9]{1,2}):([0-9]{2})$/;
        if (!timeRegex.test(element.textContent.trim())) {
            element.textContent = defaultValue;
        }
    }); 
}

function rowCount() {
    const grid = document.querySelector('.scheduleConfiguration');
    return grid ? Math.floor(grid.children.length / 4) : 0;
}

function addRow() {
    const grid = document.querySelector('.scheduleConfiguration');
    if (!grid) return;
    if (rowCount() >= 12) {
        const btn = document.getElementById('addRowBtn');
        if (btn) {
            btn.style.backgroundColor = '#ef476f';
            btn.style.color = '#ffffff';
            btn.textContent = 'Max 12 Periods';
        }
        return;
    }

    const name = document.createElement('strong');
    name.textContent = 'New Class';
    name.contentEditable = true;
        name.addEventListener('input', () => scheduleSave());

    const startTime = document.createElement('p');
    startTime.textContent = '0:00';
    startTime.contentEditable = true;
    forceTimeFormat(startTime);
        startTime.addEventListener('input', () => scheduleSave());

    const dash = document.createElement('p');
    dash.textContent = '-';

    const endTime = document.createElement('p');
    endTime.textContent = '0:00';
    endTime.contentEditable = true;
    forceTimeFormat(endTime);
        endTime.addEventListener('input', () => scheduleSave());

    grid.appendChild(name);
    grid.appendChild(startTime);
    grid.appendChild(dash);
    grid.appendChild(endTime);

    scheduleSave();
}

function removeRow() {
    const btn = document.getElementById('addRowBtn');
    if (btn) {
        btn.style.backgroundColor = '#ffffff';
        btn.style.color = '#000000';
        btn.textContent = 'Add Period';
    }
    const grid = document.querySelector('.scheduleConfiguration');
    if (!grid) return;
    if (rowCount() <= 1) return;
    for (let i = 0; i < 4; i++) grid.removeChild(grid.lastElementChild);
    scheduleSave();
}
