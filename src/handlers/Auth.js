import * as cookie from './Cookie.js';
import * as db from './Database.js';

const paths = {
	blockedLoggedIn: ['/register', '/login', '/api/account/register', '/api/account/login'],
	mustLoggedIn: [
		'/api/account/change-password', '/api/account/change-username',
		'/api/account/delete-account', '/api/account/logout-devices',

		'/api/quiz/validate',

		'/dashboard', '/settings', '/courses/letters', '/courses/numbers', '/courses/number-sign'
	]
}

export default async(c, next) => {
	const path = c.req.path;

	if (paths.blockedLoggedIn.includes(path)) {
		const sessionId = await cookie.get(c);
		if (sessionId) return c.redirect('/dashboard');
	}

	if (paths.mustLoggedIn.includes(path)) {
		const sessionId = await cookie.get(c);
		if (!sessionId) return c.redirect('/');

		const accountId = await getAccountId(sessionId);
		if (!accountId) return c.redirect('/logout');

		const account = await getAccount(accountId);

		// if session is recorded in database but it is not tied to any account
		if (!account) {
			await db.session.erase.thisDevice(sessionId);
			return c.redirect('/logout');
		}

		c.account = account;
	}

	await next();
}

async function getAccountId(sessionId) {
	return await db.session.get(sessionId);
}

async function getAccount(accountId) {
	return await db.account.get.byId(accountId);
}
