describe('Test Register', function(){

    Cypress.config('pageLoadTimeout', 10000)

    beforeEach(function() { 
        cy.wait(1000)
        cy.visit('localhost:3000') //http://34.87.73.25
        cy.title().should('eq', 'Photo-Bro')
        cy.get('.ant-btn-primary').first().click()
        cy.contains('Account Information').should('be.visible')     
    })

    it('TC 1.1-01 Signup with all fields valid', function(){
        cy.get('form').within(($form) => {                                  //uses in other tests as photographer
            cy.get('input').eq(0).type('test')
            cy.get('input').eq(1).type('test123@gmail.com')
            cy.get('input').eq(2).type('test1234')
            cy.get('.ant-select-selection').click().type('{enter}')
            cy.get('input').eq(3).type('66812345678')
            cy.get('input').eq(4).type('test')
            cy.get('input').eq(5).type('test')
            cy.get('input').eq(6).type('0123456789123')
            cy.get('input').eq(7).type('0123456789')
            cy.get('input').eq(8).type('Kasikorn')
            cy.get('input').eq(9).type('Test test')
            cy.get('button').contains('Sign Up').last().click({force:true})
        })
        cy.contains('Find your photographer').should('be.visible')
        
        cy.get('.ant-btn-icon-only').last().click()
        cy.get('.ant-dropdown-menu-item').last().click()
        cy.get('.ant-btn-primary').first().click()
        cy.contains('Account Information').should('be.visible')

        cy.get('form').within(($form) => {
            cy.get('input').eq(0).type('qwer')                              //uses in other tests as customer
            cy.get('input').eq(1).type('qwer123@gmail.com')
            cy.get('input').eq(2).type('qwer')
            cy.get('.ant-select-selection').click().type('{downarrow}{enter}')
            cy.get('input').eq(3).type('66876543210')
            cy.get('input').eq(4).type('qwer')
            cy.get('input').eq(5).type('qwer')
            cy.get('input').eq(6).type('3219876543210')
            cy.get('input').eq(7).type('9876543210')
            cy.get('input').eq(8).type('SCB')
            cy.get('input').eq(9).type('QWER QWER')
            cy.get('button').contains('Sign Up').last().click({force:true})
        })
        cy.contains('Find your photographer').should('be.visible')
        
    })

    it('TC 1.1-02 Username consists of other character(s) from TC 1.1-01.', function(){
        cy.get('form').within(($form) => {
            cy.get('input').eq(0).type('test*')
            cy.get('input').eq(1).type('test123@gmail.com')
            cy.get('input').eq(2).type('test1234')
            cy.get('.ant-select-selection').click().type('{enter}')
            cy.get('input').eq(3).type('66812345678')
            cy.get('input').eq(4).type('test')
            cy.get('input').eq(5).type('test')
            cy.get('input').eq(6).type('0123456789123')
            cy.get('input').eq(7).type('0123456789')
            cy.get('input').eq(8).type('Kasikorn')
            cy.get('input').eq(9).type('Test test')
            cy.get('button').contains('Sign Up').last().click({force:true})

            cy.contains('Account Information').should('be.visible')
        })
    })

    it('TC 1.1-03 Username is more than 150 characters in length.', function(){
        cy.get('form').within(($form) => {
            cy.get('input').eq(0).type('test123456test123456test123456test123456test123456test123456test123456test123456test123456test123456test123456test123456test123456test123456test123456test')
            cy.get('input').eq(1).type('test123@gmail.com')
            cy.get('input').eq(2).type('test1234')
            cy.get('.ant-select-selection').click().type('{enter}')
            cy.get('input').eq(3).type('66812345678')
            cy.get('input').eq(4).type('test')
            cy.get('input').eq(5).type('test')
            cy.get('input').eq(6).type('0123456789123')
            cy.get('input').eq(7).type('0123456789')
            cy.get('input').eq(8).type('Kasikorn')
            cy.get('input').eq(9).type('Test test')
            cy.get('button').contains('Sign Up').last().click({force:true})

            cy.contains('Account Information').should('be.visible')
        })
    })
    
    it('TC 1.1-04 Username is less than 1 character.', function(){
        cy.get('form').within(($form) => {
            cy.get('input').eq(0).type('a{backspace}')
            cy.get('input').eq(1).type('test123@gmail.com')
            cy.get('input').eq(2).type('test1234')
            cy.get('.ant-select-selection').click().type('{enter}')
            cy.get('input').eq(3).type('66812345678')
            cy.get('input').eq(4).type('test')
            cy.get('input').eq(5).type('test')
            cy.get('input').eq(6).type('0123456789123')
            cy.get('input').eq(7).type('0123456789')
            cy.get('input').eq(8).type('Kasikorn')
            cy.get('input').eq(9).type('Test test')
            cy.get('button').contains('Sign Up').last().click({force:true})

            cy.contains('This field is required.').should('be.visible')
        })
    })

    it('TC 1.1-05 Incorrect email format.', function(){
        cy.get('form').within(($form) => {
            cy.get('input').eq(0).type('test')
            cy.get('input').eq(1).type('test123.com')
            cy.get('input').eq(2).type('test1234')
            cy.get('.ant-select-selection').click().type('{enter}')
            cy.get('input').eq(3).type('66812345678')
            cy.get('input').eq(4).type('test')
            cy.get('input').eq(5).type('test')
            cy.get('input').eq(6).type('0123456789123')
            cy.get('input').eq(7).type('0123456789')
            cy.get('input').eq(8).type('Kasikorn')
            cy.get('input').eq(9).type('Test test')
            cy.get('button').contains('Sign Up').last().click({force:true})

            cy.contains('Account Information').should('be.visible')
        })
    })

    it('TC 1.1-06 Password is null.', function(){
        cy.get('form').within(($form) => {
            cy.get('input').eq(0).type('test')
            cy.get('input').eq(1).type('test123@gmail.com')
            cy.get('input').eq(2).type('a{backspace}')
            cy.get('.ant-select-selection').click().type('{enter}')
            cy.get('input').eq(3).type('66812345678')
            cy.get('input').eq(4).type('test')
            cy.get('input').eq(5).type('test')
            cy.get('input').eq(6).type('0123456789123')
            cy.get('input').eq(7).type('0123456789')
            cy.get('input').eq(8).type('Kasikorn')
            cy.get('input').eq(9).type('Test test')
            cy.get('button').contains('Sign Up').last().click({force:true})

            cy.contains('Account Information').should('be.visible')
        })
    })

    it('TC 1.1-07 User type is not selected.', function(){
        cy.get('form').within(($form) => {
            cy.get('input').eq(0).type('test')
            cy.get('input').eq(1).type('test123@gmail.com')
            cy.get('input').eq(2).type('test1234')
            cy.get('.ant-select-selection').click()
            cy.get('input').eq(3).type('66812345678')
            cy.get('input').eq(4).type('test')
            cy.get('input').eq(5).type('test')
            cy.get('input').eq(6).type('0123456789123')
            cy.get('input').eq(7).type('0123456789')
            cy.get('input').eq(8).type('Kasikorn')
            cy.get('input').eq(9).type('Test test')
            cy.get('button').contains('Sign Up').last().click({force:true})

            cy.contains('Account Information').should('be.visible')
        })
    })

    it('TC 1.1-08 Phone number is more than 11 digit characters in length.', function(){
        cy.get('form').within(($form) => {
            cy.get('input').eq(0).type('test')
            cy.get('input').eq(1).type('test123@gmail.com')
            cy.get('input').eq(2).type('test1234')
            cy.get('.ant-select-selection').click().type('{enter}')
            cy.get('input').eq(3).type('668123456789')
            cy.get('input').eq(4).type('test')
            cy.get('input').eq(5).type('test')
            cy.get('input').eq(6).type('0123456789123')
            cy.get('input').eq(7).type('0123456789')
            cy.get('input').eq(8).type('Kasikorn')
            cy.get('input').eq(9).type('Test test')
            cy.get('button').contains('Sign Up').last().click({force:true})

            cy.contains('Account Information').should('be.visible')
        })
    })

    it('TC 1.1-09 Phone number is less than 1 digit characters in length.', function(){
        cy.get('form').within(($form) => {
            cy.get('input').eq(0).type('test')
            cy.get('input').eq(1).type('test123@gmail.com')
            cy.get('input').eq(2).type('test1234')
            cy.get('.ant-select-selection').click().type('{enter}')
            cy.get('input').eq(3).type('a{backspace}')
            cy.get('input').eq(4).type('test')
            cy.get('input').eq(5).type('test')
            cy.get('input').eq(6).type('0123456789123')
            cy.get('input').eq(7).type('0123456789')
            cy.get('input').eq(8).type('Kasikorn')
            cy.get('input').eq(9).type('Test test')
            cy.get('button').contains('Sign Up').last().click({force:true})
    
            cy.contains('Account Information').should('be.visible')
        })
    })
    
    it('TC 1.1-10 First name is more than 30 characters in length.', function(){
        cy.get('form').within(($form) => {
            cy.get('input').eq(0).type('test')
            cy.get('input').eq(1).type('test123@gmail.com')
            cy.get('input').eq(2).type('test1234')
            cy.get('.ant-select-selection').click().type('{enter}')
            cy.get('input').eq(3).type('66812345678')
            cy.get('input').eq(4).type('testtesttesttesttesttesttesttest')
            cy.get('input').eq(5).type('test')
            cy.get('input').eq(6).type('0123456789123')
            cy.get('input').eq(7).type('0123456789')
            cy.get('input').eq(8).type('Kasikorn')
            cy.get('input').eq(9).type('Test test')
            cy.get('button').contains('Sign Up').last().click({force:true})
    
            cy.contains('Account Information').should('be.visible')
        })
    })
    
    it('TC 1.1-11 First name is less than 1 character in length.', function(){
        cy.get('form').within(($form) => {
            cy.get('input').eq(0).type('test')
            cy.get('input').eq(1).type('test123@gmail.com')
            cy.get('input').eq(2).type('test1234')
            cy.get('.ant-select-selection').click().type('{enter}')
            cy.get('input').eq(3).type('66812345678')
            cy.get('input').eq(4).type('a{backspace}')
            cy.get('input').eq(5).type('test')
            cy.get('input').eq(6).type('0123456789123')
            cy.get('input').eq(7).type('0123456789')
            cy.get('input').eq(8).type('Kasikorn')
            cy.get('input').eq(9).type('Test test')
            cy.get('button').contains('Sign Up').last().click({force:true})
    
            cy.contains('Account Information').should('be.visible')
        })
    })

    it('TC 1.1-12 Last name is more than 150 characters in length.', function(){
        cy.get('form').within(($form) => {
            cy.get('input').eq(0).type('test')
            cy.get('input').eq(1).type('test123@gmail.com')
            cy.get('input').eq(2).type('test1234')
            cy.get('.ant-select-selection').click().type('{enter}')
            cy.get('input').eq(3).type('66812345678')
            cy.get('input').eq(4).type('test')
            cy.get('input').eq(5).type('testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttest')
            cy.get('input').eq(6).type('0123456789123')
            cy.get('input').eq(7).type('0123456789')
            cy.get('input').eq(8).type('Kasikorn')
            cy.get('input').eq(9).type('Test test')
            cy.get('button').contains('Sign Up').last().click({force:true})
    
            cy.contains('Account Information').should('be.visible')
        })
    })
    
    it('TC 1.1-13 Last name is less than 1 character in length.', function(){
        cy.get('form').within(($form) => {
            cy.get('input').eq(0).type('test')
            cy.get('input').eq(1).type('test123@gmail.com')
            cy.get('input').eq(2).type('test1234')
            cy.get('.ant-select-selection').click().type('{enter}')
            cy.get('input').eq(3).type('66812345678')
            cy.get('input').eq(4).type('test')
            cy.get('input').eq(5).type('a{backspace}')
            cy.get('input').eq(6).type('0123456789123')
            cy.get('input').eq(7).type('0123456789')
            cy.get('input').eq(8).type('Kasikorn')
            cy.get('input').eq(9).type('Test test')
            cy.get('button').contains('Sign Up').last().click({force:true})
    
            cy.contains('Account Information').should('be.visible')
        })
    })
    
    it('TC 1.1-14 SSN is more than 13 digit characters in length.', function(){
        cy.get('form').within(($form) => {
            cy.get('input').eq(0).type('test')
            cy.get('input').eq(1).type('test123@gmail.com')
            cy.get('input').eq(2).type('test1234')
            cy.get('.ant-select-selection').click().type('{enter}')
            cy.get('input').eq(3).type('66812345678')
            cy.get('input').eq(4).type('test')
            cy.get('input').eq(5).type('test')
            cy.get('input').eq(6).type('01234567891234')
            cy.get('input').eq(7).type('0123456789')
            cy.get('input').eq(8).type('Kasikorn')
            cy.get('input').eq(9).type('Test test')
            cy.get('button').contains('Sign Up').last().click({force:true})
    
            cy.contains('Account Information').should('be.visible')
        })
    })
    
    it('TC 1.1-15 SSN is less than 13 digit characters in length.', function(){
        cy.get('form').within(($form) => {
            cy.get('input').eq(0).type('test')
            cy.get('input').eq(1).type('test123@gmail.com')
            cy.get('input').eq(2).type('test1234')
            cy.get('.ant-select-selection').click().type('{enter}')
            cy.get('input').eq(3).type('66812345678')
            cy.get('input').eq(4).type('test')
            cy.get('input').eq(5).type('test')
            cy.get('input').eq(6).type('012345678912')
            cy.get('input').eq(7).type('0123456789')
            cy.get('input').eq(8).type('Kasikorn')
            cy.get('input').eq(9).type('Test test')
            cy.get('button').contains('Sign Up').last().click({force:true})
    
            cy.contains('Account Information').should('be.visible')
        })
    })
    
    it('TC 1.1-16 Account number is more than 50 digit characters in length.', function(){
        cy.get('form').within(($form) => {
            cy.get('input').eq(0).type('test')
            cy.get('input').eq(1).type('test123@gmail.com')
            cy.get('input').eq(2).type('test1234')
            cy.get('.ant-select-selection').click().type('{enter}')
            cy.get('input').eq(3).type('66812345678')
            cy.get('input').eq(4).type('test')
            cy.get('input').eq(5).type('test')
            cy.get('input').eq(6).type('0123456789123')
            cy.get('input').eq(7).type('01234567890123456789012345678901234567890123456789')
            cy.get('input').eq(8).type('Kasikorn')
            cy.get('input').eq(9).type('Test test')
            cy.get('button').contains('Sign Up').last().click({force:true})
    
            cy.contains('Account Information').should('be.visible')
        })
    })
    
    it('TC 1.1-17 Account number is less than 1 digit character in length.', function(){
        cy.get('form').within(($form) => {
            cy.get('input').eq(0).type('test')
            cy.get('input').eq(1).type('test123@gmail.com')
            cy.get('input').eq(2).type('test1234')
            cy.get('.ant-select-selection').click().type('{enter}')
            cy.get('input').eq(3).type('66812345678')
            cy.get('input').eq(4).type('test')
            cy.get('input').eq(5).type('test')
            cy.get('input').eq(6).type('0123456789123')
            cy.get('input').eq(7).type('a{backspace}')
            cy.get('input').eq(8).type('Kasikorn')
            cy.get('input').eq(9).type('Test test')
            cy.get('button').contains('Sign Up').last().click({force:true})
    
            cy.contains('Account Information').should('be.visible')
        })
    })
    
    it('TC 1.1-18 Bank name is more than 50 characters in length.', function(){
        cy.get('form').within(($form) => {
            cy.get('input').eq(0).type('test')
            cy.get('input').eq(1).type('test123@gmail.com')
            cy.get('input').eq(2).type('test1234')
            cy.get('.ant-select-selection').click().type('{enter}')
            cy.get('input').eq(3).type('66812345678')
            cy.get('input').eq(4).type('test')
            cy.get('input').eq(5).type('test')
            cy.get('input').eq(6).type('0123456789123')
            cy.get('input').eq(7).type('0123456789')
            cy.get('input').eq(8).type('kbankkbankkbankkbankkbankkbankkbankkbankkbankkbankkbank')
            cy.get('input').eq(9).type('Test test')
            cy.get('button').contains('Sign Up').last().click({force:true})
    
            cy.contains('Account Information').should('be.visible')
        })
    })
    
    it('TC 1.1-19 Bank name is less than 1 character in length.', function(){
        cy.get('form').within(($form) => {
            cy.get('input').eq(0).type('test')
            cy.get('input').eq(1).type('test123@gmail.com')
            cy.get('input').eq(2).type('test1234')
            cy.get('.ant-select-selection').click().type('{enter}')
            cy.get('input').eq(3).type('66812345678')
            cy.get('input').eq(4).type('test')
            cy.get('input').eq(5).type('test')
            cy.get('input').eq(6).type('0123456789123')
            cy.get('input').eq(7).type('0123456789')
            cy.get('input').eq(8).type('a{backspace}')
            cy.get('input').eq(9).type('Test test')
            cy.get('button').contains('Sign Up').last().click({force:true})
    
            cy.contains('Account Information').should('be.visible')
        })
    })
    
    it('TC 1.1-20 Bank account name is more than 50 characters in length.', function(){
        cy.get('form').within(($form) => {
            cy.get('input').eq(0).type('test')
            cy.get('input').eq(1).type('test123@gmail.com')
            cy.get('input').eq(2).type('test1234')
            cy.get('.ant-select-selection').click().type('{enter}')
            cy.get('input').eq(3).type('66812345678')
            cy.get('input').eq(4).type('test')
            cy.get('input').eq(5).type('test')
            cy.get('input').eq(6).type('0123456789123')
            cy.get('input').eq(7).type('0123456789')
            cy.get('input').eq(8).type('Kasikorn')
            cy.get('input').eq(9).type('Test test Test test Test test Test test Test test Test test Test test Test test Test test Test test Test test')
            cy.get('button').contains('Sign Up').last().click({force:true})
    
            cy.contains('Account Information').should('be.visible')
        })
    })
    
    it('TC 1.1-21 Bank account name is less than 1 character in length.', function(){
        cy.get('form').within(($form) => {
            cy.get('input').eq(0).type('test')
            cy.get('input').eq(1).type('test123@gmail.com')
            cy.get('input').eq(2).type('test1234')
            cy.get('.ant-select-selection').click().type('{enter}')
            cy.get('input').eq(3).type('66812345678')
            cy.get('input').eq(4).type('test')
            cy.get('input').eq(5).type('test')
            cy.get('input').eq(6).type('0123456789123')
            cy.get('input').eq(7).type('0123456789')
            cy.get('input').eq(8).type('Kasikorn')
            cy.get('input').eq(9).type('a{backspace}')
            cy.get('button').contains('Sign Up').last().click({force:true})
    
            cy.contains('Account Information').should('be.visible')
        })
    })
})