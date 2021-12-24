import React, { useCallback, useEffect } from 'react';
import CardList from './CardList';
import Store from '../Store';
import Modal from './Modal';
import Button from './Button';
import { Search, Settings as Cob, Zap } from 'react-feather';
import ConfettiGenerator from 'confetti-js';
import { useSnapshot } from 'valtio';
import Input from './Input';
import ContextMenu from './ContextMenu';
import helpers from '../modules/helpers';
import Settings from './Settings';

const App = () => {
  const snap = useSnapshot(Store);

  // Callbacks
  const handleOnClickSnapshot = useCallback(async () => {
    Store.modal = {
      value: '',
      pickColor: '',
      pickIndex: -1,
      tags: [],
      isCustomPick: false,
      isShowingIcons: true,
      isUpdatingTabs: false,
      isShowingCustomPick: false,
      id: null
    };

    Store.isModalVisible = true;
  }, []);

  const handleOnClickSettings = useCallback(() => {
    Store.settings.isVisible = true;
  }, []);

  const handleOnChangeSearch = useCallback(event => {
    Store.search = event.target.value;
  }, []);

  const handleOnContextMenu = useCallback(event => {
    if(snap.contextMenu.isPreventingDefault) {
      event.preventDefault();
    }

    let type = 'default';
    Store.contextMenu.x = event.pageX;
    Store.contextMenu.y = event.pageY;
    Store.contextMenu.data = '';

    let element = event.target.closest('.card');

    if(element) {
      type = 'card';
      Store.contextMenu.data = element.getAttribute('id');
    }

    Store.contextMenu.type = type;
    Store.contextMenu.isVisible = true;
  }, [snap.cards, snap.contextMenu.isPreventingDefault]);

  const handleOnClick = useCallback(() => {
    if(snap.contextMenu.isVisible) {
      Store.contextMenu.isVisible = false;
    }
  }, [snap.contextMenu.isVisible])

  // Effects
  useEffect(() => {
    const date = new Date();
    const day = date.getDate();

    const confetti = new ConfettiGenerator({
      target: 'confetti',
      max: 30,
      colors: [ [ 255, 214, 165 ], [ 255, 173, 173 ], [ 187, 255, 173 ], [ 189, 178, 255 ], [ 160, 196, 255 ] ],
    });

    if (!localStorage.getItem('cards')) {
      helpers.card.save([]);
    }

    helpers.card.import(localStorage.getItem('cards'));

    if (date.getMonth() === 4 && day === 30) {
      confetti.render();
    }

    return () => confetti.clear();
  }, []);

  return (
    <div className={ 'w-full h-full relative select-none overflow-hidden' } onContextMenu={event => handleOnContextMenu(event)} onClick={() => handleOnClick()}>
      <Settings />
      <ContextMenu />
      <Modal />

      <canvas id={ 'confetti' } className={ 'absolute top-0 right-0 left-0 bottom-0 pointer-events-none' } />

      <div className={'grid h-screen content'}>
        <div className={'flex my-5 mx-8'}>
          {
            snap.cards.filter(card => card.isVisible).length > 0 && (
              <Input
                value={snap.search}
                placeholder={'Search'}
                onChange={event => handleOnChangeSearch(event)}
                icon={<Search size={18} />}
              />
            )
          }
        </div>

        <CardList />

        <div className={ 'flex px-8 py-5 justify-end items-center z-10' }>
          <div className={ 'text-gray-300 cursor-pointer mr-3' } onClick={ () => handleOnClickSettings() }>
            <Cob />
          </div>

          <Button onClick={ () => handleOnClickSnapshot() }>
            <div className={ 'flex items-center' }>
              <span className={ 'mx-1' }>Snapshot</span>
              <Zap size={ 18 } />
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default App;
