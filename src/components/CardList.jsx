import React, { useCallback } from 'react';
import Card from './Card';
import Store from '../Store';
import { useSnapshot } from 'valtio';
import { Archive, Search } from 'react-feather';
import Header from './Header';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import Input from './Input';

const CardList = () => {
  const snap = useSnapshot(Store);

  const handleOnChangeSearch = useCallback(event => {
    Store.search = event.target.value;
  }, []);

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
    localStorage.setItem('cards', JSON.stringify({value: cards}));
  }, [ snap.cards ]);

  return (
    <div className={'h-full px-5 pt-3'}>
      {
      snap.cards.filter(card => card.isVisible).length === 0 ? (
        <div className={'text-gray-300 grid justify-center text-center mt-empty'}>
          <div className={'justify-self-center'}>
            <Archive size={200} />
          </div>
          <div className={'mt-8'}>
            <Header>It's a bit empty here.</Header>
          </div>
        </div>
      ) : (
        <>
          <div className={'flex'}>
            <Input
              value={snap.search}
              placeholder={'Search'}
              onChange={event => handleOnChangeSearch(event)}
              className={'mb-7 mx-3'}
              icon={<Search size={18} />}
            />
          </div>

          <DragDropContext onDragEnd={ event => handleOnDragEnd(event) }>
            <Droppable droppableId={ 'cards' } direction={ 'vertical' }>
              {
                droppableProvided => (
                  <div
                    { ...droppableProvided.droppableProps }
                    ref={ droppableProvided.innerRef }
                    className={'grid gap-4'}
                  >
                    {
                      snap.cards.filter(card => card.isVisible).filter(card => {
                        if(snap.search.length === 0) return true;

                        const search = snap.search.toUpperCase();
                        let isInTags = false;

                        card.tags.forEach(tag => {
                          if(tag.toUpperCase().includes(search)) {
                            isInTags = true;
                          }
                        });

                        return isInTags || card.value.toUpperCase().includes(search);
                      }).sort((a, b) => a.index - b.index).map(card => {
                        return (
                          <Draggable key={ card.id } draggableId={ card.id } index={ card.index }>
                            {
                              draggableProvided => (
                                <div
                                  ref={ draggableProvided.innerRef } { ...draggableProvided.draggableProps } { ...draggableProvided.dragHandleProps }
                                >
                                  <Card
                                    card={card}
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