import { ItemProps } from 'components/ExploreSidebar'
import { ParsedUrlQueryInput } from 'querystring'

// export type ItemProps = {
//   title: string
//   name: string
//   type: string
//   fields: Field[]
// }

type ParseArgs = {
  queryString: ParsedUrlQueryInput
  filterItems: Pick<ItemProps, 'type' | 'name'>[]
}

export const parseQueryStringToWhere = ({ queryString }: ParseArgs) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filters: any = {}

  Object.keys(queryString)
    // Remove sort property from the parse
    .filter((item) => item !== 'sort')
    .forEach((key) => {
      if (key === 'price') {
        filters['price'] = {
          lte: Number(queryString[key])
        }
      } else {
        filters[key] = {
          slug: {
            in: queryString[key]
          }
        }
      }
    })

  console.log('filters', filters)
  return filters
}

export const parseQueryStringToFilter = ({
  queryString,
  filterItems
}: ParseArgs) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const obj: any = {}

  Object.keys(queryString).forEach((key) => {
    const item = filterItems?.find((item) => item.name === key)
    const isCheckbox = item?.type === 'checkbox'
    const isArray = Array.isArray(queryString[key])

    obj[key] = !isArray && isCheckbox ? [queryString[key]] : queryString[key]
  })

  console.log('parseQueryStringToFilter', obj)

  return obj
}
