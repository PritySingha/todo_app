const form = document.getElementById("todo-form");
const titleInput = document.getElementById("title");
const descInput = document.getElementById("description");
const pendingList = document.getElementById("pending-tasks");
const completedList = document.getElementById("completed-tasks");

// Load tasks on page load
document.addEventListener("DOMContentLoaded", loadTasks);

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = titleInput.value.trim();
  const description = descInput.value.trim();

  if (title === "" || description === "") return;

  const task = {
    title,
    description,
    createdAt: new Date().toISOString(),
    completedAt: null,
    status: "pending"
  };

  addTaskToDOM(task);
  saveTask(task);

  form.reset();
});

function formatDate(date) {
  return new Date(date).toLocaleString();
}

function addTaskToDOM(task) {
  const li = document.createElement("li");

  li.innerHTML = `
    <div class="task-top">
      <div>
        <strong>${task.title}</strong><br>
        <small>${task.description}</small>
      </div>
      <div class="task-buttons">
        ${task.status === "pending" ? '<button class="complete-btn">✔</button>' : ""}
        <button class="delete-btn">✖</button>
      </div>
    </div>
    <div class="timestamp">
      ${task.status === "pending" ? "Created: " + formatDate(task.createdAt) 
      : "Completed: " + formatDate(task.completedAt)}
    </div>
  `;

  // Complete button
  if (task.status === "pending") {
    li.querySelector(".complete-btn").addEventListener("click", () => {
      task.completedAt = new Date().toISOString();
      task.status = "completed";
      updateTask(task);
      li.remove();
      addTaskToDOM(task);
    });
  }

  // Delete button
  li.querySelector(".delete-btn").addEventListener("click", () => {
    deleteTask(task);
    li.remove();
  });

  if (task.status === "pending") {
    pendingList.appendChild(li);
  } else {
    completedList.appendChild(li);
  }
}

// ---------- LocalStorage Functions ----------
function getTasks() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}

function saveTask(task) {
  const tasks = getTasks();
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateTask(updatedTask) {
  let tasks = getTasks();
  tasks = tasks.map(task => task.createdAt === updatedTask.createdAt ? updatedTask : task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function deleteTask(taskToDelete) {
  let tasks = getTasks();
  tasks = tasks.filter(task => task.createdAt !== taskToDelete.createdAt);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const tasks = getTasks();
  tasks.forEach(task => addTaskToDOM(task));
}
