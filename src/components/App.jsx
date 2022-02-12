import React, { useCallback, useEffect } from 'react';
import { useSnapshot } from 'valtio';
import { Search, Settings as Cob, User, Zap } from 'react-feather';
import ConfettiGenerator from 'confetti-js';

import Store from '../Store';

import CardList from './CardList';
import Modal from './Modal';
import { Button } from './Base';
import { TextField } from './Input';
import ContextMenu from './ContextMenu';

import helpers from '../modules/helpers';
import supabase from '../modules/supabase';
import Profile from './Modal/Content/Profile';

const App = () => {
  const snap = useSnapshot(Store);

  // Callbacks
  const handleOnClickSnapshot = useCallback(async () => {
    Store.modal.data.snapshot = {
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

    Store.modal.content = 'Snapshot';
    Store.modal.isVisible = true;
  }, []);

  const handleOnClickSettings = useCallback(() => {
    Store.modal.data.settings = snap.settings;
    Store.modal.content = 'Settings';
    Store.modal.data.settings.category = null;
    Store.modal.isVisible = true;
  }, []);

  const handleOnClickProfile = useCallback(() => {
    Store.modal.data.profile = {
      email: '',
      password: '',
      error: null,
      isSigningIn: true,
      isLoading: false
    };

    Store.modal.content = 'Profile';
    Store.modal.isVisible = true;
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

      console.log(element)
      if(element.classList.contains('isArchived')) {
        type = 'card-isArchived';
      }
    }

    Store.contextMenu.type = type;
    Store.contextMenu.isVisible = true;
  }, [snap.cards, snap.contextMenu.isPreventingDefault]);

  const handleOnClick = useCallback(() => {
    if(snap.contextMenu.isVisible) {
      Store.contextMenu.isVisible = false;
    }
  }, [snap.contextMenu.isVisible]);

  // Effects
  useEffect(async () => {
    const date = new Date();
    const day = date.getDate();

    const confetti = new ConfettiGenerator({
      target: 'confetti',
      max: 30,
      colors: [ [ 255, 214, 165 ], [ 255, 173, 173 ], [ 187, 255, 173 ], [ 189, 178, 255 ], [ 160, 196, 255 ] ],
    });

    if (!localStorage.getItem('cards')) {
      helpers.cards.save(snap.cards);
    }

    // Import data
    helpers.settings.import(localStorage.getItem('settings'));
    helpers.cards.import(localStorage.getItem('cards'));
    
    supabase.auth.onAuthStateChange(async (_, session) => {
      Store.session = session;
      await helpers.remote.synchronize();
    });

    // Confetti? - Confetti.
    if (date.getMonth() === 4 && day === 30) {
      confetti.render();
    }

    // Synchronize
    if(snap.session) {
      await helpers.remote.synchronize();

      supabase
        .from(`cards:user_id=eq.${supabase.auth.user().id}`)
        .on('INSERT', ({ new: card }) => {
          if(!card) return false;

          const cards = [...Store.cards];
          let isInCards = false;

          cards.forEach(({ id }) => {
            if(id === card.id) {
              isInCards = true;
            }
          });

          if(!isInCards) {
            cards.push(helpers.remote.snakeCaseToCamelCase(card));

            Store.favicons[card.id] = {};
            Store.cards = cards;
            helpers.cards.save(cards);
          }
        })
        .on('UPDATE', payload => {
          if(!payload.new || !payload.old) return false;

          let cards = [...Store.cards];

          cards = cards.map(card => {
            if(card.id === payload.old.id) {
              return helpers.remote.snakeCaseToCamelCase(payload.new);
            }

            return card;
          });

          Store.favicons[payload.new.id] = {};
          Store.cards = cards;
          helpers.cards.save(cards);
        })
        .subscribe()
    }

    return () => confetti.clear();
  }, []);

  return (
    <div className={ 'w-full h-full relative select-none overflow-hidden' } onContextMenu={event => handleOnContextMenu(event)} onClick={() => handleOnClick()}>
      <ContextMenu />
      <Modal />

      <canvas id={ 'confetti' } className={ 'absolute top-0 right-0 left-0 bottom-0 pointer-events-none' } />

      <div className={'grid h-screen content'}>
        <div className={'flex my-5 mx-8 items-center gap-5 justify-between'}>
          <TextField
            value={snap.search}
            placeholder={'Search'}
            onChange={event => handleOnChangeSearch(event)}
            icon={<Search size={18} />}
          />
          <div className={'cursor-pointer'} onClick={() => handleOnClickProfile()}>
            <User />
          </div>
          <div className={'cursor-pointer'} onClick={() => handleOnClickSettings()}>
            <Cob />
          </div>
        </div>

        <CardList />

        <div className={ 'flex px-8 py-5 justify-end items-center z-10' }>
          <Button onClick={ () => handleOnClickSnapshot() }>
            <div className={ 'flex items-center' }>
              <span className={ 'mx-2' }>Snapshot</span>
              <Zap size={ 18 } />
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default App;
