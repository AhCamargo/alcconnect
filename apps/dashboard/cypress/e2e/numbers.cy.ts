describe("Números", () => {
  const uniqueId = Date.now();
  const testUser = {
    name: "Teste Números",
    email: `cypress-numbers+${uniqueId}@teste.com`,
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
    cy.get("nav").contains("Números").click();
    cy.url().should("include", "/numbers");
  });

  it("deve exibir a página de números", () => {
    cy.contains("Comprar número").should("be.visible");
    cy.get('input[id="ddd"]').should("be.visible");
  });

  it("deve exibir mensagem quando não há números", () => {
    cy.contains("Nenhum número comprado ainda").should("be.visible");
  });

  it("deve validar que DDD precisa ter 2 dígitos", () => {
    cy.get('input[id="ddd"]').should("be.visible").type("1");
    cy.get('button[type="submit"]').should("be.disabled");
  });

  it("deve comprar um número com DDD 11", () => {
    cy.get('input[id="ddd"]').should("be.visible").type("11");
    cy.get('button[type="submit"]').should("not.be.disabled").click();

    // O número deve aparecer na tabela
    cy.contains("Nenhum número comprado ainda").should("not.exist");
    cy.contains("11").should("be.visible");
    cy.contains("Ativo").should("be.visible");
  });

  it("deve comprar outro número com DDD 21", () => {
    cy.get('input[id="ddd"]').should("be.visible").type("21");
    cy.get('button[type="submit"]').click();

    cy.contains("21").should("be.visible");
  });

  it("deve listar todos os números comprados", () => {
    // Deve ter pelo menos os 2 números comprados nos testes anteriores
    cy.get("table tbody tr").should("have.length.at.least", 2);
  });

  it("deve aceitar apenas dígitos no campo DDD", () => {
    cy.get('input[id="ddd"]').type("abc");
    cy.get('input[id="ddd"]').should("have.value", "");
  });
});
