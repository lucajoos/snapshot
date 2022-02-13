import React, { useCallback } from 'react';
import { useSnapshot } from 'valtio';
import { Code, Edit2, ExternalLink, RotateCcw, Share, Trash } from 'react-feather';

import ContextMenuOption from './ContextMenuOption';

import Store from '../Store';
import helpers from '../modules/helpers';

const ContextMenu = () => {
  const snap = useSnapshot(Store);

  // Card callbacks
  const handleOnClickCardOpen = useCallback(async isWindow => {
    await helpers.cards.open(snap.contextMenu.data, isWindow);
  }, [snap.contextMenu.data]);

  const handleOnClickCardEdit = useCallback(() => {
    helpers.cards.edit(snap.contextMenu.data);
  }, [snap.contextMenu.data]);

  const handleOnClickCardRemove = useCallback(async () => {
    await helpers.cards[
      snap.settings.behaviour.isDeletingPermanently ? 'delete' : 'remove'
    ](snap.contextMenu.data);
  }, [snap.contextMenu.data, snap.settings.behaviour.isDeletingPermanently]);

  const handleOnClickCardRestore = useCallback(async () => {
    await helpers.cards.restore(snap.contextMenu.data);
  }, [snap.contextMenu.data]);

  const handleOnClickCardDelete = useCallback(async () => {
    await helpers.cards.delete(snap.contextMenu.data);
  }, [snap.contextMenu.data]);

  // Default callbacks
  const handleOnClickDefaultMenu = useCallback(() => {
    Store.contextMenu.isPreventingDefault = !snap.contextMenu.isPreventingDefault;
  }, [snap.contextMenu.isPreventingDefault])

  return (
    <div className={`z-50 p-2 w-contextMenu overflow-hidden bg-background-default drop-shadow-xl rounded grid absolute ${!snap.contextMenu.isVisible ? 'hidden' : ''}`} style={{
      top: snap.contextMenu.y,
      left: snap.contextMenu.x
    }}>
      {
        snap.contextMenu.type === 'card' && (
          <>
            <ContextMenuOption
              title={'Open'}
              icon={<ExternalLink size={16}/>}
              onClick={() => handleOnClickCardOpen(false)}
            />
            <ContextMenuOption
              title={'Open in Window'}
              icon={<ExternalLink size={16}/>}
              onClick={() => handleOnClickCardOpen(true)}
            />
            <hr className={'my-1'}/>
            <ContextMenuOption
              title={'Share'}
              icon={<Share size={16}/>}
            />
            <ContextMenuOption
              title={'Edit'}
              icon={<Edit2 size={16}/>}
              onClick={() => handleOnClickCardEdit()}
            />
            <hr className={'my-1'}/>
            <ContextMenuOption
              title={snap.settings.behaviour.isDeletingPermanently ? 'Delete' : 'Remove'}
              color={'text-red-500'}
              icon={<Trash size={16}/>}
              onClick={() => handleOnClickCardRemove()}
            />
            <hr className={'my-1'}/>
          </>
        )
      }

      {
        snap.contextMenu.type === 'card-isArchived' && (
          <>
            <ContextMenuOption
              title={'Restore'}
              icon={<RotateCcw size={16}/>}
              onClick={() => handleOnClickCardRestore()}
            />
            <ContextMenuOption
              title={'Delete'}
              color={'text-red-500'}
              icon={<Trash size={16}/>}
              onClick={() => handleOnClickCardDelete()}
            />
            <hr className={'my-1'}/>
          </>
        )
      }

      <ContextMenuOption
        title={snap.contextMenu.isPreventingDefault ? 'Allow Default' : 'Prevent Default'}
        onClick={() => handleOnClickDefaultMenu()}
        icon={<Code size={16}/>}
      />
    </div>
  )
};

export default ContextMenu;