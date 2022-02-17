import React from 'react';
import { useSnapshot } from 'valtio';
import { User } from 'react-feather';

import Store from '../../../../Store';

import { Header } from '../../../Base';
import Authentication from './Authentication';
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