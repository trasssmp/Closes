import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, onValue, set, push, serverTimestamp, query, limitToLast } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDz-6cx4lpJQ5e1fE_bt-9HYZCFiDsZvZ4",
    authDomain: "closes-d02f9.firebaseapp.com",
    projectId: "closes-d02f9",
    storageBucket: "closes-d02f9.firebasestorage.app",
    messagingSenderId: "401930587949",
    appId: "1:401930587949:web:f47a3d468cd6a85c514da4",
    measurementId: "G-ZT05GCPYY4"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const lights = [
    { id: 'light1', name: 'LIVING' }, { id: 'light2', name: 'KITCHEN' },
    { id: 'light3', name: 'HALLWAY' }, { id: 'light4', name: 'BED 01' },
    { id: 'light5', name: 'BED 02' }, { id: 'light6', name: 'BATH' },
    { id: 'light7', name: 'BALCONY L' }, { id: 'light8', name: 'BALCONY R' }
];

let lightStates = {};

// สร้าง UI ปุ่มกดและตัวเลือกเวลา
const controlGrid = document.getElementById('control-grid');
const scheduleSelect = document.getElementById('schedule-room');

lights.forEach(light => {
    // สร้างปุ่ม Dashboard
    controlGrid.innerHTML += `
        <button class="ctrl-btn" id="btn-${light.id}" onclick="toggleLight('${light.id}')">
            <span class="name">${light.name}</span>
            <span class="status-text" id="status-${light.id}">OFFLINE</span>
        </button>
    `;
    scheduleSelect.innerHTML += `<option value="${light.id}">${light.name}</option>`;

    // ฟังค่าจาก Firebase
    onValue(ref(db, `building/lights/${light.id}`), (snap) => {
        const isOn = snap.val() || false;
        lightStates[light.id] = isOn;
        
        const node = document.getElementById(`node-${light.id}`);
        const btn = document.getElementById(`btn-${light.id}`);
        const statusText = document.getElementById(`status-${light.id}`);

        if (isOn) {
            node.classList.add('on');
            btn.classList.add('active');
            statusText.innerText = "● ACTIVE";
        } else {
            node.classList.remove('on');
            btn.classList.remove('active');
            statusText.innerText = "○ INACTIVE";
        }
    });
});

// ฟังก์ชันเปิด-ปิด
window.toggleLight = function(id) {
    const newState = !lightStates[id];
    set(ref(db, `building/lights/${id}`), newState);
    
    // บันทึกประวัติ
    push(ref(db, 'building/logs'), {
        room: id,
        state: newState ? 'OPEN' : 'CLOSE',
        time: serverTimestamp()
    });
};

// ดึงประวัติ 10 รายการล่าสุด
onValue(query(ref(db, 'building/logs'), limitToLast(10)), (snap) => {
    const list = document.getElementById('history-list');
    list.innerHTML = "";
    snap.forEach(child => {
        const log = child.val();
        const timeStr = log.time ? new Date(log.time).toLocaleTimeString() : "...";
        list.innerHTML = `<li>[${timeStr}] ${log.room.toUpperCase()} switched to ${log.state}</li>` + list.innerHTML;
    });
});

// ระบบตั้งเวลา
window.setTimer = function() {
    const time = document.getElementById('schedule-time').value;
    const room = scheduleSelect.value;
    if(!time) return alert("Please select time!");

    alert(`System: Timer set for ${room} at ${time}`);

    setInterval(() => {
        const now = new Date();
        const current = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
        if(current === time) set(ref(db, `building/lights/${room}`), true);
    }, 60000);
};
