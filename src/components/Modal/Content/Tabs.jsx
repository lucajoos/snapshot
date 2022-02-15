import { useSnapshot } from 'valtio';
import Store from '../../../Store';

const Tabs = () => {
  const snap = useSnapshot(Store);

  return (
    <div className={'flex flex-col gap-2'}>
      {
        snap.modal.data.tabs.card.urls.map((url, index) => (
          <span key={index}>{url}</span>
        ))
      }
    </div>
  )
};

export default Tabs;