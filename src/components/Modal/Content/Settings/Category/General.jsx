import React, { useCallback, useRef } from 'react';
import helpers from '../../../../../modules/helpers';
import { Link, Option, Section } from '../../../../Base';
import {Download, ExternalLink, File, Globe, Maximize, SkipBack, Upload} from 'react-feather';
import Store from '../../../../../Store';
import { useSnapshot } from 'valtio';

const General = () => {
  const snap = useSnapshot(Store);
  const importRef = useRef(null);

  const handleOnClickFullscreen = useCallback(async () => {
    await helpers.api.do('tabs.create', {
      url: await helpers.api.do('runtime.getURL', 'app.html?fullscreen=true')
    }, { isWaiting: false });
  }, []);

  const handleOnClickWebsite = useCallback(async () => {
    await helpers.api.do('tabs.create', {
      url: import.meta.env.VITE_APP_APPLICATION_URL
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
    Store.dialogue.text = 'All your locally stored data will be irreversibly deleted.';
    Store.dialogue.type = 'Reset';
    Store.dialogue.isVisible = true;

    Store.dialogue.resolve = (async isAccepted => {
      if(isAccepted) {
        localStorage.clear();

        if(snap.environment === 'extension') {
          await helpers.api.do('window.close');
        } else {
          location.reload();
        }
      } else {
        Store.dialogue.isVisible = false;
      }
    });
  }, [snap.environment]);

  const handleOnClickAboutLicenses = useCallback(async () => {
    if(snap.environment === 'extension') {
      await helpers.api.do('tabs.create', {
        url: await helpers.api.do('runtime.getURL', 'licenses.html')
      }, { isWaiting: false });
    } else {
      window.open(`${snap.settings.sync.advanced.applicationUrl.length === 0 ? import.meta.env.VITE_APP_APPLICATION_URL : snap.settings.sync.advanced.applicationUrl}/licenses.html`, '_blank');
    }
  }, [snap.environment]);

  return (
    <div className={'flex flex-col gap-6'}>
      {
        snap.environment === 'extension' && (
          <div>
            <Option.Category title={'Open Fullscreen'} icon={<Maximize />} onClick={() => handleOnClickFullscreen()}/>
            <Option.Category title={'Open Website'} icon={<ExternalLink />} onClick={() => handleOnClickWebsite()}/>
          </div>
        )
      }

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
        <Link onClick={() => handleOnClickAboutLicenses()} external={true} hasUnderline={true} >Show Licenses</Link>
        <p className={'mt-2'}>Snapshot v{__APP_VERSION__} ({import.meta.env.MODE})</p>
        <p>Environment ({snap.environment})</p>
        <p>React v{React.version}</p>
      </div>
    </div>
  )
};

export default General;