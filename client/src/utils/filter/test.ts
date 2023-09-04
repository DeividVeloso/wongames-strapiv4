import { parseQueryStringToFilter, parseQueryStringToWhere } from '.'

const filterItems = [
  { name: 'price', type: 'radio' },
  { name: 'platforms', type: 'checkbox' },
  { name: 'categories', type: 'checkbox' },
  { name: 'sort', type: 'radio' }
]

const queryString = {
  price: 100,
  platforms: ['windows', 'linux'],
  categories: ['fantasy'],
  sort: 'price:asc'
}

describe('parseQueryStringToWhere', () => {
  it('should parse queryString to where format', () => {
    const parsedQuery = parseQueryStringToWhere({ queryString, filterItems })

    expect(parsedQuery).toStrictEqual({
      price: {
        lte: 100
      },
      platforms: { slug: { in: ['windows', 'linux'] } },
      categories: { slug: { in: ['fantasy'] } }
    })
  })
})

describe('parseQueryStringToFilter()', () => {
  it('should parse queryString to filter values format', () => {
    const parsedQuery = parseQueryStringToFilter({ queryString, filterItems })

    expect(parsedQuery).toStrictEqual({
      price: 100,
      platforms: ['windows', 'linux'],
      categories: ['fantasy'],
      sort: 'price:asc'
    })
  })
})
