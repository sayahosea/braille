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

		const account = await db.account.get.byUsername(conn, username);
		if (!account) {
			return error(c, 'Account not found.');
		}

		const hashedPassword = account.password;
		const passwordMatched = await util.password.verify(hashedPassword, password);
		if (!passwordMatched) return error(c, 'Incorrect password.');

		const sessionId = util.generate.sessionId();

		await db.session.create(conn, sessionId, account.id);
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
