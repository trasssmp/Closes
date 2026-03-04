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

const devices = [
    { id: 'light1', name: 'LIVING' }, { id: 'light2', name: 'KITCHEN' },
    { id: 'light3', name: 'HALLWAY' }, { id: 'light4', name: 'BED 01' },
    { id: 'light5', name: 'BED 02' }, { id: 'light6', name: 'BATH' },
    { id: 'light7', name: 'BALCONY 1' }, { id: 'light8', name: 'BALCONY 2' }
];

let deviceStatus = {};

const btnGrid = document.getElementById('btn-grid');
const selectRoom = document.getElementById('select-room');

// สร้างปุ่มและตัวเลือก
devices.forEach(dev => {
    btnGrid.innerHTML += `
        <button class="ctrl-btn" id="btn-${dev.id}" onclick="toggleLight('${dev.id}')">
            ${dev.name}<br><span id="txt-${dev.id}">OFFLINE</span>
        </button>
    `;
    selectRoom.innerHTML += `<option value="${dev.id}">${dev.name}</option>`;

    // รับค่าจาก Firebase
    onValue(ref(db, `building/lights/${dev.id}`), (snap) => {
        const isOn = snap.val() || false;
        deviceStatus[dev.id] = isOn;
        
        const node = document.getElementById(`node-${dev.id}`);
        const btn = document.getElementById(`btn-${dev.id}`);
        const txt = document.getElementById(`txt-${dev.id}`);

        if(isOn) {
            node?.classList.add('on');
            btn?.classList.add('active');
            if(txt) txt.innerText = "● ON";
        } else {
            node?.classList.remove('on');
            btn?.classList.remove('active');
            if(txt) txt.innerText = "○ OFF";
        }
    });
});

window.toggleLight = function(id) {
    const newState = !deviceStatus[id];
    set(ref(db, `building/lights/${id}`), newState);
    
    push(ref(db, 'building/logs'), {
        device: id,
        state: newState ? 'ON' : 'OFF',
        time: serverTimestamp()
    });
};

onValue(query(ref(db, 'building/logs'), limitToLast(10)), (snap) => {
    const list = document.getElementById('log-list');
    list.innerHTML = "";
    snap.forEach(child => {
        const log = child.val();
        const t = log.time ? new Date(log.time).toLocaleTimeString() : "";
        list.innerHTML = `<li>[${t}] ${log.device} -> ${log.state}</li>` + list.innerHTML;
    });
});

window.setTimer = function() {
    const time = document.getElementById('input-time').value;
    const id = selectRoom.value;
    if(!time) return alert("Select Time!");
    alert(`Timer set for ${id} at ${time}`);
    setInterval(() => {
        const now = new Date();
        if(`${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}` === time) {
            set(ref(db, `building/lights/${id}`), true);
        }
    }, 60000);
};
