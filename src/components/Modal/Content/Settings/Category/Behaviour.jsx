import { Link, Option, Section } from '../../../../Base';
import React, { useCallback, useRef } from 'react';
import helpers from '../../../../../modules/helpers';
import Switch from '../../../../Input/Switch';
import { useSnapshot } from 'valtio';
import Store from '../../../../../Store';
import { Box, ChevronRight, Maximize, Trash } from 'react-feather';

const Behaviour = () => {
  const snap = useSnapshot(Store);

  const handleOnChangeDeletePermanently = useCallback(() => {
    Store.settings.behaviour.isDeletingPermanently = !snap.settings.behaviour.isDeletingPermanently;
  }, [snap.settings.behaviour.isDeletingPermanently]);

  const handleOnChangeFullscreen = useCallback(() => {
    Store.settings.behaviour.isFullscreen = !snap.settings.behaviour.isFullscreen;
  }, [snap.settings.behaviour.isFullscreen]);

  return (
    <>
      <div className={'flex flex-col gap-2'}>
        <Option.Switch title={'Fullscreen Mode'} icon={<Maximize />}/>
        <Option.Switch title={'Delete Permanently'} icon={<Trash />}/>
      </div>
    </>
  )
};

export default Behaviour;