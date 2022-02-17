import React, { useCallback, useEffect, useRef } from 'react';
import { useSnapshot } from 'valtio';
import { Archive } from 'react-feather';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

import Store from '../Store';

import Card from './Card';
import { Header } from './Base';

import helpers from '../modules/helpers';
import supabase from '../modules/supabase';

const CardList = () => {
  const snap = useSnapshot(Store);
  const containerRef = useRef(null);

  const handleOnDragEnd = useCallback(event => {
    if (!event.destination) return;
    const stack = helpers.cards.move(event);

    if(snap.session && snap.settings.sync.isSynchronizing) {
      for(const { index, id } of stack) {
        supabase
          .from('cards')
          .update([{
            index
          }], {
            returning: 'minimal'
          })
          .match({ id })
          .then(({ error }) => {
            if(error) {
              console.error(error);
            }
          });
      }
    }

    Store.cards = stack;
    helpers.cards.save(stack);
  }, [ snap.cards, snap.session, snap.settings.sync.isSynchronizing ]);

  useEffect(() => {
    if(snap.isScrolling) {
      containerRef.current.scrollBy({top: containerRef.current.scrollHeight, left: 0, behavior: 'smooth'});
      Store.isScrolling = false;
    }
  }, [snap.isScrolling]);

  return snap.cards.filter(card => card.isVisible).length === 0 ? (
    <div className={'text-gray-300 h-full flex flex-col justify-center text-center items-center'}>
      <div className={'justify-self-center'}>
        <Archive size={200} />
      </div>
      <div className={'mt-4'}>
        <Header>It's a bit empty here.</Header>
      </div>
    </div>
  ) : (
    <div className={'h-full overflow-y-scroll'} ref={containerRef}>
      <DragDropContext onDragEnd={ event => handleOnDragEnd(event) }>
        <Droppable droppableId={ 'cards' } direction={ 'vertical' }>
          {
            droppableProvided => (
              <div
                { ...droppableProvided.droppableProps }
                ref={ droppableProvided.innerRef }
                className={'flex flex-wrap gap-x-4 justify-center'}
              >
                {
                  snap.cards.filter(card => card.isVisible).sort((a, b) => a.index - b.index).map(card => {
                    let isVisible = snap.search.length === 0;

                    if(!isVisible) {
                      const search = snap.search.toUpperCase();
                      let isInTags = false;

                      card.tags.forEach(tag => {
                        if(tag.toUpperCase().includes(search)) {
                          isInTags = true;
                        }
                      });

                      isVisible = isInTags || card.value.toUpperCase().includes(search);
                    }

                    return (
                      <Draggable key={ card.id } draggableId={ card.id } index={ card.index }>
                        {
                          draggableProvided => (
                            <div
                              ref={ draggableProvided.innerRef } { ...draggableProvided.draggableProps } { ...draggableProvided.dragHandleProps }
                            >
                              <Card
                                card={card}
                                className={!isVisible ? 'hidden' : ''}
                              />
                            </div>
                          )
                        }
                      </Draggable>
                    )
                  })
                }
                { droppableProvided.placeholder }
              </div>
            )
          }
        </Droppable>
      </DragDropContext>
    </div>
  )
};

export default CardList;