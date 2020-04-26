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
        cy.contains('Edit Profile').click()
        cy.contains('Edit Profile').should('be.visible')
    })

    it('TC 8.1-01 Set price should be success', function() {
        cy.get(':nth-child(1) > .flex-wrap > .ant-btn.mb-2').click()
        cy.get('.ant-select-selection-selected-value').contains('Please Select Time').click()
        cy.get('.ant-select-dropdown-menu-item').eq(2).click()
        cy.get('input').first().type('5000')
        cy.get('button.ant-btn-primary').last().click()
        cy.contains('Your profile has been updated.').should('be.visible')
    })

    it('TC 8.1-02 Set price should be success', function() {
        cy.get(':nth-child(1) > .flex-wrap > .ant-btn.mb-2').click()
        cy.get('.ant-select-selection-selected-value').contains('Please Select Time').click()
        cy.get('.ant-select-dropdown-menu-item').eq(2).click()
        cy.get('input').first().type('-1')
        cy.get(':nth-child(1) > .flex-wrap > :nth-child(2) > :nth-child(1) > .ant-btn').should('be.disabled')
    })

    it('TC 8.1-03 Set price should be success', function() {
        cy.get(':nth-child(1) > .flex-wrap > .ant-btn.mb-2').click()
        cy.get(':nth-child(1) > .flex-wrap > :nth-child(2) > :nth-child(1) > .ant-select > .ant-select-selection').click()
        cy.get('.ant-select-dropdown-menu-item').eq(2).click()
        cy.get('input').first().type('abcd')
        cy.get(':nth-child(1) > .flex-wrap > :nth-child(2) > :nth-child(1) > .ant-btn').should('be.disabled')
    })
})