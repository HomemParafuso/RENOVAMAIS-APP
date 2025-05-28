# Documentação da API

## Autenticação

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "string",
  "password": "string"
}
```

### Registro
```http
POST /auth/register
Content-Type: application/json

{
  "email": "string",
  "password": "string"
}
```

### Logout
```http
POST /auth/logout
```

## Faturas

### Listar Faturas
```http
GET /invoices
```

### Criar Fatura
```http
POST /invoices
Content-Type: application/json

{
  "number": "string",
  "amount": number,
  "due_date": "string (ISO date)"
}
```

### Atualizar Status da Fatura
```http
PATCH /invoices/:id/status
Content-Type: application/json

{
  "status": "pending" | "paid" | "overdue"
}
```

### Remover Fatura
```http
DELETE /invoices/:id
```

## Notificações

### Listar Notificações
```http
GET /notifications
```

### Marcar Notificação como Lida
```http
PATCH /notifications/:id/read
```

### Remover Notificação
```http
DELETE /notifications/:id
```

## Tabelas do Banco de Dados

### users
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | uuid | ID único do usuário |
| email | string | Email do usuário |
| role | enum | Papel do usuário (admin/user) |
| created_at | timestamp | Data de criação |

### invoices
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | uuid | ID único da fatura |
| number | string | Número da fatura |
| amount | decimal | Valor da fatura |
| due_date | date | Data de vencimento |
| status | enum | Status (pending/paid/overdue) |
| user_id | uuid | ID do usuário |
| created_at | timestamp | Data de criação |

### notifications
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | uuid | ID único da notificação |
| message | string | Mensagem da notificação |
| type | enum | Tipo (success/error) |
| read | boolean | Se foi lida |
| user_id | uuid | ID do usuário |
| created_at | timestamp | Data de criação |

## Políticas de Segurança

### users
- Apenas usuários autenticados podem ver seus próprios dados
- Apenas admins podem ver todos os usuários

### invoices
- Usuários podem ver e gerenciar suas próprias faturas
- Admins podem ver e gerenciar todas as faturas

### notifications
- Usuários podem ver e gerenciar suas próprias notificações
- Admins podem ver e gerenciar todas as notificações 