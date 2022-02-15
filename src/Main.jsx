import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.jsx';
import './styles/style.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Share from './components/Share';

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path={'/'} element={<App />} />
      <Route path={'/share/:id'} element={<Share />} />
    </Routes>
  </BrowserRouter>,
  document.getElementById('root'),
);