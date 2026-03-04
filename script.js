import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, onValue, set } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// ข้อมูลที่คุณให้มา
const firebaseConfig = {
    apiKey: "AIzaSyDz-6cx4lpJQ5e1fE_bt-9HYZCFiDsZvZ4",
    authDomain: "closes-d02f9.firebaseapp.com",
    projectId: "closes-d02f9",
    storageBucket: "closes-d02f9.firebasestorage.app",
    messagingSenderId: "401930587949",
    appId: "1:401930587949:web:f47a3d468cd6a85c514da4",
    measurementId: "G-ZT05GCPYY4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ฟังก์ชันดึงสถานะจาก Firebase
const rooms = ['room1', 'room2'];
let lightStatus = { room1: false, room2: false };

rooms.forEach(room => {
    const statusRef = ref(db, 'lights/' + room);
    onValue(statusRef, (snapshot) => {
        const val = snapshot.val();
        lightStatus[room] = val;
        updateUI(room, val);
    });
});

// อัปเดตหน้าตาเว็บตามสถานะจริง
function updateUI(room, isOn) {
    const btn = document.getElementById(`btn-${room}`);
    const indicator = document.getElementById(`${room}-indicator`);

    if (isOn) {
        btn.innerText = "ปิดไฟ";
        btn.style.backgroundColor = "#dc3545";
        indicator.classList.add('on');
    } else {
        btn.innerText = "เปิดไฟ";
        btn.style.backgroundColor = "#28a745";
        indicator.classList.remove('on');
    }
}

// ฟังก์ชันกดปุ่มเพื่อสลับค่า
window.toggleLight = function(room) {
    const newStatus = !lightStatus[room];
    set(ref(db, 'lights/' + room), newStatus);
};
