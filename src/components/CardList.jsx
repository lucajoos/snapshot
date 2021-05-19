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
          return ( !!card?.visible &&
            <Card
              key={index}
              index={index}
              color={card?.color}
            >
              <div className={'grid gap-1'}>
                <span className={'text-lg font-bold'}>{card?.name}</span>

                <div className={'flex items-center'}>
                  <div className={'mr-1'}>
                    <Clock size={18}/>
                  </div>

                  <span className={'text-xs'}>Created {moment(card?.meta || new Date()).fromNow()}</span>
                </div>
              </div>
            </Card>
          )
        })
      }
    </>
  )
};

export default CardList;