import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Clock, Edit2, PenTool, X } from 'react-feather';
import Store from '../Store';
import { useSnapshot } from 'valtio';
import moment from 'moment';

const Card = ({ card, color='', index=-1, onClick=() => {}, innerRef=null }) => {
  const snap = useSnapshot(Store);
  const [name, setName] = useState(card?.name);

  const palette = ['orange', 'pink', 'green', 'violet', 'blue'];
  const theme = useRef(color?.length === 0 ? palette[Math.floor(Math.random() * (palette.length - 1))] : color);

  const handleOnClickRemove = useCallback(() => {
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
          <div className={'grid gap-1'}>
            <input value={card?.name} className={`text-lg font-bold bg-transparent`} type={'text'} />

            <div className={'flex items-center'}>
              <div className={'mr-1'}>
                <Clock size={18}/>
              </div>

              <span className={'text-xs'}>Created {moment(card?.meta || new Date()).fromNow()}</span>
            </div>
          </div>
        </div>

        <div className={'absolute top-0 bottom-0 m-auto right-5 items-center cursor-pointer card-remove flex'}>
          <div className={`rounded hover:bg-${theme.current}-accent p-2 mr-1`}>
            <Edit2 />
          </div>

          <div className={`rounded hover:bg-${theme.current}-accent p-2`} onClick={() => handleOnClickRemove()}>
            <X />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;