const taskTitle = document.getElementById("taskTitle");
const taskDate = document.getElementById("taskDate");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const filterSelect = document.getElementById("filterSelect");
const searchInput = document.getElementById("searchInput");
const sortBtn = document.getElementById("sortBtn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let sortAsc = true;
addTaskBtn.addEventListener("click", () => {
  const title = taskTitle.value.trim();
  const dueDate = taskDate.value;
  if (!title || !dueDate) {
    alert("Please enter title and due date.");
    return;
  }

  const newTask = {
    id: Date.now(),
    title,
    dueDate,
    completed: false
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();
  taskTitle.value = "";
  taskDate.value = "";
});

function renderTasks() {
  taskList.innerHTML = "";
  const filter = filterSelect.value;
  const search = searchInput.value.toLowerCase();
                   [].fiter
  let filtered = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(search);
    if (filter === "completed") return t.completed && matchesSearch;
    if (filter === "pending") return !t.completed && matchesSearch;
    return matchesSearch;
  });

  filtered.forEach(task => {
    const li = document.createElement("li");
    li.className = `task ${task.completed ? "completed" : ""}`;
    
    li.innerHTML = `
      <div>
        <div class="title">${task.title}</div>
        <small>Due: ${task.dueDate}</small>
      </div>
      <div class="actions">
        <button class="toggle">COMPLETE</button>
        <button class="edit">EDIT</button>
        <button class="delete">DELETE</button>
      </div>
    `;

    li.querySelector(".toggle").addEventListener("click", () => toggleTask(task.id));
    li.querySelector(".edit").addEventListener("click", () => editTask(task.id));
    li.querySelector(".delete").addEventListener("click", () => deleteTask(task.id));

    taskList.appendChild(li);
  });
}


function toggleTask(id) {
  tasks = tasks.map(t => (t.id === id ? { ...t, completed: !t.completed } : t));
  saveTasks();
  renderTasks();
  
}


function editTask(id) {
  const task = tasks.find(t => t.id === id);
  const newTitle = prompt("Edit Title", task.title);
  const newDate = prompt("Edit Due Date (YYYY-MM-DD)", task.dueDate);
  if (newTitle && newDate) {
    task.title = newTitle.trim();
    task.dueDate = newDate;
    saveTasks();
    renderTasks();
  }
}

function deleteTask(id) {
  if (confirm("Delete this task?")) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
  }
}


function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

filterSelect.addEventListener("change", renderTasks);
searchInput.addEventListener("input", renderTasks);

sortBtn.addEventListener("click", () => {
  sortAsc = !sortAsc;
  tasks.sort((a, b) => {
    const dateA = new Date(a.dueDate);
    const dateB = new Date(b.dueDate);
    return sortAsc ? dateA - dateB : dateB - dateA;
  });
  renderTasks();
});

renderTasks();
