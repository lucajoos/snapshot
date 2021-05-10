import React, { useCallback, useEffect } from 'react';
import ButtonList from './ButtonList';
import Store from '../Store';
import Button from './Button';

const App = () => {
  useEffect(() => {
    if(!localStorage.getItem('options')) {
      localStorage.setItem('options', JSON.stringify({
        buttons: []
      }));
    }

    try {
      const options = JSON.parse(localStorage.getItem('options'));

      if(options?.buttons) {
        Store.buttons = options.buttons;
      }
    } catch(e) {
      console.error(e);
    }
  }, []);

  const handleOnClick = useCallback(async () => {
    let tabs = await chrome.tabs.query({});
    console.log(tabs)
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
