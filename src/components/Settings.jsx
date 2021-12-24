import React, { useCallback, useRef } from 'react';
import { useSnapshot } from 'valtio';
import Store from '../Store';
import { X } from 'react-feather';
import Header from './Header';
import Link from './Link';
import Section from './Section';
import helpers from '../modules/helpers';

const Settings = () => {
  const snap = useSnapshot(Store);

  const advancedImportInputRef = useRef(null);

  const handleOnClose = useCallback(() => {
    Store.settings.isVisible = false;
  }, []);

  const handleOnClickAdvancedImport = useCallback(() => {
    advancedImportInputRef.current?.click();
  }, []);

  const handleOnChangeAdvancedImportInput = useCallback(async event => {
    event.preventDefault();

    if(event.target?.files?.length > 0) {
      const content = await event.target.files.item(0).text();
      helpers.card.import(content);
      Store.settings.isVisible = false;
    }
  }, [])

  const handleOnClickAdvancedExport = useCallback(() => {
    helpers.card.export();
  }, []);

  const handleOnClickAboutLicenses = useCallback(() => {
    chrome.tabs.create({
      url: chrome.runtime.getURL('licenses.html'),
    });
  }, []);

  return (
    <div className={`fixed top-0 right-0 left-0 bottom-0 z-30 grid transition-all ${snap.settings.isVisible ? 'opacity-100 pointer-events-auto' : 'pointer-events-none opacity-0'}`}>
      <div className={'absolute top-0 right-0 left-0 bottom-0 opacity-60 bg-black'} onClick={() => handleOnClose()}/>

      <div className={'absolute z-40 rounded-md bg-background-default justify-self-center self-center p-10 w-modal max-w-modal'}>
        <div className={'absolute top-8 right-8 cursor-pointer'} onClick={() => handleOnClose()}>
          <X />
        </div>

        <div className={'grid gap-3'}>
          <Header>
            Settings
          </Header>

          <div className={'mt-2'}>
            <Section>Appearance</Section>
          </div>

          <div>
            <Section>Advanced</Section>
            <div className={'flex gap-2'}>
              <Link onClick={() => handleOnClickAdvancedImport()}>Import Cards</Link>
              <input className={ 'hidden' } type={ 'file' } onChange={ event => handleOnChangeAdvancedImportInput(event) } value={ '' } ref={advancedImportInputRef} />
              <Link onClick={() => handleOnClickAdvancedExport()}>Export Cards</Link>
            </div>
          </div>

          <div className={'mt-2'}>
            <Section>About</Section>
            <Link onClick={() => handleOnClickAboutLicenses()}>Show Licenses</Link>
            <p className={'mt-2'}>Snapshot v{import.meta.env.APP_VERSION} ({import.meta.env.MODE})</p>
            <p>React v{React.version}</p>
          </div>
        </div>
      </div>
    </div>
  )
};

export default Settings;