const form = document.getElementById("registrationForm");
const message = document.getElementById("message");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!name || !email || !password) {
    message.textContent = "All fields are required.";
    message.style.color = "red";
    return;
  }

  const userData = {
    name,
    email,
    password,
  };

  try {
    const response = await fetch("https://mockapi.io/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Something went wrong");
    }

    const data = await response.json();
    message.textContent = `Registered successfully as ${data.name}`;
    message.style.color = "green";
    form.reset();
  } catch (error) {
    message.textContent = `Error: ${error.message}`;
    message.style.color = "red";
  }
});
