import React, { useCallback, useEffect, useRef } from 'react';
import Input from './Input';
import ColorPicker from './ColorPicker';
import Button from './Button';
import Header from './Header';
import { Save, X } from 'react-feather';
import Checkbox from './Checkbox';
import { useSnapshot } from 'valtio';
import Store from '../Store';
import { v4 as uuidv4 } from 'uuid';

const Modal = () => {
  const snap = useSnapshot(Store);

  const inputRef = useRef(null);

  const handleOnClose = useCallback(() => {
    Store.isModalVisible = false;
  }, []);

  const isUpdate = snap.modal.id !== null;

  const handleOnReturn = useCallback(async () => {
    Store.isModalVisible = false;

    // Workaround
    const cards = [...Store.cards];

    let tabs = await chrome.tabs.query({
      currentWindow: true,
    });

    let urls = [];
    let favicons = [];

    tabs?.forEach(tab => {
      urls.push(tab.url);
      favicons.push(tab.favIconUrl);
    });

    if(snap.modal.id ? snap.modal.id.length > 0 : false) {
      // Update Snapshot
      cards.forEach((card, index) => {
        if(card.id === snap.modal.id) {
          cards[index] = Object.assign(card, {
            value: snap.modal.value?.length === 0 ? `Snapshot #${ snap.cards.filter(card => card.isVisible).length + 1 }` : snap.modal.value,
            pickColor: snap.modal.pickColor,
            pickIndex: snap.modal.pickIndex,
            urls: snap.modal.isUpdatingTabs ? urls : card.urls,
            editedAt: new Date().toISOString(),
            favicons: snap.modal.isUpdatingTabs ? favicons : card.favicons,
            isShowingIcons: snap.modal.isShowingIcons,
          });
        }
      })
    } else {
      // Take Snapshot
      const id = uuidv4();

      cards.push({
        id,
        value: snap.modal.value?.length === 0 ? `Snapshot #${ snap.cards.filter(card => card.isVisible).length + 1 }` : snap.modal.value,
        pickColor: snap.modal.pickColor,
        pickIndex: snap.modal.pickIndex,
        urls: urls,
        createdAt: new Date().toISOString(),
        editedAt: null,
        isVisible: true,
        index: snap.cards.length,
        favicons: snap.modal.isShowingIcons ? favicons : [],
        isShowingIcons: snap.modal.isShowingIcons,
      });

      Store.favicons[id] = {};
    }

    Store.cards = cards;
    localStorage.setItem('cards', JSON.stringify({ value: cards }));
  }, [snap.cards, snap.modal])

  const handleOnKeyDown = useCallback(event => {
    if(event.keyCode === 13) {
      handleOnReturn();
    }
  }, [snap.cards, snap.modal]);

  const handleOnChangeValue = useCallback(event => {
    Store.modal.value = event.target.value;
  }, []);

  const handleOnPick = useCallback(current => {
    if(
      current?.color === snap.modal.pickColor
    ) {
      current.color = '';
      current.index = -1;
    }

    Store.modal.pickColor = current.color;
    Store.modal.pickIndex = current.index;
  }, [snap.modal.pickColor, snap.modal.pickIndex]);

  const handleCheckboxOnChangeIcons = useCallback(() => {
    Store.modal.isShowingIcons = !snap.modal.isShowingIcons;
  }, [snap.modal.isShowingIcons]);

  const handleCheckboxOnChangeTabs = useCallback(() => {
    Store.modal.isUpdatingTabs = !snap.modal.isUpdatingTabs;
  }, [snap.modal.isUpdatingTabs]);

  useEffect(() => {
    if(snap.isModalVisible) {
      inputRef.current?.focus();
    }
  }, [snap.isModalVisible]);

  return (
    <div className={`fixed top-0 right-0 left-0 bottom-0 z-30 grid transition-all ${snap.isModalVisible ? 'opacity-100 pointer-events-auto' : 'pointer-events-none opacity-0'}`} onKeyDown={event => handleOnKeyDown(event)}>
      <div className={'absolute top-0 right-0 left-0 bottom-0 opacity-60 bg-black'} onClick={() => handleOnClose()}/>

      <div className={'absolute z-40 rounded-md bg-background-default justify-self-center self-center p-10 w-modal max-w-modal'}>
        <div className={'absolute top-8 right-8 cursor-pointer'} onClick={() => handleOnClose()}>
          <X />
        </div>

        <div className={'grid'}>
          <Header>
            {isUpdate ? 'Edit' : 'Take'} Snapshot
          </Header>

          <div className={'mb-6 mt-5'}>
            <Input
              value={snap.modal.value}
              placeholder={'Name'}
              onChange={event => handleOnChangeValue(event)}
              nativeRef={inputRef}
            />

            <div className={'flex items-center justify-between pt-3'}>
              <ColorPicker
                palette={['orange', 'pink', 'green', 'violet', 'blue']}
                pickIndex={snap.modal.pickIndex}
                onPick={pick => handleOnPick(pick)}
              />

              <div className={'flex items-center'}>
                <span className={'mr-3'}>Icons</span>
                <Checkbox onChange={() => handleCheckboxOnChangeIcons()} value={snap.modal.isShowingIcons} />
              </div>
            </div>

            {
              isUpdate && (
                <div className={'flex justify-end mt-3'}>
                  <div className={'flex items-center'}>
                    <span className={'mr-3'}>Re-Take Tabs</span>
                    <Checkbox onChange={() => handleCheckboxOnChangeTabs()} value={snap.modal.isUpdatingTabs} />
                  </div>
                </div>
              )
            }
          </div>

          <Button onClick={() => handleOnReturn()}>
            <div className={'flex items-center'}>
              <span className={'mx-1'}>Save</span>
              <Save size={18} />
            </div>
          </Button>
        </div>
      </div>
    </div>
  )
};

export default Modal;