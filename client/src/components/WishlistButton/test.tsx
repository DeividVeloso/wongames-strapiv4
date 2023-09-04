import { WishlistContextDefaultValues } from 'hooks/use-wishlist'
import { act, render, screen, waitFor } from 'utils/test-utils'
import WishlistButton from '.'
import { SessionProvider } from 'next-auth/react'
import userEvent from '@testing-library/user-event'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const useSession = jest.spyOn(require('next-auth/react'), 'useSession')
const data = { jwt: '123', user: { email: 'lorem@ipsum.com' }, expires: '1' }
useSession.mockImplementation(() => ({
  data: data
}))

describe('<WishlistButton', () => {
  it('should render a button to add to wishlist', () => {
    const wishlistProviderProps = {
      ...WishlistContextDefaultValues,
      isInWishlist: () => false
    }

    render(
      <SessionProvider session={data}>
        <WishlistButton id="1" />
      </SessionProvider>,
      { wishlistProviderProps }
    )
    expect(screen.getByLabelText(/add to wishlist/i)).toBeInTheDocument()
  })

  it('should render a button to remove from wishlist', () => {
    const wishlistProviderProps = {
      ...WishlistContextDefaultValues,
      isInWishlist: () => true
    }

    render(
      <SessionProvider session={data}>
        <WishlistButton id="1" />
      </SessionProvider>,
      { wishlistProviderProps }
    )
    expect(screen.getByLabelText(/remove from wishlist/i)).toBeInTheDocument()
  })

  it('should render a button with add to wishlist text', () => {
    const wishlistProviderProps = {
      ...WishlistContextDefaultValues,
      isInWishlist: () => false
    }

    render(
      <SessionProvider session={data}>
        <WishlistButton id="1" hasText />
      </SessionProvider>,
      { wishlistProviderProps }
    )

    expect(screen.getByText(/add to wishlist/i)).toBeInTheDocument()
  })

  it('should render a button with remove from wishlist text', () => {
    const wishlistProviderProps = {
      ...WishlistContextDefaultValues,
      isInWishlist: () => true
    }

    render(
      <SessionProvider session={data}>
        <WishlistButton id="1" hasText />
      </SessionProvider>,
      { wishlistProviderProps }
    )

    expect(screen.getByText(/remove from wishlist/i)).toBeInTheDocument()
  })

  it('should not render if not logged', () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const useSession = jest.spyOn(require('next-auth/react'), 'useSession')
    useSession.mockImplementationOnce(() => ({
      data: null
    }))

    const wishlistProviderProps = {
      ...WishlistContextDefaultValues,
      isInWishlist: () => true
    }

    render(
      <SessionProvider session={null}>
        <WishlistButton id="1" hasText />
      </SessionProvider>,
      { wishlistProviderProps }
    )

    expect(screen.queryByText(/remove from wishlist/i)).not.toBeInTheDocument()
  })

  it('should add to wishlist', async () => {
    const wishlistProviderProps = {
      ...WishlistContextDefaultValues,
      isInWishlist: () => false,
      addToWishlist: jest.fn()
    }

    render(<WishlistButton id="1" hasText />, { wishlistProviderProps })

    act(() => {
      userEvent.click(screen.getByText(/add to wishlist/i))
    })

    waitFor(() => {
      expect(wishlistProviderProps.addToWishlist).toHaveBeenCalledWith('1')
    })
  })

  it('should remove from wishlist', async () => {
    const wishlistProviderProps = {
      ...WishlistContextDefaultValues,
      isInWishlist: () => true,
      removeFromWishlist: jest.fn()
    }

    render(<WishlistButton id="1" hasText />, { wishlistProviderProps })

    act(() => {
      userEvent.click(screen.getByText(/remove from wishlist/i))
    })

    waitFor(() => {
      expect(wishlistProviderProps.removeFromWishlist).toHaveBeenCalledWith('1')
    })
  })
})
