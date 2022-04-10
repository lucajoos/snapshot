import React, { useCallback } from 'react';
import { useSnapshot } from 'valtio';
import { ChevronLeft, Compass, Edit2, FilePlus, Image, Link2, Plus, Save } from 'react-feather';

import Store from '../../../../Store';

import { Button, Header } from '../../../Base';
import { TextField } from '../../../Input';

const View = () => {
  const snap = useSnapshot(Store);

  const handleOnClickDone = useCallback(() => {
    if(
      snap.modal.data.tabs.view.url.length > 0 &&
      snap.modal.data.tabs.view.title.length > 0
    ) {
      if(snap.modal.data.tabs.view.index >= 0) {
        let stack = [...Store.modal.data.tabs.tabs];

        stack[snap.modal.data.tabs.view.index] = {
          url: snap.modal.data.tabs.view.url,
          title: snap.modal.data.tabs.view.title,
          favicon: snap.modal.data.tabs.view.favicon
        };

        Store.modal.data.tabs.tabs = stack;
      } else {
        Store.modal.data.tabs.tabs = [
          ...Store.modal.data.tabs.tabs,
          {
            url: snap.modal.data.tabs.view.url,
            title: snap.modal.data.tabs.view.title,
            favicon: snap.modal.data.tabs.view.favicon
          }
        ];
      }
    }

    Store.modal.data.tabs.current = 'default';
  }, [snap.modal.data.tabs.view.url, snap.modal.data.tabs.view.title, snap.modal.data.tabs.view.favicon, snap.modal.data.tabs.view.index]);

  const handleOnClickReturn = useCallback(() => {
    Store.modal.data.tabs.current = 'default';
  }, []);

  const handleOnChangeUrl = useCallback(event => {
    Store.modal.data.tabs.view.url = event.target.value;
  }, []);

  const handleOnChangeTitle = useCallback(event => {
    Store.modal.data.tabs.view.title = event.target.value;
  }, []);

  const handleOnChangeFavicon = useCallback(event => {
    Store.modal.data.tabs.view.favicon = event.target.value;
  }, []);

  return (
    <div className={'flex flex-col gap-6'}>
      <Header>
        <div className={'chevron-left transition-all cursor-pointer'} onClick={() => handleOnClickReturn()}>
          <ChevronLeft />
        </div>
        <div className={'flex ml-2 items-center gap-2'}>{snap.modal.data.tabs.view.index >= 0 ? <Edit2 /> : <FilePlus />} {snap.modal.data.tabs.view.index >= 0 ? 'Edit' : 'Create'} Tab</div>
      </Header>

      <div className={'flex flex-col gap-4'}>
        <TextField
          placeholder={'URL'}
          icon={<Link2 size={18} />}
          value={snap.modal.data.tabs.view.url}
          onChange={event => handleOnChangeUrl(event)}
        />
        <TextField
          placeholder={'Title'}
          icon={<Compass size={18} />}
          value={snap.modal.data.tabs.view.title}
          onChange={event => handleOnChangeTitle(event)}
        />
        <TextField
          placeholder={'Favicon'}
          icon={<Image size={18} />}
          value={snap.modal.data.tabs.view.favicon}
          onChange={event => handleOnChangeFavicon(event)}
        />
      </div>

      <Button onClick={() => handleOnClickDone()} className={'self-end'}>
        <span>{ snap.modal.data.tabs.view.index >= 0 ? 'Save' : 'Create'}</span>
        { snap.modal.data.tabs.view.index >= 0 ? <Save size={18} />: <Plus size={18} />}
      </Button>
    </div>
  )
};

export default View;