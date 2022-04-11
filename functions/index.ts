import { serve } from 'https://deno.land/std@0.131.0/http/server.ts'
import url from "./url.ts";

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey'
            }
        })
    }

  switch (req.url) {
      case '/url':
          return url()
  }
})