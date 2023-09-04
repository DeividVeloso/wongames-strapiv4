import {
  QueryGames_games,
  QueryGames_games_data_attributes
} from 'graphql/generated/QueryGames'
import { QueryHome_banners } from 'graphql/generated/QueryHome'
import formatPrice from 'utils/formatPrice'
import { QueryOrders_orders } from 'graphql/generated/QueryOrders'
import { getImageUrl } from 'utils/getImageUrl'
import { HighlightFragment } from 'graphql/generated/HighlightFragment'
import {
  QueryWishlist_wishlists_data_attributes_games,
  QueryWishlist_wishlists_data_attributes_games_data
} from 'graphql/generated/QueryWishlist'

export const bannerMapper = (banners: QueryHome_banners) => {
  return banners?.data.map(({ attributes: banner }) => {
    return {
      img: `${getImageUrl(banner?.image?.data?.attributes?.url)}`,
      title: banner?.title,
      subtitle: banner?.subtitle,
      buttonLabel: banner?.button?.label,
      buttonLink: banner?.button?.link,
      ...(banner?.ribbon && {
        ribbon: banner.ribbon?.text,
        ribbonColor: banner.ribbon?.color,
        ribbonSize: banner.ribbon?.size
      })
    }
  })
}

export const gamesMapper = (games: QueryGames_games | null | undefined) => {
  if (!games) {
    return []
  }

  return games?.data?.map(({ id, attributes: game }) => {
    return {
      id: id ? id : '',
      title: game?.name,
      slug: game?.slug,
      developer:
        game?.developers?.data?.length > 0
          ? game?.developers?.data[0]?.attributes?.name
          : '',
      img: `${getImageUrl(game?.cover?.data?.attributes?.url)}`,
      price: game?.price
    }
  })
}

export const highlightMapper = (
  highlight: HighlightFragment | null | undefined
) => {
  if (!highlight) {
    return {}
  }

  return {
    title: highlight?.title,
    subtitle: highlight?.subtitle,
    backgroundImage: `${getImageUrl(
      highlight.background?.data?.attributes?.url
    )}`,
    floatImage: `${getImageUrl(highlight.floatImage?.data?.attributes?.url)}`,
    buttonLabel: highlight?.buttonLabel,
    buttonLink: highlight?.buttonLink,
    alignment: highlight?.alignment
  }
}

export const cartMapper = (games: QueryGames_games | undefined | null) => {
  if (!games?.data) {
    return []
  }

  return games.data.map(({ id, attributes }) => {
    const game = attributes as QueryGames_games_data_attributes
    return {
      id: id!,
      title: game.name,
      img: `${getImageUrl(game?.cover?.data?.attributes?.url)}`,
      price: formatPrice(game?.price || 0)
    }
  })
}

export const ordersMapper = (orders: QueryOrders_orders | undefined) => {
  return orders?.data?.length > 0
    ? orders?.data.map(({ id, attributes: order }) => {
        return {
          id: id,
          paymentInfo: {
            flag: order?.card_brand,
            img: order?.card_brand
              ? `/img/cards/${order.card_brand}.png`
              : null,
            number: order?.card_last4
              ? `**** **** **** ${order.card_last4}`
              : 'Free Game',
            purchaseDate: `Purchase made on ${new Intl.DateTimeFormat('en-US', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            }).format(new Date(order?.createdAt))}`
          },
          games: order?.games?.data.map(({ id, attributes: game }) => {
            return {
              id: id,
              title: game?.name,
              downloadLink:
                'https://wongames.com/game/download/yuYT56Tgh431LkjhNBgdf',
              img: `${getImageUrl(game?.cover?.data?.attributes?.url)}`,
              price: formatPrice(game?.price || 0)
            }
          })
        }
      })
    : []
}
