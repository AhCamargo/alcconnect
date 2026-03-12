/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Registra um novo usuário e faz login automaticamente.
     * Armazena o token no localStorage.
     */
    register(name: string, email: string, password: string): Chainable<void>;

    /**
     * Faz login com email e senha.
     * Armazena o token no localStorage.
     */
    login(email: string, password: string): Chainable<void>;
  }
}
