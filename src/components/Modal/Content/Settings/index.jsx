import React, { useCallback, useRef } from 'react';
import { Archive, Box, ChevronLeft, Globe, RefreshCw, Settings as Cob } from 'react-feather';

import { Header, Option } from '../../../Base';
import { useSnapshot } from 'valtio';
import Store from '../../../../Store';
import Category from './Category';

const Index = () => {
  const snap = useSnapshot(Store);
  const CategoryContent = Category[snap.modal.data.settings.category];

  const iconsRef = useRef({
    General: <Globe />,
    Synchronization: <RefreshCw />,
    Archive: <Archive />,
    Miscellaneous: <Box />
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

      <div className={'flex gap-4 mt-2 flex-col'}>
        <Option title={'General'} icon={iconsRef.current['General']} onClick={title => handleOnClickCategory(title)} />
        <Option title={'Synchronization'} icon={iconsRef.current['Synchronization']} onClick={title => handleOnClickCategory(title)} />
        <Option title={'Archive'} icon={iconsRef.current['Archive']} onClick={title => handleOnClickCategory(title)} />
        <Option title={'Miscellaneous'} icon={iconsRef.current['Miscellaneous']} onClick={title => handleOnClickCategory(title)} />
      </div>
    </div>
  ) : (
    <>
      <Header>
        <div className={'cursor-pointer flex gap-2'} onClick={() => handleOnClickReturn()}>
          <ChevronLeft />
        </div>
        {
          iconsRef.current[
            snap.modal.data.settings.category
          ]
        }
        {snap.modal.data.settings.category}
      </Header>
      <div className={'mt-4 flex flex-col'}>
        <CategoryContent />
      </div>
    </>
  )
};

export default Index;