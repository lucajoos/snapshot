import React, { useCallback, useEffect, useState } from 'react';
import ButtonList from './ButtonList';
import Store from '../Store';
import Modal from './Modal';

const App = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

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

    setIsModalVisible(true);

    /*
    const buttons = Store.buttons;

    buttons.push({
      title: 'New title',
      urls: urls
    });

    localStorage.setItem('buttons', JSON.stringify({value: buttons}));

    Store.buttons = buttons;
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
        <ButtonList />

        <div onClick={() => handleOnClick()}>
          Add new
        </div>
      </div>
    </div>
  );
};

export default App;
