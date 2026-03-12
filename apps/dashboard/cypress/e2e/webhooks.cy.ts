describe("Webhooks", () => {
  const uniqueId = Date.now();
  const testUser = {
    name: "Teste Webhooks",
    email: `cypress-webhooks+${uniqueId}@teste.com`,
    password: "Senha@123",
  };

  before(() => {
    cy.request({
      method: "POST",
      url: "/auth/register",
      body: testUser,
      failOnStatusCode: false,
    });
  });

  beforeEach(() => {
    cy.login(testUser.email, testUser.password);
    cy.visit("/");
    cy.get("nav").contains("Webhooks").click();
    cy.url().should("include", "/webhooks");
  });

  it("deve exibir a página de webhooks", () => {
    cy.contains("Webhooks").should("be.visible");
    cy.contains("Novo webhook").should("be.visible");
    cy.get('input[id="url"]').should("be.visible");
    cy.get('select[id="event"]').should("be.visible");
  });

  it("deve exibir mensagem quando não há webhooks", () => {
    cy.contains("Nenhum webhook configurado").should("be.visible");
  });

  it("deve criar um webhook de SMS", () => {
    cy.get('input[id="url"]').type("https://exemplo.com/webhook/sms");
    cy.get('select[id="event"]').select("incoming_sms");
    cy.get('button[type="submit"]').click();

    cy.contains("https://exemplo.com/webhook/sms").should("be.visible");
    cy.contains("SMS recebido").should("be.visible");
  });

  it("deve criar um webhook de WhatsApp", () => {
    cy.get('input[id="url"]').type("https://exemplo.com/webhook/whatsapp");
    cy.get('select[id="event"]').select("incoming_whatsapp");
    cy.get('button[type="submit"]').click();

    cy.contains("https://exemplo.com/webhook/whatsapp").should("be.visible");
    cy.contains("WhatsApp recebido").should("be.visible");
  });

  it("deve criar um webhook de ligação", () => {
    cy.get('input[id="url"]').type("https://exemplo.com/webhook/call");
    cy.get('select[id="event"]').select("incoming_call");
    cy.get('button[type="submit"]').click();

    cy.contains("https://exemplo.com/webhook/call").should("be.visible");
    cy.contains("Ligação recebida").should("be.visible");
  });

  it("deve deletar um webhook", () => {
    // Primeiro criar um webhook para deletar
    cy.get('input[id="url"]').type("https://exemplo.com/webhook/deletar");
    cy.get('select[id="event"]').select("incoming_sms");
    cy.get('button[type="submit"]').click();

    cy.contains("https://exemplo.com/webhook/deletar").should("be.visible");

    // Clicar no botão de deletar (ícone de lixeira)
    cy.contains("https://exemplo.com/webhook/deletar")
      .closest(".rounded-xl")
      .find("button")
      .click();

    cy.contains("https://exemplo.com/webhook/deletar").should("not.exist");
  });

  it("deve exigir URL válida", () => {
    cy.get('input[id="url"]').type("url-invalida");
    cy.get('button[type="submit"]').click();

    // O input type=url do navegador deve bloquear o envio
    cy.get('input[id="url"]:invalid').should("exist");
  });
});
