import React, { useCallback, useEffect } from 'react';
import { useSnapshot } from 'valtio';
import { v4 as uuidv4 } from 'uuid';
import ConfettiGenerator from 'confetti-js';
import { Search, Settings as Cob, User, Zap } from 'react-feather';

import Store from '../../Store.js';

import CardList from '../CardList.jsx';
import Modal from '../Modal/index.jsx';
import { Button } from '../Base/index.js';
import { TextField } from '../Input/index.js';
import ContextMenu from '../ContextMenu.jsx';
import Dialogue from '../Dialogue.jsx';

import helpers from '../../modules/helpers/index.js';
import supabase from '../../modules/supabase.js';
import Cookies from '../Privacy.jsx';

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
    Store.modal.content = 'Settings';
    Store.modal.data.settings.category = null;
    Store.modal.isVisible = true;
  }, []);

  const handleOnClickProfile = useCallback(() => {
    helpers.remote.profile();
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
    Store.contextMenu.isFlippedY = event.pageY > (window.innerHeight / 2);
    Store.contextMenu.isFlippedX = event.pageX > (window.innerWidth / 2);

    let element = event.target.closest('.card');

    if(element) {
      type = 'card';
      Store.contextMenu.data = element.getAttribute('id');

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
    const environment = import.meta.env.VITE_APP_ENVIRONMENT;
    const date = new Date();
    const day = date.getDate();
    const params = new URLSearchParams(window.location.search);
    const isFullscreen = params.get('fullscreen') === 'true';
    const isAuthenticated = !!supabase.auth.session();

    const handle = async () => {
      if(environment !== 'extension') {
        window.history.replaceState({}, document.title, window.location.href.split('?')[0])
      }

      const confetti = new ConfettiGenerator({
        target: 'confetti',
        max: 30,
        colors: [ [ 255, 214, 165 ], [ 255, 173, 173 ], [ 187, 255, 173 ], [ 189, 178, 255 ], [ 160, 196, 255 ] ],
      });

      if (!localStorage.getItem('cards')) {
        helpers.cards.save(snap.cards);
      }

      // Load settings & import cards
      const settings = helpers.settings.load(localStorage.getItem('settings'));

      if(settings.behavior.isFullscreen && !isFullscreen) {
        await helpers.api.do('tabs.create', {
          url: await helpers.api.do('runtime.getURL', 'app.html?fullscreen=true')
        }, { isWaiting: false });
      }

      supabase.auth.onAuthStateChange(async (_, session) => {
        Store.session = session;
        await helpers.remote.synchronize();
      });

      if(localStorage.getItem('cards')) {
        helpers.cards.import(localStorage.getItem('cards'));
      }

      // Confetti? - Confetti.
      if(date.getMonth() === 4 && day === 30 && settings.behavior.isRenderingEffects) {
        confetti.render();
      }

      // Synchronize
      if(isAuthenticated) {
        await helpers.remote.synchronize();

        if(settings.sync.isRealtime) {
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

                if(typeof Store.favicons[payload.new.id] !== 'object') {
                  Store.favicons[payload.new.id] = {};
                }

                Store.cards = cards;
                helpers.cards.save(cards);
              })
              .subscribe();
        }
      }

      const load = async (id) => {
        const { data, error } = await supabase
            .from('cards')
            .select()
            .eq('id', id)
            .single();

        if(error) {
          console.error(error);
        } else if(data) {
          const card = helpers.remote.snakeCaseToCamelCase(data);
          const foreign = helpers.cards.get(card.id, { isForeign: true});

          if(foreign ? (!foreign.isVisible && !foreign.isDeleted) : false) {
            Store.modal.content = 'Settings';
            Store.modal.data.settings.category = 'Archive';
            Store.modal.isVisible = true;
          } else if(isAuthenticated ? card.userId !== supabase.auth.user().id : true){
            card.foreignId = card.id;
            card.id = uuidv4();
            card.index = [...Store.cards].filter(current => current.isVisible).length;
            card.createdAt = new Date().toISOString();
            card.editedAt = new Date().toISOString();

            card.isForeign = true;
            card.isPrivate = true;

            delete card.insertedAt;
            delete card.userId;

            const stack = helpers.cards.push(card);
            Store.isScrolling = true;
            helpers.cards.save(stack);

            if (isAuthenticated) {
              supabase
                  .from('cards')
                  .insert([
                    helpers.remote.camelCaseToSnakeCase(card)
                  ], {
                    returning: 'minimal'
                  })
                  .then(({ error }) => {
                    if (error) {
                      console.error(error);
                    }
                  });
            }
          }
        }
      }

      if(environment === 'extension') {
        const data = await helpers.api.do('storage.get', 'load');

        if(typeof data === 'object' ? Array.isArray(data) : false) {
          data.forEach(id => {
            load(id);
          });

          helpers.api.do('storage.set', {
            load: []
          }, { isWaiting: false });
        }
      } else if(params.get('id')?.length > 0) {
        await load(params.get('id'));
        params.delete('id')
      }

      return () => confetti.clear();
    }

    if(import.meta.env.MODE === 'development' || localStorage.getItem('cookies') === 'true' || environment === 'extension') {
      await handle();
    } else {
      Store.privacy.resolve = (async isAccepted => {
        if(isAccepted) {
          Store.privacy.isVisible = false;
          localStorage.setItem('cookies', 'true');
          await handle();
        } else {
          window.location.reload();
        }
      });

      Store.privacy.isVisible = true;
    }
  }, []);

  return (
    <div className={ 'w-full h-full relative select-none overflow-hidden' } onContextMenu={event => handleOnContextMenu(event)} onClick={() => handleOnClick()}>
      <ContextMenu />
      <Cookies />
      <Dialogue />
      <Modal />

      <canvas id={ 'confetti' } className={ 'absolute top-0 right-0 left-0 bottom-0 pointer-events-none' } />

      <div className={'flex flex-col p-8 h-screen content'}>
        <div className={'flex items-center gap-4 justify-center mb-6'}>
          <TextField
              value={snap.search}
              placeholder={'Search'}
              onChange={event => handleOnChangeSearch(event)}
              icon={<Search size={18} />}
              className={'max-w-[500px]'}
          />
          <div className={'cursor-pointer'} onClick={() => handleOnClickProfile()}>
            <User />
          </div>
          <div className={'cursor-pointer'} onClick={() => handleOnClickSettings()}>
            <Cob />
          </div>
        </div>

        <CardList />

        <div className={ 'flex justify-end items-center mt-4' }>
          <Button onClick={ () => handleOnClickSnapshot() } className={'self-end'}>
            <span>Snapshot</span>
            <Zap size={ 18 } />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default App;