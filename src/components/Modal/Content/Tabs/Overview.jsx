import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSnapshot } from 'valtio';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { Edit2, ExternalLink, File, Grid, Plus, Save, X as Times } from 'react-feather';

import Store, { Template } from '../../../../Store';

import { Button, Header, Link, Option } from '../../../Base';

import supabase from '../../../../modules/supabase';
import helpers from '../../../../modules/helpers';
import cards from '../../../../modules/helpers/cards';
import cloneDeep from 'lodash.clonedeep';

const Overview = () => {
  const snap = useSnapshot(Store);
  const [isSavable, setIsSavable] = useState(snap.modal.data.tabs.tabs.length > 0);
  const tabsRef = useRef();

  const handleOnDragEnd = useCallback(event => {
    let tabs = [...Store.modal.data.tabs.tabs];
    const [removed] = tabs.splice(event.source.index, 1);
    tabs.splice(event.destination.index, 0, removed);

    Store.modal.data.tabs.tabs = tabs;
  }, []);

  const handleOnClickCancel = useCallback(() => {
    Store.modal.isVisible = false;
  }, []);

  const handleOnClickTab = useCallback(async index => {
    if(!snap.modal.data.tabs.isEditing) {
      window.open(snap.modal.data.tabs.tabs[index].url, '_blank');
    }
  }, [snap.modal.data.tabs.isEditing, snap.modal.data.tabs.tabs]);

  const handleOnClickOpenAll = useCallback(async () => {
    await cards.open(snap.modal.data.tabs.id, false);
  }, [snap.modal.data.tabs.id]);

  const handleOnClickSave = useCallback(() => {
    if(snap.modal.data.tabs.tabs.length > 0) {
      if(!snap.modal.data.tabs.isFetching) {
        let stack = [...Store.cards];
        let card = null;

        stack = stack.map(current => {
          if (current.id === snap.modal.data.tabs.id) {
            let urls = [];
            let favicons = [];
            let titles = [];

            snap.modal.data.tabs.tabs.forEach(tab => {
              urls.push(tab.url);
              favicons.push(tab.favicon);
              titles.push(tab.title);
            });

            current.urls = urls;
            current.favicons = favicons;
            current.titles = titles;
            current.editedAt = new Date().toISOString();

            console.log(favicons)

            card = current;
            return current;
          }

          return current;
        });

        if (snap.session && snap.settings.sync.isSynchronizing && card) {
          supabase
              .from('cards')
              .update([
                helpers.remote.camelCaseToSnakeCase(card)
              ], {
                returning: 'minimal'
              })
              .match({
                id: card.id
              })
              .then(({ error }) => {
                if (error) {
                  console.error(error);
                }
              });
        }

        Store.cards = stack;
        helpers.cards.save(stack);
      }

      snap.modal.data.tabs.resolve(snap.modal.data.tabs.tabs);
      Store.modal.isVisible = false;
    }
  }, [snap.modal.data.tabs.tabs, snap.modal.data.tabs.id, snap.modal.data.tabs.resolve, snap.session, snap.settings.sync.isSynchronizing, snap.modal.data.tabs.isFetching]);

  const handleOnClickView = useCallback(() => {
    Store.modal.data.tabs.view = cloneDeep(Template.modal.data.tabs.view);
    Store.modal.data.tabs.current = 'view';
  }, []);

  const onClickIcon = useCallback(async (index, icon) => {
    if(snap.modal.data.tabs.isEditing) {
      if(icon === 0) {
        Store.modal.data.tabs.view = {...snap.modal.data.tabs.tabs[index], index};
        Store.modal.data.tabs.current = 'view';
      } else if(icon === 1) {
        let tabs = [...Store.modal.data.tabs.tabs];
        tabs.splice(index, 1);
        Store.modal.data.tabs.tabs = tabs;
      }
    }
  }, [snap.modal.data.tabs.isEditing]);

  useEffect(() => {
    if(snap.modal.isVisible && snap.modal.content === 'Tabs' && snap.modal.data.tabs.current === 'default') {
      tabsRef.current.scrollTop = 0;
    }
  }, [snap.modal.isVisible, snap.modal.content, snap.modal.data.tabs.current]);

  useEffect(() => {
    setIsSavable(snap.modal.data.tabs.tabs.length > 0);
  }, [snap.modal.data.tabs.tabs]);

  return (
    <div className={'flex flex-col gap-4'}>
      <Header><Grid /> Tabs</Header>
      <div className={'overflow-y-scroll mt-2 max-h-[40vh]'} ref={tabsRef}>
        <DragDropContext onDragEnd={event => handleOnDragEnd(event)}>
          <Droppable droppableId={'tabs'} direction={'vertical'}>
            {
              (droppableProvided, droppableSnapshot) => (
                <div
                  {...droppableProvided.droppableProps}
                  ref={droppableProvided.innerRef}
                  className={'flex flex-col'}
                >
                  {
                    snap.modal.data.tabs.tabs.map((tab, index) => (
                      <Draggable key={`${tab.url}-${index}`} draggableId={`${tab.url}-${index}`} index={index} isDragDisabled={!Store.modal.data.tabs.isEditing}>
                        {
                          draggableProvided => (
                            <div
                              ref={draggableProvided.innerRef} {...draggableProvided.draggableProps} {...draggableProvided.dragHandleProps}
                              className={snap.modal.data.tabs.isEditing ? 'pointer-events-none' : 'cursor-pointer'}
                            >
                              <div className={ 'my-1' }>
                                <Option.Sort
                                  icons={ snap.modal.data.tabs.isEditing ? [<Edit2 size={18} />, <Times size={ 18 }/>] : [<ExternalLink size={18} />] }
                                  favicon={ tab.favicon }
                                  fallback={ <File size={ 18 }/> }
                                  title={ tab.title.length > (snap.modal.data.tabs.isEditing ? 20 : 35) ? `${ tab.title.substr(0, snap.modal.data.tabs.isEditing ? 20 : 35) }...` : tab.title }
                                  isEditing={snap.modal.data.tabs.isEditing}
                                  onClick={ () => handleOnClickTab(index) }
                                  onClickIcon={ icon => onClickIcon(index, icon) }
                                />
                              </div>

                              <hr
                                className={index < snap.modal.data.tabs.tabs.length - 1 && !droppableSnapshot.isDraggingOver ? '' : 'opacity-0'} />
                            </div>
                          )
                        }
                      </Draggable>
                    ))
                  }
                  {droppableProvided.placeholder}
                </div>
              )
            }
          </Droppable>
        </DragDropContext>
      </div>

      { snap.modal.data.tabs.isEditing && <Option.Category title={'Create Tab'} icon={<Plus />} onClick={() => handleOnClickView()} /> }

      <div className={'flex gap-4 justify-end'}>
        <>
          <Link onClick={() => handleOnClickCancel()}>Cancel</Link>
          {snap.modal.data.tabs.isEditing ? (
              <Button onClick={() => handleOnClickSave()} isDisabled={!isSavable}>
                <span>Save</span>
                <Save size={18} />
              </Button>
          ) : (
              <Button onClick={() => handleOnClickOpenAll()}>
                <span>Open All</span>
                <ExternalLink size={18} />
              </Button>
          )}
        </>
      </div>
    </div>
  );
};

export default Overview;