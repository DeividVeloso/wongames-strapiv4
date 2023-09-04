import Home, { HomeTemplateProps } from 'templates/Home'

import { initializeApollo } from 'utils/apollo'
import { QUERY_HOME } from 'graphql/queries/home'
import { QueryHome, QueryHomeVariables } from 'graphql/generated/QueryHome'
import { bannerMapper, gamesMapper, highlightMapper } from 'utils/mappers'

export default function Index(props: HomeTemplateProps) {
  return <Home {...props} />
}

export async function getStaticProps() {
  const apolloClient = initializeApollo()
  const currentDate = new Date().toISOString().slice(0, 10) // 2023-02-17

  const {
    data: { banners, newGames, upcomingGames, freeGames, sections }
  } = await apolloClient.query<QueryHome, QueryHomeVariables>({
    query: QUERY_HOME,
    variables: {
      date: currentDate
    },
    fetchPolicy: 'no-cache' // garantir sempre dado novo na geração do estático!
  })

  return {
    revalidate: 10,
    props: {
      banners: bannerMapper(banners),
      newGamesTitle: sections?.data?.attributes.newGames.title,
      mostPopularGamesTitle: sections?.data?.attributes.popularGames?.title,
      upcomingGamesTitle: sections?.data?.attributes.upcomingGames?.title,
      freeGamesTitle: sections?.data?.attributes.freeGames?.title,
      newGames: gamesMapper(newGames),
      mostPopularGames: gamesMapper(
        sections?.data?.attributes?.popularGames?.games
      ),
      freeGames: gamesMapper(freeGames),
      upcomingGames: gamesMapper(upcomingGames),
      mostPopularHighlight: highlightMapper(
        sections?.data?.attributes?.popularGames?.highlight
      ),
      upcomingHighlight: highlightMapper(
        sections?.data?.attributes?.upcomingGames?.highlight
      ),
      freeHighlight: highlightMapper(
        sections?.data?.attributes?.freeGames?.highlight
      )
    }
  }
}
