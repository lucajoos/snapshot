import { cheerio } from 'https://deno.land/x/cheerio@1.0.4/mod.ts';
import cors from './cors.ts';

type Icon = {
    src: string,
    type: string
};

type Response = {
    error: string | null,
    url: string | null,
    title: string | null,
    icons: Icon[]
};

const url = async (req: Request) => {
    let response: Response = {
        error: 'Invalid request!',
        url: null,
        title: null,
        icons: []
    };

    if (req.body) {
        const url = new URL(await req.text());
        const baseUrl = `${url.protocol}//${url.hostname}`;
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
            ];

            const $ = cheerio.load(content, {
                lowerCaseTags: true,
                lowerCaseAttributeNames: true
            });

            async function favicon(): Promise<Icon[]> {
                const isUsingFavicon = await fetch(`${baseUrl}/favicon.ico`).then(res => (
                    res.headers.get('content-type') === 'image/x-icon'
                ));

                if(isUsingFavicon) {
                    return [{
                        src: `${baseUrl}/favicon.ico`,
                        type: 'image/x-icon'
                    }];
                }

                return [];
            }

            async function link(): Promise<Icon[]> {
                const returns: Icon[] = [];

                selectors.forEach(selector => {
                    $(selector).get().map((element: any) => {
                        const {href = '', type = ''} = element.attribs;

                        if (href.length > 0 ? href !== '#' : '') {
                            returns.push({
                                src: href,
                                type
                            });
                        }
                    })
                })

                return returns;
            }

            async function manifest(): Promise<Icon[]> {
                const href = $('head > link[rel=\'manifest\']').attr('href');

                if (href) {
                    const manifest = await fetch(
                        (new URL(href, baseUrl)).href
                    ).then(res => res.json());

                    if (Array.isArray(manifest.icons)) {
                        return manifest.icons.map((icon: Record<string, string>) => ({
                            src: icon.src,
                            type: icon.type
                        })) || [];
                    }
                }

                return [];
            }

            async function browserConfig(): Promise<Icon[]> {
                const tile = $('head > meta[name=\'msapplication-TileImage\']').attr('content');

                if(tile) {
                    return [{
                        src: tile,
                        type: 'msapplication-TileImage'
                    }];
                }

                return [];
            }

            const icons: any[] = await Promise.all([
                favicon(),
                link(),
                manifest(),
                browserConfig()
            ]);

            response = {
                error: null,
                url: url.toString(),
                title: $('head > title').text() || '',
                icons: ([].concat.apply([], icons)).map((icon: Icon) => ({
                    src: (
                        !icon.src.startsWith('https://') && !icon.src.startsWith('http://')
                    ) ? (
                        (new URL(icon.src, baseUrl)).href
                    ) : icon.src,
                    type: icon.type
                }))
            };
        }
    }


    return new Response(
        JSON.stringify(response),
        {
            headers: {
                'Content-Type': 'application/json',
                ...cors
            }
        }
    );
}

export default url;