describe("Meus Números", () => {
  const uniqueId = Date.now();
  const testUser = {
    name: "Teste Meus Números",
    email: `cypress-mynumbers+${uniqueId}@teste.com`,
    password: "Senha@123",
  };

  before(() => {
    cy.request({
      method: "POST",
      url: "/auth/register",
      body: {
        ...testUser,
        document: `${uniqueId}`.slice(0, 11).padEnd(11, "0"),
        phone: "11999990004",
        whatsapp: "11999990004",
      },
      failOnStatusCode: false,
    });
  });

  beforeEach(() => {
    cy.login(testUser.email, testUser.password);
    cy.visit("/");
    cy.get("nav").contains("Meus Números").click();
    cy.url().should("include", "/my-numbers");
  });

  it("deve exibir a página de meus números", () => {
    cy.contains("Meus Números").should("be.visible");
  });

  it("deve exibir mensagem amigável quando não há números", () => {
    cy.contains("Você ainda não tem números.").should("be.visible");
    cy.get('a[href="/catalog"]').should("be.visible");
  });

  it("deve exibir cards de números se disponíveis", () => {
    // Simula mock ou espera números
    cy.get(".grid").find(".rounded-xl").should("exist");
  });

  it("badge de status deve ser colorida", () => {
    cy.get(".rounded-full").should("exist");
  });

  it("deve ser responsivo", () => {
    cy.viewport("iphone-6");
    cy.get(".grid").should("be.visible");
  });
});
