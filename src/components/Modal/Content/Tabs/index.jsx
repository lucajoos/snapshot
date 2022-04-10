import React from 'react';
import { useSnapshot } from 'valtio';

import Store from '../../../../Store';

import Overview from './Overview';
import Create from './Create';

const Tabs = () => {
  const snap = useSnapshot(Store);

  return snap.modal.data.tabs.current !== 'create' ? (
    <Overview />
  ) : (
    <Create />
  )
};

export default Tabs;