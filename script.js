/* =========================================================
   DEVBOARD JAVASCRIPT
   ========================================================= */

/* =========================================================
   CURRENT DATE
   ========================================================= */
function updateDate() {
    const dateElement = document.getElementById("currentDate");
    if (!dateElement) return;

    const now = new Date();
    dateElement.textContent = now.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric"
    });
}

/* =========================================================
   LIVE CLOCK
   ========================================================= */
function updateClock() {
    const clock = document.getElementById("clock");
    if (!clock) return;

    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const period = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12;
    clock.textContent = `${String(hours).padStart(2, "0")}:${minutes}:${seconds} ${period}`;
}

/* =========================================================
   FOOTER YEAR
   ========================================================= */
function updateYear() {
    const footerYear = document.getElementById("footerYear");
    if (footerYear) footerYear.textContent = new Date().getFullYear();
}

/* =========================================================
   TASK SYSTEM
   ========================================================= */
const taskInput = document.getElementById("taskInput");
const addTaskButton = document.getElementById("addTask");
const taskList = document.getElementById("taskList");
const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");

let tasks = JSON.parse(localStorage.getItem("devboardTasks")) || [];

function saveTasks() {
    localStorage.setItem("devboardTasks", JSON.stringify(tasks));
}

function updateTaskStats() {
    if (totalTasks) totalTasks.textContent = tasks.length;
    if (completedTasks) {
        completedTasks.textContent = tasks.filter(task => task.completed).length;
    }
}

function renderTasks() {
    if (!taskList) return;

    taskList.innerHTML = "";

    tasks.forEach((task, index) => {
        const taskElement = document.createElement("div");
        taskElement.className = "task" + (task.completed ? " completed" : "");

        taskElement.innerHTML = `
            <input type="checkbox" ${task.completed ? "checked" : ""} data-index="${index}">
            <span>${escapeHTML(task.text)}</span>
            <button class="delete-task" data-delete="${index}" title="Delete task">×</button>
        `;

        taskList.appendChild(taskElement);
    });

    updateTaskStats();
}

