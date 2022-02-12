import { Link, Section } from '../../../../Base';
import React, { useCallback, useRef } from 'react';
import helpers from '../../../../../modules/helpers';

const Miscellaneous = () => {
  const advancedImportInputRef = useRef(null);

  const handleOnClickAdvancedImport = useCallback(() => {
    advancedImportInputRef.current?.click();
  }, []);

  const handleOnChangeAdvancedImportInput = useCallback(async event => {
    event.preventDefault();

    if(event.target?.files?.length > 0) {
      const content = await event.target.files.item(0).text();
      helpers.cards.import(content);
    }
  }, [])

  const handleOnClickAdvancedExport = useCallback(() => {
    helpers.cards.export();
  }, []);

  const handleOnCLickAdvancedReset = useCallback(async () => {
    localStorage.clear();
    await helpers.api.do('window.close');
  }, []);

  const handleOnClickAboutLicenses = useCallback(async () => {
    await helpers.api.do('tabs.create', {
      url: await helpers.api.do('runtime.getURL', 'licenses.html')
    }, { isWaiting: false });
  }, []);

  const handleOnClickOpenFullscreen = useCallback(async () => {
    await helpers.api.do('tabs.create', {
      url: await helpers.api.do('runtime.getURL', 'app.html?fullscreen=true')
    }, { isWaiting: false });
  }, []);

  return (
    <div className={'flex flex-col gap-4'}>
      <div>
        <Section>Advanced</Section>
        <div className={'flex gap-2'}>
          <Link onClick={() => handleOnClickAdvancedImport()}>Import Cards</Link>
          <input className={ 'hidden' } type={ 'file' } onChange={ event => handleOnChangeAdvancedImportInput(event) } value={ '' } ref={advancedImportInputRef} />
          <Link onClick={() => handleOnClickAdvancedExport()}>Export Cards</Link>
          <Link onClick={() => handleOnCLickAdvancedReset()}>Reset</Link>
        </div>
      </div>

      <div>
        <Section>About</Section>
        <Link onClick={() => handleOnClickAboutLicenses()} external={true}>Show Licenses</Link>
        <p className={'mt-2'}>Snapshot v{__APP_VERSION__} ({import.meta.env.MODE})</p>
        <p>React v{React.version}</p>
      </div>
    </div>
  )
};

export default Miscellaneous;