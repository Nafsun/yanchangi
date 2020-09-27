import React from 'react';
import { MuiThemeProvider } from 'material-ui/styles/';
import BottomRoute from './components/bottomroute/BottomRoute';
import TopRoute from './components/toproute/TopRoute';
import ApolloClient from 'apollo-client';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {createUploadLink} from 'apollo-upload-client';
import { ApolloProvider } from 'react-apollo';
import './style.css';

const apolloCache = new InMemoryCache();
const uploadLink = createUploadLink({uri: '/graphql'});
const client = new ApolloClient({cache: apolloCache, link: uploadLink});

function App() {
  return (
    <div>
    <MuiThemeProvider>
        <ApolloProvider client={client}>
          <TopRoute/>
          <BottomRoute/>
        </ApolloProvider>
    </MuiThemeProvider>
    </div>
  );
}

export default App;