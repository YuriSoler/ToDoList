document.addEventListener("DOMContentLoaded", () => {
  // Seleciona os elementos do formulário
  const form = document.getElementById("taskForm");
  const taskTitleInput = document.getElementById("taskTitle");
  const taskDescriptionInput = document.getElementById("taskDescription");
  const taskPriorityInput = document.getElementById("taskPriority");
  const taskDueDateInput = document.getElementById("taskDueDate");
  const submitButton = document.getElementById("btnAddTask");

  // Seleciona os elementos da lista
  const listTask = document.getElementById("listTask");
  const emptyListImage = document.querySelector(".listVazia");
  
  const API_URL = "http://localhost:3000/tasks";

  // Variáveis para controlar o estado de edição
  let isEditing = false;
  let currentTaskId = null;

  const fetchAndRenderTasks = async () => {
    try {
      const response = await fetch(API_URL);
      const tasks = await response.json();
      listTask.innerHTML = "";

      emptyListImage.style.display = tasks.length === 0 ? "block" : "none";

      tasks.forEach(task => {
        const li = document.createElement("li");
        li.dataset.id = task._id;

        const dataEntrega = new Date(task.data_entrega).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
        const dataCriacao = new Date(task.createdAt).toLocaleDateString('pt-BR', { timeZone: 'UTC' });

        li.innerHTML = `
          <div class="task-header">
            <div class="task-title-group">
              <input type="checkbox" class="status-checkbox" data-status="${task.status}" ${task.status === 'concluida' ? 'checked' : ''}>
              <span>${task.titulo}</span>
            </div>
            <div class="buttonAction">
              <button class="editItem"><img src="../frontend/assets/img/editIcon.png" alt="Editar"></button>
              <button class="deletItem"><img src="../frontend/assets/img/trashIcon.png" alt="Excluir"></button>
            </div>
          </div>
          ${task.descricao ? `<p class="task-description">${task.descricao}</p>` : ''}
          <div class="task-footer">
            <div class="task-meta">
              <span class="status-tag" data-status="${task.status}">${task.status.replace('_', ' ')}</span>
              <span class="priority-tag" data-priority="${task.prioridade}">${task.prioridade}</span>
            </div>
            <span class="due-date">Entrega: ${dataEntrega}</span>
          </div>
        `;
        listTask.appendChild(li);
      });
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
    }
  };

  // Função para resetar o formulário para o estado inicial
  const resetForm = () => {
    isEditing = false;
    currentTaskId = null;
    form.reset();
    submitButton.innerHTML = `<img src="../frontend/assets/img/plusIcon.png" alt="Adicionar Tarefa"> <span>Adicionar Tarefa</span>`;
  };

  // Evento de submit do formulário (agora lida com CRIAR e ATUALIZAR)
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    
    const taskData = {
      titulo: taskTitleInput.value.trim(),
      descricao: taskDescriptionInput.value.trim(),
      prioridade: taskPriorityInput.value,
      data_entrega: taskDueDateInput.value,
    };

    if (!taskData.titulo || !taskData.data_entrega) {
      alert("Por favor, preencha o título e a data de entrega.");
      return;
    }

    if (isEditing) {
      // Lógica para ATUALIZAR uma tarefa
      await fetch(`${API_URL}/${currentTaskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });
    } else {
      // Lógica para CRIAR uma nova tarefa
      taskData.status = 'pendente';
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });
    }

    resetForm();
    fetchAndRenderTasks();
  });

  // Evento de clique na lista de tarefas
  listTask.addEventListener("click", async (event) => {
    const li = event.target.closest("li");
    if (!li) return;
    const taskId = li.dataset.id;

    // DELETAR
    if (event.target.closest(".deletItem")) {
      await fetch(`${API_URL}/${taskId}`, { method: "DELETE" });
      fetchAndRenderTasks();
    }

    // EDITAR
    if (event.target.closest(".editItem")) {
      const response = await fetch(`${API_URL}/${taskId}`);
      const task = await response.json();
      
      taskTitleInput.value = task.titulo;
      taskDescriptionInput.value = task.descricao || '';
      taskPriorityInput.value = task.prioridade;
      // Formata a data para o formato YYYY-MM-DD 
      taskDueDateInput.value = new Date(task.data_entrega).toISOString().split('T')[0];
      
      isEditing = true;
      currentTaskId = taskId;
      submitButton.innerHTML = `<span>Salvar Alterações</span>`;
      window.scrollTo(0, 0); // Rola a página para o topo para ver o formulário
    }

    // Ação de MUDAR STATUS (checkbox)
    if (event.target.classList.contains("status-checkbox")) {
      const currentStatus = event.target.dataset.status;
      const newStatus = currentStatus !== 'concluida' ? 'concluida' : 'pendente';
      
      await fetch(`${API_URL}/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchAndRenderTasks();
    }
  });

  fetchAndRenderTasks();
});
