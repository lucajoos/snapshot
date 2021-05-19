import React from 'react';
import Card from './Card';
import Store from '../Store';
import { useSnapshot } from 'valtio';
import { Archive } from 'react-feather';
import Header from './Header';

const CardList = () => {
  const snap = useSnapshot(Store);

  let visible = 0;

  snap.cards.forEach(current => {
    if(current?.visible) {
      visible++;
    }
  });

  console.log(visible)

  return (
    <div className={'relative h-full'}>
      {
         visible === 0 && (
           <div className={'text-gray-300 grid justify-center text-center mt-empty'}>
             <div className={'justify-self-center'}>
               <Archive size={200} />
             </div>
             <div className={'mt-8'}>
               <Header>It's a bit empty here.</Header>
             </div>
           </div>
        )
      }
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
    </div>
  )
};

export default CardList;