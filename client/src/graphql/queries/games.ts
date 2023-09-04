import { gql, QueryHookOptions, useQuery } from '@apollo/client'
import { GameFragment } from 'graphql/fragments/game'
import { QueryGames, QueryGamesVariables } from 'graphql/generated/QueryGames'

export const QUERY_GAMES = gql`
  query QueryGames(
    $pagination: PaginationArg
    $filters: GameFiltersInput
    $sort: [String]
  ) {
    games(pagination: $pagination, filters: $filters, sort: $sort) {
      data {
        id
        attributes {
          ...GameFragment
        }
      }
      meta {
        pagination {
          total
        }
      }
    }
  }

  ${GameFragment}
`

export const QUERY_GAME_BY_SLUG = gql`
  query QueryGameBySlug($slug: String!) {
    games(filters: { slug: { eq: $slug } }) {
      data {
        id
        attributes {
          name
          short_description
          description
          price
          rating
          release_date
          gallery {
            data {
              attributes {
                src: url
                label: alternativeText
              }
            }
          }
          cover {
            data {
              attributes {
                src: url
              }
            }
          }
          developers {
            data {
              attributes {
                name
              }
            }
          }
          publisher {
            data {
              attributes {
                name
              }
            }
          }
          categories {
            data {
              attributes {
                name
              }
            }
          }
          platforms {
            data {
              attributes {
                name
              }
            }
          }
        }
      }
    }
  }
`

export const useQueryGames = (
  options?: QueryHookOptions<QueryGames, QueryGamesVariables>
) => {
  return useQuery<QueryGames, QueryGamesVariables>(QUERY_GAMES, options)
}
