import React, { useCallback, useRef, useState } from 'react';
import { useSnapshot } from 'valtio';
import { ChevronLeft, Compass, Edit2, FilePlus, Image, Link2, Loader, Plus, Save } from 'react-feather';

import Store from '../../../../Store';

import { Button, Header, Section } from '../../../Base';
import { TextField } from '../../../Input';
import helpers from '../../../../modules/helpers';
import axios from 'axios';

const View = () => {
  const snap = useSnapshot(Store);
  const timeoutRef = useRef(null);
  const [isFetching, setIsFetching] = useState(false);

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

  const handleOnKeyDown = useCallback(event => {
    if(!isFetching) {
      setIsFetching(true);
    }

    if(timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if(helpers.general.isValidURL(event.target.value, ['http', 'https'])) {
        axios.post(`${import.meta.env.VITE_APP_EDGE_URL}/url`, event.target.value, {
          headers: {
            'Accept': 'application/json; charset=UTF-8',
            'Authorization': `ApiKey ${import.meta.env.VITE_APP_EDGE_API_KEY}`
          }
        })
          .then(response => {
            if(!response.data.error ? (
                typeof response.data.title === 'string' &&
                typeof response.data.icons === 'object' ? (
                    Array.isArray(response.data.icons)
                ) : false
            ) : false) {
              Store.modal.data.tabs.view.title = response.data.title;
              Store.modal.data.tabs.view.favicon = response.data.icons
                  .sort((a, b) => (
                      a.type === 'icon' && b.type === 'icon' ? 0 : (
                          a.type === 'icon' ? -1 : 1
                      )
                  ))
                  .find(({src}) => src.endsWith('.png'))?.src
                || response.data.icons[0]?.src
                || '';


            }

            setIsFetching(false);
          });
      }
    }, 500);
  }, [isFetching]);

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
          onKeyDown={event => handleOnKeyDown(event)}
        />

        <Section title={'Advanced'} isExtendable={true} isExtendedInitially={false} className={'my-4'}>
          <div className={'flex flex-col gap-4'}>
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
        </Section>
      </div>

      <Button onClick={() => handleOnClickDone()} className={'self-end'} isDisabled={isFetching || snap.modal.data.tabs.view.url.length === 0}>
        {
          isFetching ? (
              <>
                <span>Loading</span>
                <div className={'animate-spin-slow'}>
                  <Loader size={18} />
                </div>
              </>
          ) : (
              <>
                <span>{ snap.modal.data.tabs.view.index >= 0 ? 'Save' : 'Create'}</span>
                { snap.modal.data.tabs.view.index >= 0 ? <Save size={18} />: <Plus size={18} /> }
              </>
          )
        }
      </Button>
    </div>
  )
};

export default View;