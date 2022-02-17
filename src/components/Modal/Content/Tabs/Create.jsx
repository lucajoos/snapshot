import React, { useCallback } from 'react';
import { useSnapshot } from 'valtio';
import { ChevronLeft, Compass, FilePlus, Image, Link2, Plus } from 'react-feather';

import Store from '../../../../Store';

import { Button, Header } from '../../../Base';
import { TextField } from '../../../Input';

const Create = () => {
  const snap = useSnapshot(Store);

  const handleOnClickDone = useCallback(() => {
    if(
      snap.modal.data.tabs.create.url.length > 0 &&
      snap.modal.data.tabs.create.title.length > 0
    ) {
      Store.modal.data.tabs.tabs = [
        ...Store.modal.data.tabs.tabs,
        {
          url: snap.modal.data.tabs.create.url,
          title: snap.modal.data.tabs.create.title,
          favicon: snap.modal.data.tabs.create.favicon
        }
      ];
    }

    Store.modal.data.tabs.current = '';
  }, [snap.modal.data.tabs.create.url, snap.modal.data.tabs.create.title, snap.modal.data.tabs.create.favicon]);

  const handleOnClickReturn = useCallback(() => {
    Store.modal.data.tabs.current = '';
  }, []);

  const handleOnChangeUrl = useCallback(event => {
    Store.modal.data.tabs.create.url = event.target.value;
  }, []);

  const handleOnChangeTitle = useCallback(event => {
    Store.modal.data.tabs.create.title = event.target.value;
  }, []);

  const handleOnChangeFavicon = useCallback(event => {
    Store.modal.data.tabs.create.favicon = event.target.value;
  }, []);

  return (
    <div className={'flex flex-col gap-6'}>
      <Header>
        <div className={'chevron-left transition-all cursor-pointer'} onClick={() => handleOnClickReturn()}>
          <ChevronLeft />
        </div>
        <div className={'flex ml-2 items-center gap-2'}><FilePlus /> Create Tab</div>
      </Header>

      <div className={'flex flex-col gap-4'}>
        <TextField
          placeholder={'URL'}
          icon={<Link2 size={18} />}
          value={snap.modal.data.tabs.create.url}
          onChange={event => handleOnChangeUrl(event)}
        />
        <TextField
          placeholder={'Title'}
          icon={<Compass size={18} />}
          value={snap.modal.data.tabs.create.title}
          onChange={event => handleOnChangeTitle(event)}
        />
        <TextField
          placeholder={'Favicon'}
          icon={<Image size={18} />}
          value={snap.modal.data.tabs.create.favicon}
          onChange={event => handleOnChangeFavicon(event)}
        />
      </div>

      <Button onClick={() => handleOnClickDone()} className={'self-end'}>
        <span>Create</span>
        <Plus size={18} />
      </Button>
    </div>
  )
};

export default Create;