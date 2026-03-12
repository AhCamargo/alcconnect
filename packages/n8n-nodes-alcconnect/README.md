# n8n-nodes-alcconnect

Community node para o [n8n](https://n8n.io/) que permite integrar a plataforma **ALC Connect** — números virtuais, SMS, WhatsApp e automação de comunicação.

## Instalação

### Via n8n GUI

1. Vá em **Settings → Community Nodes**
2. Clique em **Install a community node**
3. Digite `n8n-nodes-alcconnect` e instale

### Via CLI

```bash
npm install n8n-nodes-alcconnect
```

## Configuração de Credenciais

1. No editor do n8n, abra qualquer node **ALC Connect**
2. Em **Credential**, clique em **Create New**
3. Preencha:
   - **API Key** — Token JWT ou API Key gerada no painel do ALC Connect
   - **Base URL** — URL da API (padrão: `https://api.alcconnect.com.br`)

## Nodes disponíveis

### ALC Connect (Actions)

| Resource | Operation         | Descrição                                |
| -------- | ----------------- | ---------------------------------------- |
| Message  | **Send SMS**      | Envia um SMS para um número de telefone  |
| Message  | **Send WhatsApp** | Envia uma mensagem WhatsApp              |
| Number   | **Create Number** | Compra um novo número virtual por DDD    |
| Number   | **List Numbers**  | Lista todos os números virtuais da conta |

### ALC Connect Trigger

Node de trigger que inicia um workflow quando um evento ocorre na plataforma.

| Evento              | Descrição                             |
| ------------------- | ------------------------------------- |
| `incoming_sms`      | SMS recebido em um número virtual     |
| `incoming_call`     | Chamada recebida em um número virtual |
| `incoming_whatsapp` | Mensagem WhatsApp recebida            |

Payload de exemplo recebido pelo trigger:

```json
{
  "event": "incoming_sms",
  "number": "+551199999999",
  "from": "+551188888888",
  "message": "Olá",
  "timestamp": "2026-03-11T10:00:00"
}
```

## Exemplo de Workflow

**Resposta automática com IA via WhatsApp:**

```
┌─────────────────────────┐
│  ALC Connect Trigger    │
│  (incoming_sms)         │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  OpenAI Node            │
│  (gerar resposta)       │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  ALC Connect            │
│  Send WhatsApp          │
│  (resposta automática)  │
└─────────────────────────┘
```

### Passo a passo

1. **ALC Connect Trigger** — Selecione o evento `incoming_sms`
2. **OpenAI** — Use a mensagem recebida (`{{ $json.message }}`) como prompt
3. **ALC Connect → Send WhatsApp** — Envie a resposta gerada para `{{ $json.from }}`

## Desenvolvimento

```bash
# Instalar dependências
npm install

# Build
npm run build

# Watch mode
npm run dev
```

### Testar localmente no n8n

```bash
# Linkar o pacote
cd packages/n8n-nodes-alcconnect
npm link

# No diretório do n8n
cd ~/.n8n
npm link n8n-nodes-alcconnect

# Reiniciar n8n
```

## Compatibilidade

- n8n v1.0+
- Node.js 18+

## Licença

MIT
