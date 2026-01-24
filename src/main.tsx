import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { Spin } from 'antd';
import { PersistGate } from 'redux-persist/integration/react';
import App from './App.tsx';
import './index.css';
import store, { persistor } from './redux/store.ts';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={<Spin />} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </StrictMode>
);
