import { serve } from 'https://deno.land/std@0.131.0/http/server.ts'
import { cheerio } from 'https://deno.land/x/cheerio@1.0.4/mod.ts';
import { urlParse } from 'https://deno.land/x/url_parse/mod.ts';

type Icon = {
  src: string,
  type: string
}

type Response = {
  error: string | null,
  url: string | null,
  title: string | null,
  icons: Icon[]
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey'
            }
        })
    }

  let response: Response = {
    error: 'Invalid request!',
    url: null,
    title: null,
    icons: []
  };

  if (req.body) {
    const url = urlParse(await req.text())
    const baseUrl = `${url.protocol}//${url.hostname}`
    const content = await fetch(url.toString()).then(res => res.text());

    if(content) {
      const selectors = [
        'link[rel=\'icon\']',
        'link[rel=\'shortcut icon\']',
        'link[rel=\'apple-touch-icon\']',
        'link[rel=\'apple-touch-icon-precomposed\']',
        'link[rel=\'apple-touch-startup-image\']',
        'link[rel=\'mask-icon\']',
        'link[rel=\'fluid-icon\']'
      ]

      const $ = cheerio.load(content, {
        lowerCaseTags: true,
        lowerCaseAttributeNames: true
      })

      const favicon = () => (
          new Promise(async resolve => {
            let returns: Icon[] = [];

            if(await fetch(`${baseUrl}/favicon.ico`).then(res => (
                res.headers.get('content-type') === 'image/x-icon'
            ))) {
              returns = [{
                src: `${baseUrl}/favicon.ico`,
                type: 'image/x-icon'
              }]
            }

            resolve(returns)
          })
      )

      const link = () => (
          new Promise(resolve => {
            let returns: Icon[] = [];

            selectors.forEach(selector => {
              $(selector).get().map((element: any) => {
                const { href='', type='' } = element.attribs;

                if(href.length > 0 ? href !== '#' : '') {
                  returns.push({
                    src: href,
                    type
                  })
                }
              })
            })

            resolve(returns)
          })
      )

      const manifest = () => (
          new Promise(async resolve => {
            let returns: Icon[] = [];

            const href = $('head > link[rel=\'manifest\']').attr('href');

            if(href) {
              const manifest = await fetch(new URL(href, baseUrl)).then(res => res.json());

              if(Array.isArray(manifest.icons)) {
                returns = manifest.icons.map((icon: any) => ({
                  src: icon.src,
                  type: icon.type
                })) || []
              }
            }

            resolve(returns)
          })
      )

      const browserConfig = () => (
          new Promise(resolve => {
            const tile = $('head > meta[name=\'msapplication-TileImage\']').attr('content');
            let returns: Icon[] = [];

            if(tile) {
              returns = [{
                src: tile,
                type: 'msapplication-TileImage'
              }]
            }

            resolve(returns)
          })
      )

      const icons: any[] = await Promise.all([favicon(), link(), manifest(), browserConfig()]);

      response = {
        error: null,
        url: url.toString(),
        title: $('head > title').text() || '',
        icons: [].concat.apply([], icons)
      }
    }
  }


  return new Response(
    JSON.stringify(response),
    {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey'
        }
     }
  )
})