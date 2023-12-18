import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { store,persistor } from './redux/store';
import reportWebVitals from './reportWebVitals';
import App from './App';
import { BrowserRouter } from "react-router-dom";
import {QueryClient, QueryClientProvider} from 'react-query';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
const queryClient = new QueryClient();
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
 <BrowserRouter>


<QueryClientProvider client={queryClient}>

<Provider store={store}>
<PersistGate loading={null} persistor={persistor}>
<App/>
      </PersistGate>

</Provider>
{/* <ReactQueryDevtools initialIsOpen={false} /> */}


</QueryClientProvider>


 </BrowserRouter>
  
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
