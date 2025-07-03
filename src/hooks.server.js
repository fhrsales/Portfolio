import { sequence } from '@sveltejs/kit/hooks';
// import * as auth from '$lib/server/auth';
import { paraglideMiddleware } from '$lib/paraglide/server';

const handleParaglide = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request, locale }) => {
		event.request = request;

		return resolve(event, {
			transformPageChunk: ({ html }) => html.replace('%paraglide.lang%', locale)
		});
	});

// Desabilita autenticação server-side para build funcionar sem backend
const handleAuth = async ({ event, resolve }) => {
  event.locals.user = null;
  event.locals.session = null;
  return resolve(event);
};

export const handle = sequence(handleParaglide, handleAuth);