function escapeHTML(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

function addTask() {
    if (!taskInput) return;

    const text = taskInput.value.trim();
    if (!text) return;

    tasks.push({ text, completed: false, createdAt: Date.now() });
    saveTasks();
    renderTasks();
    taskInput.value = "";
    showToast("Quest added! +10 XP ⚡");
}

if (addTaskButton) addTaskButton.addEventListener("click", addTask);
if (taskInput) {
    taskInput.addEventListener("keydown", event => {
        if (event.key === "Enter") addTask();
    });
}

if (taskList) {
    taskList.addEventListener("change", event => {
        if (!event.target.matches('input[type="checkbox"]')) return;

        const index = Number(event.target.dataset.index);
        if (!tasks[index]) return;

        tasks[index].completed = event.target.checked;
        saveTasks();
        renderTasks();
        showToast(event.target.checked ? "Quest completed! 🎉" : "Quest reopened.");
    });

    taskList.addEventListener("click", event => {
        if (!event.target.classList.contains("delete-task")) return;

        const index = Number(event.target.dataset.delete);
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
        showToast("Quest removed.");
    });
}

/* =========================================================
   NOTES
   ========================================================= */
const notes = document.getElementById("notes");
if (notes) {
    notes.value = localStorage.getItem("devboardNotes") || "";
    notes.addEventListener("input", () => {
        localStorage.setItem("devboardNotes", notes.value);
    });
}

/* =========================================================
   HEATMAP
   ========================================================= */
function createHeatmap() {
    const heatmap = document.getElementById("heatmap");
    if (!heatmap) return;

    heatmap.innerHTML = "";

    for (let i = 0; i < 84; i++) {
        const cell = document.createElement("div");
        cell.className = "heatmap-cell";
        const random = Math.random();

        if (random > .78) cell.classList.add("level4");
        else if (random > .58) cell.classList.add("level3");
        else if (random > .36) cell.classList.add("level2");
        else if (random > .18) cell.classList.add("level1");

        cell.title = `${Math.floor(random * 8)} coding activities`;
        heatmap.appendChild(cell);
    }
}

/* =========================================================
   THEME
   ========================================================= */
const themeButton = document.getElementById("themeBtn");
const savedTheme = localStorage.getItem("devboardTheme");

if (savedTheme === "light") {
    document.body.classList.add("light");
    if (themeButton) themeButton.textContent = "🌙";
}

if (themeButton) {
    themeButton.addEventListener("click", () => {
        document.body.classList.toggle("light");
        const isLight = document.body.classList.contains("light");
        localStorage.setItem("devboardTheme", isLight ? "light" : "dark");
        themeButton.textContent = isLight ? "🌙" : "☀️";
        showToast(isLight ? "Light mode enabled ☀️" : "Dark mode enabled 🌙");
    });
}

/* =========================================================
   SOUND BUTTON
   ========================================================= */
const muteButton = document.getElementById("muteBtn");
let muted = localStorage.getItem("devboardMuted") === "true";

function updateMuteButton() {
    if (muteButton) muteButton.textContent = muted ? "🔇" : "🔊";
}

if (muteButton) {
    muteButton.addEventListener("click", () => {
        muted = !muted;
        localStorage.setItem("devboardMuted", muted);
        updateMuteButton();
        showToast(muted ? "Sound muted 🔇" : "Sound enabled 🔊");
    });
}

/* =========================================================
   NAVIGATION — EVERY SIDEBAR ITEM NOW WORKS
   ========================================================= */
const navItems = document.querySelectorAll(".nav-item");

const navTargets = {
    "Dashboard": "dashboard",
    "Tasks": "tasks",
    "Notes": "notes-section",
    "Activity": "activity",
    "Projects": "projects"
};

function getPageTargets() {
    return {
        dashboard: document.querySelector(".hero"),
        tasks: document.querySelector(".tasks-card"),
        "notes-section": document.querySelector(".notes-card"),
        activity: document.querySelector(".activity-card"),
        projects: document.querySelector(".projects-card")
    };
}

function setActiveNav(item) {
    navItems.forEach(nav => nav.classList.remove("active"));
    if (item) item.classList.add("active");
}

function navigateTo(name, item) {
    setActiveNav(item);

    const targetId = navTargets[name];
    if (targetId) {
        const target = getPageTargets()[targetId];
        if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
            target.classList.add("section-focus");
            setTimeout(() => target.classList.remove("section-focus"), 900);
        }
        return;
    }

    if (name === "Achievements") {
        openPanel(
            "🏆 Achievements",
            `
                <div class="achievement-grid">
                    <div class="achievement"><b>⚡ First Quest</b><span>Add your first task</span></div>
                    <div class="achievement"><b>🎯 Quest Hunter</b><span>Complete 5 tasks</span></div>
                    <div class="achievement"><b>🔥 On Fire</b><span>Build a 7 day streak</span></div>
                    <div class="achievement"><b>💻 Code Trainer</b><span>Keep coding every day</span></div>
                </div>
            `
        );
        return;
    }

    if (name === "Settings") {
        openPanel(
            "⚙️ Settings",
            `
                <div class="settings-list">
                    <button data-setting="theme">🎨 Toggle Theme</button>
                    <button data-setting="sound">🔊 Toggle Sound</button>
                    <button data-setting="clearTasks">🗑️ Clear All Tasks</button>
                    <button data-setting="clearNotes">📝 Clear Notes</button>
                </div>
            `
        );
        return;
    }
}

navItems.forEach(item => {
    item.addEventListener("click", event => {
        event.preventDefault();
        const label = item.querySelector("b")?.textContent.trim();
        navigateTo(label, item);
    });
});

/* =========================================================
   ACHIEVEMENT / SETTINGS PANELS
   ========================================================= */
function openPanel(title, content) {
    let overlay = document.getElementById("devboardPanel");

    if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "devboardPanel";
        overlay.innerHTML = `
            <div class="panel-backdrop"></div>
            <div class="dashboard-panel" role="dialog" aria-modal="true">
                <button class="panel-close" aria-label="Close">×</button>
                <div class="panel-title"></div>
                <div class="panel-content"></div>
            </div>
        `;
        document.body.appendChild(overlay);

        overlay.querySelector(".panel-backdrop").addEventListener("click", closePanel);
        overlay.querySelector(".panel-close").addEventListener("click", closePanel);
    }

    overlay.querySelector(".panel-title").textContent = title;
    overlay.querySelector(".panel-content").innerHTML = content;
    overlay.classList.add("open");

    overlay.querySelectorAll("[data-setting]").forEach(button => {
        button.addEventListener("click", () => {
            const action = button.dataset.setting;

            if (action === "theme" && themeButton) themeButton.click();
            if (action === "sound" && muteButton) muteButton.click();

            if (action === "clearTasks") {
                if (confirm("Clear all tasks?")) {
                    tasks = [];
                    saveTasks();
                    renderTasks();
                    showToast("All tasks cleared.");
                }
            }

            if (action === "clearNotes" && notes) {
                notes.value = "";
                localStorage.removeItem("devboardNotes");
                showToast("Notes cleared.");
            }
        });
    });
}

