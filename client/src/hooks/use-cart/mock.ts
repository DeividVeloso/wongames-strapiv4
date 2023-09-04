import { QUERY_GAMES } from 'graphql/queries/games'

export const gamesMock = {
  request: {
    query: QUERY_GAMES,
    variables: { filters: { id: { in: ['1', '2'] } } }
  },
  result: {
    data: {
      games: {
        data: [
          {
            id: '1',
            attributes: {
              name: 'Sample Game',
              slug: 'sample-game',
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
          },
          {
            id: '2',
            attributes: {
              name: 'Sample Game',
              slug: 'sample-game',
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
          }
        ],
        meta: {
          pagination: {
            total: 2,
            __typename: 'Pagination'
          },
          __typename: 'ResponseCollectionMeta'
        },
        __typename: 'GameEntityResponseCollection'
      }
    }
  }
}

export const cartItems = [
  {
    id: '1',
    img: 'http://localhost:1337/sample-game.jpg',
    price: '$10.50',
    title: 'Sample Game'
  },
  {
    id: '2',
    img: 'http://localhost:1337/sample-game.jpg',
    price: '$10.50',
    title: 'Sample Game'
  }
]
