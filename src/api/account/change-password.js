const required = ['password'];

export default async(c, util, cookie, db) => {
	try {
		const body = await c.req.json();

		const bodyValid = util.validateBody(required, Object.keys(body));
		if (!bodyValid) return c.text('body request is not valid :[', 400);

		const { password } = body;
		const valid = util.validateValue.password(password);
		if (!valid) return c.text('your password either too long or too short :[', 400);

		const hashedPassword = await util.password.hash(password);
		await db.account.update.password(hashedPassword, c.account.id);

		return c.text("Your password has been changed", 200);
	} catch(err) {
		console.error(err.stack);
		return c.text('server error, sowwy :[', 500);
	}
}