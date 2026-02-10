# Game Tracker - Zerados

Aplicação desktop para rastrear e organizar jogos que você já zerou. Construída com Electron + React + TypeScript, oferece uma interface compacta e visual no estilo widget para manter seu histórico de jogos completos.

## Preview

A interface exibe os jogos em um grid de duas colunas, com capa, nome, nota e data de conclusão. O tema é escuro com tons de cinza e destaques em dourado.

## Funcionalidades

- **Adicionar jogos** — nome, capa, nota e data de conclusão
- **Salvar lista** — persistência via localStorage
- **Modo excluir** — ativa botões de remoção nos cards
- **Grid compacto** — visualização em duas colunas com cards horizontais

## Tech Stack

| Camada      | Tecnologia              |
|-------------|-------------------------|
| Runtime     | Electron 40             |
| Frontend    | React 18 + TypeScript   |
| Bundler     | Vite 7                  |
| Estilização | Tailwind CSS 4          |
| Lint        | ESLint + TS parser      |
| Build       | electron-builder        |

## Estrutura do Projeto

```
src/
├── types/          # Interfaces de dados (Game)
├── services/       # Operações puras sobre dados (CRUD, localStorage)
├── hooks/          # Gerenciamento de state React (ponte service ↔ UI)
├── components/     # Componentes visuais (GameCard)
├── constant/       # Paleta de cores centralizada
├── App.tsx         # Componente raiz — orquestra hook + UI
├── main.tsx        # Entry point React + Electron bridge
└── index.css       # Tailwind + estilos base
```

**Fluxo de dados:**

```
App.tsx → useGameList() → GameService
  UI         state           dados puros
```

## Como Rodar

```bash
# Instalar dependências
npm install

# Modo desenvolvimento (Vite + Electron com HMR)
npm run dev

# Build para produção
npm run build
```

## Autor

Widget feito por **@Seth0s**.
