import { InMemoryCache } from '@apollo/client'
import _uniqBy from 'lodash/uniqBy'

export default new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        games: {
          keyArgs: ['filters', 'sort'],
          merge(existing, incoming) {
            if (existing?.data.length) {
              const mergedData = _uniqBy(
                [existing?.data, incoming?.data].flat(),
                '__ref'
              )

              console.log('mergedData', mergedData)

              return {
                data: mergedData,
                meta: incoming.meta
              }
            } else {
              return incoming
            }
          }
        }
      }
    },
    Wishlist: {
      fields: {
        games: {
          merge(_, incoming) {
            return incoming
          }
        }
      }
    }
  }
})
