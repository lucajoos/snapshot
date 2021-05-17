import React, { useCallback, useEffect, useRef, useState } from 'react';
import CardList from './CardList';
import Store from '../Store';
import Modal from './Modal';
import Input from './Input';
import { useSnapshot } from 'valtio';

const App = () => {
  const snap = useSnapshot(Store);

  const inputRef = useRef(null);

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
    inputRef.current?.focus();

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

  const handleOnReturn = useCallback(intention => {
    Store.isModalVisible = false;

    if(intention) {
      console.log(snap.value)
    }
  }, [snap.value]);

  const handleModalInputOnChange = useCallback(event => {
    Store.value = event.target.value;
  }, []);

  return (
    <div className={'h-full w-full'}>
      <Modal
        isVisible={snap.isModalVisible}

        buttons={
          <div>Close me</div>
        }

        onReturn={intention => handleOnReturn(intention)}
      >
        <h1>This is a modal</h1>
        <Input
          value={snap.value}
          placeholder={'Name'}

          onChange={(event) => handleModalInputOnChange(event) }

          nativeRef={inputRef}
        />
      </Modal>

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
