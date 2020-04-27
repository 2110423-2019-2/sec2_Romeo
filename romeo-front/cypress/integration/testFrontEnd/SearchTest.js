describe('Test Search by filter', function() {
    it('TC 6.1-01 Search with any length and filters', function() {
        cy.visit('localhost:3000')
        cy.title().should('eq', 'Photo-Bro')
        cy.get('input').first().type('Peter')
        cy.get('input').first().type('{enter}')
        cy.wait(5000)
        cy.contains('No Results').should('be.visible')
    })
})