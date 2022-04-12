import error from './error.ts';

function auth(request: Request, response: Response): Response {
    const authorization = request.headers.get('Authorization') || '';

    if(authorization.length === 0) {
        return error(request, 401, 'Unauthorized', 'Missing API key to access the requested resource.');
    }

    const key = (authorization.split('ApiKey ')[1] || '').trim();

    if(key.length === 0) {
        return error(request, 401, 'Unauthorized', 'Incorrect format of the provided API key.');
    }

    if(key !== Deno.env.get('API_KEY')) {
        return error(request, 403, 'Forbidden', 'Provided API key is not allowed to access the requested resource.')
    }

    return response;
}

export default auth;