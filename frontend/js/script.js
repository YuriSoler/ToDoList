const form = document.querySelector(".inputArea");
const taskInput = document.querySelector("#taskInput");
const listTask = document.querySelector("#listTask");
const emptyListImage = document.querySelector(".listVazia");
const API_URL = "http://localhost:3000/tasks";

const fetchAndRenderTasks = async () => {
  try {
    const response = await fetch(API_URL);
    const tasks = await response.json();
    listTask.innerHTML = "";

    emptyListImage.style.display = tasks.length === 0 ? "block" : "none";

    tasks.forEach((task) => {
      const li = document.createElement("li");
      if (task.completed) li.classList.add("completo");
      li.dataset.id = task._id;
      
      // Formata a data para o padrão brasileiro (dd/mm/aaaa)
      const dataCriacao = new Date(task.createdAt).toLocaleString('pt-BR');

      li.innerHTML = `
        <input type="checkbox" class="checkbox" ${task.completed ? "checked" : ""}>
        <div class="task-content">
          <span>${task.text}</span>
          <span class="task-date">${dataCriacao}</span>
        </div>
        <div class="buttonAction">
          <button class="editItem"><img src="/frontend/assets/img/editIcon.png" alt="Editar"></button>
          <button class="deletItem"><img src="/frontend/assets/img/trashIcon.png" alt="Excluir"></button>
        </div>
      `;
      listTask.appendChild(li);
    });
  } catch (error) { console.error("Erro ao buscar tarefas:", error); }
};

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const taskText = taskInput.value.trim();
  if (taskText !== "") {
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: taskText, completed: false }),
    });
    fetchAndRenderTasks();
    taskInput.value = "";
    taskInput.focus();
  }
});

listTask.addEventListener("click", async (event) => {
  const item = event.target.closest("li");
  if (!item) return;
  const taskId = item.dataset.id;
  const action = event.target.closest("button")?.classList[0] || (event.target.classList.contains("checkbox") ? "checkbox" : null);

  let needsRender = true;
  switch (action) {
    case "deletItem":
      await fetch(`${API_URL}/${taskId}`, { method: "DELETE" });
      break;
    case "checkbox":
      const isCompleted = event.target.checked;
      await fetch(`${API_URL}/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: isCompleted }),
      });
      break;
    case "editItem":
      const newText = prompt("Edite sua tarefa:", item.querySelector("span").textContent);
      if (newText && newText.trim() !== "") {
        await fetch(`${API_URL}/${taskId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: newText.trim() }),
        });
      }
      break;
    default:
      needsRender = false;
  }
  if (needsRender) fetchAndRenderTasks();
});

document.addEventListener("DOMContentLoaded", fetchAndRenderTasks);