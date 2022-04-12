import { serve } from 'https://deno.land/std@0.131.0/http/server.ts'
import url from "./url.ts";
import cors from "./cors.ts";

await serve(async (req: Request) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', {
            headers: cors
        });
    }

    let response = new Response('ok', {
        headers: cors
    });

    switch (`/${req.url.split('/').slice(3).join('/')}`) {
        case '/url':
            response = await url(req);
            break;
    }

    return response;
});