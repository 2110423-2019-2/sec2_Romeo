describe('Test Login', function() {
    beforeEach(function() { 
        cy.visit('localhost:3000')
        cy.title().should('eq', 'Photo-Bro')
        cy.get('button.mr-2').click()
        cy.contains('Password')
    })

    it('TC 2.1-01 Login with valid username and password', function() {
        cy.get('form').within(($form) => {
            cy.get('input').first().type('test')
            cy.get('input').last().type('test1234')
            cy.get('.ant-btn').click()
        })
        cy.wait(1000)
        cy.contains('No active account found with the given credentials').should('not.visible')
    })

    it('TC 2.1-02 Login with valid username but invalid password', function() {
        cy.get('form').within(($form) => {
            cy.get('input').first().type('test')
            cy.get('input').last().type('testwrongpassword')
            cy.get('.ant-btn').click()
        })
        cy.wait(1000)
        cy.contains('No active account found with the given credentials').should('be.visible')
    })

    it('TC 2.1-03 Login with invalid username', function() {
        cy.get('form').within(($form) => {
            cy.get('input').first().type('uvuvwevwevwe onyetenyevwe ugwemuhwem osas')
            cy.get('input').last().type('test1234')
            cy.get('.ant-btn').click()
        })
        cy.wait(1000)
        cy.contains('No active account found with the given credentials').should('be.visible')
    })
})