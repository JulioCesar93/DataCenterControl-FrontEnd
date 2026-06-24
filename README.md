# DCIM Frontend — Data Center Infrastructure Management

Interface moderna para gerenciamento de data centers, construída com React + Material UI.

## 🚀 Início Rápido

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env.local
# Edite .env.local e defina a URL do seu back-end Spring Boot

# 3. Iniciar em modo desenvolvimento
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

**Credenciais de teste:**
- Email: `admin@dcim.com`
- Senha: `admin123`

---

## 📁 Estrutura do Projeto

```
src/
├── api/           # Axios + endpoints (clientesAPI, equipamentosAPI…)
├── components/
│   ├── common/    # PageHeader, StatusChip, ProtectedRoute
│   └── layout/    # Sidebar retrátil
├── contexts/      # AuthContext (login/logout, JWT, mock)
├── pages/         # Dashboard, Clientes, Equipamentos, Localizações, Tickets, Usuários
├── theme/         # MUI dark theme + rackColors
└── utils/         # mockData.js (substitua pelas chamadas reais)
```

---

## 🔌 Integrando com o Back-End Spring Boot

### 1. Desative o mock e ative a API real

Em `src/contexts/AuthContext.jsx`, descomente o bloco de API real e comente o mock:

```js
// ✅ Produção
const { data } = await authAPI.login({ email, password })
const userData = { ...data.user, token: data.token }

// ❌ Remover o mock abaixo
```

### 2. Endpoints esperados

| Recurso       | Método | Path                          |
|---------------|--------|-------------------------------|
| Login         | POST   | `/api/auth/login`             |
| Clientes      | GET    | `/api/clientes`               |
| Clientes      | POST   | `/api/clientes`               |
| Clientes      | PUT    | `/api/clientes/{id}`          |
| Clientes      | DELETE | `/api/clientes/{id}`          |
| Equipamentos  | GET    | `/api/equipamentos`           |
| Equipamentos  | POST   | `/api/equipamentos`           |
| Localizações  | GET    | `/api/localizacoes`           |
| Localizações  | GET    | `/api/localizacoes/rack/{id}` |
| Tickets       | GET    | `/api/tickets`                |
| Tickets       | POST   | `/api/tickets`                |
| Dashboard     | GET    | `/api/dashboard/resumo`       |

### 3. CORS no Spring Boot

```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return registry -> registry.addMapping("/api/**")
            .allowedOrigins("http://localhost:3000")
            .allowedMethods("GET","POST","PUT","DELETE")
            .allowedHeaders("*")
            .allowCredentials(true);
    }
}
```

### 4. JWT — Resposta esperada do login

```json
{
  "token": "eyJhbGci...",
  "user": {
    "id": 1,
    "nome": "Admin DCIM",
    "email": "admin@dcim.com",
    "role": "ADMIN"
  }
}
```

O token é salvo em `localStorage` como `dcim_token` e enviado automaticamente como `Authorization: Bearer <token>` em todas as requisições.

---

## 🛠 Scripts

| Comando         | Descrição                          |
|-----------------|------------------------------------|
| `npm run dev`   | Inicia servidor de desenvolvimento |
| `npm run build` | Gera build de produção em `dist/`  |
| `npm run preview` | Pré-visualiza o build            |

---

## 🎨 Tecnologias

- **React 18** + Vite
- **Material UI 5** (dark theme customizado)
- **React Router 6**
- **Axios** (interceptors JWT)
- **Recharts** (gráficos)
- **Notistack** (notificações)

---
