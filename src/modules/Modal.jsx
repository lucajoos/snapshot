import React, { useCallback, useEffect, useRef, useState } from 'react';
import Input from './Input';
import ColorPicker from './ColorPicker';

const Modal = ({ isVisible, onReturn=()=>{} }) => {
  const inputRef = useRef(null);
  const [value, setValue] = useState('');
  const [color, setColor] = useState('');

  const handleOnClickCurtain = useCallback(() => onReturn(false, { value: null, color: null }), []);
  const handleOnKeyDown = useCallback(event => {
    if(event.keyCode === 13 || event.keyCode === 27) {
      onReturn(event.keyCode === 13, {
        value: value || '',
        color: color || ''
      });
    }
  }, [value]);

  useEffect(() => {
    if(isVisible) {
      inputRef.current?.focus();
    }
  }, [isVisible]);

  return (
    <div className={`fixed top-0 right-0 left-0 bottom-0 z-30 grid transition-all ${isVisible ? 'opacity-100 pointer-events-auto' : 'pointer-events-none opacity-0'}`} onKeyDown={event => handleOnKeyDown(event)}>
      <div className={'absolute top-0 right-0 left-0 bottom-0 opacity-60 bg-black'} onClick={() => handleOnClickCurtain()}/>

      <div className={'absolute z-40 rounded-md bg-background-default justify-self-center self-center p-10'}>
        <div>
          <h1>This is a modal</h1>
          <Input
            value={value}
            placeholder={'Name'}

            onChange={(event) => setValue(event.target.value)}

            nativeRef={inputRef}
          />
          <ColorPicker
            palette={['orange', 'pink', 'green', 'violet', 'blue']}

            onPick={color => setColor(color || '')}
          />
        </div>

        <div>
          <div>Close me</div>
        </div>
      </div>
    </div>
  )
};

export default Modal;