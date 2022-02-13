import React from 'react';
import Switch from '../../../../Input/Switch';
import { useSnapshot } from 'valtio';
import Store from '../../../../../Store';
import { Button, Link, Option } from '../../../../Base';
import { HardDrive, Layers, Maximize, RefreshCw, Settings, Sliders, Tool, Trash } from 'react-feather';

const Sync = () => {
  const snap = useSnapshot(Store)
  return (
    <div className={'flex flex-col gap-2'}>
      <Option.Switch title={'Synchronize Cards'} icon={<Layers />}/>
      <Option.Switch title={'Synchronize Settings'} icon={<Settings />}/>
    </div>
  )
};

export default Sync;