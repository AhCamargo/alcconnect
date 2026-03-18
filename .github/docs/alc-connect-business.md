# ALC Connect — Contexto de Negócio

## O que é

Revenda de números virtuais (eSIM/VoIP) para desenvolvedores que precisam de números para testar automações (n8n, WhatsApp bots, secretárias virtuais, etc.).

## Problema que resolve

Devs enfrentam barreiras ao comprar eSIM/números virtuais:

- Exigem email corporativo
- Exigem CNPJ
- Exigem envio de documentos para validação
- Demora na aprovação

ALC Connect remove essa fricção: dev se cadastra e compra o número rápido.

## Público-alvo

- Desenvolvedores que usam n8n, Evolution API, WhatsApp automations
- Devs que querem testar bots/secretárias virtuais antes de vender para clientes
- Devs que não têm CNPJ ou email corporativo

## Modelo de negócio

- Revenda de números virtuais do fornecedor (amigo com MVNO)
- ALC Connect é revendedor, não operadora
- Integração com MVNO ainda não definida (pode ser API REST, CSV, DB, etc.)

## Hub de Pagamento

- **ASAAS** — aceita CPF (sem necessidade de CNPJ)
- CNPJ será criado quando o projeto tomar proporções maiores

## O que NÃO é (por enquanto)

- NÃO é uma Communication Platform tipo Twilio
- NÃO é CRM
- NÃO é Automation Engine
- Foco é simples: vender números virtuais para devs

## Background do fundador

- Ex-profissional de telecomunicações: Asterisk, PABX, central telefônica virtual, operadora VoIP
- Agora é desenvolvedor
- Conhece o mercado de telecom por dentro

## Origem da ideia

Tentou comprar eSIM na Salvy para testar secretária virtual no n8n + Evolution API (WhatsApp). Encontrou todas as barreiras acima. Percebeu que outros devs passam pela mesma dor.
