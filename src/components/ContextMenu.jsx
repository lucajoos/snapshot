import React from 'react';
import { useSnapshot } from 'valtio';
import Store from '../Store';
import ContextMenuOption from './ContextMenuOption';
import { Delete, Edit2, ExternalLink, PenTool, Share, Trash } from 'react-feather';

const ContextMenu = () => {
  const snap = useSnapshot(Store);

  return (
    <div className={`z-50 p-2 w-contextMenu overflow-hidden bg-background-default drop-shadow-xl rounded grid absolute ${!snap.contextMenu.isVisible ? 'hidden' : ''}`} style={{
      top: snap.contextMenu.y,
      left: snap.contextMenu.x
    }}>
      <ContextMenuOption
        title={'Open'}
        icon={<ExternalLink size={16}/>}
      />
      <ContextMenuOption
        title={'Open Window'}
        icon={<ExternalLink size={16}/>}
      />
      <hr className={'my-1'}/>
      <ContextMenuOption
        title={'Share'}
        icon={<Share size={16}/>}
      />
      <ContextMenuOption
        title={'Edit'}
        icon={<Edit2 size={16}/>}
      />
      <hr className={'my-1'}/>
      <ContextMenuOption
        title={'Delete'}
        color={'text-red-500'}
        icon={<Trash size={16}/>}
      />
    </div>
  )
};

export default ContextMenu;