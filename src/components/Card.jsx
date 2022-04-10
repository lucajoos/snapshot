import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSnapshot } from 'valtio';
import moment from 'moment';
import Color from 'color';
import { Clock, MoreHorizontal, Rss } from 'react-feather';

import Store from '../Store';

import Icon from './Icon';

import helpers from '../modules/helpers'

const Card = ({ card, className, isArchived=false }) => {
  const snap = useSnapshot(Store);

  const palette = useRef([ 'orange', 'pink', 'green', 'violet', 'blue' ]);
  const [theme, setTheme] = useState(null);
  const [themeAccent, setThemeAccent] = useState(null)

  const [isHoveringMore, setIsHoveringMore] = useState(snap.isTouchDevice);
  
  const containerRef = useRef(null);

  const faviconsRendered = Object.values(snap.favicons[card.id]).filter(current => current).length;

  // Callbacks
  const updateTheme = useCallback(() => {
    const currentTheme = card.isCustomPick ? card.pickColor : (card.pickColor.length > 0 ? card.pickColor : palette.current[Math.floor(Math.random() * palette.current.length)]);

    setTheme(currentTheme);
    setThemeAccent(card.isCustomPick ? Color(currentTheme).lighten(0.05) : null);
  }, [card.pickColor, card.pickCustom, card.pickIndex, card.isCustomPick]);

  const handleOnClickMore = useCallback(event => {
    Store.contextMenu.x = event.pageX - 10;
    Store.contextMenu.y = event.pageY + 10;
    Store.contextMenu.type = isArchived ? 'card-isArchived' : 'card';
    Store.contextMenu.data = card.id;

    Store.contextMenu.isFlippedY = event.pageY > (window.innerHeight / 2);
    Store.contextMenu.isFlippedX = event.pageX > (window.innerWidth / 2);

    Store.contextMenu.isVisible = true;
  }, [card, isArchived]);

  const handleOnClick = useCallback(async event => {
    if (event.target === containerRef.current && !isArchived) {
      if(snap.environment === 'extension') {
        await helpers.cards.open(card.id, snap.settings.behavior.cards.isOpeningInWindow);
      } else {
        await helpers.cards.tabs(card.id, false);
      }
    }
  }, [ card, snap.settings.behavior.cards.isOpeningInWindow, snap.environment ]);

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
        className={ `card p-5 select-none rounded-lg text-text-default relative ${!theme?.startsWith('#') ? ` bg-${theme}-default` : ''}${isArchived ? ' isArchived w-full' : ' cursor-pointer w-[calc(100vw-4rem-var(--scrollbar-width))]'}` }
        ref={ containerRef }
        id={card.id}
      >
        <div className={ 'grid gap-1 pointer-events-none' }>
          <div className={ 'grid gap-1' }>
            <div className={'flex gap-1 items-center'}>
              {card.isForeign && (
                <Rss size={18}/>
              )}
              <span className={ 'font-bold' }>{ card.value }</span>
            </div>

            <div className={ 'flex items-center' }>
              <div className={ 'flex items-center' }>
                <div className={ 'mr-1' }>
                  <Clock size={ 18 } />
                </div>

                <span className={ 'text-xs' }>Created { moment(card.createdAt || new Date()).fromNow() }</span>
              </div>

                <div
                  style={{ backgroundColor: card.isCustomPick && themeAccent}}
                  className={ `flex p-2 gap-1 rounded items-center justify-center ml-3 ${!card.isCustomPick ? `bg-${theme}-accent` : ''} ${(card.favicons.length === 0 || !card.isShowingIcons || isArchived) ? 'opacity-0' : ''}` }
                >
                  {
                    card.favicons.map((favicon, index) => {
                      if(snap.favicons[card.id][index] === undefined) {
                        Store.favicons[card.id][index] = false;
                      }

                      return (
                        <Icon
                          src={ favicon }
                          alt={ '' }
                          isVisible={ snap.favicons[card.id][index] }
                          key={index}
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

        <div className={ `absolute top-0 bottom-0 m-auto right-5 items-center cursor-pointer card-remove flex ${isHoveringMore ? 'opacity-100' : 'opacity-0'}` }>
          <div
            style={{ backgroundColor: card.isCustomPick && themeAccent }}
            className={ `rounded p-2 mr-1 pointer-events-all transition-color ${!card.isCustomPick ? `hover:bg-${theme}-accent` : ''}` }
            onClick={ event => handleOnClickMore(event) }
            onMouseEnter={() => setIsHoveringMore(true)}
            onMouseLeave={() => setIsHoveringMore(snap.isTouchDevice)}
          >
            <MoreHorizontal />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;