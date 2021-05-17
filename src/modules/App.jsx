import React, { useCallback, useEffect, useRef, useState } from 'react';
import CardList from './CardList';
import Store from '../Store';
import Modal from './Modal';
import Input from './Input';

const App = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalInputValue, setModalInputValue] = useState('');

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

    setIsModalVisible(true);
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

  const handleOnReturn = useCallback(() => {
    setIsModalVisible(false);
  }, []);

  const handleModalInputOnChange = useCallback(event => {
    setModalInputValue(event.target.value);
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
        <Input
          value={modalInputValue}
          placeholder={'Name'}

          onChange={(event) => { handleModalInputOnChange(event) }}

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
