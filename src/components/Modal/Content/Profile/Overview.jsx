import supabase from '../../../../modules/supabase';
import { Button } from '../../../Base';
import { LogOut } from 'react-feather';
import { useSnapshot } from 'valtio';
import Store from '../../../../Store';
import { useCallback } from 'react';
import moment from 'moment';

const Overview = () => {
  const snap = useSnapshot(Store);

  const handleOnClickSignOut = useCallback(async () => {
    supabase.auth.signOut().catch(e => {
      console.error(e);
    });
  }, []);

  return (
    <div className={'flex flex-col gap-6'}>
      <p>Welcome <b>{supabase.auth.user().email}</b>!<br/>Profile created {moment(supabase.auth.user().created_at).fromNow()}.</p>
      <Button className={'self-end'} onClick={() => handleOnClickSignOut()}>
        <span>Logout</span>
        <LogOut />
      </Button>
    </div>
  )
};

export default Overview;