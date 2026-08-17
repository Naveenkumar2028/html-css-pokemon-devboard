/* =========================================================
   DEVBOARD JAVASCRIPT
   ========================================================= */


/* =========================================================
   CURRENT DATE
   ========================================================= */

function updateDate() {

    const dateElement =
        document.getElementById("currentDate");

    const now = new Date();

    const formattedDate =
        now.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric"
        });

    dateElement.textContent = formattedDate;
}


/* =========================================================
   LIVE CLOCK
   ========================================================= */

function updateClock() {

    const clock =
        document.getElementById("clock");

    const now = new Date();

    let hours = now.getHours();

    const minutes =
        String(now.getMinutes()).padStart(2, "0");

    const seconds =
        String(now.getSeconds()).padStart(2, "0");

    const period =
        hours >= 12 ? "PM" : "AM";

    hours = hours % 12;

    hours = hours || 12;

    clock.textContent =
        `${String(hours).padStart(2, "0")}:${minutes}:${seconds} ${period}`;
}


/* =========================================================
   FOOTER YEAR
   ========================================================= */

function updateYear() {

    document.getElementById("footerYear")
        .textContent = new Date().getFullYear();
}


/* =========================================================
   TASK SYSTEM
   ========================================================= */

const taskInput =
    document.getElementById("taskInput");

const addTaskButton =
    document.getElementById("addTask");

const taskList =
    document.getElementById("taskList");

const totalTasks =
    document.getElementById("totalTasks");

const completedTasks =
    document.getElementById("completedTasks");


let tasks =
    JSON.parse(localStorage.getItem("devboardTasks")) || [];


function saveTasks() {

    localStorage.setItem(
        "devboardTasks",
        JSON.stringify(tasks)
    );
}


function updateTaskStats() {

    totalTasks.textContent =
        tasks.length;

    completedTasks.textContent =
        tasks.filter(task => task.completed).length;
}


function renderTasks() {

    taskList.innerHTML = "";

    tasks.forEach((task, index) => {

        const taskElement =
            document.createElement("div");

        taskElement.className =
            "task" +
            (task.completed ? " completed" : "");

        taskElement.innerHTML = `

            <input
                type="checkbox"
                ${task.completed ? "checked" : ""}
                data-index="${index}"
            >

            <span>${escapeHTML(task.text)}</span>

            <button
                class="delete-task"
                data-delete="${index}"
                title="Delete task"
            >
                ×
            </button>
        `;

        taskList.appendChild(taskElement);
    });

    updateTaskStats();
}


function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


function addTask() {

    const text =
        taskInput.value.trim();

    if (!text) return;

    tasks.push({

        text: text,

        completed: false

    });

    saveTasks();

    renderTasks();

    taskInput.value = "";
}


addTaskButton.addEventListener(
    "click",
    addTask
);


taskInput.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            addTask();

        }

    }
);


taskList.addEventListener(
    "change",
    event => {

        if (
            event.target.matches(
                'input[type="checkbox"]'
            )
        ) {

            const index =
                Number(
                    event.target.dataset.index
                );

            tasks[index].completed =
                event.target.checked;

            saveTasks();

            renderTasks();
        }

    }
);


taskList.addEventListener(
    "click",
    event => {

        if (
            event.target.classList.contains(
                "delete-task"
            )
        ) {

            const index =
                Number(
                    event.target.dataset.delete
                );

            tasks.splice(index, 1);

            saveTasks();

            renderTasks();
        }

    }
);


/* =========================================================
   NOTES
   ========================================================= */

const notes =
    document.getElementById("notes");


notes.value =
    localStorage.getItem(
        "devboardNotes"
    ) || "";


notes.addEventListener(
    "input",
    () => {

        localStorage.setItem(
            "devboardNotes",
            notes.value
        );

    }
);


/* =========================================================
   HEATMAP
   ========================================================= */

function createHeatmap() {

    const heatmap =
        document.getElementById("heatmap");

    heatmap.innerHTML = "";

    for (
        let i = 0;
        i < 84;
        i++
    ) {

        const cell =
            document.createElement("div");

        cell.className =
            "heatmap-cell";

        const random =
            Math.random();

        if (random > .78) {

            cell.classList.add("level4");

        } else if (random > .58) {

            cell.classList.add("level3");

        } else if (random > .36) {

            cell.classList.add("level2");

        } else if (random > .18) {

            cell.classList.add("level1");

        }

        heatmap.appendChild(cell);
    }
}


/* =========================================================
   THEME
   ========================================================= */

const themeButton =
    document.getElementById("themeBtn");


const savedTheme =
    localStorage.getItem(
        "devboardTheme"
    );


if (savedTheme === "light") {

    document.body.classList.add("light");

    themeButton.textContent = "🌙";
}


themeButton.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "light"
        );

        const isLight =
            document.body.classList.contains(
                "light"
            );

        localStorage.setItem(
            "devboardTheme",
            isLight ? "light" : "dark"
        );

        themeButton.textContent =
            isLight ? "🌙" : "☀️";

    }
);


/* =========================================================
   SOUND BUTTON
   ========================================================= */

const muteButton =
    document.getElementById("muteBtn");

let muted =
    localStorage.getItem(
        "devboardMuted"
    ) === "true";


function updateMuteButton() {

    muteButton.textContent =
        muted ? "🔇" : "🔊";
}


muteButton.addEventListener(
    "click",
    () => {

        muted = !muted;

        localStorage.setItem(
            "devboardMuted",
            muted
        );

        updateMuteButton();

    }
);


/* =========================================================
   NAVIGATION VISUAL
   ========================================================= */

document
    .querySelectorAll(".nav-item")
    .forEach(item => {

        item.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(
                        ".nav-item"
                    )
                    .forEach(nav =>
                        nav.classList.remove(
                            "active"
                        )
                    );

                item.classList.add("active");

            }
        );

    });


/* =========================================================
   INITIALIZE
   ========================================================= */

updateDate();

updateClock();

updateYear();

renderTasks();

createHeatmap();

updateMuteButton();


/* Update clock every second */

setInterval(
    updateClock,
    1000
);


/* Update date every minute */

setInterval(
    updateDate,
    60000
);