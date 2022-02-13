import React, { useCallback, useEffect, useRef } from 'react';
import { useSnapshot } from 'valtio';
import { v4 as uuidv4 } from 'uuid';
import { Save, Type, Zap } from 'react-feather';

import { Button, Header } from '../../Base';
import { Checkbox, ColorPicker, Tags, TextField } from '../../Input';

import Store from '../../../Store';
import helpers from '../../../modules/helpers';
import supabase from '../../../modules/supabase';

const Snapshot = () => {
  const snap = useSnapshot(Store);

  const inputRef = useRef(null);
  const colorRef = useRef(null);

  const isUpdate = snap.modal.data.snapshot.id !== null;

  const handleOnReturn = useCallback(async () => {
    Store.modal.isVisible = false;

    // Workaround
    const cards = [...Store.cards];

    let tabs = await helpers.api.do('tabs.query', {
      currentWindow: true
    });

    let urls = [];
    let favicons = [];

    tabs?.forEach(tab => {
      urls.push(tab.url);
      favicons.push(tab.favIconUrl);
    });

    if(snap.modal.data.snapshot.id ? snap.modal.data.snapshot.id.length > 0 : false) {
      // Update Snapshot
      for (const card of cards) {
        if(card.id === snap.modal.data.snapshot.id) {
          const update = {
            value: snap.modal.data.snapshot.value?.length === 0 ? `Snapshot #${ snap.cards.filter(card => card.isVisible).length + 1 }` : snap.modal.data.snapshot.value,
            tags: snap.modal.data.snapshot.tags,

            pickColor: snap.modal.data.snapshot.pickColor,
            pickIndex: snap.modal.data.snapshot.pickIndex,

            editedAt: new Date().toISOString(),

            isShowingIcons: snap.modal.data.snapshot.isShowingIcons,
            isCustomPick: snap.modal.data.snapshot.isShowingCustomPick && snap.modal.data.snapshot.pickColor.length > 0 && snap.modal.data.snapshot.pickIndex === -1,

            urls: snap.modal.data.snapshot.isUpdatingTabs ? urls : card.urls,
            favicons: snap.modal.data.snapshot.isUpdatingTabs ? favicons : card.favicons,
          };

          cards[cards.indexOf(card)] = Object.assign(card, update);

          if(snap.session && snap.settings.sync.isSynchronizing) {
            supabase
              .from('cards')
              .update([
                helpers.remote.camelCaseToSnakeCase(update)
              ], {
                returning: 'minimal'
              })
              .match({ id: card.id })
              .then(({ error }) => {
                if(error) {
                  console.error(error);
                }
              });
          }
        }
      }
    } else {
      // Take Snapshot
      const id = uuidv4();

      const card = {
        id,
        index: snap.cards.filter(card => card.isVisible).length,
        value: snap.modal.data.snapshot.value?.length === 0 ? `Snapshot #${ snap.cards.filter(card => card.isVisible).length + 1 }` : snap.modal.data.snapshot.value,
        tags: snap.modal.data.snapshot.tags,

        pickColor: snap.modal.data.snapshot.pickColor,
        pickIndex: snap.modal.data.snapshot.pickIndex,

        createdAt: new Date().toISOString(),
        editedAt: new Date().toISOString(),

        isVisible: true,
        isDeleted: false,
        isShowingIcons: snap.modal.data.snapshot.isShowingIcons,
        isCustomPick: snap.modal.data.snapshot.isShowingCustomPick && snap.modal.data.snapshot.pickColor.length > 0 && snap.modal.data.snapshot.pickIndex === -1,

        urls,
        favicons
      };

      cards.push(card);
      Store.favicons[id] = {};

      if(snap.session && snap.settings.sync.isSynchronizing) {
        supabase
          .from('cards')
          .insert([
            helpers.remote.camelCaseToSnakeCase(card)
          ], {
            returning: 'minimal'
          })
          .then(({ error }) => {
            if(error) {
              console.error(error);
            }
          });
      }
    }

    Store.cards = cards;
    helpers.cards.save(cards);
  }, [snap.cards, snap.modal, snap.session, snap.settings.sync.isSynchronizing])

  const handleOnKeyDown = useCallback(async event => {
    if(event.keyCode === 13) {
      await handleOnReturn();
    }
  }, [snap.cards, snap.modal]);

  const handleOnChangeValue = useCallback(event => {
    Store.modal.data.snapshot.value = event.target.value;
  }, []);

  const handleOnChangeColor = useCallback(event => {
    if(/^#[0-9a-fA-F]{0,6}$/g.test(event.target.value) || event.target.value.length === 0) {
      Store.modal.data.snapshot.pickColor = event.target.value.toUpperCase();
    }
  }, []);

  const handleOnPick = useCallback(current => {
    if(
      current?.color === snap.modal.data.snapshot.pickColor
    ) {
      current.color = '';
      current.index = -1;
    }

    Store.modal.data.snapshot.pickColor = current.color;
    Store.modal.data.snapshot.pickIndex = current.index;
  }, [snap.modal.data.snapshot.pickColor, snap.modal.data.snapshot.pickIndex]);

  const handleCheckboxOnChangeIcons = useCallback(() => {
    Store.modal.data.snapshot.isShowingIcons = !snap.modal.data.snapshot.isShowingIcons;
  }, [snap.modal.data.snapshot.isShowingIcons]);

  const handleCheckboxOnChangeTabs = useCallback(() => {
    Store.modal.data.snapshot.isUpdatingTabs = !snap.modal.data.snapshot.isUpdatingTabs;
  }, [snap.modal.data.snapshot.isUpdatingTabs]);

  const handleOnChangeTags = useCallback(tags => {
    Store.modal.data.snapshot.tags = tags;
  }, []);

  const handleOnKeyDownTags = useCallback(event => {
    if(event.keyCode === 13) {
      event.preventDefault();
    }
  }, []);

  useEffect(() => {
    if(snap.modal.data.snapshot.isShowingCustomPick) {
      colorRef.current?.focus();
    }
  }, [snap.modal.data.snapshot.isShowingCustomPick]);

  useEffect(() => {
    if(snap.modal.isVisible && snap.modal.content === 'Snapshot') {
      inputRef.current?.focus();
    }
  }, [snap.modal.isVisible, snap.modal.content]);

  return (
    <>
      <Header>
        <Zap /> {isUpdate ? 'Edit' : 'Take'} Snapshot
      </Header>

      <div className={'my-6'}>
        <TextField
          value={snap.modal.data.snapshot.value}
          placeholder={'Name'}
          onChange={event => handleOnChangeValue(event)}
          nativeRef={inputRef}
          onKeyDown={event => handleOnKeyDown(event)}
          icon={<Type size={18} />}
        />

        <Tags
          className={'mt-4'}
          title={'Tags'}
          tags={snap.modal.data.snapshot.tags}
          onChange={ tags => handleOnChangeTags(tags) }
          onKeyDown={event => handleOnKeyDownTags(event)}
          isOnlyAllowingUniqueTags={true}
          pasteDataType={'text/plain'}
          separators={[',', ';']}
          maxTags={5}
        />

        <div className={'flex items-center justify-between mt-8'}>
          <div className={`flex items-center ${!isUpdate ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <span className={'mr-3'}>Capture Tabs</span>
            <Checkbox onChange={() => handleCheckboxOnChangeTabs()} value={snap.modal.data.snapshot.isUpdatingTabs || !isUpdate} isEnabled={isUpdate} />
          </div>

          <div className={'flex items-center'}>
            <span className={'mr-3'}>Show Icons</span>
            <Checkbox onChange={() => handleCheckboxOnChangeIcons()} value={snap.modal.data.snapshot.isShowingIcons} />
          </div>
        </div>

        <ColorPicker
          palette={['orange', 'pink', 'green', 'violet', 'blue']}
          pickIndex={snap.modal.data.snapshot.pickIndex}
          onPick={pick => handleOnPick(pick)}
          className={'mt-8'}
        />

        <TextField
          value={snap.modal.data.snapshot.pickColor}
          placeholder={'Custom Color'}
          onChange={event => handleOnChangeColor(event)}
          nativeRef={colorRef}
          className={!snap.modal.data.snapshot.isShowingCustomPick ? 'hidden' : ''}
        />
      </div>

      <Button onClick={() => handleOnReturn()} className={'self-end'}>
        <span>Save</span>
        <Save size={18} />
      </Button>
    </>
  )
};

export default Snapshot;