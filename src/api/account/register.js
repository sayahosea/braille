const required = ['username', 'password'];

export default async(c, util, db, cookie) => {
	let conn;

	try {
		const body = await c.req.json();

		if (!util.validate.body(required, Object.keys(body))) {
			return error(c, 'Invalid body request.');
		}

		const { username, password } = body;

		if (!util.validate.username(username)) {
			return error(c, 'Username is invalid.');
		}

		if (!util.validate.password(password)) {
			return error(c, 'Your password either too long or too short.');
		}

		conn = await db.getConn();

		const accountExists = await db.account.get.byUsername(conn, username);
		if (accountExists) {
			return error(c, 'That username is already taken.');
		}

		const hashedPassword = await util.password.hash(password);

		// create account and retrieve the newly-created account id
		const accountId = await db.account.create(conn, username, hashedPassword);

		const sessionId = util.generate.sessionId();

		await db.session.create(conn, sessionId, accountId);
		await cookie.set(c, sessionId);

		return c.redirect('/dashboard');
	} catch(err) {
		console.error(err.stack);
		if (conn) conn.release();
		return c.text('Server error.', 500);
	} finally {
		if (conn) conn.release();
	}
}

function error(c, text) {
	return c.text(text, 400);
}
