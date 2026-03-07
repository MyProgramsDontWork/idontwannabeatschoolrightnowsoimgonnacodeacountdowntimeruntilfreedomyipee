  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyBwm7JqxPmvQxK86t2XkCBcN6bUtPiztC4",
    authDomain: "pfs-auth-e869e.firebaseapp.com",
    projectId: "pfs-auth-e869e",
    storageBucket: "pfs-auth-e869e.firebasestorage.app",
    messagingSenderId: "971332774317",
    appId: "1:971332774317:web:8bd311895cabe45c42d924"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const auth = getAuth();
createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed up 
    const user = userCredential.user;
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ..
  });

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

const excuses = [
  "Google Assignments wouldn’t attach my Doc even though it was in Drive.",
  "Schoology kept loading but never actually opened the assignment.",
  "I clicked submit in Google Assignments, but it didn’t show as turned in on Schoology.",
  "The Google Assignment page froze right when I hit turn in.",
  "Schoology logged me out while I was attaching the file.",
  "My Doc said it saved, but the latest edits weren’t there.",
  "The assignment wouldn’t load inside Schoology, just a blank screen.",
  "My Chromebook updated right when I opened it.",
  "Google Assignments kept saying loading and never finished.",
  "I attached the Doc, but it didn’t sync in time.",
  "The submission went through on Google’s side but not Schoology’s.",
  "My Chromebook battery dropped way faster than expected.",
  "The Wi-Fi disconnected right when I hit submit.",
  "Schoology gave me an error when I tried to turn it in.",
  "The Doc wouldn’t convert properly during submission.",
  "The page refreshed and cleared my attachment.",
  "It showed as attached, but after I submitted it disappeared.",
  "Schoology timed out before it finished uploading.",
  "I couldn’t reopen the assignment after attaching the file.",
  "The submit button wasn’t responding for some reason.",
  "Google Drive was slow syncing my changes.",
  "The version history didn’t save my last edits.",
  "Schoology was really slow because everyone was submitting at once.",
  "The Wi-Fi was connected but nothing school-related would load.",
  "The assignment tab just kept spinning.",
  "My Chromebook froze and I had to restart it.",
  "It said it submitted, but it still shows as missing.",
  "The attachment didn’t preview, so I wasn’t sure it went through.",
  "I accidentally closed the tab mid-upload.",
  "The deadline passed while it was still processing.",
  "I finished it but left it in my other binder.",
  "I put it in the wrong folder and didn’t realize.",
  "I left it on the kitchen table.",
  "It’s in my backpack, just not this backpack.",
  "I printed it but forgot to grab it from the printer.",
  "I had it in my notebook but took the wrong notebook.",
  "I stapled it into the wrong packet.",
  "I thought it was in my folder, but it wasn’t.",
  "I brought the draft instead of the final copy.",
  "I left it in my locker.",
  "I finished it late and forgot to put it in my bag.",
  "I put it somewhere safe and now I can’t find it.",
  "I accidentally turned in the wrong paper.",
  "I had it clipped inside another assignment.",
  "I printed the wrong version.",
  "I thought I already turned it in.",
  "It fell out of my folder at some point.",
  "I grabbed yesterday’s work instead.",
  "I wrote it but didn’t rewrite it neatly.",
  "I brought it, but it’s in my other class folder.",
  "I finished it digitally but didn’t realize we needed a printed copy.",
  "I printed it, but the printer cut off the last page.",
  "I uploaded it but forgot to bring the hard copy.",
  "I wrote it on paper first and ran out of time to type it.",
  "I typed it but didn’t realize it had to be handwritten.",
  "The Doc was finished, but I forgot to submit it through Schoology.",
  "I printed the outline instead of the final version.",
  "I attached the wrong file version.",
  "I had it done but forgot it needed to be uploaded separately.",
  "I thought attaching it in Drive was enough.",
  "Schoology and Google Assignments were not cooperating.",
  "My Chromebook chose the worst possible time to freeze.",
  "The submit button and I had a misunderstanding.",
  "It looked submitted but apparently wasn’t.",
  "The Wi-Fi decided to be unpredictable.",
  "I trusted autosave a little too much.",
  "The system said processing for a long time.",
  "My Doc was ready, but Schoology wasn’t.",
  "It worked yesterday but not today.",
  "The portal was moving slower than usual.",
  "I misread the due date.",
  "I thought it was due at the end of the day.",
  "I misunderstood the submission instructions.",
  "I didn’t realize it locked at the bell.",
  "I thought attaching the Doc was enough without hitting submit.",
  "I didn’t notice it hadn’t fully turned in.",
  "I ran out of time double-checking it.",
  "I got stuck on one part and didn’t finish.",
  "I underestimated how long it would take.",
  "I thought it was due next class.",
  "It’s in my locker and I didn’t have time to grab it.",
  "I left it in my math folder by accident.",
  "I printed it but didn’t staple it and forgot it.",
  "I had it in my bag last night.",
  "I grabbed the wrong stack of papers.",
  "I thought I packed it.",
  "It’s in the wrong section of my binder.",
  "I put it somewhere flat so it wouldn’t wrinkle.",
  "I finished it but forgot to sign it.",
  "I accidentally brought home the graded one instead.",
  "Google Assignments froze right when I submitted.",
  "Schoology wouldn’t recognize my attachment.",
  "The page refreshed and removed the file.",
  "My Chromebook restarted mid-upload.",
  "The Wi-Fi disconnected at 99 percent.",
  "I hit submit, but it didn’t register.",
  "I thought it uploaded, but it didn’t save.",
  "The printer ran out of ink halfway through.",
  "I accidentally submitted a blank version.",
  "Schoology and I were not aligned today."
];