import cors from './cors.ts';

function error (request: Request, status: number, error: string, message: string): Response {
    return new Response(JSON.stringify({
        timestamp: new Date().toISOString(),
        status,
        error,
        message,
        path: `/${request.url.split('://')[1].split('/')[1]}`
    }), {
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            ...cors
        }
    });
}

export default error;