import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Check, Clock, Edit2, PenTool, X } from 'react-feather';
import Store from '../Store';
import { useSnapshot } from 'valtio';
import moment from 'moment';

const Card = ({ card, color='', index=-1}) => {
  const snap = useSnapshot(Store);
  const [name, setName] = useState(card?.name);
  const [isDisabled, setIsDisabled] = useState(true);

  const palette = ['orange', 'pink', 'green', 'violet', 'blue'];
  const theme = useRef(color?.length === 0 ? palette[Math.floor(Math.random() * (palette.length - 1))] : color);

  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const handleOnClickRemove = useCallback(() => {
    let cards = snap.cards.map(compare => {
      let current = Object.assign({}, compare);

      if(current.id === card.id) {
        current.visible = false;
      }

      return current;
    });

    Store.cards = cards;

    const set = cards.filter(current => {
      return current.id !== card.id;
    });

    localStorage.setItem('length', (parseInt(localStorage.getItem('length')) - 1).toString());
    localStorage.setItem('cards', JSON.stringify({value: set}));
  }, [snap.cards, index]);

  const handleOnInputChange = useCallback(event => {
    setName(event.target.value);

    let cards = snap.cards.map((card, number) => {
      let current = Object.assign({}, card);

      if(index === number) {
        current.name = event.target.value?.length === 0 ? `Snapshot #${localStorage.getItem('length')}` : event.target.value;
      }

      return current;
    });

    Store.cards = cards;
    localStorage.setItem('cards', JSON.stringify({value: cards}));
  }, []);

  const handleOnClickEdit = useCallback(() => {
    if(isDisabled) {
      setIsDisabled(!isDisabled);

      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 50);
    } else {
      inputRef.current?.blur();
    }
  }, [isDisabled]);

  const handleOnBlur = useCallback(() => {
    if(name?.length === 0) {
      setName(`Card #${localStorage.getItem('length')}`);
    }

    setIsDisabled(true);
  }, [name]);

  const handleOnKeyDown = useCallback((event) => {
    if(event.keyCode === 13 || event.keyCode === 27) {
      inputRef.current?.blur();
    }
  }, []);

  const handleOnClick = useCallback(event => {
    if(event.target === containerRef.current) {
      card.urls.forEach(url => {
        chrome.tabs.create({
          url: url
        });
      });
    }
  }, [card]);

  return (
    <div
      className={'my-4'}
    >
      <div
        onClick={e => handleOnClick(e)}
        className={`card p-5 cursor-pointer select-none w-full rounded-lg text-text-default relative bg-${theme.current}-default`}
        ref={containerRef}
      >
        <div className={'grid gap-1 pointer-events-none'}>
          <div className={'grid gap-1'}>
            <input
              value={name}
              className={`text-lg font-bold bg-transparent ${isDisabled ? 'pointer-events-none' : 'pointer-events-all'}`}
              type={'text'}
              onChange={e => handleOnInputChange(e)}
              disabled={isDisabled}
              ref={inputRef}
              onBlur={() => handleOnBlur()}
              onKeyDown={(e) => handleOnKeyDown(e)}
            />

            <div className={'flex items-center'}>
              <div className={'mr-1'}>
                <Clock size={18}/>
              </div>

              <span className={'text-xs'}>Created {moment(card?.meta || new Date()).fromNow()}</span>
            </div>
          </div>
        </div>

        <div className={'absolute top-0 bottom-0 m-auto right-5 items-center cursor-pointer card-remove flex'}>
          <div className={`rounded hover:bg-${theme.current}-accent p-2 mr-1 pointer-events-all`} onClick={() => {handleOnClickEdit()}}>
            {
              isDisabled ? <Edit2 /> : <Check/>
            }
          </div>

          {
            isDisabled && (
              <div className={`rounded hover:bg-${theme.current}-accent p-2 pointer-events-all`} onClick={() => handleOnClickRemove()}>
                <X />
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default Card;