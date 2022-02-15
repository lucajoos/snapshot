import React, { useCallback, useRef } from 'react';
import helpers from '../../../../../modules/helpers';
import { Link, Option, Section } from '../../../../Base';
import { Download, Maximize, SkipBack, Upload } from 'react-feather';
import Store, { Template } from '../../../../../Store';
import settings from '../../../../../modules/helpers/settings';

const General = () => {
  const importRef = useRef(null);

  const handleOnClickFullscreen = useCallback(async () => {
    await helpers.api.do('tabs.create', {
      url: await helpers.api.do('runtime.getURL', 'app.html?fullscreen=true')
    }, { isWaiting: false });
  }, []);

  const handleOnClickImport = useCallback(() => {
    importRef.current?.click();
  }, []);

  const handleOnChangeImport = useCallback(async event => {
    event.preventDefault();

    if(event.target?.files?.length > 0) {
      const content = await event.target.files.item(0).text();
      helpers.cards.import(content);
    }
  }, [])

  const handleOnClickExport = useCallback(() => {
    helpers.cards.export();
  }, []);

  const handleOnClickReset = useCallback(async () => {
    Store.confirm.text = 'All your locally stored data will be irreversibly deleted.';
    Store.confirm.type = 'Reset';
    Store.confirm.isVisible = true;

    Store.confirm.resolve = (isAccepted => {
      if(isAccepted) {
        localStorage.clear();

        Object.keys(Template).forEach(key => {
          Store[key] = Template[key];
        });
      }

      Store.confirm.isVisible = false;

      if(isAccepted) {
        setTimeout(() => {
          Store.modal.isVisible = false;
        }, 150);
      }
    });
  }, []);

  const handleOnClickAboutLicenses = useCallback(async () => {
    await helpers.api.do('tabs.create', {
      url: await helpers.api.do('runtime.getURL', 'licenses.html')
    }, { isWaiting: false });
  }, []);

  return (
    <div className={'flex flex-col gap-6'}>
      <Option.Category title={'Open Fullscreen'} icon={<Maximize />} onClick={() => handleOnClickFullscreen()}/>

      <div>
        <Section>Advanced</Section>

        <Option.Category title={'Import Data'} icon={<Download />} onClick={() => handleOnClickImport()}/>
        <input className={ 'hidden' } type={ 'file' } onChange={ event => handleOnChangeImport(event) } ref={importRef} />

        <Option.Category title={'Export Data'} icon={<Upload />} onClick={() => handleOnClickExport()}/>

        <hr className={'my-2'}/>

        <Option.Category title={'Reset'} icon={<SkipBack />} onClick={() => handleOnClickReset()}/>
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

export default General;