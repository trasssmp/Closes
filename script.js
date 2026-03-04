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

// รายชื่อไฟทั้งหมด
const lightDevices = [
    { id: 'light1', name: 'Living Room' },
    { id: 'light2', name: 'Kitchen' },
    { id: 'light3', name: 'Hallway' },
    { id: 'light4', name: 'Bedroom 01' },
    { id: 'light5', name: 'Bedroom 02' },
    { id: 'light6', name: 'Bathroom' },
    { id: 'light7', name: 'Balcony A' },
    { id: 'light8', name: 'Balcony B' }
];

const statusStore = {};

// สร้างปุ่มควบคุมและตัวเลือกตั้งเวลาอัตโนมัติ
const controlList = document.getElementById('control-list');
const scheduleSelect = document.getElementById('schedule-room');

lightDevices.forEach(dev => {
    // สร้างปุ่มในเมนู Control
    controlList.innerHTML += `
        <div class="ctrl-item">
            <span>${dev.name}</span>
            <button class="btn-toggle" id="btn-${dev.id}" onclick="toggleLight('${dev.id}')">OFF</button>
        </div>
    `;
    // เพิ่มตัวเลือกในเมนูตั้งเวลา
    scheduleSelect.innerHTML += `<option value="${dev.id}">${dev.name}</option>`;

    // เชื่อมต่อ Firebase Real-time
    onValue(ref(db, `building/lights/${dev.id}`), (snapshot) => {
        const isOn = snapshot.val() || false;
        statusStore[dev.id] = isOn;
        
        const node = document.getElementById(`node-${dev.id}`);
        const btn = document.getElementById(`btn-${dev.id}`);
        
        if(isOn) {
            node.classList.add('on');
            btn.classList.add('active');
            btn.innerText = "ON";
        } else {
            node.classList.remove('on');
            btn.classList.remove('active');
            btn.innerText = "OFF";
        }
    });
});

// ฟังก์ชันเปิดปิด
window.toggleLight = function(id) {
    const nextStatus = !statusStore[id];
    set(ref(db, `building/lights/${id}`), nextStatus);
    
    // บันทึก Log
    push(ref(db, 'building/logs'), {
        device: id,
        action: nextStatus ? "OPENED" : "CLOSED",
        time: serverTimestamp()
    });
};

// ดึง Log มาแสดง
onValue(query(ref(db, 'building/logs'), limitToLast(8)), (snapshot) => {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = "";
    snapshot.forEach(doc => {
        const log = doc.val();
        const date = log.time ? new Date(log.time).toLocaleTimeString() : "";
        historyList.innerHTML = `<li>[${date}] ${log.device}: ${log.action}</li>` + historyList.innerHTML;
    });
});

// ระบบตั้งเวลา
window.setTimer = function() {
    const time = document.getElementById('schedule-time').value;
    const devId = scheduleSelect.value;
    if(!time) return alert("Please select time");
    
    alert(`Timer Set: ${devId} at ${time}`);
    
    setInterval(() => {
        const now = new Date();
        const nowStr = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
        if(nowStr === time) set(ref(db, `building/lights/${devId}`), true);
    }, 60000);
};
