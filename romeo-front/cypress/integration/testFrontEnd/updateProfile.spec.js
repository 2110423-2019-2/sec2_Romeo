describe('Test Update Profile', function() {

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
        cy.contains('Personal Information').click()
        cy.contains('Personal Information').should('be.visible')
    })

    it('TC 3.1-02 Should be error from email\'s input', function() {
        cy.get('form').within(($form) => {
            cy.get('input').first().clear().type('test456')
            cy.get('span').contains('Confirm Edits').click()
        })  
        cy.contains('An error occurred. Please try again later.').should('be.visible')
    })

    it('TC 3.1-03 Should be error from changing password', function() {
        cy.get('form').within(($form) => {
            cy.get('span').contains('Edit Password').click()
        }) 
        cy.contains('Edit Password').should('be.visible')
        cy.get('form').within(($form) => {
            cy.get('input').first().type('test1234')
            cy.get('input').eq(1).type('abc123')
            cy.get('input').last().type('abc123')
            cy.get('span').contains('Confirm Password Edit').click()
        })
        cy.contains('Incorrect Old Password').should('be.visible')
    })

    it('TC 3.1-04 Should be error from changing password', function() {
        cy.get('form').within(($form) => {
            cy.get('span').contains('Edit Password').click()
        }) 
        cy.contains('Edit Password').should('be.visible')
        cy.get('form').within(($form) => {
            cy.get('input').first().type('1234')
            cy.get('span').contains('Confirm Password Edit').should('be.disabled')
        })
    })

    it('TC 3.1-05 Should be error from changing password', function() {
        cy.get('form').within(($form) => {
            cy.get('span').contains('Edit Password').click()
        }) 
        cy.contains('Edit Password').should('be.visible')
        cy.get('form').within(($form) => {
            cy.get('input').first().type('1234')
            cy.get('input').eq(1).type('abc123')
            cy.get('input').last().type('123abc')
            cy.get('span').contains('Confirm Password Edit').click()
        })
        cy.contains('Passwords Do Not Match').should('be.visible')
    })

    it('TC 3.1-06 Should be error from phone number\'s input', function() {
        cy.get('form').within(($form) => {
            cy.get('input').eq(1).clear().type('668123456789')
            cy.get('span').contains('Confirm Edits').click()
        })  
        cy.contains('An error occurred. Please try again later.').should('be.visible')
    })

    it('TC 3.1-07 Should be error from phone number\'s input', function() {
        cy.get('form').within(($form) => {
            cy.get('input').eq(1).clear()
        })  
        cy.contains('This field is required.').should('be.visible')
    })

    it('TC 3.1-08 Should be error from first name\'s input', function() {
        cy.get('form').within(($form) => {
            cy.get('input').eq(2).clear().type('abcdefabcdefabcdefabcdefabcdefabcdef')
            cy.get('span').contains('Confirm Edits').click()
        })  
        cy.contains('An error occurred. Please try again later.').should('be.visible')
    })

    it('TC 3.1-09 Should be error from first name\'s input', function() {
        cy.get('form').within(($form) => {
            cy.get('input').eq(2).clear()
        })  
        cy.contains('This field is required.').should('be.visible')
    })

    it('TC 3.1-10 Should be error from last name\'s input', function() {
        cy.get('form').within(($form) => {
            cy.get('input').eq(3).clear().type('abcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdef')
            cy.get('span').contains('Confirm Edits').click()
        })  
        cy.contains('An error occurred. Please try again later.').should('be.visible')
    })

    it('TC 3.1-11 Should be error from first name\'s input', function() {
        cy.get('form').within(($form) => {
            cy.get('input').eq(3).clear()
        })  
        cy.contains('This field is required.').should('be.visible')
    })

    it('TC 3.1-12 Should be error from first name\'s input', function() {
        cy.get('form').within(($form) => {
            cy.get('input').eq(5).clear().type('012345678901234567890123456789012345678901234567890')
            cy.get('span').contains('Confirm Edits').click()
        })  
        cy.contains('An error occurred. Please try again later.').should('be.visible')
    })

    it('TC 3.1-13 Should be error from first name\'s input', function() {
        cy.get('form').within(($form) => {
            cy.get('input').eq(5).clear()
        })  
        cy.contains('This field is required.').should('be.visible')
    })

    it('TC 3.1-14 Should be error from first name\'s input', function() {
        cy.get('form').within(($form) => {
            cy.get('input').eq(6).clear().type('SCBSCBSCBSCBSCBSCBSCBSCBSCBSCBSCBSCBSCBSCBSCBSCBSCBSCB')
            cy.get('span').contains('Confirm Edits').click()
        })  
        cy.contains('An error occurred. Please try again later.').should('be.visible')
    })

    it('TC 3.1-15 Should be error from first name\'s input', function() {
        cy.get('form').within(($form) => {
            cy.get('input').eq(6).clear()
        })  
        cy.contains('This field is required.').should('be.visible')
    })

    it('TC 3.1-16 Should be error from first name\'s input', function() {
        cy.get('form').within(($form) => {
            cy.get('input').last().clear().type('Name Name Name Name Name Name Name Name Name Name Name Name')
            cy.get('span').contains('Confirm Edits').click()
        })  
        cy.contains('An error occurred. Please try again later.').should('be.visible')
    })

    it('TC 3.1-17 Should be error from first name\'s input', function() {
        cy.get('form').within(($form) => {
            cy.get('input').last().clear()
        })  
        cy.contains('This field is required.').should('be.visible')
    })

    it('TC 3.1-01 Update Profile should be success', function() {
        cy.get('form').within(($form) => {
            cy.get('input').first().clear().type('test456@gmail.com')
            cy.get('span').contains('Edit Password').click()
        }) 
        cy.contains('Edit Password').should('be.visible')
        cy.get('form').within(($form) => {
            cy.get('input').first().type('abc123')
            cy.get('input').eq(1).type('abc123')
            cy.get('input').last().type('abc123')
            cy.get('span').contains('Confirm Password Edit').click()
            cy.get('span').contains('Back').click()
        })
        cy.contains('Personal Information').should('be.visible')
        cy.get('form').within(($form) => {
            cy.get('input').eq(1).clear().type('66812345678')
            cy.get('input').eq(2).clear().type('abc')
            cy.get('input').eq(3).clear().type('def')
            cy.get('input').eq(5).clear().type('0123456789')
            cy.get('input').eq(6).clear().type('SCB')
            cy.get('input').last().clear().type('Test testtt')
            cy.get('span').contains('Confirm Edits').click()
        })
    })
})