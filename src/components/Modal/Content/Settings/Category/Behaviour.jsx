import { Option } from '../../../../Base';
import React, { useCallback } from 'react';
import { useSnapshot } from 'valtio';
import Store from '../../../../../Store';
import { Maximize, Trash } from 'react-feather';
import helpers from '../../../../../modules/helpers';

const Behaviour = () => {
  const snap = useSnapshot(Store);

  const handleOnChangeDeletePermanently = useCallback(() => {
    Store.settings.behaviour.isDeletingPermanently = !snap.settings.behaviour.isDeletingPermanently;
    helpers.settings.save();
  }, [snap.settings.behaviour.isDeletingPermanently]);

  const handleOnChangeFullscreen = useCallback(() => {
    Store.settings.behaviour.isFullscreen = !snap.settings.behaviour.isFullscreen;
    helpers.settings.save();
  }, [snap.settings.behaviour.isFullscreen]);

  return (
    <>
      <div className={'flex flex-col gap-2'}>
        <Option.Switch
          title={'Fullscreen Mode'}
          icon={<Maximize />}
          onChange={() => handleOnChangeFullscreen()}
          value={snap.settings.behaviour.isFullscreen}
        />
        <Option.Switch
          title={'Delete Permanently'}
          icon={<Trash />}
          onChange={() => handleOnChangeDeletePermanently()}
          value={snap.settings.behaviour.isDeletingPermanently}
        />
      </div>
    </>
  )
};

export default Behaviour;