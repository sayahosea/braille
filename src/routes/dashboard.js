export default async(c, util, cookie, db) => {
	return c.html( util.render('dashboard', { username: c.account.username }) );
}