import React, { useCallback, useEffect } from 'react';
import ButtonList from './ButtonList';
import Store from '../Store';
import Button from './Button';
import { useSnapshot } from 'valtio';

const App = () => {
  const snap = useSnapshot(Store);

  useEffect(() => {
    if(!localStorage.getItem('buttons')) {
      localStorage.setItem('buttons', JSON.stringify({
        value: []
      }));
    }

    try {
      const buttons = JSON.parse(localStorage.getItem('buttons'))?.value;

      console.log(buttons)

      if(buttons) {
        Store.buttons = buttons;
      }
    } catch(e) {
      console.error(e);
    }
  }, []);

  const handleOnClick = useCallback(async () => {
    let tabs = [{
      url: 'hello'
    }, {
      url: 'world'
    }];

    let urls = [];

    tabs?.forEach(tab => {
      urls.push(tab.url);
    });

    const buttons = Store.buttons;

    buttons.push({
      title: 'New title',
      urls: urls
    });

    localStorage.setItem('buttons', JSON.stringify({value: buttons}));

    Store.buttons = buttons;
  }, []);

  return (
    <div className={'p-5 h-full w-full'}>
      <ButtonList />

      <div onClick={() => handleOnClick()}>
        Add new
      </div>
    </div>
  );
};

export default App;
