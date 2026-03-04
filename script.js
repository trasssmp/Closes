import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, onValue, set, push, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

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

// รายชื่อหลอดไฟ 1-8
const lights = [1, 2, 3, 4, 5, 6, 7, 8];
const panel = document.getElementById('control-panel');

// 1. สร้างปุ่มกด 8 ชุด
lights.forEach(num => {
    panel.innerHTML += `
        <div class="control-item">
            <span>Light No. ${num}</span>
            <div class="btn-group">
                <button class="btn-on" onclick="updateLight(${num}, true)">ON</button>
                <button class="btn-off" onclick="updateLight(${num}, false)">OFF</button>
            </div>
        </div>
    `;

    // 2. ฟังสถานะจาก Firebase มาเปลี่ยนสีวงกลมในผัง
    onValue(ref(db, `lights/unit${num}`), (snapshot) => {
        const status = snapshot.val();
        const bulb = document.getElementById(`bulb-${num}`);
        if (status === true) {
            bulb.classList.add('on');
        } else {
            bulb.classList.remove('on');
        }
    });
});

// 3. ฟังก์ชันส่งค่าไป Firebase
window.updateLight = function(id, state) {
    set(ref(db, `lights/unit${id}`), state);
    
    // บันทึกประวัติ
    push(ref(db, 'logs'), {
        device: `Unit ${id}`,
        action: state ? 'OPENED' : 'CLOSED',
        time: serverTimestamp()
    });
};

// เช็คการเชื่อมต่อ
onValue(ref(db, '.info/connected'), (snap) => {
    document.getElementById('system-status').innerText = 
        snap.val() ? "🟢 System Connected" : "🔴 Disconnected";
});
