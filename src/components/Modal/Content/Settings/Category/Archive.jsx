import React from 'react';
import { useSnapshot } from 'valtio';
import Store from '../../../../../Store';
import Card from '../../../../Card';

const Archive = () => {
  const snap = useSnapshot(Store);

  return (
    <div className={'overflow-scroll max-h-[60vh]'}>
      {snap.cards.filter(card => !card.isVisible && !card.isDeleted).sort((a, b) => new Date(a.editedAt) - new Date(b.editedAt)).reverse().map(card => {
        return <Card card={card} isArchived={true} key={card.id} />
      })}
    </div>
  )
};

export default Archive;