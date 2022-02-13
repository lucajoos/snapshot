import React, { useCallback, useRef } from 'react';
import helpers from '../../../../../modules/helpers';
import { Button, Link, Option, Section } from '../../../../Base';
import {
  ArrowDownCircle,
  ArrowUpCircle,
  CornerLeftDown,
  CornerRightDown,
  CornerRightUp,
  Download, Rewind,
  Share,
  Trash,
  Upload,
  X,
  Zap,
} from 'react-feather';

const General = () => {
  const handleOnClickOpenFullscreen = useCallback(async () => {
    await helpers.api.do('tabs.create', {
      url: await helpers.api.do('runtime.getURL', 'app.html?fullscreen=true')
    }, { isWaiting: false });
  }, []);

  const handleOnClickAboutLicenses = useCallback(async () => {
    await helpers.api.do('tabs.create', {
      url: await helpers.api.do('runtime.getURL', 'licenses.html')
    }, { isWaiting: false });
  }, []);

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

  return (
    <div className={'flex flex-col gap-6'}>
      <div>
        <Section>Advanced</Section>

        <Option.Category title={'Import Data'} icon={<Download />}/>

        <Option.Category title={'Export Data'} icon={<Upload />}/>
        <input className={ 'hidden' } type={ 'file' } onChange={ event => handleOnChangeAdvancedImportInput(event) } ref={advancedImportInputRef} />

        <hr className={'my-2'}/>

        <Option.Category title={'Reset'} icon={<Rewind />}/>
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