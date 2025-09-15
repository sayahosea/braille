export default async(c, util, db, cookie) => {
	const sessionId = await cookie.get(c);

	const conn = await db.getConn();
	await db.session.erase.thisDevice(conn, sessionId);

	await cookie.destroy(c);
	conn.release();

	return c.redirect('/');
}