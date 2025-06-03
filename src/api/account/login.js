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

		const account = await db.account.get.byUsername(username);
		if (!account) {
			return c.text('account not found, sowwy :[', 400);
		}

		const hashedPassword = account.password;
		const passwordMatched = await util.password.verify(hashedPassword, password);
		if (!passwordMatched) {
			return c.text('incorrect password :[', 400);
		}

		const sessionId = util.generate.sessionId();

		await db.session.create(sessionId, account.id);
		await cookie.set(c, sessionId);

		return c.redirect('/dashboard');

	} catch(err) {
		console.error(err.stack);
		return c.text('server error, sowwy :[', 500);
	}
}
