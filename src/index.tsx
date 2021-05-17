import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { SnackbarProvider } from 'notistack';
import { QueryClient, QueryClientProvider } from 'react-query';
import Config from './libs/Config';

const queryClient = new QueryClient();

ReactDOM.render(
    // <React.StrictMode>
    <SnackbarProvider maxSnack={3}>
        <QueryClientProvider client={queryClient}>
            <App />
        </QueryClientProvider>
    </SnackbarProvider>,

    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
