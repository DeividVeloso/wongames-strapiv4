import { useRouter } from 'next/router'

import * as S from './styles'
import GameCard from 'components/GameCard'
import Base from 'templates/Base'
import ExploreSidebar, { ItemProps } from 'components/ExploreSidebar'
import { Grid } from 'components/Grid'
import { KeyboardArrowDown } from '@styled-icons/material-outlined'
import { useQueryGames } from 'graphql/queries/games'
import { parseQueryStringToFilter, parseQueryStringToWhere } from 'utils/filter' //parseQueryStringToWhere
import { ParsedUrlQueryInput } from 'querystring'
import Empty from 'components/Empty'
import { getImageUrl } from 'utils/getImageUrl'

export type GamesTemplateProps = {
  filterItems: ItemProps[]
}

const Games = ({ filterItems }: GamesTemplateProps) => {
  const { push, query } = useRouter()

  const { data, loading, fetchMore } = useQueryGames({
    notifyOnNetworkStatusChange: true,
    variables: {
      pagination: {
        limit: 15
      },
      filters: parseQueryStringToWhere({ queryString: query, filterItems }),
      sort: [query.sort as string]
    }
    //fetchPolicy: 'no-cache'
  })

  if (!data) {
    return <p>Loading...</p>
  }

  const hasMoreGames =
    data?.games?.data?.length < (data?.games?.meta?.pagination?.total || 0)

  const handleFilter = (items: ParsedUrlQueryInput) => {
    push({
      pathname: '/games',
      query: items
    })
    return
  }

  const handleShowMore = () => {
    console.log('START', data?.games?.data.length)
    fetchMore({
      variables: {
        pagination: {
          limit: 15,
          start: data?.games?.data?.length || 0
        }
      }
    })
  }

  console.log('data?.games?.data======>', data?.games?.data)

  return (
    <Base>
      <S.Main>
        <ExploreSidebar
          initialValues={parseQueryStringToFilter({
            queryString: query,
            filterItems
          })}
          items={filterItems}
          onFilter={handleFilter}
        />

        <section>
          {data?.games?.data?.length ? (
            <>
              <Grid>
                {data?.games?.data?.map(({ id, attributes: game }) => {
                  return (
                    <GameCard
                      id={id}
                      key={game?.slug}
                      title={game.name}
                      slug={game.slug}
                      developer={
                        game.developers.data.length > 0
                          ? game.developers?.data[0]?.attributes?.name
                          : ''
                      }
                      img={`${getImageUrl(game?.cover?.data?.attributes?.url)}`}
                      price={game.price}
                    />
                  )
                })}
              </Grid>

              {hasMoreGames && (
                <S.ShowMore>
                  {loading ? (
                    <S.ShowMoreLoading
                      src="/img/dots.svg"
                      alt="Loading more games..."
                    ></S.ShowMoreLoading>
                  ) : (
                    <S.ShowMoreButton role="button" onClick={handleShowMore}>
                      <p>Show more</p>
                      <KeyboardArrowDown size={35} />
                    </S.ShowMoreButton>
                  )}
                </S.ShowMore>
              )}
            </>
          ) : (
            <Empty
              title=":("
              description="We didn't find any games with this filter"
              hasLink
            ></Empty>
          )}
        </section>
      </S.Main>
    </Base>
  )
}

export default Games
