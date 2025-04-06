const API_URL = "https://mockapi.io/users"; // replace with real mock API if needed

const userList = document.getElementById("userList");
const userForm = document.getElementById("userForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const message = document.getElementById("message");

let users = [];

async function fetchUsers() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Failed to fetch users");
    users = await res.json();
    displayUsers(users);
  } catch (error) {
    message.textContent = `Error: ${error.message}`;
    message.style.color = "red";
  }
}

function displayUsers(users) {
  userList.innerHTML = "";
  users.forEach(user => {
    const div = document.createElement("div");
    div.className = "user-card";
    div.innerHTML = `<strong>${user.name}</strong><br>${user.email}`;
    userList.appendChild(div);
  });
}

userForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();

  if (!name || !email) {
    message.textContent = "Please fill all fields.";
    message.style.color = "red";
    return;
  }

  if (users.some(u => u.email === email)) {
    message.textContent = "Email already exists.";
    message.style.color = "red";
    return;
  }

  const newUser = { name, email };

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });

    if (!res.ok) throw new Error("Failed to add user");
    const createdUser = await res.json();
    users.push(createdUser);
    displayUsers(users);
    message.textContent = "User added successfully!";
    message.style.color = "green";
    userForm.reset();
  } catch (error) {
    message.textContent = `Error: ${error.message}`;
    message.style.color = "red";
  }
});

fetchUsers();
