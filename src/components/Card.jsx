import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Clock, Edit2, X } from 'react-feather';
import Store from '../Store';
import { useSnapshot } from 'valtio';
import moment from 'moment';
import Icon from './Icon';
import Color from 'color';

const Card = ({ card, className }) => {
  const snap = useSnapshot(Store);

  const palette = useRef([ 'orange', 'pink', 'green', 'violet', 'blue' ]);
  const [theme, setTheme] = useState(null);
  const [themeAccent, setThemeAccent] = useState(null)

  const [isHoveringEdit, setIsHoveringEdit] = useState(false);
  const [isHoveringDelete, setIsHoveringDelete] = useState(false);
  
  const containerRef = useRef(null);

  const faviconsRendered = Object.values(snap.favicons[card.id]).filter(current => current).length;

  // Callbacks
  const updateTheme = useCallback(() => {
    const currentTheme = card.isCustomPick ? card.pickColor : (card.pickColor.length > 0 ? card.pickColor : palette.current[Math.floor(Math.random() * palette.current.length)]);

    setTheme(currentTheme);
    setThemeAccent(card.isCustomPick ? Color(currentTheme).lighten(0.05) : null);
  }, [card.pickColor, card.pickCustom, card.pickIndex, card.isCustomPick]);

  const handleOnClickRemove = useCallback(() => {
    let cards = snap.cards.map(compare => {
      let current = Object.assign({}, compare);

      if (current.id === card.id) {
        current.isVisible = false;
      }

      return current;
    });

    Store.cards = cards;

    const set = cards.filter(current => {
      return current.id !== card.id;
    });

    localStorage.setItem('cards', JSON.stringify({ value: set }));
  }, [ snap.cards, card.index ]);

  const handleOnClickEdit = useCallback(() => {
    Store.modal = {
      id: card.id,
      value: card.value,
      tags: card.tags,
      pickColor: card.pickColor,
      pickIndex: card.pickIndex,
      pickCustom: card.pickCustom,
      isShowingIcons: card.isShowingIcons,
      isUpdatingTabs: false,
      isShowingCustomPick: card.isCustomPick,
    };

    Store.isModalVisible = true;
  }, [card]);

  const handleOnClick = useCallback(event => {
    if (event.target === containerRef.current) {
      card.urls.forEach(url => {
        chrome.tabs.create({
          url: url,
        });
      });
    }
  }, [ card ]);

  // Effects
  useEffect(() => {
    updateTheme();
  }, [card.pickColor, card.pickCustom, card.pickIndex, card.isCustomPick]);

  useEffect(() => {
    // Set initial theme
    updateTheme();
  }, []);

  return (
    <div
      className={ `overflow-hidden my-2${className ? ` ${className}` : ''}` }
    >
      <div
        onClick={ e => handleOnClick(e) }
        style={{ backgroundColor: theme?.startsWith('#') && theme }}
        className={ `card p-5 cursor-pointer select-none w-full rounded-lg text-text-default relative ${!theme?.startsWith('#') ? `bg-${theme}-default` : ''}` }
        ref={ containerRef }
      >
        <div className={ 'grid gap-1 pointer-events-none' }>
          <div className={ 'grid gap-1' }>
            <span className={ 'font-bold' }>{ card.value }</span>

            <div className={ 'flex items-center' }>
              <div className={ 'flex items-center' }>
                <div className={ 'mr-1' }>
                  <Clock size={ 18 } />
                </div>

                <span className={ 'text-xs' }>Created { moment(card.createdAt || new Date()).fromNow() }</span>
              </div>

                <div
                  style={{ backgroundColor: card.isCustomPick && themeAccent}}
                  className={ `flex p-2 gap-1 rounded items-center justify-center ml-3 ${!card.isCustomPick ? `bg-${theme}-accent` : ''} ${(faviconsRendered === 0 || !card.isShowingIcons) ? 'opacity-0' : ''}` }
                >
                  {
                    card.favicons.map((favicon, index) => {
                      if(!snap.favicons[card.id][index]) {
                        Store.favicons[card.id][index] = false;
                      }

                      return (
                        <Icon
                          src={ favicon }
                          alt={ '' }
                          key={ index }
                          isVisible={ snap.favicons[card.id][index] }
                          onLoad={() => {
                            if(
                              card.favicons.length <= 3 ||
                              faviconsRendered < 2
                            ) {
                              Store.favicons[card.id][index] = true;
                            }
                          }}
                          onError={() => {
                            Store.favicons[card.id][index] = false;
                          }}
                        />
                      );
                    })
                  }

                  {
                    card.favicons.length - faviconsRendered > 0 && (
                      <div key={ 'counter' }
                           className={ `w-4 h-4 font-bold inline-block rounded-full text-xs flex items-center justify-center` }>
                        +{ card.favicons.length - faviconsRendered }
                      </div>
                    )
                  }
                </div>
            </div>
          </div>
        </div>

        <div className={ 'absolute top-0 bottom-0 m-auto right-5 items-center cursor-pointer card-remove flex' }>
          <div
            style={{ backgroundColor: card.isCustomPick && isHoveringEdit && themeAccent}}
            className={ `rounded p-2 mr-1 pointer-events-all transition-color ${!card.isCustomPick ? `hover:bg-${theme}-accent` : ''}` }
            onClick={ () => handleOnClickEdit() }
            onMouseEnter={() => setIsHoveringEdit(true)}
            onMouseLeave={() => setIsHoveringEdit(false)}
          >
            <Edit2 />
          </div>

          <div
            style={{ backgroundColor: card.isCustomPick && isHoveringDelete && themeAccent}}
            className={ `rounded p-2 rounded pointer-events-all transition-color ${!card.isCustomPick ? `hover:bg-${theme}-accent` : ''}` }
            onClick={ () => handleOnClickRemove() }
            onMouseEnter={() => setIsHoveringDelete(true)}
            onMouseLeave={() => setIsHoveringDelete(false)}
          >
            <X />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;