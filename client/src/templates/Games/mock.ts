import { QUERY_GAMES } from 'graphql/queries/games'

export const noGamesMock = {
  request: {
    query: QUERY_GAMES,
    variables: {
      pagination: {
        limit: 15
      },
      filters: {},
      sort: [undefined]
    }
  },
  result: {
    data: {
      games: {
        data: [],
        meta: {
          pagination: {
            total: 0,
            __typename: 'Pagination'
          },
          __typename: 'ResponseCollectionMeta'
        },
        __typename: 'GameEntityResponseCollection'
      }
    }
  }
}

export const gamesMock = {
  request: {
    query: QUERY_GAMES,
    variables: {
      pagination: {
        limit: 15
      },
      filters: {},
      sort: [undefined]
    }
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

export const fetchMoreMock = {
  request: {
    query: QUERY_GAMES,
    variables: {
      pagination: {
        limit: 15,
        start: 1
      },
      filters: {},
      sort: [undefined]
    }
  },
  result: {
    data: {
      games: {
        data: [
          {
            id: '2',
            attributes: {
              name: 'Fetch More Game',
              slug: 'sample-game-2',
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
