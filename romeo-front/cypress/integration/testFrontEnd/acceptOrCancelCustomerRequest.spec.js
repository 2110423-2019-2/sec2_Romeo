describe('Test Edit Portfolio', function() {
    
    Cypress.config('pageLoadTimeout', 10000)

    beforeEach(function() { 
        cy.visit('localhost:3000')
        cy.title().should('eq', 'Photo-Bro')
        cy.get('button.mr-2').click()
        cy.contains('Password')
        cy.get('form').within(($form) => {
            cy.get('input').first().type('test')
            cy.get('input').last().type('abc123')
            cy.get('.ant-btn').click()
        })
        cy.get('.container > .d-flex > :nth-child(2) > .ant-btn').click()
        cy.contains('test').should('be.visible')
        cy.contains('My Reservations').click()
        cy.contains('My Reservations').should('be.visible')
    })

    it('TC 6.6-01 Accept Request', function() {
        cy.get('[data-row-key="0"] > :nth-child(7) > :nth-child(1) > .d-flex > .ant-btn-primary').first().click()
        cy.contains('Matched').should('be.visible')
    })

    it('TC 6.6-02 Decline Request', function() {
        cy.get(':nth-child(1) > .d-flex > .ant-btn-danger').first().click()
        cy.contains('Declined').should('be.visible')
    })
})