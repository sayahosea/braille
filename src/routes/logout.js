export default async(c, util, cookie, db) => {
	const sessionId = await cookie.get(c);

	await db.session.erase.thisDevice(sessionId);
	await cookie.destroy(c);

	return c.redirect('/');
}