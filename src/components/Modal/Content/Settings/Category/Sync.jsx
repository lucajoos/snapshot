import React from 'react';
import Switch from '../../../../Input/Switch';
import { useSnapshot } from 'valtio';
import Store from '../../../../../Store';
import { Button, Link, Option } from '../../../../Base';
import { HardDrive, Maximize, RefreshCw, Settings, Tool, Trash } from 'react-feather';

const Sync = () => {
  const snap = useSnapshot(Store)
  return (
    <div className={'flex flex-col gap-2'}>
      <Option.Switch title={'Update Cards'} icon={<HardDrive />}/>
      <Option.Switch title={'Update Settings'} icon={<Tool />}/>
    </div>
  )
};

export default Sync;