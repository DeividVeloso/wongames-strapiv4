import Wishlist, { WishlistTemplateProps } from 'templates/Wishlist'
// import * as S from './styles'

import { initializeApollo } from 'utils/apollo'
import { QUERY_RECOMMENDED } from 'graphql/queries/recommended'
import { gamesMapper, highlightMapper } from 'utils/mappers'
import { QueryRecommended } from 'graphql/generated/QueryRecommended'
import protectedRoutes from 'utils/protected-routes'
import { GetServerSidePropsContext } from 'next'
import {
  QueryWishlist,
  QueryWishlistVariables
} from 'graphql/generated/QueryWishlist'
import { QUERY_WISHLIST } from 'graphql/queries/wishlist'

export default function WishlistPage(props: WishlistTemplateProps) {
  return <Wishlist {...props}></Wishlist>
}

// Se a página não for publica devemos utilizar o getStaticProps,
// pois assim podemos gerar a página em tempo de build pra ter mais performance
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await protectedRoutes(context)

  if (!session) {
    return { props: {} }
  }

  const apolloClient = initializeApollo(null, session)

  if (!session) return {}

  await apolloClient.query<QueryWishlist, QueryWishlistVariables>({
    query: QUERY_WISHLIST,
    variables: {
      identifier: session?.user?.email as string
    }
  })

  const { data } = await apolloClient.query<QueryRecommended>({
    query: QUERY_RECOMMENDED
  })

  console.log('cypress====>', data)

  return {
    props: {
      session,
      initialApolloState: apolloClient.cache.extract(),
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
