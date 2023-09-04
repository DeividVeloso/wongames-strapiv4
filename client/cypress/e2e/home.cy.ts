describe('Home Page', () => {
  it('should render home sections', () => {
    // visitar a página
    // cy.visit('http://localhost:3000')
    cy.visit('/')

    cy.shouldRenderBanner()
    cy.shouldRenderShowcase({ name: 'New games', hightlight: false })
    cy.shouldRenderShowcase({ name: 'Popular games', hightlight: true })
    cy.shouldRenderShowcase({ name: 'Upcoming games', hightlight: true })
    cy.shouldRenderShowcase({ name: 'Free games', hightlight: true })
  })
})
