import React from 'react';
import Card from './Card';
import Store from '../Store';
import { useSnapshot } from 'valtio';
import moment from 'moment';
import { Clock, Type } from 'react-feather';

const CardList = () => {
  const snap = useSnapshot(Store);

  return (
    <>
      {
        snap.cards.map((card, index) => {
          return (!!card?.visible &&
            <Card
              key={index}
              index={index}
              color={card?.color}
              card={card}
            />
          )
        })
      }
    </>
  )
};

export default CardList;