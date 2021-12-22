import React, { useCallback, useEffect } from 'react';
import CardList from './CardList';
import Store from '../Store';
import Modal from './Modal';
import { useSnapshot } from 'valtio';
import Button from './Button';
import { Info, Zap } from 'react-feather';
import ConfettiGenerator from 'confetti-js';

const App = () => {
  useEffect(() => {
    const date = new Date();
    const day = date.getDate();

    const confetti = new ConfettiGenerator({
      target: 'confetti',
      max: 30,
      colors: [ [ 255, 214, 165 ], [ 255, 173, 173 ], [ 187, 255, 173 ], [ 189, 178, 255 ], [ 160, 196, 255 ] ],
    });

    if (!localStorage.getItem('cards')) {
      localStorage.setItem('cards', JSON.stringify({
        value: [],
      }));
    }

    try {
      const cards = JSON.parse(localStorage.getItem('cards'))?.value;

      cards.forEach(card => {
        Store.favicons[card.id] = {};
      });

      if (cards) {
        Store.cards = cards;
      }
    } catch (e) {
      console.error(e);
    }

    if (date.getMonth() === 4 && day === 30) {
      confetti.render();
    }

    return () => confetti.clear();
  }, []);

  const handleOnClick = useCallback(async () => {
    Store.modal = {
      value: '',
      pickColor: '',
      pickIndex: -1,
      isShowingIcons: true,
      isUpdatingTabs: false,
      id: null
    };

    Store.isModalVisible = true;
  }, []);

  const handleOnClickInfo = useCallback(() => {
    chrome.tabs.create({
      url: chrome.runtime.getURL('licenses.html'),
    });
  }, []);

  return (
    <div className={ 'w-full h-full relative select-none' }>
      <canvas id={ 'confetti' } className={ 'absolute top-0 right-0 left-0 bottom-0' } />
      <Modal />

      <CardList />

      <div className={ 'flex fixed bottom-10 right-10 items-center' }>
        <div className={ 'text-gray-300 cursor-pointer mr-3' } onClick={ () => handleOnClickInfo() }>
          <Info />
        </div>

        <Button onClick={ () => handleOnClick() }>
          <div className={ 'flex items-center' }>
            <span className={ 'mx-1' }>Snapshot</span>
            <Zap size={ 18 } />
          </div>
        </Button>
      </div>
    </div>
  );
};

export default App;
