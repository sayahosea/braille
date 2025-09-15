export default async(c, util, db, cookie) => {
	const sessionId = await cookie.get(c);
	const conn = await db.getConn();

	await db.session.erase.allDevices(conn, c.account.id, sessionId);
	conn.release();

	return c.text('Removed sessions from other devices.', 200);
}