import React, { useEffect } from 'react';
import ButtonList from './ButtonList';
import Store from '../Store';

const App = () => {
  useEffect(() => {
    Store.buttons = [
      {
        title: 'hello 1',
        meta: 'Created yesterday at 9 PM',
        color: 'blue'
      },

      {
        title: 'hello 2',
        meta: 'Created yesterday at 9 PM',
        color: 'violet'
      },

      {
        title: 'hello 3',
        meta: 'Created yesterday at 9 PM',
        color: 'green'
      }
    ]
  }, []);

  return (
    <div className={'p-5 h-full w-full'}>
      <ButtonList />

      <h1>Some text</h1>
    </div>
  );
};

export default App;
