import 'jsr:@std/dotenv/load';
import { Hono } from 'npm:hono';
import { serveStatic } from 'npm:hono/deno';

import * as util from './handlers/Util.js';
import * as cookie from './handlers/Cookie.js';
import * as db from './handlers/Database.js';
import Routes from './handlers/Routes.js';
import AuthPlugin from './handlers/AuthPlugin.js';

import API from './routers/API.js';
import Courses from './routers/Courses.js';

await db.init();



const app = new Hono()
.use('/static/*', serveStatic({ root: './src' }))
.get('/favicon.ico', serveStatic({ path: './src/static/favicon.ico' }))
.use(async (c, next) => AuthPlugin(c, next))

.route('/api', API)
.route('/courses', Courses)

.get('/', async(c) => {
	return Routes.index(c, util, cookie);
})
.get('/logout', async(c) => {
	return Routes.logout(c, util, cookie, db);
})

.get('/register', async(c) => {
	return c.html(util.render('register'));
})
.get('/login', async(c) => {
	return c.html(util.render('login'));
})
.get('/privacy', async(c) => {
	return c.html(util.render('privacy'));
})

.get('/dashboard', async(c) => {
	return Routes.dashboard(c, util, cookie, db);
})

.get('/settings', async(c) => {
	return Routes.settings(c, util, cookie, db);
})



try {
	const port = parseInt(process.env.PORT) || 3000;
	Deno.serve({ port }, app.fetch);
} catch(err) {
	console.error(err);
	process.exit(1);
}
