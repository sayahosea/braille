export default async(c, util, db, cookie) => {
	const sessionId = await cookie.get(c);
	await db.session.erase.allDevices(c.account.id, sessionId);
	return c.text("Removed sessions from other devices.", 200);
}