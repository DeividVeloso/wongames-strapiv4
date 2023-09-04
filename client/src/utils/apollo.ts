import { ApolloClient, HttpLink, NormalizedCacheObject } from '@apollo/client'
import { useMemo } from 'react'
import apolloCache from './apolloCache'
import { setContext } from '@apollo/client/link/context'
import { SessionAuth } from 'next-auth'

let apolloClient: ApolloClient<NormalizedCacheObject | null>

function createApolloClient(session?: SessionAuth | null) {
  const httpLink = new HttpLink({
    uri: `${process.env.NEXT_PUBLIC_API_URL}/graphql`
  })

  const authLink = setContext((_, { headers, session: clientSession }) => {
    const jwt = session?.jwt || clientSession?.jwt || ''
    const authorization = jwt ? `Bearer ${jwt}` : ''
    return { headers: { ...headers, authorization } }
  })

  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: authLink.concat(httpLink),

    cache: apolloCache
  })
}

export function initializeApollo(
  initialState = null,
  session?: SessionAuth | null
) {
  // serve para verificar se já existe uma instância para não criar outra.
  const apolloClientGlobal = apolloClient ?? createApolloClient(session)

  // recuperando o cache
  if (initialState) {
    apolloClientGlobal.cache.restore(initialState)
  }

  //sempre incializando no SSR com o cache limpo
  if (typeof window === 'undefined') {
    return apolloClientGlobal
  }

  apolloClient = apolloClient ?? apolloClientGlobal

  return apolloClient
}

export function useApollo(initialState = null, session?: SessionAuth | null) {
  // se o state não mudou utiliza o mesmo objeto.
  const store = useMemo(
    () => initializeApollo(initialState, session),
    [initialState, session]
  )
  return store
}
