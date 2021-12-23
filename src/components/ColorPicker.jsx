import React, { useCallback, useState } from 'react';
import { Check, Sliders } from 'react-feather';
import { useSnapshot } from 'valtio';
import Store from '../Store';

const ColorPicker = ({ palette = [], pickIndex = -1, onPick = () => {}, }) => {
  const snap = useSnapshot(Store);

  const handleOnClick = useCallback((index, color) => {
    Store.modal.isShowingCustomPick = false;

    onPick({
      color: color ? color : palette[index],
      index: index,
    });
  }, [ palette ]);

  const handleOnClickCustom = useCallback(() => {
    if(snap.modal.pickColor ? (snap.modal.pickColor.length === 0 || !snap.modal.pickColor.startsWith('#')) : true) {
      Store.modal.pickColor = '#FFADAD';
    }

    Store.modal.pickIndex = -1;
    Store.modal.isShowingCustomPick = !snap.modal.isShowingCustomPick;
  }, [snap.modal.pickCustom, snap.modal.isShowingCustomPick]);

  return (
    <div className={ 'flex justify-start items-center my-2' }>
      <span>Color</span>

      <div className={ 'ml-3 flex' }>
        {
          palette.map((color, index) => {
            return (
              <div
                className={ `w-6 h-6 mr-1 cursor-pointer transition-all rounded bg-${ color }-default` }
                onClick={ () => handleOnClick(index) }
                key={ color }
              >
                <div
                  className={ `text-text-default grid justify-center items-center h-full duration-50 transition-all ${ pickIndex === index ? 'opacity-100' : 'opacity-0' }` }>
                  <Check size={ 20 } />
                </div>
              </div>
            );
          })
        }

        <div
          className={ 'w-6 h-6 relative cursor-pointer' }
          onClick={ () => handleOnClickCustom() }
        >
          <div className={ `text-text-default grid justify-center items-center h-full duration-50 transition-all` }>
            <Sliders size={ 20 } />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;