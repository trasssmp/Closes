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

let currentStatus = { room1: false, room2: false };

// 1. ติดตามสถานะไฟและอัปเดต Blueprint
const roomIds = ['room1', 'room2'];
roomIds.forEach(room => {
    onValue(ref(db, `lights/${room}`), (snapshot) => {
        const isOn = snapshot.val();
        currentStatus[room] = isOn;
        
        // อัปเดตจุดไฟในแผนผัง
        const node = document.getElementById(`node-${room}`);
        const btn = document.getElementById(`btn-${room}`);
        
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

// 2. ฟังก์ชันเปิดปิด และบันทึกประวัติ (History)
window.toggleLight = function(room) {
    const newStatus = !currentStatus[room];
    set(ref(db, `lights/${room}`), newStatus);
    
    // บันทึกลง History ใน Firebase
    push(ref(db, 'history'), {
        room: room,
        status: newStatus ? "ON" : "OFF",
        timestamp: serverTimestamp()
    });
};

// 3. ดึงประวัติย้อนหลังมาแสดง
const historyRef = query(ref(db, 'history'), limitToLast(10));
onValue(historyRef, (snapshot) => {
    const list = document.getElementById('history-list');
    list.innerHTML = "";
    snapshot.forEach(child => {
        const data = child.val();
        const time = data.timestamp ? new Date(data.timestamp).toLocaleTimeString() : "...";
        const li = document.createElement('li');
        li.innerText = `[${time}] ${data.room.toUpperCase()}: ${data.status}`;
        list.prepend(li); // เอาอันล่าสุดขึ้นบน
    });
});

// 4. ระบบตั้งเวลา (Simple Timer)
window.setTimer = function() {
    const timeVal = document.getElementById('schedule-time').value;
    const room = document.getElementById('schedule-room').value;
    
    if(!timeVal) return alert("กรุณาเลือกเวลา");

    alert(`ตั้งเวลาให้ ${room} ทำงานตอน ${timeVal}`);

    // เช็คเวลาทุกๆ 1 นาที (Client-side Timer)
    setInterval(() => {
        const now = new Date();
        const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        
        if(currentTime === timeVal) {
            set(ref(db, `lights/${room}`), true); // สั่งเปิดไฟเมื่อถึงเวลา
        }
    }, 60000);
};
