# Deploy no Coolify — Guia de Configuração

## Visão Geral

Cada serviço do ALC Connect é deployado **separadamente** no Coolify.
Isso permite deploy independente, acesso direto ao banco, e melhor visibilidade.

## Pré-requisitos

- Coolify v4 instalado no servidor (216.238.119.31)
- Cloudflare DNS configurado (A records apontando para o IP do servidor)
- Repositório GitHub conectado ao Coolify: `https://github.com/AhCamargo/alcconnect`

---

## 1. PostgreSQL (Database)

**Tipo no Coolify:** Resources > + New > **Database > PostgreSQL**

| Campo    | Valor               |
| -------- | ------------------- |
| Name     | `alcconnect-db`     |
| Version  | `16-alpine`         |
| Database | `alcconnect`        |
| User     | `alcconnect`        |
| Password | (gerar senha forte) |

Após criar, copie a **Internal URL** que o Coolify gera. Exemplo:

```
postgresql://alcconnect:SENHA@alcconnect-db-xxxx:5432/alcconnect
```

**Vantagens:**

- Acesso ao banco direto pelo painel do Coolify
- Backup automático
- Métricas de uso
- Pode conectar externamente habilitando "Publicly accessible"

---

## 2. API

**Tipo no Coolify:** Resources > + New > **Application > Public Repository** (ou Private via GitHub App)

| Campo               | Valor                                     |
| ------------------- | ----------------------------------------- |
| Repository          | `https://github.com/AhCamargo/alcconnect` |
| Branch              | `main`                                    |
| Build Pack          | **Dockerfile**                            |
| Base Directory      | `/apps/api`                               |
| Dockerfile Location | `/Dockerfile`                             |
| Domain              | `https://api.alcconnect.com.br`           |
| Port                | `3000`                                    |

**Variáveis de ambiente:**

```env
DATABASE_URL=postgresql://alcconnect:SENHA@alcconnect-db-xxxx:5432/alcconnect?schema=public
JWT_SECRET=TROCAR_POR_SEGREDO_FORTE
PORT=3000
CORS_ORIGINS=https://app.alcconnect.com.br,https://alcconnect.com.br,https://www.alcconnect.com.br
SMTP_HOST=smtp.resend.com
SMTP_PORT=465
SMTP_USER=resend
SMTP_PASS=re_xxxxxxxx
SMTP_FROM=contato@alcconnect.com.br
EMAIL_TO=contato@alcconnect.com.br
```

> **Importante:** O `DATABASE_URL` deve usar o hostname interno do PostgreSQL criado no Coolify (não `localhost`).

---

## 3. Dashboard

**Tipo no Coolify:** Resources > + New > **Application > Public Repository**

| Campo               | Valor                                     |
| ------------------- | ----------------------------------------- |
| Repository          | `https://github.com/AhCamargo/alcconnect` |
| Branch              | `main`                                    |
| Build Pack          | **Dockerfile**                            |
| Base Directory      | `/apps/dashboard`                         |
| Dockerfile Location | `/Dockerfile`                             |
| Domain              | `https://app.alcconnect.com.br`           |
| Port                | `80`                                      |

**Build Arguments (na aba Build):**

```
VITE_API_URL=https://api.alcconnect.com.br
```

---

## 4. Landing Page

**Tipo no Coolify:** Resources > + New > **Application > Public Repository**

| Campo               | Valor                                     |
| ------------------- | ----------------------------------------- |
| Repository          | `https://github.com/AhCamargo/alcconnect` |
| Branch              | `main`                                    |
| Build Pack          | **Dockerfile**                            |
| Base Directory      | `/apps/landing`                           |
| Dockerfile Location | `/Dockerfile`                             |
| Domain              | `https://alcconnect.com.br`               |
| Port                | `80`                                      |

Sem variáveis de ambiente necessárias.

---

## Cloudflare DNS

| Tipo  | Nome  | Conteúdo            | Proxy   |
| ----- | ----- | ------------------- | ------- |
| A     | `@`   | `216.238.119.31`    | Proxied |
| A     | `api` | `216.238.119.31`    | Proxied |
| A     | `app` | `216.238.119.31`    | Proxied |
| CNAME | `www` | `alcconnect.com.br` | Proxied |

**SSL/TLS:** Full (strict) no Cloudflare.

---

## Desenvolvimento Local

Para rodar localmente com Docker:

```bash
# Na raiz do projeto
docker compose -f docker-compose.dev.yml up --build
```

Isso sobe PostgreSQL + API. O Dashboard e Landing rodam via `pnpm dev` localmente.
