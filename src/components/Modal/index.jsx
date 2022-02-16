import React, { useCallback } from 'react';
import { useSnapshot } from 'valtio';
import { X } from 'react-feather';

import Content from './Content';

import Store from '../../Store';

const Modal = () => {
  const snap = useSnapshot(Store);
  const ModalContent = Content[snap.modal.content];

  const handleOnClose = useCallback(() => {
    Store.modal.isVisible = false;
  }, []);

  return (
    <div className={`fixed top-0 right-0 left-0 bottom-0 z-10 grid transition-all ${snap.modal.isVisible ? 'opacity-100 pointer-events-auto' : 'pointer-events-none opacity-0'}`}>
      <div className={`transition-all absolute top-0 right-0 left-0 bottom-0 bg-black ${snap.confirm.isVisible ? 'opacity-30' : 'opacity-60'}`} onClick={() => handleOnClose()} onContextMenu={() => handleOnClose()}/>

      <div className={`absolute z-20 rounded-md bg-background-default justify-self-center self-center p-10 ${snap.environment === 'extension' ? 'w-[calc(450px-4rem)]' : 'w-[475px] max-w-full'}`}>
        <div className={'absolute top-8 right-8 cursor-pointer'} onClick={() => handleOnClose()}>
          <X />
        </div>

        <div className={'flex flex-col'}>
          {
            snap.modal.content.length > 0 ? <ModalContent /> : null
          }
        </div>
      </div>
    </div>
  )
};

export default Modal;