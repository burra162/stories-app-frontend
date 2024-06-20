describe('Login Test', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('displays an error when email and password are empty', () => {
    cy.get('button').contains('Login').click();
    cy.get('.v-snackbar', { timeout: 10000 }).should('be.visible');
    cy.get('.v-snackbar').should('contain', 'All fields are required!');
  });

  it('displays an error when only email is provided', () => {
    cy.get('input[label="Email"]').type('test@example.com');
    cy.get('button').contains('Login').click();
    cy.get('.v-snackbar', { timeout: 10000 }).should('be.visible');
    cy.get('.v-snackbar').should('contain', 'All fields are required!');
  });

  it('displays an error when only password is provided', () => {
    cy.get('input[label="Password"]').type('1234');
    cy.get('button').contains('Login').click();
    cy.get('.v-snackbar', { timeout: 10000 }).should('be.visible');
    cy.get('.v-snackbar').should('contain', 'All fields are required!');
  });

  it('logs in successfully with correct credentials', () => {
    cy.get('input[label="Email"]').type('admin@gmail.com');
    cy.get('input[label="Password"]').type('123456');

    cy.intercept('POST', '**/login').as('loginUser');
    cy.get('button').contains('Login').click();

    cy.wait('@loginUser').then((interception) => {
      expect(interception.response.statusCode).to.eq(200);

      cy.get('.v-snackbar', { timeout: 10000 }).should('be.visible');
      cy.get('.v-snackbar').should('contain', 'Login successful!');
      cy.url().should('include', '/home');
    });
  });

  it('displays an error with incorrect credentials', () => {
    cy.get('input[label="Email"]').type('wrong@example.com');
    cy.get('input[label="Password"]').type('wrongpassword');

    cy.intercept('POST', '**/login').as('loginUser');
    cy.get('button').contains('Login').click();

    cy.wait('@loginUser').then((interception) => {
      expect(interception.response.statusCode).to.eq(401);

      cy.get('.v-snackbar', { timeout: 10000 }).should('be.visible');
      cy.get('.v-snackbar').should('contain', 'Invalid credentials');
    });
  });
});
