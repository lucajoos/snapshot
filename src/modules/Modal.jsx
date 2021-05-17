import React, { useCallback } from 'react';

const Modal = ({ children, buttons, isVisible, onReturn=()=>{} }) => {
  const handleOnClickCurtain = useCallback(onReturn, []);

  return (
    <div className={`fixed top-0 right-0 left-0 bottom-0 z-30 grid transition-all ${isVisible ? 'opacity-100 pointer-events-auto' : 'pointer-events-none opacity-0'}`}>
      <div className={'absolute top-0 right-0 left-0 bottom-0 opacity-60 bg-black'} onClick={() => handleOnClickCurtain()}/>

      <div className={'absolute z-40 rounded-md bg-background-default justify-self-center self-center p-10'}>
        <div>
          { children }
        </div>

        <div>
          { buttons }
        </div>
      </div>
    </div>
  )
};

export default Modal;