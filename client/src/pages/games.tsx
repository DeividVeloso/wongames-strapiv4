import { initializeApollo } from 'utils/apollo'
import { QUERY_GAMES } from 'graphql/queries/games'
import { QueryGames, QueryGamesVariables } from 'graphql/generated/QueryGames'

import GamesTemplate, { GamesTemplateProps } from 'templates/Games'
import { GetServerSidePropsContext } from 'next'
import { parseQueryStringToWhere } from 'utils/filter'

import {
  genreFields,
  platformFields,
  priceFields,
  sortFields
} from 'utils/filter/fields'

export default function GamesPage(props: GamesTemplateProps) {
  return <GamesTemplate {...props} />
}

export async function getServerSideProps({ query }: GetServerSidePropsContext) {
  const filterPrice = {
    title: 'Price',
    name: 'price',
    type: 'radio',
    fields: priceFields
  }

  const filterPlatforms = {
    title: 'Platforms',
    name: 'platforms',
    type: 'checkbox',
    fields: platformFields
  }

  const filterSort = {
    title: 'Sort by price',
    name: 'sort',
    type: 'radio',
    fields: sortFields
  }

  const filterCategories = {
    title: 'Genres',
    name: 'categories',
    type: 'checkbox',
    fields: genreFields
  }

  const filterItems = [
    filterSort,
    filterPrice,
    filterPlatforms,
    filterCategories
  ]

  const apolloClient = initializeApollo()
  await apolloClient.query<QueryGames, QueryGamesVariables>({
    query: QUERY_GAMES,
    variables: {
      pagination: {
        limit: 15
      },
      filters: parseQueryStringToWhere({ queryString: query, filterItems }),
      sort: [query.sort as string]
    }
  })

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
      filterItems: filterItems
    }
  }
}
