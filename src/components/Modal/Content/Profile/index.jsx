import React, { useCallback } from 'react';
import { useSnapshot } from 'valtio';

import { Button, Header } from '../../../Base';

import Store from '../../../../Store';

import supabase from '../../../../modules/supabase';
import Authentication from './Authentication';
import { LogOut, User } from 'react-feather';

const Profile = () => {
  const snap = useSnapshot(Store);

  const handleOnClickSignOut = useCallback(async () => {
    supabase.auth.signOut().catch(e => {
      console.error(e);
    });
  }, []);

  return (
    <>
      <Header><User /> Profile</Header>
      <div className={'mt-6 flex flex-col'}>
        {
          !snap.session ? (
            <Authentication />
          ) : (
            <div className={'flex gap-4 flex-col'}>
              <p>{supabase.auth.user().email}</p>
              <Button className={'self-end'} onClick={() => handleOnClickSignOut()}>
                <span>Logout</span>
                <LogOut size={18} />
              </Button>
            </div>
          )
        }
      </div>
    </>
  )
}

export default Profile;