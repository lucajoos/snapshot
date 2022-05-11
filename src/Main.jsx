import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/Routes/App.jsx';
import './styles/style.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Share from './components/Routes/Share.jsx';
import Confirmation from './components/Routes/Confirmation.jsx';

ReactDOM.render(
  import.meta.env.VITE_APP_ENVIRONMENT === 'extension' ? (
    <App />
  ) : (
    <BrowserRouter>
      <Routes>
        <Route path={'/'} element={<App />} />
        <Route path={'/s/:id'} element={<Share />} />
        <Route path={'/confirmation'} element={<Confirmation />} />
      </Routes>
    </BrowserRouter>
  ),
  document.getElementById('root'),
);