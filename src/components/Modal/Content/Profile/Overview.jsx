import { useCallback } from 'react';
import moment from 'moment';
import { LogOut } from 'react-feather';

import { Button } from '../../../Base';
import supabase from '../../../../modules/supabase';
import helpers from '../../../../modules/helpers/index.js';


const Overview = () => {
    const handleOnClickSignOut = useCallback(async () => {
        await helpers.general.reset('Do you want to reset all locally stored data as well?');

        supabase.auth.signOut()
            .catch(e => {
                console.error(e);
            });
    }, []);

    return (
        <div className={ 'flex flex-col gap-6' }>
            <p>Welcome <b>{ supabase.auth.user().email }</b>!<br/>Profile
                created { moment(supabase.auth.user().created_at).fromNow() }.</p>
            <Button className={ 'self-end' } onClick={ () => handleOnClickSignOut() }>
                <span>Logout</span>
                <LogOut/>
            </Button>
        </div>
    );
};

export default Overview;