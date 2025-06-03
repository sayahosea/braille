const required = ['username'];

export default async(c, util, cookie, db) => {
	try {
		const body = await c.req.json();

		const bodyValid = util.validateBody(required, Object.keys(body));
		if (!bodyValid) return c.text('body request is not valid :[', 400);

		const { username } = body;
		const valid = util.validateValue.username(username);
		if (!valid) return c.text('your new username is not valid, sowwy :[', 400);

		await db.account.update.username(username, c.account.id);

		return c.text("Your username has been changed", 200);
	} catch(err) {
		console.error(err.stack);
		return c.text('server error, sowwy :[', 500);
	}
}