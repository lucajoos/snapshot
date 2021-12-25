import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Clock, Delete, Edit2, MoreHorizontal, Trash, X } from 'react-feather';
import Store from '../Store';
import { useSnapshot } from 'valtio';
import moment from 'moment';
import Icon from './Icon';
import Color from 'color';
import helpers from '../modules/helpers'

const Card = ({ card, className }) => {
  const snap = useSnapshot(Store);

  const palette = useRef([ 'orange', 'pink', 'green', 'violet', 'blue' ]);
  const [theme, setTheme] = useState(null);
  const [themeAccent, setThemeAccent] = useState(null)

  const [isHoveringMore, setIsHoveringMore] = useState(false);
  
  const containerRef = useRef(null);

  const faviconsRendered = Object.values(snap.favicons[card.id]).filter(current => current).length;

  // Callbacks
  const updateTheme = useCallback(() => {
    const currentTheme = card.isCustomPick ? card.pickColor : (card.pickColor.length > 0 ? card.pickColor : palette.current[Math.floor(Math.random() * palette.current.length)]);

    setTheme(currentTheme);
    setThemeAccent(card.isCustomPick ? Color(currentTheme).lighten(0.05) : null);
  }, [card.pickColor, card.pickCustom, card.pickIndex, card.isCustomPick]);

  const handleOnClickMore = useCallback(event => {
    Store.contextMenu.x = event.pageX - 200;
    Store.contextMenu.y = event.pageY + 5;
    Store.contextMenu.data = card.id;
    Store.contextMenu.type = 'card';
    Store.contextMenu.isVisible = true;
  }, [card]);

  const handleOnClick = useCallback(event => {
    if (event.target === containerRef.current) {
      helpers.cards.open(card.id);
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
        id={card.id}
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
                  className={ `flex p-2 gap-1 rounded items-center justify-center ml-3 ${!card.isCustomPick ? `bg-${theme}-accent` : ''} ${(card.favicons.length === 0 || !card.isShowingIcons) ? 'opacity-0' : ''}` }
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
            style={{ backgroundColor: card.isCustomPick && isHoveringMore && themeAccent}}
            className={ `rounded p-2 mr-1 pointer-events-all transition-color ${!card.isCustomPick ? `hover:bg-${theme}-accent` : ''}` }
            onClick={ event => handleOnClickMore(event) }
            onMouseEnter={() => setIsHoveringMore(true)}
            onMouseLeave={() => setIsHoveringMore(false)}
          >
            <MoreHorizontal />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;