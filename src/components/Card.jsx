import React, { useCallback, useEffect, useRef } from 'react';
import { X } from 'react-feather';
import Store from '../Store';
import { useSnapshot } from 'valtio';

const Card = ({ children, color='', index=-1, onClick=() => {}, innerRef=null }) => {
  const snap = useSnapshot(Store);

  const palette = ['orange', 'pink', 'green', 'violet', 'blue'];
  const theme = useRef(color?.length === 0 ? palette[Math.floor(Math.random() * (palette.length - 1))] : color);

  const handleOnClick = useCallback(() => {
    let cards = snap.cards.map((card, number) => {
      let current = Object.assign({}, card);

      if(index === number) {
        current.visible = false;
      }

      return current;
    });

    Store.cards = cards;

    const set = cards.filter((card, number) => {
      return index !== number;
    });

    localStorage.setItem('length', (parseInt(localStorage.getItem('length')) - 1).toString());
    localStorage.setItem('cards', JSON.stringify({value: set}));
  }, [snap.cards, index]);

  return (
    <div
      className={'my-4'}
    >
      <div
        onClick={() => onClick()}
        className={`card p-5 cursor-pointer select-none w-full rounded-lg text-text-default relative bg-${theme.current}-default`}
        ref={innerRef}
      >
        <div className={'grid gap-1'}>
          {children}
        </div>

        <div className={'absolute top-0 bottom-0 m-auto right-5 grid items-center cursor-pointer'} onClick={() => handleOnClick()}>
          <X />
        </div>
      </div>
    </div>
  );
};

export default Card;