import React, { useCallback, useEffect, useRef, useState } from 'react';
import CardList from './CardList';
import Store from '../Store';
import Modal from './Modal';
import { useSnapshot } from 'valtio';

const App = () => {
  const snap = useSnapshot(Store);

  useEffect(() => {
    if(!localStorage.getItem('cards')) {
      localStorage.setItem('cards', JSON.stringify({
        value: []
      }));
    }

    try {
      const cards = JSON.parse(localStorage.getItem('cards'))?.value;

      console.log(cards)

      if(cards) {
        Store.cards = cards;
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

    Store.isModalVisible = true;

    /*
    const cards = Store.cards;

    cards.push({
      name: 'New title',
      urls: urls
    });

    localStorage.setItem('cards', JSON.stringify({value: cards}));

    Store.cards = cards;
     */
  }, []);

  const handleOnReturn = useCallback((intention, value) => {
    Store.isModalVisible = false;

    console.log(value)

    if(intention) {
      console.log(value)
    }
  }, []);

  return (
    <div className={'h-full w-full'}>
      <Modal
        isVisible={snap.isModalVisible}

        onReturn={(i, v) => handleOnReturn(i, v)}
      />

      <div className={'p-5'}>
        <CardList />

        <div onClick={() => handleOnClick()}>
          Add new
        </div>
      </div>
    </div>
  );
};

export default App;
