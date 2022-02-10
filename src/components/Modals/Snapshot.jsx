import React, { useCallback, useEffect, useRef } from 'react';
import Input from '../Input';
import ColorPicker from '../ColorPicker';
import Button from '../Button';
import Header from '../Header';
import { Save } from 'react-feather';
import Checkbox from '../Checkbox';
import { useSnapshot } from 'valtio';
import Store from '../../Store';
import { v4 as uuidv4 } from 'uuid';
import InputTag from '../InputTag';
import helpers from '../../modules/helpers';

const Modal = () => {
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
      cards.forEach((card, index) => {
        if(card.id === snap.modal.data.snapshot.id) {
          cards[index] = Object.assign(card, {
            value: snap.modal.data.snapshot.value?.length === 0 ? `Snapshot #${ snap.cards.filter(card => card.isVisible).length + 1 }` : snap.modal.data.snapshot.value,
            tags: snap.modal.data.snapshot.tags,

            pickColor: snap.modal.data.snapshot.pickColor,
            pickIndex: snap.modal.data.snapshot.pickIndex,

            editedAt: new Date().toISOString(),

            isShowingIcons: snap.modal.data.snapshot.isShowingIcons,
            isCustomPick: snap.modal.data.snapshot.isShowingCustomPick && snap.modal.data.snapshot.pickColor.length > 0 && snap.modal.data.snapshot.pickIndex === -1,

            urls: snap.modal.data.snapshot.isUpdatingTabs ? urls : card.urls,
            favicons: snap.modal.data.snapshot.isUpdatingTabs ? favicons : card.favicons,
          });
        }
      })
    } else {
      // Take Snapshot
      const id = uuidv4();

      cards.push({
        id,
        index: snap.cards.length,
        value: snap.modal.data.snapshot.value?.length === 0 ? `Snapshot #${ snap.cards.filter(card => card.isVisible).length + 1 }` : snap.modal.data.snapshot.value,
        tags: snap.modal.data.snapshot.tags,

        pickColor: snap.modal.data.snapshot.pickColor,
        pickIndex: snap.modal.data.snapshot.pickIndex,

        createdAt: new Date().toISOString(),
        editedAt: null,

        isVisible: true,
        isShowingIcons: snap.modal.data.snapshot.isShowingIcons,
        isCustomPick: snap.modal.data.snapshot.isShowingCustomPick && snap.modal.data.snapshot.pickColor.length > 0 && snap.modal.data.snapshot.pickIndex === -1,

        urls,
        favicons
      });

      Store.favicons[id] = {};
    }

    Store.cards = cards;
    helpers.cards.save(cards);
  }, [snap.cards, snap.modal])

  const handleOnKeyDown = useCallback(event => {
    if(event.keyCode === 13) {
      handleOnReturn();
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

  return (
    <>
      <Header>
        {isUpdate ? 'Edit' : 'Take'} Snapshot
      </Header>

      <div className={'mb-6 mt-5'}>
        <Input
          value={snap.modal.data.snapshot.value}
          placeholder={'Name'}
          onChange={event => handleOnChangeValue(event)}
          nativeRef={inputRef}
          onKeyDown={event => handleOnKeyDown(event)}
        />

        <InputTag
          className={'mt-5'}
          title={'Tags'}
          tags={snap.modal.data.snapshot.tags}
          onChange={ tags => handleOnChangeTags(tags) }
          onDone={() => handleOnReturn()}
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

        <Input
          value={snap.modal.data.snapshot.pickColor}
          placeholder={'Custom Color'}
          onChange={event => handleOnChangeColor(event)}
          nativeRef={colorRef}
          className={!snap.modal.data.snapshot.isShowingCustomPick ? 'hidden' : ''}
        />
      </div>

      <Button onClick={() => handleOnReturn()}>
        <div className={'flex items-center'}>
          <span className={'mx-1'}>Save</span>
          <Save size={18} />
        </div>
      </Button>
    </>
  )
};

export default Modal;