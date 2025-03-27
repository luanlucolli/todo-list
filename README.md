# Noto-a

Aplicação web de gerenciamento de tarefas (To-Do List), com backend em PHP + MySQL e frontend responsivo em HTML, CSS e JavaScript. O sistema é entregue dockerizado, com foco em organização de código, desempenho e experiência do usuário.

---

## Tecnologias

- HTML5, CSS3 (Custom Properties)
- JavaScript (ES6+)
- Bootstrap 5.3
- Toastify.js
- PHP 8.1 (API RESTful)
- MySQL 5.7
- Apache + Docker + Docker Compose
- phpMyAdmin (opcional)

---

## Funcionalidades

- Criação, edição e exclusão de tarefas
- Marcar como concluída ou pendente
- Filtro por status (Todos, Pendentes, Concluídas)
- Pesquisa em tempo real por título
- Modais para criação/edição e confirmação de exclusão
- Validação de campos com feedback visual
- Toasts para ações (sucesso, erro)
- Interface responsiva com dark mode fixo

---

## Arquitetura

- API REST PHP desacoplada (`/api`)
- Frontend servido via Apache (`/`)
- Backend estruturado em rotas + controller
- Banco inicializado via script SQL (`init.sql`)
- Separação clara entre front e back (pasta `frontend/` e `backend/`)
- Ambientes configurados via Docker Compose

---

## Como executar

> Requisitos: Docker instalado e aberto

```bash
git clone https://github.com/luanlucolli/todo-list.git
cd todo-list
docker-compose up --build
e pronto, está rodando em http://localhost:8000
