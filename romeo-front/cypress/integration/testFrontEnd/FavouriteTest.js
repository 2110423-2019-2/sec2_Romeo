import { wait } from "@testing-library/react"

describe('Test Favourite Photographer', function() {

    it('TC 5.1-01 Add favourite photographer', function() {
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
        cy.contains('test').should('be.visible')
        cy.visit('http://localhost:3000/profile/test')
        cy.get('.sidebar-profile > .ant-btn').click()  
    })
    it('TC 5.1-01 Add favourite photographer', function() {
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
        cy.contains('test').should('be.visible')
        cy.visit('http://localhost:3000/profile/test')
        cy.get('.sidebar-profile > .ant-btn').click()  
    })
    
})