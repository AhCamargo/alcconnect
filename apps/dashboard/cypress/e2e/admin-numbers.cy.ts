describe("Admin - Números", () => {
  const uniqueId = Date.now();
  const adminUser = {
    name: "Admin Cypress",
    email: `cypress-admin+${uniqueId}@teste.com`,
    password: "Senha@123",
    role: "ADMIN",
  };

  before(() => {
    // Cria admin via API ou mock
    cy.request({
      method: "POST",
      url: "/auth/register",
      body: {
        ...adminUser,
        document: `${uniqueId}`.slice(0, 11).padEnd(11, "0"),
        phone: "11999990005",
        whatsapp: "11999990005",
        role: "ADMIN",
      },
      failOnStatusCode: false,
    });
  });

  beforeEach(() => {
    cy.login(adminUser.email, adminUser.password);
    cy.visit("/");
    cy.get("nav").contains("Números").click();
    cy.url().should("include", "/admin/numbers");
  });

  it("deve listar todos os números", () => {
    cy.contains("Admin - Números").should("be.visible");
    cy.get("table").should("be.visible");
  });

  it("deve abrir modal para adicionar número", () => {
    cy.get("button").contains("Novo Número").click();
    cy.get('input[name="phoneNumber"]').should("be.visible");
  });

  it("deve adicionar número com sucesso", () => {
    cy.get("button").contains("Novo Número").click();
    cy.get('input[name="phoneNumber"]').type("11999990010");
    cy.get('input[name="ddd"]').type("11");
    cy.get('input[name="region"]').type("São Paulo");
    cy.get('select[name="type"]').select("VOIP");
    cy.get('input[name="priceMonthly"]').type("29.90");
    cy.get('input[name="priceActivation"]').type("49.90");
    cy.get('input[name="providerRef"]').type("ref-001");
    cy.get('button[type="submit"]').click();
    cy.contains("11999990010").should("be.visible");
  });

  it("deve editar número", () => {
    cy.contains("11999990010")
      .parent()
      .find("button")
      .contains("Editar")
      .click();
    cy.get('input[name="region"]').clear().type("SP Capital");
    cy.get('button[type="submit"]').click();
    cy.contains("SP Capital").should("be.visible");
  });

  it("deve excluir número disponível", () => {
    cy.contains("11999990010")
      .parent()
      .find("button")
      .contains("Excluir")
      .click();
    cy.get("button").contains("Confirmar").click();
    cy.contains("11999990010").should("not.exist");
  });

  it("badge de status deve ser colorida", () => {
    cy.get(".rounded-full").should("exist");
  });

  it("deve ser responsivo", () => {
    cy.viewport("iphone-6");
    cy.get("table").should("be.visible");
  });
});
