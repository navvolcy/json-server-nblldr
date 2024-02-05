describe('Home page', () => {
  beforeEach('Student web is loaded"', () => {
    cy.visit('http://localhost:3000')
   
  })

  it('lang, charset, herf,', () =>{

    cy.get("[lang = 'en']")
    cy.get("[charset = 'utf8']")
    cy.get("[href = 'https://cdn.sstatic.net/Sites/stackoverflow/Img/favicon.ico']")

  })
})

describe('Dynamic data ', () => {
  it('UVU Class courses', () => {
    cy.visit('http://localhost:3000')
 
    cy.get('select').select('CS 3380').should('have.value','cs3380')
    cy.get('select').select('CS 4660').should('have.value','cs4660')
    cy.get('select').select('CS 4690').should('have.value','cs4690')

  })
})



describe('Input value',() =>{
  it('checking input value',() => {
    cy.visit('http://localhost:3000')

    cy.get("[placeholder ='12345678']")
    cy.get("[maxlength = '8']")
  })

})

describe('toggle feature', () =>{
  it('toggle visibility',() =>{
    cy.visit('http://localhost:3000')

    cy.get("[data-cy = 'logs']")
  })
})

describe('Load the CSS file', ()=>{
  it("css & JS file check", () =>{
    cy.visit('http://localhost:3000')

    cy.get("[href='style.css']")
    cy.get("[src ='script.js']")
  })
})



