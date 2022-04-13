import React, { useCallback, useEffect, useRef } from 'react';
import { useSnapshot } from 'valtio';
import { Save, Type, Zap } from 'react-feather';

import Store from '../../../Store';

import { Button, Header } from '../../Base';
import { Checkbox, ColorPicker, Tags, TextField } from '../../Input';

import helpers from '../../../modules/helpers';

const Snapshot = () => {
  const snap = useSnapshot(Store);

  const inputRef = useRef(null);
  const colorRef = useRef(null);

  const isUpdate = snap.modal.data.snapshot.id !== null;

  const handleOnReturn = useCallback(async () => {
    Store.modal.isVisible = false;
    await helpers.cards.create();
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

  const handleOnPick = useCallback(index => {
    Store.modal.data.snapshot.pickIndex = index === snap.modal.data.snapshot.pickIndex ? -1 : index;
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
    <div className={'flex flex-col h-full'}>
      <Header>
        <Zap /> {isUpdate ? 'Edit' : 'Take'} Snapshot
      </Header>

      <div className={'flex flex-col mt-6 overflow-y-scroll'}>
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
          palette={snap.palette}
          pickIndex={snap.modal.data.snapshot.pickIndex}
          onPick={index => handleOnPick(index)}
          className={'mt-8'}
        />

        <div className={`overflow-hidden transition-all duration-500 ${!snap.modal.data.snapshot.isShowingCustomPick ? 'max-h-0' : 'max-h-20'}`}>
          <TextField
              value={snap.modal.data.snapshot.pickColor}
              placeholder={'Custom Color'}
              onChange={event => handleOnChangeColor(event)}
              nativeRef={colorRef}
              className={'mt-4'}
          />
        </div>
      </div>

      <Button onClick={() => handleOnReturn()} className={'self-end mt-8'}>
        <span>Save</span>
        <Save size={18} />
      </Button>
    </div>
  )
};

export default Snapshot;