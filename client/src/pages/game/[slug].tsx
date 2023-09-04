import { GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import { initializeApollo } from 'utils/apollo'

import Game, { GameTemplateProps } from 'templates/Game'

import { QueryGames, QueryGamesVariables } from 'graphql/generated/QueryGames'
import { QUERY_GAMES, QUERY_GAME_BY_SLUG } from 'graphql/queries/games'
import {
  QueryGameBySlug,
  QueryGameBySlugVariables
} from 'graphql/generated/QueryGameBySlug'
import { QueryRecommended } from 'graphql/generated/QueryRecommended'
import { QUERY_RECOMMENDED } from 'graphql/queries/recommended'
import { gamesMapper, highlightMapper } from 'utils/mappers'
import {
  QueryUpcoming,
  QueryUpcomingVariables
} from 'graphql/generated/QueryUpcoming'
import { QUERY_UPCOMING } from 'graphql/queries/upcoming'
import { getImageUrl } from 'utils/getImageUrl'

const apolloClient = initializeApollo()

export default function Index(props: GameTemplateProps) {
  const router = useRouter()

  /**
   * isFallback é a propriedade que o nextjs usa para saber se a página
   * já foi gerada ou ainda está em processamento.
   *
   * Se a rota não tiver sido gerada ainda
   * Podemos mostrar um loading
   * Uma tela de esqueleto
   * e etc.
   */
  if (router.isFallback) return null

  return <Game {...props} />
}

//Aqui ele gera as URL das páginas /game/bla
//E gera os arquivos em build time das páginas ex: /game/bla.tsx, game/foo.tsx
export async function getStaticPaths() {
  const { data } = await apolloClient.query<QueryGames, QueryGamesVariables>({
    query: QUERY_GAMES,
    variables: { limit: 9 }
  })

  //Gera as páginas com os arquivos basedaos no slug
  const paths = data.games.data.map(({ attributes: { slug } }) => ({
    params: { slug }
  }))

  return {
    paths,
    fallback: 'blocking'
  }
}

//Ele gera a página especifica alimenta com os dados.
export const getStaticProps: GetStaticProps = async ({ params }) => {
  // Get game data
  const { data } = await apolloClient.query<
    QueryGameBySlug,
    QueryGameBySlugVariables
  >({
    query: QUERY_GAME_BY_SLUG,
    variables: { slug: `${params?.slug}` }
  })

  if (!data.games.data.length) {
    // Essa propriedade o NEXTJS entende que não achou o dado e redireciona para página 404
    return { notFound: true }
  }

  const game = data.games.data[0].attributes

  // get recommended games
  const { data: recommendedSection } =
    await apolloClient.query<QueryRecommended>({
      query: QUERY_RECOMMENDED
    })

  const currentDate = new Date().toISOString().slice(0, 10) // 2023-02-19

  //get upcoming games
  const { data: upcomingSection } = await apolloClient.query<
    QueryUpcoming,
    QueryUpcomingVariables
  >({
    query: QUERY_UPCOMING,
    variables: {
      date: currentDate
    },
    fetchPolicy: 'no-cache'
  })

  return {
    revalidate: 60,
    props: {
      slug: params?.slug,
      cover: `${getImageUrl(game?.cover?.data?.attributes?.src)}`,
      gameInfo: {
        id: data.games.data[0].id,
        title: game.name,
        price: game.price,
        description: game.short_description
      },
      gallery: game.gallery.data.map(({ attributes: image }) => ({
        src: `${getImageUrl(image.src)}`,
        label: image.label
      })),
      description: game.description,
      details: {
        developer:
          game.developers.data.length > 0
            ? game.developers?.data[0]?.attributes?.name
            : '',
        releaseDate: game.release_date,
        platforms: game.platforms.data.map(
          ({ attributes: platform }) => platform.name
        ),
        publisher: game.publisher.data.attributes.name,
        rating: game.rating,
        genres: game.categories.data.map(
          ({ attributes: category }) => category.name
        )
      },
      upcomingTitle:
        upcomingSection.showCase.data.attributes.upcomingGames.title,
      upcomingGames: gamesMapper(upcomingSection.upcomingGames),
      upcomingHighlight: highlightMapper(
        upcomingSection.showCase.data.attributes.upcomingGames.highlight
      ),
      recommendedTitle:
        recommendedSection.recommended.data.attributes.section.title || null,
      recommendedGames: gamesMapper(
        recommendedSection.recommended.data.attributes.section.games
      )
    }
  }
}
