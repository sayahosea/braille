export default async(c, util) => {
	return c.html(util.render('dashboard', { username: c.account.username }));
}