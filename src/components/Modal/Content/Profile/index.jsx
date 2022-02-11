import React, { useCallback } from 'react';
import { useSnapshot } from 'valtio';

import { Button, Header } from '../../../Base';

import Store from '../../../../Store';

import supabase from '../../../../modules/supabase';
import Authentication from './Authentication';

const Profile = () => {
  const snap = useSnapshot(Store);

  const handleOnClickSignOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  return (
    <>
      <Header>Profile</Header>

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