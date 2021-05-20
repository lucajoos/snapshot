import React, { useCallback, useEffect, useRef, useState } from 'react';
import Input from './Input';
import ColorPicker from './ColorPicker';
import Button from './Button';
import Header from './Header';
import { Check, X } from 'react-feather';
import Checkbox from './Checkbox';

const Modal = ({ isVisible, onReturn=()=>{} }) => {
  const inputRef = useRef(null);
  const [value, setValue] = useState('');
  const [pick, setPick] = useState({color: '', index: -1});
  const [isShowingIcons, setIsShowingIcons] = useState(true);

  const handleOnReturn = useCallback(() => onReturn(false, { value: null, color: null }), []);
  const handleOnKeyDown = useCallback(event => {
    if(event.keyCode === 13 || event.keyCode === 27) {
      onReturn(event.keyCode === 13, {
        value: value || '',
        pick: pick || '',
        isShowingIcons: false
      });
    }
  }, [value, pick]);

  const handleOnClick = useCallback(() => {
    onReturn(true, {
      value: value || '',
      pick: pick || '',
      isShowingIcons: isShowingIcons
    });
  }, [value, pick, isShowingIcons]);

  const handleOnPick = useCallback(current => {
    if(current?.color === pick?.color) {
      current.color = '';
      current.index = -1;
    }

    setPick(current);
  }, [pick]);

  const handleCheckboxOnChange = useCallback(() => {
    setIsShowingIcons(current => {
      return !current;
    });
  }, []);

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
      <div className={'absolute top-0 right-0 left-0 bottom-0 opacity-60 bg-black'} onClick={() => handleOnReturn()}/>

      <div className={'absolute z-40 rounded-md bg-background-default justify-self-center self-center p-10 w-modal max-w-modal'}>
        <div className={'absolute top-8 right-8 cursor-pointer'} onClick={() => handleOnReturn()}>
          <X />
        </div>

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

            <div className={'flex items-center justify-between pt-3'}>
              <ColorPicker
                palette={['orange', 'pink', 'green', 'violet', 'blue']}
                value={pick}

                onPick={pick => handleOnPick(pick)}
              />

              <div className={'flex items-center'}>
                <span className={'mr-3'}>Icons</span>
                <Checkbox onChange={() => handleCheckboxOnChange()} value={isShowingIcons} />
              </div>
            </div>
          </div>

          <Button onClick={() => handleOnClick()}>
            <span className={'mx-1'}>Create</span>
            <Check size={18} />
          </Button>
        </div>
      </div>
    </div>
  )
};

export default Modal;