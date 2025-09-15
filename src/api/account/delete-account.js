export default async(c, util, db, cookie) => {
	let conn;

	try {
		const accountId = c.account.id;
		conn = await db.getConn();

		await db.session.erase.allDevices(conn, accountId);
		await db.account.erase(conn, accountId);
		await cookie.destroy(c);

		return c.text('Your account and account data have been deleted, goodbye!', 200);
	} catch(err) {
		console.error(err.stack);
		if (conn) conn.release();
		return c.text('Server error.', 500);
	} finally {
		if (conn) conn.release();
	}
}