const btnChangeLanguage = document.querySelector('.btnChangeLanguage')
const inputMission = document.querySelector('.inputMission');
const inputDate = document.querySelector('.inputDate');
const btnAdd = document.querySelector('.btnAdd');
const containerButtons = document.querySelector('#containerButtons');
const btnSorting = document.querySelector('.btnSorting');
const btnFiltering = document.querySelector('.btnFiltering');
const btnEverything = document.querySelector('.btnEverything');
const btnCompleted = document.querySelector('.btnCompleted');
const btnActivity = document.querySelector('.btnActivity');
const containerTasks = document.querySelector('.containerTasks');

function setLanguage(langCode) {
    const isHebrew = langCode === 'he';
    btnSorting.textContent = isHebrew ? 'מיון' : 'Sorting';
    btnFiltering.textContent = isHebrew ? 'סינון' : 'Filtering';
    btnAdd.textContent = isHebrew ? 'הוספה' : 'Add';
    btnEverything.textContent = isHebrew ? 'הכל' : 'Everything';
    btnCompleted.textContent = isHebrew ? 'הושלם' : 'Completed';
    btnActivity.textContent = isHebrew ? 'פעיל' : 'Activity';
    btnChangeLanguage.textContent = isHebrew ? 'English' : 'עברית';
    inputMission.placeholder = isHebrew ? 'תיאור המשימה' : 'Write the mission';
    inputMission.style.direction = isHebrew ? 'rtl' : 'ltr';

    localStorage.setItem('language', langCode);
}

const initialLanguage = localStorage.getItem('language') || 'en';
setLanguage(initialLanguage);

btnChangeLanguage.addEventListener('click', () => {
    const currentLanguage = localStorage.getItem('language');
    const newLanguage = currentLanguage === 'he' ? 'en' : 'he';
    setLanguage(newLanguage);
});

function saveTasks(tasksArray) {
    const parsedValue = JSON.stringify(tasksArray)
    localStorage.setItem("tasks", parsedValue)
}

function getTasks() {
    const lsTaskValue = localStorage.getItem("tasks")
    if (!lsTaskValue) {
        return []
    } else {
        return JSON.parse(lsTaskValue)
    }
}

let tasks = getTasks()
let currentFilter = 'all'

function renderTasks() {
    containerTasks.innerHTML = ''
    let filteredTasks = filterTasks(tasks, currentFilter);
    filteredTasks.forEach(task => {
        let liElement = document.createElement('li')
        liElement.innerHTML = `
            <li>
                Mission: ${task.missionText}, Date: ${task.dueDate}
                <button class="btnC"></button>
                <button class="btnX"></button>
            </li>
        `
        if (task.completed) {
            liElement.style.textDecoration = 'line-through';
        }
        containerTasks.appendChild(liElement)
        liElement.addEventListener('click', (event) => {
            if (event.target.classList.contains('btnC')) {
                const clickedLi = event.target.parentElement;
                clickedLi.style.textDecoration = 'line-through';
                task.completed = true;
                saveTasks(tasks);
            } else if (event.target.classList.contains('btnX')) {
                const indexToDelete = tasks.findIndex(t => t.id === task.id);
                if (indexToDelete !== -1) {
                    tasks.splice(indexToDelete, 1);
                    saveTasks(tasks);
                    renderTasks();
                }
            }
        })
    });
};

function addTask() {
    let missionVal = inputMission.value
    let dateVal = inputDate.value
    let newTask = {
        id: Date.now().toString(),
        missionText: missionVal,
        dueDate: dateVal,
        completed: false
    }
    tasks.push(newTask)
    saveTasks(tasks)
    inputMission.value = ''
    inputMission.style.border = '1px solid black'
    inputDate.value = ''
    inputDate.style.border = '1px solid black'
    renderTasks()
};

btnAdd.addEventListener('click', () => {
    if (!inputMission.value && !inputDate.value) {
        inputMission.style.border = '3px solid red'
        inputDate.style.border = '3px solid red'
    } else if (!inputMission.value) {
        inputMission.style.border = '3px solid red'
        inputDate.style.border = '1px solid black'
    } else if (!inputDate.value) {
        inputDate.style.border = '3px solid red'
        inputMission.style.border = '1px solid black'
    } else {
        inputMission.style.border = '1px solid black'
        inputDate.style.border = '1px solid black'
        addTask()
    }
});

let isFiltering = false
btnFiltering.addEventListener('click', () => {
    if (isFiltering) {
        containerButtons.style.display = 'none'
        isFiltering = false
    } else {
        containerButtons.style.display = 'block'
        isFiltering = true
    }
});

function filterTasks(tasks, filter = "all") {
    let filtered;
    switch (filter) {
        case 'active':
            filtered = tasks.filter(task => !task.completed)
            break;
        case 'completed':
            filtered = tasks.filter(task => task.completed)
            break;
        default:
            filtered = tasks
    }
    return filtered;
}

function sortTasks(tasks) {
    tasks.sort((a, b) => {
        const dateA = new Date(a.dueDate);
        const dateB = new Date(b.dueDate);
        return dateA.getTime() - dateB.getTime(); // משווה את חותמות הזמן המילישניות
    });
    renderTasks();
};

function refreshPage() {
    location.reload();
}

btnEverything.addEventListener("click", () => {
    currentFilter = "all";
    renderTasks();
});

btnCompleted.addEventListener("click", () => {
    currentFilter = "completed";
    renderTasks();
});

btnActivity.addEventListener("click", () => {
    currentFilter = "active";
    renderTasks();
});

btnSorting.addEventListener('click', () => {
    sortTasks(tasks);
});

document.addEventListener('DOMContentLoaded', renderTasks);