const API_URL = "https://mockapi.io/tasks"; // Replace with your working mock API endpoint

const taskList = document.getElementById("taskList");
const message = document.getElementById("message");

let tasks = [];
let currentTaskId = null;

// Fetch all tasks
async function fetchTasks() {
  try {
    const res = await fetch(API_URL);
    tasks = await res.json();
    displayTasks();
  } catch (error) {
    showMessage("Failed to fetch tasks", "red");
  }
}

function displayTasks() {
  taskList.innerHTML = "";
  tasks.forEach(task => {
    const taskDiv = document.createElement("div");
    taskDiv.className = "task";
    taskDiv.innerHTML = `
      <span>
        <strong>${task.title}</strong> - <em>${task.status}</em>
      </span>
      <span>
        <button class="edit" onclick="openModal('${task.id}')">Edit</button>
        <button class="delete" onclick="deleteTask('${task.id}')">Delete</button>
      </span>
    `;
    taskList.appendChild(taskDiv);
  });
}

// Delete task
async function deleteTask(id) {
  const confirmDelete = confirm("Are you sure you want to delete this task?");
  if (!confirmDelete) return;

  try {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Delete failed");
    tasks = tasks.filter(task => task.id !== id);
    displayTasks();
    showMessage("Task deleted successfully", "green");
  } catch (error) {
    showMessage("Error deleting task", "red");
  }
}

// Edit task
function openModal(id) {
  currentTaskId = id;
  const task = tasks.find(t => t.id === id);
  document.getElementById("editTitle").value = task.title;
  document.getElementById("editStatus").value = task.status;
  document.getElementById("editModal").style.display = "flex";
}

function closeModal() {
  document.getElementById("editModal").style.display = "none";
}

// Submit edit
async function submitEdit() {
  const title = document.getElementById("editTitle").value.trim();
  const status = document.getElementById("editStatus").value;

  if (!title) {
    showMessage("Title cannot be empty", "red");
    return;
  }

  try {
    const res = await fetch(`${API_URL}/${currentTaskId}`, {
      method: "PATCH", // You can also use PUT here
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, status }),
    });

    if (!res.ok) throw new Error("Update failed");

    const updatedTask = await res.json();
    const index = tasks.findIndex(t => t.id === currentTaskId);
    tasks[index] = updatedTask;
    displayTasks();
    showMessage("Task updated successfully", "green");
    closeModal();
  } catch (error) {
    showMessage("Failed to update task", "red");
  }
}

function showMessage(text, color) {
  message.textContent = text;
  message.style.color = color;
  setTimeout(() => message.textContent = "", 3000);
}

fetchTasks();
