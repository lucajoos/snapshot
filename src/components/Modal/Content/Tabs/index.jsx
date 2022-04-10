import React from 'react';
import { useSnapshot } from 'valtio';

import Store from '../../../../Store';

import Overview from './Overview';
import View from './View';

const Tabs = () => {
  const snap = useSnapshot(Store);

  return snap.modal.data.tabs.current !== 'view' ? (
    <Overview />
  ) : (
    <View />
  )
};

export default Tabs;