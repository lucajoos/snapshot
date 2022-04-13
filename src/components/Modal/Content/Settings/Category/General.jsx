import React, { useCallback, useRef } from 'react';
import { useSnapshot } from 'valtio';
import { Download, ExternalLink, FileText, Maximize, Shield, SkipBack, Upload } from 'react-feather';

import Store from '../../../../../Store';

import { Link, Option, Section } from '../../../../Base';
import helpers from '../../../../../modules/helpers';

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

      if(content) {
        await helpers.cards.import(content);
      }
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

  const handleOnClickExternal = useCallback(async path => {
    if(snap.environment === 'extension') {
      await helpers.api.do('tabs.create', {
        url: await helpers.api.do('runtime.getURL', path)
      }, { isWaiting: false });
    } else {
      window.open(`${snap.settings.sync.advanced.applicationUrl.length === 0 ? import.meta.env.VITE_APP_APPLICATION_URL : snap.settings.sync.advanced.applicationUrl}/${path}`, '_blank');
    }
  }, [snap.environment]);


  return (
    <div className={'flex flex-col gap-4'}>
      {
          snap.environment === 'extension' && (
              <Section>
                <Option.Category title={'Open Fullscreen'} icon={<Maximize />} onClick={() => handleOnClickFullscreen()}/>
                <Option.Category title={'Open Website'} icon={<ExternalLink />} onClick={() => handleOnClickWebsite()}/>
              </Section>
          )
      }

      <Section title={'Advanced'} isExtendable={true}>
        <Option.Category title={'Import Data'} icon={<Download />} onClick={() => handleOnClickImport()}/>
        <input className={ 'hidden' } type={ 'file' } onChange={ event => handleOnChangeImport(event) } ref={importRef} />

        <Option.Category title={'Export Data'} icon={<Upload />} onClick={() => handleOnClickExport()}/>

        <hr className={'my-2'}/>

        <Option.Category title={'Reset'} icon={<SkipBack />} onClick={() => handleOnClickReset()}/>
      </Section>

      <Section title={'Privacy'}>
        <Option.Category title={'Withdraw Preferences'} icon={<Shield />} onClick={() => handleOnClickReset()}/>

        <hr className={'my-2'}/>

        <Option.Category title={'Privacy Statement'} icon={<FileText />} onClick={() => handleOnClickExternal('privacy.html')}/>
        <Option.Category title={'Imprint'} icon={<FileText />} onClick={() => handleOnClickExternal('imprint.html')}/>
      </Section>

      <Section title={'About'}>
        <Link onClick={() => handleOnClickExternal('licenses.html')} external={true} hasUnderline={true} >Show Licenses</Link>
        <p className={'mt-2'}>Snapshot v{__APP_VERSION__} ({import.meta.env.MODE})</p>
        <p>Environment ({snap.environment})</p>
        <p>React v{React.version}</p>
      </Section>
    </div>
  )
};

export default General;