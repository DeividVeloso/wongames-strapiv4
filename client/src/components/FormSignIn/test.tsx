/* eslint-disable @typescript-eslint/no-var-requires */
import { render, screen } from 'utils/test-utils'

import FormSignIn from '.'

const useRouter = jest.spyOn(require('next/router'), 'useRouter')
const push = jest.fn()

useRouter.mockImplementation(() => ({
  push,
  query: '',
  asPath: '',
  route: '/'
}))

describe('<FormSignIn />', () => {
  it('should render the heading', () => {
    const { container } = render(<FormSignIn />)
    const email = screen.getByPlaceholderText(/email/i)
    const password = screen.getByText(/password/i)
    const button = screen.getByRole('button', {
      name: /sign in now/i
    })

    expect(email).toBeInTheDocument()
    expect(password).toBeInTheDocument()
    expect(button).toBeInTheDocument()

    expect(container.parentElement).toMatchSnapshot()
  })

  it('should render the forgot password link', () => {
    render(<FormSignIn />)
    const forgotLink = screen.getByRole('link', {
      name: /forgot your password/i
    })

    expect(forgotLink).toBeInTheDocument()
  })

  it('should render text to sign up if already have an account', () => {
    render(<FormSignIn />)
    const signUp = screen.getByRole('link', {
      name: /sign up/i
    })
    const createAccountText = screen.getByText(/do not have an account\?/i)

    expect(signUp).toBeInTheDocument()
    expect(createAccountText).toBeInTheDocument()
  })
})
