import { AuthProvider } from '@redwoodjs/auth'
import netlifyIdentity from 'netlify-identity-widget'
import ReactDOM from 'react-dom'
import {
  GraphQLClient,
  ClientContext,
  useQuery,
  useMutation,
} from 'graphql-hooks'
import { print } from 'graphql'
import {
  FatalErrorBoundary,
  FetchConfigProvider,
  FlashProvider,
  GraphQLHooksProvider,
  useFetchConfig,
} from '@redwoodjs/web'
import FatalErrorPage from 'src/pages/FatalErrorPage'

import Routes from 'src/Routes'

import './scaffold.css'
import './index.css'

netlifyIdentity.init()

const useQueryAdapter = (query, options) => {
  return useQuery(print(query), options)
}

const useMutationAdapter = (query, options) => {
  return useMutation(print(query), options)
}

const GraphqlHooksProvider = ({ children }) => {
  const { uri: url, headers } = useFetchConfig()

  const client = new GraphQLClient({ url, headers })

  return (
    <ClientContext.Provider value={client}>{children}</ClientContext.Provider>
  )
}

ReactDOM.render(
  <FatalErrorBoundary page={FatalErrorPage}>
    <AuthProvider client={netlifyIdentity} type="netlify">
      <FetchConfigProvider>
        <GraphqlHooksProvider>
          <GraphQLHooksProvider
            useQuery={useQueryAdapter}
            useMutation={useMutationAdapter}
          >
            <FlashProvider>
              <Routes />
            </FlashProvider>
          </GraphQLHooksProvider>
        </GraphqlHooksProvider>
      </FetchConfigProvider>
    </AuthProvider>
  </FatalErrorBoundary>,
  document.getElementById('redwood-app')
)
