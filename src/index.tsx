import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { SnackbarProvider } from 'notistack';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import Config from './libs/Config';
import { createUploadLink } from 'apollo-upload-client';

const queryClient = new QueryClient();

const client = new ApolloClient({
    link: createUploadLink({
        uri: Config.SERVER_API_URL
    }),
    cache: new InMemoryCache({
        resultCaching: false,
    }),
});

ReactDOM.render(
    // <React.StrictMode>
    <ApolloProvider client={client}>
        <SnackbarProvider maxSnack={3}>
            <QueryClientProvider client={queryClient}>
                <App />
            </QueryClientProvider>
        </SnackbarProvider>
    </ApolloProvider>,
    // </React.StrictMode>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
