import { render, screen } from 'utils/test-utils'

import FormSignUp from '.'
import { MockedProvider } from '@apollo/client/testing'

describe('<FormSignUp />', () => {
  it('should render the heading', () => {
    const { container } = render(
      <MockedProvider>
        <FormSignUp />
      </MockedProvider>
    )

    const name = screen.getByPlaceholderText(/name/i)
    const email = screen.getByPlaceholderText(/email/i)
    const password = screen.getByPlaceholderText('Password')
    const confirmPassword = screen.getByPlaceholderText('Confirm password')
    const button = screen.getByRole('button', {
      name: /sign up now/i
    })

    expect(name).toBeInTheDocument()
    expect(email).toBeInTheDocument()
    expect(password).toBeInTheDocument()
    expect(confirmPassword).toBeInTheDocument()
    expect(button).toBeInTheDocument()

    expect(container.parentElement).toMatchSnapshot()
  })

  it('should render text to sign in if already have an account', () => {
    render(
      <MockedProvider>
        <FormSignUp />
      </MockedProvider>
    )
    const signIn = screen.getByRole('link', {
      name: /sign in/i
    })
    const createAccountText = screen.getByText(/already have an account\?/i)

    expect(signIn).toBeInTheDocument()
    expect(createAccountText).toBeInTheDocument()
  })
})
