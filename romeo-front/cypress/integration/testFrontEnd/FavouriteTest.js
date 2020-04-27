describe('Test Favourite Photographer', function() {

    Cypress.config('pageLoadTimeout', 10000)

    beforeEach(function() { 

        cy.visit('localhost:3000')
        cy.title().should('eq', 'Photo-Bro')
        cy.get('button.mr-2').click()
        cy.contains('Password')
        cy.get('form').within(($form) => {
            cy.get('input').first().type('qwer')
            cy.get('input').last().type('qwer')
            cy.get('.ant-btn').click()
        })
        cy.wait(1000)
        cy.contains('Find your photographer').should('be.visible')
    })

    it('TC 5.1-01 Add favourite photographer', function() {
        
        cy.get('.ant-btn-icon-only').last().click()
        cy.get('.ant-dropdown-menu-item').eq(1).click()
        cy.contains('You do not have any favorite photographers.').should('be.visible')
        cy.wait(1500)
        cy.visit('localhost:3000')
        cy.contains('test').should('be.visible')
        cy.visit('http://localhost:3000/profile/test')
        cy.get('.sidebar-profile > .ant-btn').click()  
        cy.get('.ant-btn-icon-only').last().click()
        cy.get('.ant-dropdown-menu-item').eq(1).click()
        cy.contains('test').should('be.visible')
        cy.wait(1500)
    })
    it('TC 5.1-02 Remove favourite photographer', function() {
       
        cy.get('.ant-btn-icon-only').last().click()
        cy.get('.ant-dropdown-menu-item').eq(1).click()
        cy.contains('test').should('be.visible')
        cy.wait(1500)
        cy.visit('localhost:3000')
        cy.contains('test').should('be.visible')
        cy.visit('http://localhost:3000/profile/test')
        cy.get('.sidebar-profile > .ant-btn').click()  
        cy.get('.ant-btn-icon-only').last().click()
        cy.get('.ant-dropdown-menu-item').eq(1).click()
        cy.contains('You do not have any favorite photographers.').should('be.visible')
        cy.wait(1500)
    })
    
})