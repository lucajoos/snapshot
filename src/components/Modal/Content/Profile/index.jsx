import React, { useCallback } from 'react';
import { useSnapshot } from 'valtio';

import { Header } from '../../../Base';

import Store from '../../../../Store';

import Authentication from './Authentication';
import { User } from 'react-feather';
import Overview from './Overview';

const Profile = () => {
  const snap = useSnapshot(Store);

  return (
    <>
      <Header><User /> Profile</Header>
      <div className={'mt-6 flex flex-col'}>
        {
          !snap.session ? (
            <Authentication />
          ) : (
            <Overview />
          )
        }
      </div>
    </>
  )
}

export default Profile;