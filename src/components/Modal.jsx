import React, { useCallback, useEffect, useRef } from 'react';
import { X } from 'react-feather';
import { useSnapshot } from 'valtio';
import Store from '../Store';
import Modals from './Modals';

const Modal = () => {
  const snap = useSnapshot(Store);
  const ModalContent = Modals[snap.modal.content];

  const handleOnClose = useCallback(() => {
    Store.modal.isVisible = false;
  }, []);

  return (
    <div className={`fixed top-0 right-0 left-0 bottom-0 z-30 grid transition-all ${snap.modal.isVisible ? 'opacity-100 pointer-events-auto' : 'pointer-events-none opacity-0'}`}>
      <div className={'absolute top-0 right-0 left-0 bottom-0 opacity-60 bg-black'} onClick={() => handleOnClose()}/>

      <div className={'absolute z-40 rounded-md bg-background-default justify-self-center self-center p-10 w-modal max-w-modal'}>
        <div className={'absolute top-8 right-8 cursor-pointer'} onClick={() => handleOnClose()}>
          <X />
        </div>

        <div className={'grid'}>
          {
            snap.modal.content.length > 0 ? <ModalContent /> : null
          }
        </div>
      </div>
    </div>
  )
};

export default Modal;