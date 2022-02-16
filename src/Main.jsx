import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.jsx';
import './styles/style.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Share from './components/Share';
import Confirmed from './components/Confirmed';

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path={'/'} element={<App />} />
      <Route path={'/share/:id'} element={<Share />} />
      <Route path={'/dialogueed'} element={<Confirmed />} />
    </Routes>
  </BrowserRouter>,
  document.getElementById('root'),
);