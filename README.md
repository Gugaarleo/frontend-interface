## Frontend Interface

Aplicação frontend (React + Vite) com autenticação JWT e integração com o backend existente. Inclui telas de Cadastro, Login e uma área logada com CRUD de items, usando Fetch API, LocalStorage e toasts.

### Requisitos
- Node.js 18+ e npm
- Backend rodando e acessível (defina a URL na variável `VITE_API_URL`)

### Configuração
1) Copie o arquivo de ambiente e ajuste a URL do backend:

```
cp .env.example .env
```

Edite `.env` e configure, por exemplo:

```
VITE_API_URL=http://localhost:3000
```

2) Instale as dependências e rode em desenvolvimento:

```
npm install
npm run dev
```

O app abrirá em http://localhost:5173.

### Fluxo de uso
- Cadastro: preencha nome, e-mail e senha e envie (POST /register)
- Login: informe e-mail e senha (POST /login). O token JWT é salvo no LocalStorage.
- Dashboard (protegido): CRUD em `/items` usando o token (GET/POST/PUT/DELETE). Há botão de logout.

### Comportamento de autenticação
- Token é adicionado automaticamente no header Authorization (Bearer).
- Se o token expirar ou a API retornar 401, o app faz logout e redireciona para login com toast de aviso.
- O JWT é decodificado para ler `exp` e agendar auto-logout quando aplicável.

### Ajustes de integração
- Base URL: `VITE_API_URL`.
- Endpoints esperados:
	- `POST /register` { name, email, password }
	- `POST /login` { email, password } -> { token }
	- `GET /items` -> Array ou { items: [] }
	- `POST /items` { name, description? }
	- `PUT /items/:id` { name, description? }
	- `DELETE /items/:id`

Se seus campos diferirem, ajuste os componentes `ItemForm`, `ItemList` e a página `Dashboard`.

### Boas práticas implementadas
- Feedback visual (toasts) para sucesso/erro
- Loading ao buscar e enviar dados
- Tratamento consistente de erros da API
- Responsivo e simples de manter

### Teste de expiração do token
Para testar o redirecionamento por expiração, configure o backend para tokens com poucos segundos de validade. O app irá:
1) Agendar auto-logout baseado em `exp` do JWT;
2) Em requisições subsequentes com 401, forçar logout e redirecionar.

### Scripts úteis
- `npm run dev` — ambiente de desenvolvimento
- `npm run build` — build de produção
- `npm run preview` — preview do build
- `npm run lint` — análise estática

### Licença
Uso educacional.

# frontend-interface