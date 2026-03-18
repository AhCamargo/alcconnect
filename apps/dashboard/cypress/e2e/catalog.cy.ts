describe("Catálogo de Números", () => {
  const uniqueId = Date.now();
  const testUser = {
    name: "Teste Catálogo",
    email: `cypress-catalog+${uniqueId}@teste.com`,
    password: "Senha@123",
  };

  before(() => {
    cy.request({
      method: "POST",
      url: "/auth/register",
      body: {
        ...testUser,
        document: `${uniqueId}`.slice(0, 11).padEnd(11, "0"),
        phone: "11999990003",
        whatsapp: "11999990003",
      },
      failOnStatusCode: false,
    });
  });

  beforeEach(() => {
    cy.login(testUser.email, testUser.password);
    cy.visit("/");
    cy.get("nav").contains("Catálogo").click();
    cy.url().should("include", "/catalog");
  });

  it("deve exibir a página de catálogo", () => {
    cy.contains("Catálogo de Números").should("be.visible");
    cy.contains("Filtros").should("be.visible");
  });

  it("deve exibir mensagem quando não há números disponíveis", () => {
    cy.contains("Nenhum número disponível.").should("be.visible");
  });

  it("deve permitir filtrar por DDD e Tipo", () => {
    cy.get('input[name="ddd"]').type("11");
    cy.get('select[name="type"]').select("VOIP");
    cy.contains("Carregando...").should("be.visible");
  });

  it("deve exibir cards de números se disponíveis", () => {
    // Simula mock ou espera números
    cy.get(".grid").find(".rounded-xl").should("exist");
  });

  it("botão contratar deve estar desabilitado", () => {
    cy.get('button[title="Em breve"]').should("be.disabled");
  });

  it("deve ser responsivo", () => {
    cy.viewport("iphone-6");
    cy.get(".grid").should("be.visible");
  });
});
