import React, { useCallback, useEffect, useRef, useState } from 'react';
import Button from './Button';
import Store from '../Store';
import { useSnapshot } from 'valtio';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const ButtonList = () => {
  const snap = useSnapshot(Store);

  return (
    <DndProvider backend={HTML5Backend}>
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
    </DndProvider>
  )
};

export default ButtonList;