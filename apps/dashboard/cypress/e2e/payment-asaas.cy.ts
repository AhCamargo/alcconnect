// payment-asaas.cy.ts
// Testes E2E para fluxo de pagamento, ativação de tenant e webhooks Asaas

describe("Pagamento e Ativação Tenant - Asaas", () => {
  const uniqueId = Date.now();
  const testUser = {
    name: "Teste Pagamento",
    email: `cypress-payment+${uniqueId}@teste.com`,
    password: "Senha@123",
  };

  let tenantId: string;
  let paymentId: string;

  before(() => {
    // Cria usuário e tenant
    cy.request({
      method: "POST",
      url: "/auth/register",
      body: {
        ...testUser,
        document: `${uniqueId}`.slice(0, 11).padEnd(11, "0"),
        phone: "11999990006",
        whatsapp: "11999990006",
      },
      failOnStatusCode: false,
    }).then((resp) => {
      tenantId = resp.body.tenantId;
    });
  });

  it("deve iniciar pagamento e receber webhook de confirmação", () => {
    // Simula início de pagamento
    cy.request({
      method: "POST",
      url: "/payments/init",
      body: {
        tenantId,
        plan: "basic",
      },
    }).then((resp) => {
      paymentId = resp.body.paymentId;
      expect(resp.status).to.eq(200);
      expect(resp.body.status).to.eq("PENDING");
    });

    // Simula webhook Asaas de pagamento confirmado
    cy.request({
      method: "POST",
      url: "/webhooks/asaas",
      body: {
        event: "PAYMENT_CONFIRMED",
        paymentId,
        tenantId,
      },
    }).then((resp) => {
      expect(resp.status).to.eq(200);
      expect(resp.body.message).to.eq("Pagamento confirmado");
    });

    // Verifica ativação do tenant
    cy.request({
      method: "GET",
      url: `/tenants/${tenantId}`,
    }).then((resp) => {
      expect(resp.body.status).to.eq("ACTIVE");
    });
  });

  it("deve garantir idempotência do webhook Asaas", () => {
    // Envia o mesmo webhook duas vezes
    cy.request({
      method: "POST",
      url: "/webhooks/asaas",
      body: {
        event: "PAYMENT_CONFIRMED",
        paymentId,
        tenantId,
      },
    }).then((resp) => {
      expect(resp.status).to.eq(200);
      expect(resp.body.message).to.eq("Pagamento confirmado");
    });

    cy.request({
      method: "POST",
      url: "/webhooks/asaas",
      body: {
        event: "PAYMENT_CONFIRMED",
        paymentId,
        tenantId,
      },
    }).then((resp) => {
      expect(resp.status).to.eq(200);
      expect(resp.body.message).to.eq("Pagamento já processado");
    });
  });

  it("deve tratar erro de pagamento não encontrado", () => {
    cy.request({
      method: "POST",
      url: "/webhooks/asaas",
      body: {
        event: "PAYMENT_CONFIRMED",
        paymentId: "fake-id",
        tenantId,
      },
      failOnStatusCode: false,
    }).then((resp) => {
      expect(resp.status).to.eq(404);
      expect(resp.body.message).to.eq("Pagamento não encontrado");
    });
  });

  it("deve tratar erro de tenant não encontrado", () => {
    cy.request({
      method: "POST",
      url: "/webhooks/asaas",
      body: {
        event: "PAYMENT_CONFIRMED",
        paymentId,
        tenantId: "fake-tenant",
      },
      failOnStatusCode: false,
    }).then((resp) => {
      expect(resp.status).to.eq(404);
      expect(resp.body.message).to.eq("Tenant não encontrado");
    });
  });
});
