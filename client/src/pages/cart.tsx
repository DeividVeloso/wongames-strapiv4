import { GetServerSidePropsContext } from 'next'

import Cart, { CartProps } from 'templates/Cart'

import { initializeApollo } from 'utils/apollo'
import { QueryRecommended } from 'graphql/generated/QueryRecommended'
import { QUERY_RECOMMENDED } from 'graphql/queries/recommended'
import { gamesMapper, highlightMapper } from 'utils/mappers'
import protectedRoutes from 'utils/protected-routes'

export default function CartPage(props: CartProps) {
  return <Cart {...props} />
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await protectedRoutes(context)

  if (!session) {
    return { props: {} }
  }

  const apolloClient = initializeApollo(null, session)
  const { data } = await apolloClient.query<QueryRecommended>({
    query: QUERY_RECOMMENDED
  })

  return {
    props: {
      session,
      recommendedTitle:
        data?.recommended?.data?.attributes?.section.title || null,
      recommendedGames: gamesMapper(
        data?.recommended?.data?.attributes?.section.games
      ),
      recommendedHighlight: highlightMapper(
        data?.recommended?.data?.attributes?.section?.highlight
      )
    }
  }
}
