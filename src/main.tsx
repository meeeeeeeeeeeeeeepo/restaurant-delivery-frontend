import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'urql';
import { client } from './client';
import { App } from './components/App';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider value={client}>
      <App />
    </Provider>
  </React.StrictMode>
);
