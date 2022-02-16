import { useSnapshot } from 'valtio';
import Store from '../../../../Store';
import React  from 'react';
import Overview from './Overview';
import Create from './Create';

const Tabs = () => {
  const snap = useSnapshot(Store);

  return snap.modal.data.tabs.current.length === 0 ? (
    <Overview />
  ) : (
    <Create />
  )
};

export default Tabs;