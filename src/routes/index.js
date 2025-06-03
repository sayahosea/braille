export default async(c, util, cookie) => {
	let loggedIn = false;

	const session = await cookie.get(c);
	if (session) loggedIn = true;

	return c.html( util.render('index', { loggedIn }) );
}