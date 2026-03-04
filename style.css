:root {
    --bg-color: #0a192f;
    --blueprint-blue: #112240;
    --line-color: rgba(100, 255, 218, 0.2);
    --accent-color: #64ffda;
    --light-on: #fbff00;
    --text-main: #ccd6f6;
}

body {
    background-color: var(--bg-color);
    color: var(--text-main);
    font-family: 'Courier New', Courier, monospace;
    margin: 0;
    display: flex;
    justify-content: center;
}

.app-container {
    width: 95%;
    max-width: 1200px;
    padding: 20px;
}

header { border-bottom: 2px solid var(--accent-color); margin-bottom: 20px; }
header h1 { margin: 0; color: var(--accent-color); letter-spacing: 3px; }

.main-layout {
    display: grid;
    grid-template-columns: 1fr 350px;
    gap: 20px;
}

/* Blueprint Style */
.blueprint-card {
    background-color: var(--blueprint-blue);
    height: 500px;
    position: relative;
    border: 3px solid #1d3557;
    overflow: hidden;
    display: flex;
}

.grid-overlay {
    position: absolute; width: 100%; height: 100%;
    background-image: linear-gradient(var(--line-color) 1px, transparent 1px),
                      linear-gradient(90deg, var(--line-color) 1px, transparent 1px);
    background-size: 30px 30px;
}

.room {
    position: relative; border: 2px solid var(--accent-color);
    margin: 40px; flex: 1; display: flex; 
    flex-direction: column; align-items: center; justify-content: center;
}

.room-label { position: absolute; top: 10px; left: 10px; font-size: 0.8rem; color: var(--accent-color); }

/* จุดไฟในแผนผัง */
.light-node {
    width: 20px; height: 20px; border-radius: 50%;
    background-color: #333; transition: 0.5s;
    box-shadow: inset 0 0 5px #000;
}

.light-node.on {
    background-color: var(--light-on);
    box-shadow: 0 0 25px var(--light-on), 0 0 50px var(--light-on);
}

/* Control Cards */
.card {
    background: #112240; padding: 15px; border-radius: 10px; margin-bottom: 15px;
    border-left: 4px solid var(--accent-color);
}

h3 { color: var(--accent-color); font-size: 1rem; margin-top: 0; }

.ctrl-row { display: flex; justify-content: space-between; margin: 10px 0; }

.btn-toggle {
    background: transparent; border: 1px solid var(--accent-color);
    color: var(--accent-color); padding: 5px 15px; cursor: pointer;
}

.btn-toggle.active { background: var(--accent-color); color: var(--bg-color); }

.history-card { max-height: 200px; overflow-y: auto; font-size: 0.75rem; }
#history-list { list-style: none; padding: 0; }
#history-list li { padding: 5px 0; border-bottom: 1px solid #1d3557; color: #8892b0; }

@media (max-width: 768px) {
    .main-layout { grid-template-columns: 1fr; }
}
