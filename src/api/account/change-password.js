const required = ['password'];

export default async(c, util, db) => {
	let conn;

	try {
		const body = await c.req.json();

		if (!util.validate.body(required, Object.keys(body))) {
			return error(c, 'Invalid body request.');
		}

		const { password } = body;
		if (!util.validate.password(password)) {
			return error(c, 'Your password either too long or too short.');
		}

		const hashedPassword = await util.password.hash(password);
		conn = await db.getConn();

		await db.account.update.password(conn, hashedPassword, c.account.id);

		return c.text('Your password has been changed.', 200);
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
