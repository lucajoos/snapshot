import { serve } from 'https://deno.land/std@0.131.0/http/server.ts'
import url from './url.ts';
import error from './error.ts';
import auth from './auth.ts';
import ok from './ok.ts';

await serve(async (request: Request) => {
    if (request.method === 'OPTIONS') {
        return ok(request);
    }

    let response = error(request, 400, 'Not Found', 'The requested resource could not be found.');

    switch (`/${request.url.split('/').slice(3).join('/')}`) {
        case '/':
            return ok(request);
        case '/url':
            return auth(request, await url(request));
    }

    return response;
});