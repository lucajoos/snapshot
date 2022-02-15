import React, { useCallback, useRef } from 'react';
import { Archive, Box, ChevronLeft, Globe, RefreshCw, Settings as Cob } from 'react-feather';

import { Header, Option } from '../../../Base';
import { useSnapshot } from 'valtio';
import Store from '../../../../Store';
import Category from './Category';

const Settings = () => {
  const snap = useSnapshot(Store);
  const CategoryContent = Category[snap.modal.data.settings.category];

  const iconsRef = useRef({
    General: <Globe />,
    Behavior: <Box />,
    Sync: <RefreshCw />,
    Archive: <Archive />
  })

  const handleOnClickCategory = useCallback(title => {
    Store.modal.data.settings.category = title;
  }, []);

  const handleOnClickReturn = useCallback(() => {
    Store.modal.data.settings.category = null;
  }, []);

  return !snap.modal.data.settings.category ? (
    <div className={'flex flex-col gap-6'}>
      <Header><Cob /> Settings</Header>

      <div className={'flex gap-2 flex-col'}>
        <Option.Category title='General' icon={iconsRef.current['General']} onClick={title => handleOnClickCategory(title)} />
        <hr />
        <Option.Category title='Behavior' icon={iconsRef.current['Behavior']} onClick={title => handleOnClickCategory(title)} />
        <hr />
        <Option.Category title='Sync' icon={iconsRef.current['Sync']} onClick={title => handleOnClickCategory(title)} />
        <hr />
        <Option.Category title='Archive' icon={iconsRef.current['Archive']} onClick={title => handleOnClickCategory(title)} />
      </div>
    </div>
  ) : (
    <>
      <Header>
        <div className={'chevron-left transition-all cursor-pointer'} onClick={() => handleOnClickReturn()}>
          <ChevronLeft />
        </div>
        <div className={'flex ml-2 items-center gap-2'}>
          {
            iconsRef.current[
              snap.modal.data.settings.category
              ]
          }
          {snap.modal.data.settings.category}
        </div>
      </Header>
      <div className={'max-h-[50vh] overflow-scroll mt-6 flex flex-col'}>
        <CategoryContent />
      </div>
    </>
  )
};

export default Settings;