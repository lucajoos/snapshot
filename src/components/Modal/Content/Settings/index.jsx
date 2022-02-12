import React, { useCallback, useRef } from 'react';
import { Archive, Box, ChevronLeft, Globe, RefreshCw, Settings as Cob, Trash, User } from 'react-feather';

import { Header, Option } from '../../../Base';
import { useSnapshot } from 'valtio';
import Store from '../../../../Store';
import Category from './Category';

const Index = () => {
  const snap = useSnapshot(Store);
  const CategoryContent = Category[snap.modal.data.settings.category];

  const handleOnClickCategory = useCallback(title => {
    Store.modal.data.settings.category = title;
  }, []);

  const handleOnClickReturn = useCallback(() => {
    Store.modal.data.settings.category = '';
  }, []);

  return !snap.modal.data.settings.category ? (
    <div className={'flex flex-col gap-6'}>
      <Header><Cob /> Settings</Header>

      <div className={'flex gap-2 mt-2 flex-col'}>
        <Option title={'General'} icon={<Globe />} onClick={title => handleOnClickCategory(title)} />
        <Option title={'Synchronization'} icon={<RefreshCw />} onClick={title => handleOnClickCategory(title)} />
        <Option title={'Archive'} icon={<Archive />} onClick={title => handleOnClickCategory(title)} />
        <Option title={'Miscellaneous'} icon={<Box />} onClick={title => handleOnClickCategory(title)} />
      </div>
    </div>
  ) : (
    <>
      <Header>
        <div className={'cursor-pointer flex gap-2'} onClick={() => handleOnClickReturn()}>
          <ChevronLeft />
        </div>
        {snap.modal.data.settings.category}
      </Header>
      <div className={'mt-4 flex flex-col'}>
        <CategoryContent />
      </div>
    </>
  )
};

export default Index;