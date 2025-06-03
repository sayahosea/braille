const required = ['username', 'password'];

export default async(c, util, cookie, db) => {
	try {
		const body = await c.req.json();

		const bodyValid = util.validateBody(required, Object.keys(body));
		if (!bodyValid) return c.text('body request is not valid :[', 400);

		const { username, password } = body;

		const valid = {
			username: util.validateValue.username(username),
			password: util.validateValue.password(password)
		}

		if (!valid.username) return c.text('your username is not valid :[', 400);
		if (!valid.password) return c.text('your password either too long or too short :[', 400);

		const accountExists = await db.account.get.byUsername(username);
		if (accountExists) {
			return c.text('username already taken, sowwy :[', 400);
		}

		const hashedPassword = await util.password.hash(password);

		// create account and retrieve the newly-created account id
		const accountId = await db.account.create(username, hashedPassword);

		const sessionId = util.generate.sessionId();

		await db.session.create(sessionId, accountId);
		await cookie.set(c, sessionId);

		return c.redirect('/dashboard');

	} catch(err) {
		console.error(err.stack);
		return c.text('server error, sowwy :[', 500);
	}
}
