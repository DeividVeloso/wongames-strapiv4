import { MockedProvider } from '@apollo/client/testing'
import { WishlistProvider, useWishlist } from '.'
import { act, renderHook } from '@testing-library/react-hooks'
import {
  wishlistMock,
  wishlistItems,
  createWishlistMock,
  updateWishlistMock,
  removeWishlistMock
} from './mock'
import { SessionProvider } from 'next-auth/react'
import { waitFor } from 'utils/test-utils'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const useSession = jest.spyOn(require('next-auth/react'), 'useSession')
const data = { jwt: '123', user: { email: 'lorem@ipsum.com' }, expires: '1' }
useSession.mockImplementation(() => ({
  data: data
}))

describe.only('useWhislist', () => {
  it('should return wishlist items', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <SessionProvider session={null}>
        <MockedProvider mocks={[wishlistMock]}>
          <WishlistProvider>{children}</WishlistProvider>
        </MockedProvider>
      </SessionProvider>
    )

    const { result, waitForNextUpdate } = renderHook(() => useWishlist(), {
      wrapper
    })
    expect(result.current.loading).toBe(true)

    // wait until get the data
    await waitForNextUpdate()

    expect(result.current.items).toStrictEqual([
      wishlistItems[0],
      wishlistItems[1]
    ])
  })

  it('should return wishlist true if is in isInWishlist', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <SessionProvider session={null}>
        <MockedProvider mocks={[wishlistMock]}>
          <WishlistProvider>{children}</WishlistProvider>
        </MockedProvider>
      </SessionProvider>
    )

    const { result, waitForNextUpdate } = renderHook(() => useWishlist(), {
      wrapper
    })
    expect(result.current.loading).toBe(true)

    // wait until get the data
    await waitForNextUpdate()

    expect(result.current.isInWishlist('1')).toBe(true)
    expect(result.current.isInWishlist('2')).toBe(true)
    expect(result.current.isInWishlist('3')).toBe(false)
  })

  it('should add item in wishlist creating a new list', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <SessionProvider session={data}>
        <MockedProvider mocks={[createWishlistMock]}>
          <WishlistProvider>{children}</WishlistProvider>
        </MockedProvider>
      </SessionProvider>
    )

    const { result, waitForNextUpdate } = renderHook(() => useWishlist(), {
      wrapper
    })

    act(() => {
      result.current.addToWishlist('3')
    })

    await waitForNextUpdate()
    expect(result.current.items).toStrictEqual([wishlistItems[2]])
  })

  it('should add item in wishlist updating the current list', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <SessionProvider session={data}>
        <MockedProvider mocks={[wishlistMock, updateWishlistMock]}>
          <WishlistProvider>{children}</WishlistProvider>
        </MockedProvider>
      </SessionProvider>
    )

    const { result, waitForNextUpdate } = renderHook(() => useWishlist(), {
      wrapper
    })

    // wait for the data to load
    await waitForNextUpdate()

    act(() => {
      result.current.addToWishlist('3')
    })

    await waitFor(() => {
      expect(result.current.items).toStrictEqual(wishlistItems)
    })
  })

  it('should remove item from wishlist', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <SessionProvider session={data}>
        <MockedProvider mocks={[wishlistMock, removeWishlistMock]}>
          <WishlistProvider>{children}</WishlistProvider>
        </MockedProvider>
      </SessionProvider>
    )

    const { result, waitForNextUpdate } = renderHook(() => useWishlist(), {
      wrapper
    })

    // wait for the data to load
    await waitForNextUpdate()

    act(() => {
      result.current.removeFromWishlist('1')
    })

    await waitFor(() => {
      expect(result.current.items).toStrictEqual([wishlistItems[1]])
    })
  })
})
