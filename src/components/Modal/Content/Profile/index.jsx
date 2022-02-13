import React, { useCallback } from 'react';
import { useSnapshot } from 'valtio';

import { Button, Header } from '../../../Base';

import Store from '../../../../Store';

import supabase from '../../../../modules/supabase';
import Authentication from './Authentication';
import { User } from 'react-feather';

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
      {
        !snap.session ? (
          <Authentication />
        ) : (
          <>
            <Button onClick={() => handleOnClickSignOut()}>Logout</Button>
          </>
        )
      }
    </>
  )
}

export default Profile;