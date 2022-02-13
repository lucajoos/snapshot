import React from 'react';
import { useSnapshot } from 'valtio';
import Store from '../../../../../Store';
import Card from '../../../../Card';
import { Header } from '../../../../Base';
import { Wind } from 'react-feather';

const Archive = () => {
  const snap = useSnapshot(Store);
  const cards = snap.cards.filter(card => !card.isVisible && !card.isDeleted);

  return cards.length === 0 ? (
    <div className={'text-gray-300 h-full flex flex-col justify-center text-center items-center'}>
      <div className={'justify-self-center'}>
        <Wind size={64} />
      </div>
      <div className={'mt-4'}>
        <Header>There's nothing here.</Header>
      </div>
    </div>
  ) : (
    <>
      <div className={'overflow-scroll max-h-[60vh]'}>
        {cards.sort((a, b) => new Date(a.editedAt) - new Date(b.editedAt)).reverse().map(card => {
          return <Card card={card} isArchived={true} key={card.id} />
        })}
      </div>
    </>
  )
};

export default Archive;