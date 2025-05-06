/* Espera o carregamento da página antes de rodar o script */
document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("taskInput");

  const addTaskBtn = document.getElementById("btnADDtask");

  const taskList = document.getElementById("listTask");

  const emptyImg = document.querySelector(".listVazia");

  const list = document.querySelector(".containerList");

  /* Controle da exibição da imagem e o tamanho do layout */
  const toggleEmptyState = () => {
    emptyImg.style.display = taskList.children.length === 0 ? "block" : "none";
    list.style.width = taskList.children.length > 0 ? "100%" : "50%";
  };

  /* Cria uma nova tarefa e a adiciona na lista */
  const addTask = (event) => {
    event.preventDefault();

    const taskText = taskInput.value.trim();
    if (!taskText) {
      return;
    }

    const li = document.createElement("li");
    li.innerHTML = `
      <input type="checkbox" class="checkbox">
      <span>${taskText}</span>
      <div class="buttonAction">
        <button class="editItem"><i class="fa-solid fa-pen"></i></button>
        <button class="deletItem"><i class="fa-solid fa-trash"></i></button>
      </div>`;

    li.querySelector(".deletItem").addEventListener("click", () => {
      li.remove();
      toggleEmptyState();
    });

    taskList.appendChild(li);
    taskInput.value = "";
    toggleEmptyState();
  };

  /* Adiciona tarefa ao clicar no botão */
  addTaskBtn.addEventListener("click", addTask);

  /* Atalho para adicionar tarefa com a tecla Enter */
  taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      addTask(e);
    }
  });
});
