Cypress.Commands.add(
  "register",
  (name: string, email: string, password: string) => {
    cy.request("POST", "/auth/register", { name, email, password }).then(
      (res) => {
        window.localStorage.setItem("token", res.body.token);
      },
    );
  },
);

Cypress.Commands.add("login", (email: string, password: string) => {
  cy.request("POST", "/auth/login", { email, password }).then((res) => {
    window.localStorage.setItem("token", res.body.token);
  });
});
