// URL da API backend
const API_URL = "http://localhost:8000/api";


// Variáveis de controle de edição
let isEditing = false;
let editingTaskId = null;

// Armazena todas as tarefas carregadas
let allTasks = [];

// Evento disparado ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
  loadTasks();

  // Escuta o campo de busca para filtrar a lista dinamicamente
  const searchInput = document.getElementById("search");
  searchInput.addEventListener("input", (e) => {
    const value = e.target.value.trim();
    filterTasksBySearch(value);
  });

  // Remove o estado de erro do campo de título ao digitar
  const titleInput = document.getElementById("modal-title-input");
  titleInput.addEventListener("input", () => titleInput.classList.remove("is-invalid"));
  titleInput.addEventListener("focus", () => titleInput.classList.remove("is-invalid"));
});

// Carrega as tarefas da API e aplica filtros se necessário
async function loadTasks(status = null, button = null) {
  const url = status !== null ? `${API_URL}/tasks?status=${status}` : `${API_URL}/tasks`;
  const res = await fetch(url);
  const tasks = await res.json();

  // Se nenhum resultado no filtro, volta para o filtro "Todos"
  if (status !== null && tasks.length === 0) {
    showToast("Nenhuma tarefa encontrada nesse filtro.", "error");
    document.querySelectorAll(".btn-filter").forEach(btn => btn.classList.remove("active"));
    document.querySelector(".btn-filter:first-child").classList.add("active");
    return loadTasks();
  }

  if (button) setActiveFilter(button);

  allTasks = tasks;
  renderTasks(allTasks);
}

// Filtra tarefas com base no título digitado
function filterTasksBySearch(term) {
  const filtered = allTasks.filter(task =>
    task.title.toLowerCase().includes(term.toLowerCase())
  );
  renderTasks(filtered);
}

// Define visualmente o botão de filtro ativo
function setActiveFilter(activeBtn) {
  document.querySelectorAll(".btn-filter").forEach(btn => btn.classList.remove("active"));
  activeBtn.classList.add("active");
}

// Renderiza a lista de tarefas no DOM
function renderTasks(tasks) {
  const list = document.getElementById("task-list");
  list.innerHTML = "";

  if (tasks.length === 0) {
    list.innerHTML = `
      <li style="background-color: #333; border: none; color: #ffffff !important; font-family: monospace, monospace;"
          class="list-group-item text-center text-muted placeholder-task">
          Nenhuma tarefa encontrada
      </li>`;
    return;
  }

  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = "task-card list-group-item mb-2 shadow-sm rounded";

    const date = new Date(task.created_at).toLocaleDateString("pt-BR", {
      day: "2-digit", month: "2-digit", year: "numeric"
    });

    li.innerHTML = `
      <div class="d-flex justify-content-between align-items-start">
        <div class="d-flex align-items-center gap-2">
          <input class="form-check-input mt-0" type="checkbox" ${task.status === 1 ? "checked" : ""} onchange="markDone(${task.id}, this.checked)">
          <strong class="fs-6 m-0">${task.title}</strong>
        </div>
        <div class="dropdown">
          <button class="btn btn-sm p-0 text-muted" data-bs-toggle="dropdown">
            <i class="bi bi-three-dots-vertical"></i>
          </button>
          <ul class="dropdown-menu dropdown-menu-dark dropdown-menu-end">
            <li><a class="dropdown-item" href="#" onclick="editTask(${task.id})">Editar</a></li>
            <li><a class="dropdown-item text-danger" href="#" onclick="deleteTask(${task.id})">Excluir</a></li>
          </ul>
        </div>
      </div>
      <p class="task-desc text-muted mb-1 mt-1">${task.description || "Sem descrição"}</p>
      <div class="d-flex justify-content-between">
        <small class="text-muted">${date}</small>
        <span class="badge ${task.status === 1 ? "bg-success" : "bg-warning text-dark"}">
          ${task.status === 1 ? "Concluído" : "Pendente"}
        </span>
      </div>
    `;

    list.appendChild(li);
  });
}

// Altera o status da tarefa (concluído ou pendente)
async function markDone(id, checked) {
  const newStatus = checked ? 1 : 0;
  await fetch(`${API_URL}/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: newStatus }),
  });
  loadTasks();
}

// Estado da tarefa a ser excluída
let taskToDelete = null;

// Exibe o modal de confirmação de exclusão
function deleteTask(id) {
  taskToDelete = id;
  const modal = new bootstrap.Modal(document.getElementById("confirmDeleteModal"));
  modal.show();
}

// Confirma a exclusão da tarefa
document.getElementById("confirm-delete-btn").addEventListener("click", async () => {
  if (!taskToDelete) return;

  await fetch(`${API_URL}/tasks/${taskToDelete}`, { method: "DELETE" });

  bootstrap.Modal.getInstance(document.getElementById("confirmDeleteModal")).hide();
  showToast("Tarefa excluída com sucesso!", "success");

  taskToDelete = null;
  loadTasks();
});

// Abre o modal para criar ou editar uma tarefa
function openModal(task = null) {
  const modal = document.getElementById("task-modal");
  const titleField = document.getElementById("modal-title-input");
  const descField = document.getElementById("modal-description-input");
  const modalTitle = document.getElementById("modal-title");

  titleField.classList.remove("is-invalid");
  modal.classList.remove("d-none");

  if (task) {
    modalTitle.textContent = "Editar Tarefa";
    titleField.value = task.title;
    descField.value = task.description || "";
    isEditing = true;
    editingTaskId = task.id;
  } else {
    modalTitle.textContent = "Nova Tarefa";
    titleField.value = "";
    descField.value = "";
    isEditing = false;
    editingTaskId = null;
  }
}

// Fecha o modal de tarefa
function closeModal() {
  document.getElementById("modal-title-input").classList.remove("is-invalid");
  document.getElementById("task-modal").classList.add("d-none");
}

// Submissão do formulário do modal (criação ou edição)
document.getElementById("modal-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("modal-title-input");
  const description = document.getElementById("modal-description-input");

  title.classList.remove("is-invalid");

  if (title.value.trim() === "") {
    title.classList.add("is-invalid");
    showToast("O título é obrigatório.");
    return;
  }

  const data = {
    title: title.value.trim(),
    description: description.value.trim()
  };

  const url = isEditing ? `${API_URL}/tasks/${editingTaskId}` : `${API_URL}/tasks`;
  const method = isEditing ? "PUT" : "POST";

  await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  closeModal();
  loadTasks();
});

// Exibe mensagens toast (sucesso ou erro)
function showToast(message, type = "error") {
  const color = type === "success" ? "#28a745" : "#dc3545";
  Toastify({
    text: message,
    duration: 3000,
    gravity: "top",
    position: "center",
    backgroundColor: color,
    stopOnFocus: true
  }).showToast();
}

// Busca uma tarefa pelo id e abre o modal de edição
function editTask(id) {
  loadTasks().then(async () => {
    const res = await fetch(`${API_URL}/tasks`);
    const tasks = await res.json();
    const taskData = tasks.find(t => t.id === id);
    if (taskData) openModal(taskData);
  });
}
