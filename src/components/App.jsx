import React, { useCallback, useEffect } from 'react';
import CardList from './CardList';
import Store from '../Store';
import Modal from './Modal';
import { useSnapshot } from 'valtio';
import Button from './Button';
import { Plus } from 'react-feather';

const App = () => {
  const snap = useSnapshot(Store);

  useEffect(() => {
    if(!localStorage.getItem('cards')) {
      localStorage.setItem('cards', JSON.stringify({
        value: []
      }));
    }

    if(!localStorage.getItem('length')) {
      localStorage.setItem('length', '1');
    }

    if(!localStorage.getItem('id')) {
      localStorage.setItem('id', '0');
    }

    try {
      const cards = JSON.parse(localStorage.getItem('cards'))?.value;

      if(cards) {
        Store.cards = cards;
      }
    } catch(e) {
      console.error(e);
    }
  }, []);

  const handleOnClick = useCallback(async () => {
    Store.isModalVisible = true;
  }, []);

  const handleOnReturn = useCallback(async (intention, data) => {
    Store.isModalVisible = false;

    if(intention) {
      let tabs = await chrome.tabs.query({});

      let urls = [];
      let favicons = [];

      tabs?.forEach(tab => {
        urls.push(tab.url);
        favicons.push(tab.favIconUrl);
      });

      const {value, pick} = data;
      const cards = Store.cards;

      cards.push({
        name: value?.length === 0 ? `Snapshot #${localStorage.getItem('length')}` : value,
        urls: urls,
        color: pick.color,
        meta: new Date().toISOString(),
        visible: true,
        id: localStorage.getItem('id'),
        favicons: favicons,
        isShowingIcons: true
      });

      localStorage.setItem('length', (parseInt(localStorage.getItem('length')) + 1).toString());
      localStorage.setItem('id', (parseInt(localStorage.getItem('id')) + 1).toString());
      localStorage.setItem('cards', JSON.stringify({value: cards}));

      Store.cards = cards;
    }
  }, []);

  return (
    <div className={'w-full h-full relative'}>
      <Modal
        isVisible={snap.isModalVisible}

        onReturn={(i, v) => handleOnReturn(i, v)}
      />

      <div className={'p-5'}>
        <CardList />
      </div>

      <div className={'fixed bottom-10 right-10'}>
        <Button onClick={() => handleOnClick()}>
          <span className={'mx-1'}>Add</span>
          <Plus size={18} />
        </Button>
      </div>
    </div>
  );
};

export default App;
