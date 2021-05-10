import React, { useCallback, useEffect, useRef, useState } from 'react';
import Button from './Button';
import Store from '../Store';
import { useSnapshot } from 'valtio';

const ButtonList = () => {
  const snap = useSnapshot(Store);

  return (
    <>
      {
        snap.buttons.map((button, index) => {
          return (
            <Button
              key={index}
              color={button?.color}
            >
              <div className={'grid gap-1'}>
                <span className={'text-lg font-bold'}>{button?.title}</span>
                <span className={'text-xs'}>{button?.meta}</span>
              </div>
            </Button>
          )
        })
      }
    </>
  )
};

export default ButtonList;