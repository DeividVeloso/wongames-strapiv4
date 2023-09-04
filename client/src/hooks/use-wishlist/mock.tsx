import {
  MUTATION_CREATE_WISHLIST,
  MUTATION_UPDATE_WISHLIST
} from 'graphql/mutations/wishlist'
import { QUERY_WISHLIST } from 'graphql/queries/wishlist'

const gameMock = (id: string) => ({
  id: id,
  attributes: {
    name: `Sample Game ${id}`,
    slug: `sample-game-${id}`,
    cover: {
      data: {
        attributes: {
          url: '/sample-game.jpg',
          __typename: 'UploadFile'
        },
        __typename: 'UploadFileEntity'
      },
      __typename: 'UploadFileEntityResponse'
    },
    developers: {
      data: [
        {
          attributes: {
            name: 'sample developer',
            __typename: 'Developer'
          },
          __typename: 'DeveloperEntity'
        }
      ],
      __typename: 'DeveloperRelationResponseCollection'
    },
    price: 10.5,
    __typename: 'Game'
  },
  __typename: 'GameEntity'
})

export const wishlistMock = {
  request: {
    query: QUERY_WISHLIST,
    context: { session: { jwt: '123' } },
    variables: {
      identifier: 'lorem@ipsum.com'
    }
  },
  result: {
    data: {
      wishlists: {
        data: [
          {
            id: 1,
            attributes: {
              games: {
                data: [gameMock('1'), gameMock('2')]
              }
            }
          }
        ]
      }
    }
  }
}

export const createWishlistMock = {
  request: {
    query: MUTATION_CREATE_WISHLIST,
    context: { session: { jwt: '123' } },
    variables: {
      data: {
        games: ['3']
      }
    }
  },
  result: {
    data: {
      createWishlist: {
        data: {
          id: 1,
          attributes: {
            games: {
              data: [gameMock('3')],
              __typename: 'GameRelationResponseCollection'
            },
            __typename: 'Wishlist'
          },
          __typename: 'WishlistEntity'
        },
        __typename: 'WishlistEntityResponse'
      }
    }
  }
}

export const updateWishlistMock = {
  request: {
    query: MUTATION_UPDATE_WISHLIST,
    context: { session: { jwt: '123' } },
    variables: {
      id: 1,
      data: {
        games: ['1', '2', '3']
      }
    }
  },
  result: {
    data: {
      updateWishlist: {
        data: {
          id: 1,
          attributes: {
            games: {
              data: [gameMock('1'), gameMock('2'), gameMock('3')],
              __typename: 'GameRelationResponseCollection'
            },
            __typename: 'Wishlist'
          },
          __typename: 'WishlistEntity'
        },
        __typename: 'WishlistEntityResponse'
      }
    }
  }
}

export const removeWishlistMock = {
  request: {
    query: MUTATION_UPDATE_WISHLIST,
    context: { session: { jwt: '123' } },
    variables: {
      id: 1,
      data: {
        games: ['2']
      }
    }
  },
  result: {
    data: {
      updateWishlist: {
        data: {
          id: 1,
          attributes: {
            games: {
              data: [gameMock('2')],
              __typename: 'GameRelationResponseCollection'
            },
            __typename: 'Wishlist'
          },
          __typename: 'WishlistEntity'
        },
        __typename: 'WishlistEntityResponse'
      }
    }
  }
}

export const wishlistItems = [
  {
    id: '1',
    title: 'Sample Game 1',
    slug: 'sample-game-1',
    developer: 'sample developer',
    img: 'http://localhost:1337/sample-game.jpg',
    price: 10.5
  },
  {
    id: '2',
    title: 'Sample Game 2',
    slug: 'sample-game-2',
    developer: 'sample developer',
    img: 'http://localhost:1337/sample-game.jpg',
    price: 10.5
  },
  {
    id: '3',
    title: 'Sample Game 3',
    slug: 'sample-game-3',
    developer: 'sample developer',
    img: 'http://localhost:1337/sample-game.jpg',
    price: 10.5
  }
]
