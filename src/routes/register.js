export default async(c, util, cookie) => {
	let loggedIn = false;

	const session = await cookie.get(c);
	if (session) loggedIn = true;

	ctx.response.body = util.render('register');
	return ctx;
}