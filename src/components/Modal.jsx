import React, { useCallback, useEffect, useRef, useState } from 'react';
import Input from './Input';
import ColorPicker from './ColorPicker';
import Button from './Button';
import Header from './Header';
import { Check } from 'react-feather';

const Modal = ({ isVisible, onReturn=()=>{} }) => {
  const inputRef = useRef(null);
  const [value, setValue] = useState('');
  const [pick, setPick] = useState({color: '', index: -1});
  const [enabled, setEnabled] = useState(false);

  const handleOnClickCurtain = useCallback(() => onReturn(false, { value: null, color: null }), []);
  const handleOnKeyDown = useCallback(event => {
    if(event.keyCode === 13 || event.keyCode === 27) {
      onReturn(event.keyCode === 13, {
        value: value || '',
        pick: pick || ''
      });
    }
  }, [value, pick]);

  const handleOnClick = useCallback(() => {
    onReturn(true, {
      value: value || '',
      pick: pick || ''
    });
  }, [value, pick]);

  useEffect(() => {
    if(isVisible) {
      inputRef.current?.focus();
      setValue('');

      setPick({
        color: '',
        index: -1
      });
    }
  }, [isVisible]);

  return (
    <div className={`fixed top-0 right-0 left-0 bottom-0 z-30 grid transition-all ${isVisible ? 'opacity-100 pointer-events-auto' : 'pointer-events-none opacity-0'}`} onKeyDown={event => handleOnKeyDown(event)}>
      <div className={'absolute top-0 right-0 left-0 bottom-0 opacity-60 bg-black'} onClick={() => handleOnClickCurtain()}/>

      <div className={'absolute z-40 rounded-md bg-background-default justify-self-center self-center p-10 min-w-modal'}>
        <div className={'grid'}>
          <Header>
            Save current window
          </Header>

          <div className={'mb-6 mt-5'}>
            <Input
              value={value}
              placeholder={'Name'}

              onChange={(event) => setValue(event.target.value)}

              nativeRef={inputRef}
            />

            <div className={'pt-3'}>
              <ColorPicker
                palette={['orange', 'pink', 'green', 'violet', 'blue']}
                value={pick}

                onPick={pick => setPick(pick)}
              />
            </div>
          </div>

          <Button onClick={() => handleOnClick()} enabled={enabled}>
            <span className={'mr-1 ml-2'}>Create</span>
            <Check />
          </Button>
        </div>
      </div>
    </div>
  )
};

export default Modal;