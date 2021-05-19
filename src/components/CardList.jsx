import React from 'react';
import Card from './Card';
import Store from '../Store';
import { useSnapshot } from 'valtio';
import moment from 'moment';

const CardList = () => {
  const snap = useSnapshot(Store);

  return (
    <>
      {
        snap.cards.map((card, index) => {
          return (
            <Card
              key={index}
              color={card?.color}
            >
              <div className={'grid gap-1'}>
                <span className={'text-lg font-bold'}>{card?.name}</span>
                <span className={'text-xs'}>Created {moment(card?.meta || new Date()).fromNow()}</span>
              </div>
            </Card>
          )
        })
      }
    </>
  )
};

export default CardList;