function closePanel() {
    const overlay = document.getElementById("devboardPanel");
    if (overlay) overlay.classList.remove("open");
}

document.addEventListener("keydown", event => {
    if (event.key === "Escape") closePanel();
});

/* =========================================================
   PROJECT BUTTONS
   ========================================================= */
document.querySelectorAll(".project a").forEach(link => {
    link.addEventListener("click", event => {
        event.preventDefault();
        const project = link.closest(".project");
        const title = project?.querySelector("h3")?.textContent.trim() || "Project";
        const description = project?.querySelector("p")?.textContent.trim() || "";
        showToast(`${title}: ${description}`);
    });
});

/* =========================================================
   TOAST NOTIFICATIONS
   ========================================================= */
function showToast(message) {
    let toast = document.getElementById("devboardToast");

    if (!toast) {
        toast = document.createElement("div");
        toast.id = "devboardToast";
        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(window.devboardToastTimer);
    window.devboardToastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2600);
}

/* =========================================================
   DYNAMIC FUNCTIONALITY STYLES
   ========================================================= */
const functionalStyles = document.createElement("style");
functionalStyles.textContent = `
    html { scroll-behavior: smooth; }
    .section-focus { animation: devboardFocus .9s ease; }
    @keyframes devboardFocus {
        0% { box-shadow: 0 0 0 0 rgba(255,210,31,0); }
        35% { box-shadow: 0 0 0 4px rgba(255,210,31,.28), 0 0 28px rgba(255,210,31,.16); }
        100% { box-shadow: 0 0 0 0 rgba(255,210,31,0); }
    }
    #devboardToast {
        position: fixed;
        right: 24px;
        bottom: 24px;
        z-index: 9999;
        max-width: 380px;
        padding: 13px 17px;
        border: 1px solid #415a7d;
        border-radius: 12px;
        background: #07142a;
        color: #f5f7ff;
        box-shadow: 0 15px 45px rgba(0,0,0,.35);
        font-size: 13px;
        opacity: 0;
        transform: translateY(15px);
        pointer-events: none;
        transition: .25s ease;
    }
    #devboardToast.show { opacity: 1; transform: translateY(0); }
    #devboardPanel { position: fixed; inset: 0; z-index: 9998; display: none; }
    #devboardPanel.open { display: block; }
    .panel-backdrop { position: absolute; inset: 0; background: rgba(0,5,15,.72); backdrop-filter: blur(8px); }
    .dashboard-panel {
        position: relative;
        width: min(620px, calc(100% - 32px));
        max-height: calc(100vh - 80px);
        overflow: auto;
        margin: 40px auto;
        padding: 28px;
        border: 1px solid #304968;
        border-radius: 18px;
        background: linear-gradient(145deg,#0b1a32,#050f20);
        box-shadow: 0 30px 80px rgba(0,0,0,.5);
    }
    .panel-close {
        position: absolute; right: 15px; top: 12px;
        width: 38px; height: 38px; border: 1px solid #314967;
        border-radius: 10px; background: #07142a; color: #fff;
        font-size: 25px; cursor: pointer;
    }
    .panel-title { font-size: 25px; font-weight: 850; margin-bottom: 20px; }
    .achievement-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .achievement {
        display: flex; flex-direction: column; gap: 7px; padding: 17px;
        border: 1px solid #304968; border-radius: 13px; background: #08162b;
    }
    .achievement b { color: #ffd21f; }
    .achievement span { color: #91a5c3; font-size: 12px; }
    .settings-list { display: grid; gap: 10px; }
    .settings-list button {
        padding: 14px 16px; text-align: left; border: 1px solid #304968;
        border-radius: 11px; background: #08162b; color: #edf3ff; cursor: pointer;
    }
    .settings-list button:hover { border-color: #ffd21f; color: #ffd21f; }
    @media(max-width:600px) {
        .achievement-grid { grid-template-columns: 1fr; }
        #devboardToast { left: 15px; right: 15px; bottom: 15px; max-width: none; }
    }
`;
document.head.appendChild(functionalStyles);

/* =========================================================
   INITIALIZE
   ========================================================= */
updateDate();
updateClock();
updateYear();
renderTasks();
createHeatmap();
updateMuteButton();

setInterval(updateClock, 1000);
setInterval(updateDate, 60000);
