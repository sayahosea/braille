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
	let conn;

	try {
		const path = c.req.path;

		if (paths.blockedLoggedIn.includes(path)) {
			const sessionId = await cookie.get(c);
			if (sessionId) return c.redirect('/dashboard');
		}

		if (paths.mustLoggedIn.includes(path)) {
			const sessionId = await cookie.get(c);
			if (!sessionId) return c.redirect('/');

			conn = await db.getConn();

			const accountId = await db.session.get(conn, sessionId);
			if (!accountId) return c.redirect('/logout');

			const account = await db.account.get.byId(conn, accountId);

			// if session is recorded in database but it is not tied to any account
			if (!account) {
				await db.session.erase.thisDevice(conn, sessionId);
				return c.redirect('/logout');
			}

			c.account = account;
		}

		await next();
	} catch(err) {
		console.error(err);
		if (conn) conn.release();
		process.exit(1);
	} finally {
		if (conn) conn.release();
	}
}
