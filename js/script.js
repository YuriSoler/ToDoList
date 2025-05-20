/* Espera o carregamento da página antes de rodar o script */
document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("taskInput");
  const addTaskBtn = document.getElementById("btnADDtask");
  const taskList = document.getElementById("listTask");
  const emptyImg = document.querySelector(".listVazia");
  const list = document.querySelector(".containerList");

  /* Controle da exibição da imagem (ListaVazia) e do layout */
  const toggleEmptyState = () => {
    emptyImg.style.display = taskList.children.length === 0 ? "block" : "none";
    list.style.width = taskList.children.length > 0 ? "100%" : "50%";
  };

  /* Cria uma nova tarefa e a adiciona na lista */
  const addTask = (text, completed = false) => {
    const taskText = text || taskInput.value.trim();
    if (!taskText) return;

    const li = document.createElement("li");
    li.innerHTML = `
      <input type="checkbox" class="checkbox" ${completed ? "checked" : ""}/>
      <span>${taskText}</span>
      <div class="buttonAction">
        <button class="editItem"><i class="fa-solid fa-pen"></i></button>
        <button class="deletItem"><i class="fa-solid fa-trash"></i></button>
      </div>`;

    const checkbox = li.querySelector(".checkbox");
    const editItem = li.querySelector(".editItem");

    if (completed) {
      li.classList.add("completo");
      editItem.disabled = true;
      editItem.style.opacity = "0.5";
      editItem.style.pointerEvents = "none";
    }

    checkbox.addEventListener("change", () => {
      const isChecked = checkbox.checked;
      li.classList.toggle("completo", isChecked);
      editItem.disabled = isChecked;
      editItem.style.opacity = isChecked ? "0.5" : "1";
      editItem.style.pointerEvents = isChecked ? "none" : "auto";
    });

    editItem.addEventListener("click", () => {
      if (!checkbox.checked) {
        taskInput.value = li.querySelector("span").textContent;
        li.remove();
        toggleEmptyState();
      }
    });

    li.querySelector(".deletItem").addEventListener("click", () => {
      li.remove();
      toggleEmptyState();
    });

    taskList.appendChild(li);
    taskInput.value = "";
    toggleEmptyState();
  };

  /* Adiciona tarefa ao clicar no botão ou pressionar a tecla Enter */
  addTaskBtn.addEventListener("click", (event) => {
    event.preventDefault(); // impede recarregamento se estiver em um <form>
    addTask();
  });

  taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTask();
    }
  });
});
