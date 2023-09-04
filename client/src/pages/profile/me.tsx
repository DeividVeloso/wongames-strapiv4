import FormProfile, { FormProfileProps } from 'components/FormProfile'
import {
  QueryProfileMe,
  QueryProfileMeVariables
} from 'graphql/generated/QueryProfileMe'
import { QUERY_PROFILE_ME } from 'graphql/queries/profile'
import { GetServerSidePropsContext } from 'next'
import { SessionAuth } from 'next-auth'
import Profile from 'templates/Profile'
import { initializeApollo } from 'utils/apollo'
import protectedRoutes from 'utils/protected-routes'

export default function Me(props: FormProfileProps) {
  return (
    <Profile>
      <FormProfile {...props} />
    </Profile>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = (await protectedRoutes(context)) as SessionAuth

  if (!session) {
    return {
      props: {}
    }
  }

  //Com essa chamada eu estou me autenticando no apollo;database;api
  const apolloClient = initializeApollo(null, session)
  const { data } = await apolloClient.query<
    QueryProfileMe,
    QueryProfileMeVariables
  >({
    query: QUERY_PROFILE_ME
  })

  return {
    props: {
      session,
      username: data.me.username,
      email: data.me.email
    }
  }
}
