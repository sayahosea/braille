export default async(c, util, cookie, db) => {
	try {
		const accountId = c.account.id;

		await db.session.erase.allDevices(accountId);
		await db.account.erase(accountId);
		await cookie.destroy(c);

		return c.text('Your account and account data have been deleted, goodbye!', 200);
	} catch(err) {
		console.error(err.stack);
		return c.text('server error :(', 500);
	}
}