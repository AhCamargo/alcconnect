describe("Autenticação", () => {
  const uniqueId = Date.now();
  const testUser = {
    name: "Teste Cypress",
    email: `cypress+${uniqueId}@teste.com`,
    password: "Senha@123",
  };

  beforeEach(() => {
    cy.clearLocalStorage();
  });

  it("deve exibir a página de login", () => {
    cy.visit("/login");
    cy.contains("Acesse sua conta").should("be.visible");
    cy.get('input[id="email"]').should("be.visible");
    cy.get('input[id="password"]').should("be.visible");
    cy.get('button[type="submit"]').contains("Entrar");
  });

  it("deve navegar para registro a partir do login", () => {
    cy.visit("/login");
    cy.contains("Criar conta").click();
    cy.url().should("include", "/register");
    cy.contains("Crie sua conta").should("be.visible");
  });

  it("deve rejeitar login com credenciais inválidas", () => {
    cy.visit("/login");
    cy.get('input[id="email"]').type("invalido@email.com");
    cy.get('input[id="password"]').type("senhaerrada");
    cy.get('button[type="submit"]').click();
    // 401 interceptor redireciona de volta ao login
    cy.url().should("include", "/login");
  });

  it("deve registrar um novo usuário com sucesso", () => {
    cy.visit("/register");
    cy.get('input[id="name"]').type(testUser.name);
    cy.get('input[id="email"]').type(testUser.email);
    cy.get('input[id="password"]').type(testUser.password);
    cy.get('button[type="submit"]').click();

    // Após registro, deve redirecionar para o dashboard
    cy.url().should("eq", Cypress.config().baseUrl + "/");
    cy.contains("Dashboard").should("be.visible");
  });

  it("deve fazer login com o usuário registrado", () => {
    cy.visit("/login");
    cy.get('input[id="email"]').type(testUser.email);
    cy.get('input[id="password"]').type(testUser.password);
    cy.get('button[type="submit"]').click();

    cy.url().should("eq", Cypress.config().baseUrl + "/");
    cy.contains("Dashboard").should("be.visible");
  });

  it("deve fazer logout e redirecionar para login", () => {
    cy.login(testUser.email, testUser.password);
    cy.visit("/");
    cy.contains("Dashboard").should("be.visible");

    // Clicar no botão de sair
    cy.contains("Sair").click();
    cy.url().should("include", "/login");
  });

  it("deve redirecionar para login quando não autenticado", () => {
    cy.visit("/");
    cy.url().should("include", "/login");
  });

  it("deve redirecionar para login ao acessar rota protegida", () => {
    // Sem token, a SPA redireciona para /login via ProtectedRoute
    cy.visit("/");
    cy.url().should("include", "/login");
    // Tentar acessar via API direta retorna 401
    cy.request({ url: "/numbers", failOnStatusCode: false })
      .its("status")
      .should("eq", 401);
  });
});
