import { cheerio } from 'https://deno.land/x/cheerio@1.0.4/mod.ts';
import cors from './cors.ts';
import error from "./error.ts";

type Icon = {
    src: string,
    type: string
};

type Response = {
    url: string | null,
    title: string | null,
    icons: Icon[]
};

type Context = {
    $: any | null,
    baseUrl: string
}

const selectors = [
    'link[rel=\'icon\']',
    'link[rel=\'shortcut icon\']',
    'link[rel=\'apple-touch-icon\']',
    'link[rel=\'apple-touch-icon-precomposed\']',
    'link[rel=\'apple-touch-startup-image\']',
    'link[rel=\'mask-icon\']',
    'link[rel=\'fluid-icon\']'
];

async function favicon(context: Context): Promise<Icon[]> {
    let isUsingFavicon = false;

    try {
        isUsingFavicon = await fetch(`${context.baseUrl}/favicon.ico`).then(res => (
            res.headers.get('content-type') === 'image/x-icon'
        ));
    } catch (_) {}

    if(isUsingFavicon) {
        return [{
            src: `${context.baseUrl}/favicon.ico`,
            type: 'image/x-icon'
        }];
    }

    return [];
}

async function link(context: Context): Promise<Icon[]> {
    const icons: Icon[] = [];

    selectors.forEach(selector => {
        context.$(selector).get().map((element: any) => {
            const {href = '', type = ''} = element.attribs;

            if (href.length > 0 ? href !== '#' : '') {
                icons.push({
                    src: href,
                    type
                });
            }
        })
    })

    return icons;
}

async function manifest(context: Context): Promise<Icon[]> {
    const href = context.$('head > link[rel=\'manifest\']').attr('href');

    if (href) {
        let manifest = {
            icons: []
        };

        try {
            manifest = await fetch(
                (new URL(href, context.baseUrl)).href
            ).then(res => res.json());
        } catch (_) {}

        if (Array.isArray(manifest.icons)) {
            return manifest.icons.map((icon: Record<string, string>) => ({
                src: icon.src,
                type: icon.type
            })) || [];
        }
    }

    return [];
}

async function browserConfig(context: Context): Promise<Icon[]> {
    const tile = context.$('head > meta[name=\'msapplication-TileImage\']').attr('content');

    if(tile) {
        return [{
            src: tile,
            type: 'msapplication-TileImage'
        }];
    }

    return [];
}

const url = async (request: Request) => {
    let response: Response = {
        url: null,
        title: null,
        icons: []
    };

    const body = await request.text();

    if(!body) {
        return error(request, 400, 'Bad Request', 'No data was provided in the body of the request.');
    }

    let url: URL | null;

    try {
        url = new URL(body);
    } catch (_) {
        return error(request, 400, 'Bad Request', 'The given data is not a valid URL.');
    }

    const baseUrl = `${url.protocol}//${url.hostname}`;
    const threads: Function[] = [favicon];

    let content = '';
    let title = '';
    let $: any;

    try {
        content = await fetch(url.toString()).then(res => res.text());
    } catch(_) {}

    if(content.length > 0) {
        $ = cheerio.load(content, {
            lowerCaseTags: true,
            lowerCaseAttributeNames: true
        });

        title = $('head > title').text() || '';

        threads.push(link, manifest, browserConfig);
    }

    const icons: any[] = await Promise.all(threads.map(thread => thread({$, baseUrl})));

    response = {
        url: url.toString(),
        icons: ([].concat.apply([], icons)).map((icon: Icon) => ({
            src: (
                !icon.src.startsWith('https://') && !icon.src.startsWith('http://')
            ) ? (
                (new URL(icon.src, baseUrl)).href
            ) : icon.src,
            type: icon.type
        })),
        title
    };

    return new Response(
        JSON.stringify(response),
        {
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                ...cors
            }
        }
    );
}

export default url;