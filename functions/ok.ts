import cors from "./cors.ts";

function ok(request: Request): Response {
    return new Response(JSON.stringify({
        timestamp: new Date().toISOString(),
        status: '200',
        path: `/${request.url.split('://')[1].split('/')[1]}`
    }), {
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            ...cors
        }
    });
}

export default ok;