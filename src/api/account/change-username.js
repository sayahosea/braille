const required = ['username'];

export default async(c, util, db) => {
	let conn;

	try {
		const body = await c.req.json();

		if (!util.validate.body(required, Object.keys(body))) {
			return error(c, 'Invalid body request.');
		}

		const { username } = body;
		if (!util.validate.username(username)) {
			return error(c, 'Your new username is not valid.');
		}

		conn = await db.getConn();
		await db.account.update.username(conn, username, c.account.id);

		return c.text('Your username has been changed', 200);
	} catch(err) {
		console.error(err.stack);
		if (conn) conn.release();
		return c.text('Server error.', 500);
	} finally {
		if (conn) conn.release();
	}
}