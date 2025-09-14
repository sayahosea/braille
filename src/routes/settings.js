export default async(c, util, cookie, db) => {
	return c.html(util.render("settings"));
}