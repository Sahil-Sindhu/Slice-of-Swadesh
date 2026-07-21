describe("Authentication Flow E2E Tests", () => {
  beforeEach(() => {
    cy.visit("/login");
  });

  it("should display the login page with all elements", () => {
    cy.get("h1").should("contain", "Sign in");
    cy.get("input#email").should("be.visible");
    cy.get("input#password").should("be.visible");
    cy.get("button#login-submit").should("be.visible");
  });

  it("should show validation errors on empty fields", () => {
    cy.get("button#login-submit").click();
    cy.get("p").should("contain", "Email is required");
    cy.get("p").should("contain", "Password is required");
  });

  it("should navigate to forgot password page", () => {
    cy.contains("Forgot password?").click();
    cy.url().should("include", "/forgot-password");
    cy.get("h1").should("contain", "Forgot Password?");
    cy.get("input#email").should("be.visible");
  });
});
