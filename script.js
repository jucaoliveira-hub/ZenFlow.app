let tasks = JSON.parse(localStorage.getItem('zenflow_tasks')) || [];
let timerInterval;
let timeLeft = 1500;

const quotes = [
    "Foque apenas no próximo passo.",
    "Feito é melhor que perfeito.",
    "Sua mente é para ter ideias, não para guardá-las.",
    "Respire. Uma coisa de cada vez.",
    "Seja gentil com seu cérebro hoje."
];

// Inicialização
window.onload = () => {
    document.getElementById('current-date').innerText = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'short' });
    document.getElementById('motivational-quote').innerText = quotes[Math.floor(Math.random() * quotes.length)];
    renderTasks();
};

function addTask() {
    const name = document.getElementById('task-name').value;
    if (!name) return alert("Dê um nome à tarefa!");

    const newTask = {
        id: Date.now(),
        name,
        desc: document.getElementById('task-desc').value,
        date: document.getElementById('task-date').value,
        category: document.getElementById('task-category').value,
        energy: document.getElementById('task-energy').value,
        status: 'todo'
    };

    tasks.push(newTask);
    saveAndRender();
    document.getElementById('task-name').value = '';
    document.getElementById('task-desc').value = '';
}

function moveTask(id, newStatus) {
    const doingCount = tasks.filter(t => t.status === 'doing').length;
    if (newStatus === 'doing' && doingCount >= 2) {
        alert("Cuidado! Mais de 2 tarefas em foco podem gerar ansiedade. Termine uma primeiro.");
        return;
    }

    const task = tasks.find(t => t.id === id);
    task.status = newStatus;
    saveAndRender();
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveAndRender();
}

function saveAndRender() {
    localStorage.setItem('zenflow_tasks', JSON.stringify(tasks));
    renderTasks();
}

function renderTasks(filter = 'Todas') {
    const lists = { todo: 'list-todo', doing: 'list-doing', done: 'list-done' };
    Object.values(lists).forEach(id => document.getElementById(id).innerHTML = '');

    let filtered = tasks;
    if (filter !== 'Todas') filtered = tasks.filter(t => t.category === filter);

    filtered.forEach(t => {
        const card = document.createElement('div');
        card.className = `task-card ${t.category.toLowerCase()} ${t.status === 'done' ? 'done' : ''}`;
        card.innerHTML = `
            <h4>${t.name}</h4>
            <p>${t.desc}</p>
            <small>${t.date ? new Date(t.date).toLocaleString('pt-BR') : ''}</small>
            <span class="energy-tag">${t.energy}</span>
            <div style="margin-top:10px">
                ${t.status !== 'done' ? `<button onclick="moveTask(${t.id}, '${t.status === 'todo' ? 'doing' : 'done'}')">➡️</button>` : ''}
                <button onclick="deleteTask(${t.id})">🗑️</button>
            </div>
        `;
        document.getElementById(lists[t.status]).appendChild(card);
    });

    updateCounters();
}

function updateCounters() {
    document.getElementById('count-todo').innerText = tasks.filter(t => t.status === 'todo').length;
    document.getElementById('count-doing').innerText = tasks.filter(t => t.status === 'doing').length;
    document.getElementById('count-done').innerText = tasks.filter(t => t.status === 'done').length;
}

// Pomodoro Logic
function startTimer() {
    if (timerInterval) return;
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            document.getElementById('beep-sound').play();
            alert("Tempo de foco atingido! Descanse um pouco.");
            resetTimer();
        }
    }, 1000);
}

function pauseTimer() { clearInterval(timerInterval); timerInterval = null; }
function resetTimer() { pauseTimer(); timeLeft = 1500; updateTimerDisplay(); }
function updateTimerDisplay() {
    const m = Math.floor(timeLeft / 60);
    const s = timeLeft % 60;
    document.getElementById('timer-display').innerText = `${m}:${s < 10 ? '0' : ''}${s}`;
}