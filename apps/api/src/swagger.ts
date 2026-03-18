import swaggerJsdoc from "swagger-jsdoc";

export const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "ALC Connect API",
    version: "1.0.0",
    description:
      "API para comunicação, automação e números virtuais. Plataforma multi-tenant, integração telecom, automação e marketing.",
  },
  servers: [
    { url: "http://localhost:3000", description: "Desenvolvimento" },
    { url: "https://api.alcconnect.com.br", description: "Produção" },
  ],
  tags: [
    { name: "Auth", description: "Autenticação e usuários" },
    {
      name: "PhoneNumbers",
      description: "Catálogo e gestão de números virtuais",
    },
    { name: "Numbers", description: "Gestão de números adquiridos" },
    { name: "Webhooks", description: "Integração e eventos" },
    { name: "Lead", description: "Leads e marketing" },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      RegisterRequest: {
        type: "object",
        properties: {
          name: { type: "string", example: "João Silva" },
          email: { type: "string", example: "joao@email.com" },
          password: { type: "string", example: "minhaSenha123" },
          document: { type: "string", example: "12345678901" },
          phone: { type: "string", example: "11999999999" },
          whatsapp: { type: "string", example: "11988888888" },
        },
        required: [
          "name",
          "email",
          "password",
          "document",
          "phone",
          "whatsapp",
        ],
      },
      LoginRequest: {
        type: "object",
        properties: {
          email: { type: "string", example: "joao@email.com" },
          password: { type: "string", example: "minhaSenha123" },
        },
        required: ["email", "password"],
      },
      LoginResponse: {
        type: "object",
        properties: {
          token: { type: "string", example: "jwt.token.aqui" },
          user: {
            $ref: "#/components/schemas/User",
          },
        },
      },
      User: {
        type: "object",
        properties: {
          id: { type: "string", example: "uuid" },
          name: { type: "string", example: "João Silva" },
          email: { type: "string", example: "joao@email.com" },
          document: { type: "string", example: "12345678901" },
          phone: { type: "string", example: "11999999999" },
          whatsapp: { type: "string", example: "11988888888" },
          role: { type: "string", example: "USER" },
        },
      },
      PhoneNumber: {
        type: "object",
        properties: {
          id: { type: "string", example: "uuid" },
          phoneNumber: { type: "string", example: "11999999999" },
          ddd: { type: "string", example: "11" },
          region: { type: "string", example: "São Paulo" },
          type: { type: "string", enum: ["ESIM", "VOIP", "WHATSAPP"] },
          status: {
            type: "string",
            enum: ["AVAILABLE", "RESERVED", "SOLD", "SUSPENDED"],
          },
          monthlyPrice: { type: "number", example: 29.9 },
          setupPrice: { type: "number", example: 10.0 },
          providerRef: { type: "string", example: "mvno-123" },
        },
      },
      PhoneNumberListResponse: {
        type: "object",
        properties: {
          numbers: {
            type: "array",
            items: { $ref: "#/components/schemas/PhoneNumber" },
          },
        },
      },
      CreatePhoneNumberRequest: {
        type: "object",
        properties: {
          phoneNumber: { type: "string", example: "11999999999" },
          ddd: { type: "string", example: "11" },
          region: { type: "string", example: "São Paulo" },
          type: { type: "string", enum: ["ESIM", "VOIP", "WHATSAPP"] },
          monthlyPrice: { type: "number", example: 29.9 },
          setupPrice: { type: "number", example: 10.0 },
          providerRef: { type: "string", example: "mvno-123" },
        },
        required: ["phoneNumber", "ddd", "type", "monthlyPrice"],
      },
      UpdatePhoneNumberRequest: {
        type: "object",
        properties: {
          phoneNumber: { type: "string", example: "11999999999" },
          ddd: { type: "string", example: "11" },
          region: { type: "string", example: "São Paulo" },
          type: { type: "string", enum: ["ESIM", "VOIP", "WHATSAPP"] },
          status: {
            type: "string",
            enum: ["AVAILABLE", "RESERVED", "SOLD", "SUSPENDED"],
          },
          monthlyPrice: { type: "number", example: 29.9 },
          setupPrice: { type: "number", example: 10.0 },
          providerRef: { type: "string", example: "mvno-123" },
        },
      },
      BuyNumberRequest: {
        type: "object",
        properties: {
          ddd: { type: "string", example: "11" },
        },
        required: ["ddd"],
      },
      Error: {
        type: "object",
        properties: {
          error: { type: "string", example: "Usuário não encontrado" },
        },
      },
      CreateWebhookRequest: {
        type: "object",
        properties: {
          url: { type: "string", example: "https://meusistema.com/webhook" },
          eventType: {
            type: "string",
            enum: ["incoming_call", "incoming_sms", "incoming_whatsapp"],
          },
        },
        required: ["url", "eventType"],
      },
      Webhook: {
        type: "object",
        properties: {
          id: { type: "string", example: "uuid" },
          url: { type: "string", example: "https://meusistema.com/webhook" },
          eventType: { type: "string", example: "incoming_sms" },
          userId: { type: "string", example: "uuid" },
          active: { type: "boolean", example: true },
        },
      },
      LeadRequest: {
        type: "object",
        properties: {
          nome: { type: "string", example: "Empresa XYZ" },
          email: { type: "string", example: "contato@empresa.com" },
          ddd: { type: "string", example: "11" },
          uso: {
            type: "string",
            enum: ["whatsapp", "automacao", "pabx", "testes"],
          },
        },
        required: ["nome", "email", "ddd", "uso"],
      },
    },
  },
  security: [{ BearerAuth: [] }],
  paths: {
    // AUTH
    "/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Registrar novo usuário",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RegisterRequest" },
            },
          },
        },
        responses: {
          201: {
            description: "Usuário registrado com sucesso",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/User" },
              },
            },
          },
          400: {
            description: "Erro de validação",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { error: "Nome completo é obrigatório" },
              },
            },
          },
          409: {
            description: "Usuário já existe",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { error: "Usuário já existe" },
              },
            },
          },
        },
      },
    },
    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login de usuário",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Login realizado com sucesso",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LoginResponse" },
                example: {
                  token: "jwt.token.aqui",
                  user: {
                    id: "uuid",
                    name: "João Silva",
                    email: "joao@email.com",
                  },
                },
              },
            },
          },
          400: {
            description: "Erro de validação",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { error: "Email inválido" },
              },
            },
          },
          401: {
            description: "Credenciais inválidas",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { error: "Usuário não encontrado" },
              },
            },
          },
        },
      },
    },
    "/auth/me": {
      get: {
        tags: ["Auth"],
        summary: "Dados do usuário logado",
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: "Dados do usuário",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/User" },
              },
            },
          },
          401: {
            description: "Token inválido",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { error: "Token inválido" },
              },
            },
          },
        },
      },
    },
    // PHONE NUMBERS
    "/api/phone-numbers": {
      get: {
        tags: ["PhoneNumbers"],
        summary: "Catálogo público de números virtuais",
        parameters: [
          {
            name: "ddd",
            in: "query",
            schema: { type: "string" },
            description: "DDD (opcional)",
          },
          {
            name: "type",
            in: "query",
            schema: { type: "string", enum: ["ESIM", "VOIP", "WHATSAPP"] },
            description: "Tipo (opcional)",
          },
          {
            name: "page",
            in: "query",
            schema: { type: "integer", default: 1 },
            description: "Página",
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", default: 20 },
            description: "Limite",
          },
        ],
        responses: {
          200: {
            description: "Lista de números disponíveis",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/PhoneNumberListResponse",
                },
              },
            },
          },
          400: {
            description: "Erro de validação",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { error: "DDD inválido" },
              },
            },
          },
        },
      },
    },
    "/api/phone-numbers/mine": {
      get: {
        tags: ["PhoneNumbers"],
        summary: "Meus números virtuais",
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: "Lista dos meus números",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/PhoneNumberListResponse",
                },
              },
            },
          },
          401: {
            description: "Token inválido",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { error: "Token inválido" },
              },
            },
          },
        },
      },
    },
    "/api/phone-numbers/:id": {
      get: {
        tags: ["PhoneNumbers"],
        summary: "Detalhe de número virtual",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "ID do número",
          },
        ],
        responses: {
          200: {
            description: "Dados do número",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/PhoneNumber" },
              },
            },
          },
          401: {
            description: "Token inválido",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { error: "Token inválido" },
              },
            },
          },
          404: {
            description: "Número não encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { error: "Número não encontrado" },
              },
            },
          },
        },
      },
      put: {
        tags: ["PhoneNumbers"],
        summary: "Editar número virtual",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdatePhoneNumberRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Número atualizado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/PhoneNumber" },
              },
            },
          },
          400: {
            description: "Erro de validação",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { error: "Status inválido" },
              },
            },
          },
          401: {
            description: "Token inválido",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { error: "Token inválido" },
              },
            },
          },
        },
      },
      delete: {
        tags: ["PhoneNumbers"],
        summary: "Remover número virtual",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "ID do número",
          },
        ],
        responses: {
          200: {
            description: "Número removido",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Número removido." },
                  },
                },
              },
            },
          },
          401: {
            description: "Token inválido",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { error: "Token inválido" },
              },
            },
          },
          404: {
            description: "Número não encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { error: "Número não encontrado" },
              },
            },
          },
        },
      },
    },
    "/api/phone-numbers/admin/all": {
      get: {
        tags: ["PhoneNumbers"],
        summary: "Todos os números (admin)",
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: "Lista de todos os números",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/PhoneNumberListResponse",
                },
              },
            },
          },
          401: {
            description: "Token inválido",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { error: "Token inválido" },
              },
            },
          },
          403: {
            description: "Permissão negada",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { error: "Permissão negada" },
              },
            },
          },
        },
      },
    },
    // NUMBERS
    "/numbers": {
      get: {
        tags: ["Numbers"],
        summary: "Lista de números adquiridos",
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: "Lista de números",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/PhoneNumberListResponse",
                },
              },
            },
          },
        },
      },
    },
    "/numbers/buy": {
      post: {
        tags: ["Numbers"],
        summary: "Comprar número virtual",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/BuyNumberRequest" },
            },
          },
        },
        responses: {
          201: {
            description: "Número comprado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/PhoneNumber" },
              },
            },
          },
          400: {
            description: "Erro de validação",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { error: "DDD inválido" },
              },
            },
          },
        },
      },
    },
    "/numbers/:id": {
      get: {
        tags: ["Numbers"],
        summary: "Detalhe de número adquirido",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "ID do número",
          },
        ],
        responses: {
          200: {
            description: "Dados do número",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/PhoneNumber" },
              },
            },
          },
          404: {
            description: "Número não encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { error: "Número não encontrado" },
              },
            },
          },
        },
      },
    },
    "/numbers/:id/events": {
      get: {
        tags: ["Numbers"],
        summary: "Eventos do número adquirido",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "ID do número",
          },
        ],
        responses: {
          200: {
            description: "Lista de eventos",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    events: { type: "array", items: { type: "object" } },
                  },
                },
              },
            },
          },
        },
      },
    },
    // WEBHOOKS
    "/webhooks": {
      get: {
        tags: ["Webhooks"],
        summary: "Lista de webhooks cadastrados",
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: "Lista de webhooks",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    webhooks: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Webhook" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Webhooks"],
        summary: "Criar webhook",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateWebhookRequest" },
            },
          },
        },
        responses: {
          201: {
            description: "Webhook criado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Webhook" },
              },
            },
          },
          400: {
            description: "Erro de validação",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { error: "URL inválida" },
              },
            },
          },
        },
      },
    },
    "/webhooks/:id": {
      delete: {
        tags: ["Webhooks"],
        summary: "Remover webhook",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "ID do webhook",
          },
        ],
        responses: {
          200: {
            description: "Webhook removido",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Webhook removido." },
                  },
                },
              },
            },
          },
          404: {
            description: "Webhook não encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { error: "Webhook não encontrado" },
              },
            },
          },
        },
      },
    },
    "/webhooks/events": {
      get: {
        tags: ["Webhooks"],
        summary: "Lista de eventos disponíveis",
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: "Lista de eventos",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    events: { type: "array", items: { type: "object" } },
                  },
                },
              },
            },
          },
        },
      },
    },
    // LEAD
    "/api/lead": {
      post: {
        tags: ["Lead"],
        summary: "Criar lead",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LeadRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Lead criado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { success: { type: "boolean", example: true } },
                },
              },
            },
          },
          400: {
            description: "Erro de validação",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { error: "Nome é obrigatório" },
              },
            },
          },
          500: {
            description: "Erro interno",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { error: "Erro ao processar solicitação." },
              },
            },
          },
        },
      },
    },
  },
};

// Os endpoints serão adicionados no próximo passo.
