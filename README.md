# Noto-a 🗒️

**Noto-a** é uma aplicação web de gerenciamento de tarefas (To-Do List) moderna, responsiva e minimalista, construída com foco em performance, UX e boas práticas de desenvolvimento front-end. Toda a interface é construída com **modo escuro absoluto**, inspirado em ambientes produtivos como Notion e interfaces iOS.

---

## Tecnologias Utilizadas

- **HTML5 Semântico**
- **CSS3 com Custom Properties (variáveis CSS)**
- **JavaScript Puro (ES6+)**
- **Bootstrap 5.3** (componentes, grid, modais)
- **Toastify.js** (feedback visual com toasts)
- **PHP (Back-end REST)**
- **MySQL (persistência de dados)**
- **Docker + docker-compose** para ambiente isolado e reprodutível

---

## Funcionalidades

- CRUD completo de tarefas
- Criação e edição via modal sobreposto
- Exclusão com modal de confirmação estilo iOS
- Pesquisa em tempo real por título
- Filtros por status: Todos, Pendentes, Concluídas
- Feedbacks com toasts para ações (validação, sucesso, erro)
- Armazenamento persistente com API REST em PHP + MySQL
- Interface 100% responsiva (desktop, tablets e mobile)

---

## Decisões de Arquitetura

### 1. **Separação por Responsabilidades**
- `index.html`: estrutura semântica e componentes Bootstrap.
- `style.css`: design system completo com dark mode fixo.
- `app.js`: controle de estado da UI, requisições, renderização e eventos.
- `routes.php` e `TaskController.php`: back-end RESTful simples e desacoplado.

### 2. **Estado Local Controlado (Frontend)**
- Tarefas são carregadas uma vez e mantidas em memória.
- Filtros e busca são aplicados no lado do cliente para ganho de performance.
- Evita chamadas desnecessárias à API.

### 3. **UX Prioritária**
- Feedback instantâneo ao digitar ou clicar.
- Validação visual clara com bordas vermelhas.
- Modal de confirmação elegante antes da exclusão.
- Toasts para interações bem resolvidas.

### 4. **Dark Mode Fixo**
- O design foi propositalmente feito apenas para o **modo escuro**, com um gradiente de fundo linear (`#1c1c1e → #19191b`), inputs escuros e tipografia clara, visando conforto visual e foco.

---

## Como Rodar o Projeto

### Requisitos:
- [Docker](https://www.docker.com/) instalado

### Etapas:

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/noto-a.git
cd noto-a

# Suba a aplicação
docker-compose up --build
