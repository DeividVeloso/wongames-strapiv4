import { render, screen } from 'utils/test-utils'

import Highlight from '.'
import * as S from './styles'

const props = {
  title: 'Heading 1',
  subtitle: 'Heading 2',
  buttonLabel: 'Buy now',
  buttonLink: '/r2d2',
  backgroundImage: '/img/red-dead-img.jpg',
  floatImage: '/img/float-image.png'
}

describe('<Highlight />', () => {
  it('should render the heading', () => {
    render(<Highlight {...props} />)

    expect(
      screen.getByRole('heading', { name: /Heading 1/i })
    ).toBeInTheDocument()

    expect(
      screen.getByRole('heading', { name: /Heading 2/i })
    ).toBeInTheDocument()

    expect(screen.getByRole('link', { name: /buy now/i })).toBeInTheDocument()

    // expect(container.firstChild).toMatchSnapshot()
  })

  it('should render background image', () => {
    render(<Highlight {...props} />)

    expect(
      screen.getByRole('img', { name: `${props.title} background` })
    ).toHaveAttribute('src', `${props.backgroundImage}`)
  })

  it('should render float image', () => {
    render(<Highlight {...props} floatImage={props.floatImage} />)

    expect(screen.getByRole('img', { name: props.title })).toHaveAttribute(
      'src',
      props.floatImage
    )
  })

  it('should render content in the right by default', () => {
    const { container } = render(
      <Highlight {...props} floatImage={props.floatImage} />
    )

    expect(container.firstChild).toHaveStyleRule(
      'grid-template-areas',
      "'floatimage content'"
    )

    expect(container.firstChild).toHaveStyleRule('text-align', 'right', {
      modifier: `${S.Content}`
    })
  })

  it('should render content in the left', () => {
    const { container } = render(
      <Highlight {...props} floatImage={props.floatImage} alignment="left" />
    )

    expect(container.firstChild).toHaveStyleRule(
      'grid-template-areas',
      "'content floatimage'"
    )

    expect(container.firstChild).toHaveStyleRule('text-align', 'left', {
      modifier: `${S.Content}`
    })
  })
})
