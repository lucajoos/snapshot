import React, { useCallback } from 'react';
import { useSnapshot } from 'valtio';
import { Check, Sliders } from 'react-feather';

import Store from '../../Store';

const ColorPicker = ({ palette = [], className='', pickIndex = -1, onPick = () => {}, }) => {
  const snap = useSnapshot(Store);

  const handleOnClick = useCallback(index => {
    Store.modal.data.snapshot.isShowingCustomPick = false;
    onPick(index);
  }, []);

  const handleOnClickCustom = useCallback(() => {
    if(snap.modal.data.snapshot.isShowingCustomPick) {
      Store.modal.data.snapshot.pickIndex = snap.modal.data.snapshot.previousPickIndex;
    } else {
      Store.modal.data.snapshot.previousPickIndex = snap.modal.data.snapshot.pickIndex;
      Store.modal.data.snapshot.pickIndex = -1;

      if(snap.modal.data.snapshot.pickColor.length === 0) {
        Store.modal.data.snapshot.pickColor = '#FFADAD';
      }
    }

    Store.modal.data.snapshot.isShowingCustomPick = !snap.modal.data.snapshot.isShowingCustomPick;
  }, [snap.modal.data.snapshot.pickIndex, snap.modal.data.snapshot.isShowingCustomPick, snap.modal.data.snapshot.previousPickIndex]);

  return (
    <div className={ `flex justify-start items-center ${className ? ` ${className}` : ''}` }>
      <span>Color</span>

      <div className={ 'ml-3 flex justify-between w-full' }>
        <div className={'flex'}>
          {
            palette.map((color, index) => {
              return (
                <div
                  className={ `w-6 h-6 mr-1 cursor-pointer transition-all rounded bg-${ color }-default` }
                  onClick={ () => handleOnClick(index) }
                  key={ index }
                >
                  <div
                    className={ `text-text-default grid justify-center items-center h-full duration-50 transition-all ${ pickIndex === index ? 'opacity-100' : 'opacity-0' }` }>
                    <Check size={ 20 } />
                  </div>
                </div>
              );
            })
          }
        </div>

        <div
          className={ 'w-6 h-6 relative cursor-pointer' }
          onClick={ () => handleOnClickCustom() }
        >
          <div className={ `text-text-default grid justify-center items-center h-full duration-50 transition-all ${!snap.modal.data.snapshot.isShowingCustomPick ? 'text-gray-400' : ''}` }>
            <Sliders size={ 20 } />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;