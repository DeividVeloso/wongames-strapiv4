import { gql } from '@apollo/client'
import { GameFragment } from 'graphql/fragments/game'

export const MUTATION_CREATE_WISHLIST = gql`
  mutation MutationCreateWishlist($data: WishlistInput!) {
    createWishlist(data: $data) {
      data {
        id
        attributes {
          games {
            data {
              id
              attributes {
                ...GameFragment
              }
            }
          }
        }
      }
    }
  }
  ${GameFragment}
`

export const MUTATION_UPDATE_WISHLIST = gql`
  mutation MutationUpdateWishlist($id: ID!, $data: WishlistInput!) {
    updateWishlist(id: $id, data: $data) {
      data {
        id
        attributes {
          games {
            data {
              id
              attributes {
                ...GameFragment
              }
            }
          }
        }
      }
    }
  }
  ${GameFragment}
`
