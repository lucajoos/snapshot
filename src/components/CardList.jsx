import React, { useCallback } from 'react';
import { useSnapshot } from 'valtio';
import { Archive } from 'react-feather';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

import Card from './Card';
import { Header } from './Base';

import Store from '../Store';
import helpers from '../modules/helpers';

const CardList = () => {
  const snap = useSnapshot(Store);

  const handleOnDragEnd = useCallback(event => {
    if (!event.destination) return;
    // Workaround
    let cards = [...Store.cards];

    // Calculate if document was moved back or forth
    const mutation = event.destination.index < event.source.index ? 1 : -1;

    // Apply mutations & send to database
    snap.cards.forEach((card, index) => {
      if(
        mutation === 1 ? (
          card.index >= event.destination.index &&
          card.index < event.source.index
        ) : (
          card.index > event.source.index &&
          card.index <= event.destination.index
        )
      ) {
        // If in range mutate index
        cards[index].index += mutation;
      } else if(card.index === event.source.index) {
        // Update index of moved document to destination index
        cards[index].index = event.destination.index;
      }
    });

    Store.cards = cards;
    helpers.cards.save(cards);
  }, [ snap.cards ]);

  return (
    <div className={'h-full px-5 overflow-y-scroll'}>
      {
      snap.cards.filter(card => card.isVisible).length === 0 ? (
        <div className={'text-gray-300 h-full flex flex-col justify-center text-center items-center'}>
          <div className={'justify-self-center'}>
            <Archive size={200} />
          </div>
          <div className={'mt-4'}>
            <Header>It's a bit empty here.</Header>
          </div>
        </div>
      ) : (
        <>


          <DragDropContext onDragEnd={ event => handleOnDragEnd(event) }>
            <Droppable droppableId={ 'cards' } direction={ 'vertical' }>
              {
                droppableProvided => (
                  <div
                    { ...droppableProvided.droppableProps }
                    ref={ droppableProvided.innerRef }
                    className={'grid'}
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
        </>
      )
    }</div>
  )
};

export default CardList;