**Cypress**
# npm install cypress

Before run test
* set username and password in the test file
    - cy.get('form').within(($form) => {
            cy.get('input').first().type(username)
            cy.get('input').last().type(password)
            cy.get('.ant-btn').click()
        })
    - cy.contains(username).should('be.visible')

To run cypress test
# npx cypress open