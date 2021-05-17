import React, { useCallback, useEffect, useState } from 'react';
import CardList from './CardList';
import Store from '../Store';
import Modal from './Modal';

const App = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

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

    setIsModalVisible(true);

    /*
    const cards = Store.cards;

    cards.push({
      title: 'New title',
      urls: urls
    });

    localStorage.setItem('cards', JSON.stringify({value: cards}));

    Store.cards = cards;
     */
  }, []);

  const handleOnReturn = useCallback(() => {
    setIsModalVisible(false);
  }, []);

  return (
    <div className={'h-full w-full'}>
      <Modal
        isVisible={isModalVisible}
        buttons={
          <div>Close me</div>
        }
        onReturn={() => {handleOnReturn()}}
      >
        <h1>This is a modal</h1>
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
